import{j as e}from"./jsx-runtime-BMrMXMSG.js";import{B as a}from"./button-DVl6wKDh.js";import{C as n,b as d}from"./card-CEVsoCFj.js";import{u as o,F as c,L as i}from"./components-BwFStQ-X.js";import"./index-CTHubjAk.js";import"./index-BlA7Mg33.js";import"./index-CFsilEuh.js";function f(){const{images:t,clipboard:s}=o();return s&&(navigator.clipboard.writeText(s),window.location.href="/dashboard/images"),t.length===0?e.jsx("div",{className:"h-screen flex items-center justify-center",children:e.jsx("h1",{className:"text-5xl",children:"Nothing here :("})}):e.jsx("div",{className:"p-4",children:t.map(r=>e.jsx(n,{children:e.jsxs(d,{className:"p-2",children:[e.jsx("img",{src:`/i/${r.id}/raw`,alt:r.display_name,className:"aspect-square rounded-md object-cover h-12"}),e.jsx("p",{className:"mt-2 truncate text-sm font-medium hover:text-primary",children:e.jsx("a",{href:`/i/${r.id}`,children:r.display_name})}),e.jsx("p",{className:"text-xs text-muted-foreground",children:new Date(r.created_at).toLocaleDateString()}),e.jsx(c,{children:e.jsx(i,{to:`?generate_link=${r.id}`,children:e.jsx(a,{children:"Link"})})}),e.jsx(i,{to:`/i/${r.id}/delete`,children:e.jsx(a,{children:"Delete"})})]})},r.id))})}export{f as default};
