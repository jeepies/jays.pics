import { ActionFunctionArgs, LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { useCallback, useMemo, useRef, useState } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { prisma } from '~/services/database.server';
import { getSession, getUserBySession } from '~/services/session.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('userID')) return redirect('/');
  const user = await getUserBySession(session);
  if (!user) return redirect('/');

  const trigger = await prisma.trigger.findFirst({
    where: { user_id: user.id, type: 'image_upload' },
    include: { actions: true },
  });

  return json({ trigger });
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get('Cookie'));
  if (!session.has('userID')) return redirect('/');
  const user = await getUserBySession(session);
  if (!user) return redirect('/');

  const data = await request.json();
  if (!Array.isArray(data.actions)) return json({ ok: false }, { status: 400 });

  // clear existing trigger/actions
  const existing = await prisma.trigger.findFirst({
    where: { user_id: user.id, type: 'image_upload' },
    include: { actions: true },
  });
  if (existing) {
    await prisma.triggerAction.deleteMany({ where: { trigger_id: existing.id } });
    await prisma.trigger.delete({ where: { id: existing.id } });
  }

  const trigger = await prisma.trigger.create({
    data: { user_id: user.id, type: 'image_upload', name: 'Image Uploaded' },
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
      { id: 'trigger', type: 'input', position: { x: 0, y: 0 }, data: { label: 'Image Uploaded' } },
    ];
    if (trigger) {
      trigger.actions.forEach((a, i) => {
        nodes.push({
          id: `a${i}`,
          position: { x: 250, y: i * 100 },
          data: { label: a.type, actionType: a.type, ...a.data },
        });
      });
    }
    return nodes;
  }, [trigger]);

  const initialEdges = useMemo<Edge[]>(() => {
    if (!trigger) return [];
    return trigger.actions.map((_, i) => ({ id: `e${i}`, source: 'trigger', target: `a${i}` }));
  }, [trigger]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      const rect = reactFlowWrapper.current!.getBoundingClientRect();
      const position = reactFlowInstance.project({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      const id = `${type}_${nodes.length}`;
      const newNode: Node = {
        id,
        position,
        data: { label: type, actionType: type },
      };
      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) => eds.concat({ id: `e_${id}`, source: 'trigger', target: id }));
    },
    [reactFlowInstance, nodes.length, setEdges, setNodes]
  );

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodeClick = useCallback((_: any, node: Node) => {
    if (node.id === 'trigger') return;
    setSelectedNode(node);
  }, []);

  function updateSelected(data: Record<string, unknown>) {
    if (!selectedNode) return;
    setNodes((nds) => nds.map((n) => (n.id === selectedNode.id ? { ...n, data: { ...n.data, ...data } } : n)));
    setSelectedNode((n) => (n ? { ...n, data: { ...n.data, ...data } } : n));
  }

  async function handleSave() {
    const actions = nodes
      .filter((n) => n.id !== 'trigger')
      .map((n) => ({ type: n.data.actionType, data: { ...n.data } }));

    await fetch('/dashboard/triggers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actions }),
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Triggers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <aside className="w-96 space-y-2" onDragOver={onDragOver}>
              {['add_tag', 'rename'].map((t) => (
                <div
                  key={t}
                  className="p-2 border rounded cursor-grab bg-background"
                  draggable
                  onDragStart={(event) => event.dataTransfer.setData('application/reactflow', t)}
                >
                  {t}
                </div>
              ))}
            </aside>
            <div className="h-96 flex-1" ref={reactFlowWrapper}>
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
              {selectedNode.data.actionType === 'add_tag' && (
                <Input
                  placeholder="Tag Name"
                  value={selectedNode.data.tag || ''}
                  onChange={(e) => updateSelected({ tag: e.target.value })}
                />
              )}
              {selectedNode.data.actionType === 'rename' && (
                <Input
                  placeholder="New Name"
                  value={selectedNode.data.name || ''}
                  onChange={(e) => updateSelected({ name: e.target.value })}
                />
              )}
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
