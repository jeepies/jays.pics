import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  Connection,
  Edge,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { prisma } from "~/services/database.server";
import { getSession, getUserBySession } from "~/services/session.server";

import AddTagAction from "./triggers/add_tag";
import RenameAction from "./triggers/rename";

const ACTION_COMPONENTS: Record<
  string,
  React.FC<{ data: any; update: (d: any) => void }>
> = {
  add_tag: AddTagAction,
  rename: RenameAction,
};
const AVAILABLE_ACTIONS = Object.keys(ACTION_COMPONENTS);

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/");
  const user = await getUserBySession(session);
  if (!user) return redirect("/");

  const trigger = await prisma.trigger.findFirst({
    where: { user_id: user.id, type: "image_upload" },
    include: { actions: true },
  });

  return json({ trigger });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  if (!session.has("userID")) return redirect("/");
  const user = await getUserBySession(session);
  if (!user) return redirect("/");

  const data = await request.json();
  if (!Array.isArray(data.actions)) return json({ ok: false }, { status: 400 });

  const existing = await prisma.trigger.findFirst({
    where: { user_id: user.id, type: "image_upload" },
    include: { actions: true },
  });
  if (existing) {
    await prisma.triggerAction.deleteMany({
      where: { trigger_id: existing.id },
    });
    await prisma.trigger.delete({ where: { id: existing.id } });
  }

  const trigger = await prisma.trigger.create({
    data: { user_id: user.id, type: "image_upload", name: "Image Uploaded" },
  });

  for (const a of data.actions) {
    await prisma.triggerAction.create({
      data: {
        trigger_id: trigger.id,
        type: a.type,
        data: a.data,
      },
    });
  }

  return json({ ok: true });
}

export default function Triggers() {
  const { trigger } = useLoaderData<typeof loader>();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const initialNodes = useMemo<Node[]>(() => {
    const nodes: Node[] = [
      {
        id: "trigger",
        type: "input",
        position: { x: 0, y: 0 },
        data: { label: "Image Uploaded" },
      },
    ];
    if (trigger) {
      trigger.actions.forEach((a, i) => {
        nodes.push({
          id: `a${i}`,
          position: { x: 250, y: i * 100 },
          data: {
            label: a.type,
            actionType: a.type,
            ...(a.data as Record<string, unknown>),
          },
        });
      });
    }
    return nodes;
  }, [trigger]);

  const initialEdges = useMemo<Edge[]>(() => {
    if (!trigger) return [];
    return trigger.actions.map((_, i) => ({
      id: `e${i}`,
      source: "trigger",
      target: `a${i}`,
    }));
  }, [trigger]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    nodeId: string;
  } | null>(null);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !reactFlowInstance) return;

      const rect = reactFlowWrapper.current!.getBoundingClientRect();
      const position = reactFlowInstance.project({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
      const id = `${type}_${nodes.length}`;
      const newNode: Node = {
        id,
        position,
        data: { label: type, actionType: type },
      };
      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) =>
        eds.concat({ id: `e_${id}`, source: "trigger", target: id }),
      );
    },
    [reactFlowInstance, nodes.length, setEdges, setNodes],
  );

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (node.id === "trigger") return;
    setSelectedNode(node);
  }, []);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      if (node.id === "trigger") return;
      setContextMenu({ x: event.clientX, y: event.clientY, nodeId: node.id });
    },
    [],
  );

  function updateSelected(data: Record<string, unknown>) {
    if (!selectedNode) return;
    setNodes((nds) =>
      nds.map((n) =>
        n.id === selectedNode.id ? { ...n, data: { ...n.data, ...data } } : n,
      ),
    );
    setSelectedNode((n) => (n ? { ...n, data: { ...n.data, ...data } } : n));
  }

  function handleRename() {
    if (!contextMenu) return;
    const node = nodes.find((n) => n.id === contextMenu.nodeId);
    if (!node) return;
    const name = prompt("Node name", String(node.data.label || ""));
    if (name) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === node.id ? { ...n, data: { ...n.data, label: name } } : n,
        ),
      );
    }
    setContextMenu(null);
  }

  function handleDelete() {
    if (!contextMenu) return;
    const id = contextMenu.nodeId;
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
    setContextMenu(null);
  }

  async function handleSave() {
    const actions = nodes
      .filter((n) => n.id !== "trigger")
      .map((n) => ({ type: n.data.actionType, data: { ...n.data } }));

    await fetch("/dashboard/triggers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actions }),
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-4 h-screen">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>Triggers</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 relative flex flex-col">
          <div className="flex gap-4 h-full">
            <aside className="w-60 space-y-2" onDragOver={onDragOver}>
              {AVAILABLE_ACTIONS.map((t) => (
                <div
                  key={t}
                  className="p-2 border rounded cursor-grab bg-background"
                  draggable
                  onDragStart={(event) =>
                    event.dataTransfer.setData("application/reactflow", t)
                  }
                >
                  {t}
                </div>
              ))}
            </aside>
            <div className="flex-1 h-full" ref={reactFlowWrapper}>
              <ReactFlowProvider>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onNodeClick={onNodeClick}
                  onInit={setReactFlowInstance}
                  onNodeContextMenu={onNodeContextMenu}
                  fitView
                >
                  <Background />
                  <Controls />
                </ReactFlow>
              </ReactFlowProvider>
            </div>
          </div>
          {selectedNode && (
            <div className="mt-4 space-y-2">
              {(() => {
                const Action = ACTION_COMPONENTS[selectedNode.data.actionType];
                return Action ? (
                  <Action data={selectedNode.data} update={updateSelected} />
                ) : null;
              })()}
            </div>
          )}
          {contextMenu && (
            <div
              className="absolute bg-background border rounded shadow-sm"
              style={{ top: contextMenu.y, left: contextMenu.x }}
            >
              <button
                className="block px-4 py-2 w-full text-left"
                onClick={handleRename}
              >
                Rename
              </button>
              <button
                className="block px-4 py-2 w-full text-left"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          )}
          <Button className="mt-4" onClick={handleSave}>
            Save
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
