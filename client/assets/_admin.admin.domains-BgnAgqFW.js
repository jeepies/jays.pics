import{j as e}from"./jsx-runtime-BMrMXMSG.js";import{C as o,a as d,c,d as m,b as l}from"./card-CEVsoCFj.js";import{T as x,a as h,b as i,c as s,d as j,e as r}from"./table-CFscRwcK.js";import{u as p}from"./_admin-TbWPlviG.js";import{u as f}from"./components-BwFStQ-X.js";import"./index-CTHubjAk.js";import"./button-DVl6wKDh.js";import"./separator-Cu6-nCqS.js";import"./createLucideIcon-CKMWKKJc.js";import"./index-De4eUs7t.js";import"./index-BlA7Mg33.js";import"./index-CFsilEuh.js";function R(){p();const{count:t,urls:n}=f();return e.jsxs(e.Fragment,{children:[" ",e.jsxs(o,{className:"mt-4",children:[e.jsxs(d,{children:[e.jsx(c,{children:"Domains"}),e.jsxs(m,{children:["There are ",t," domains"]})]}),e.jsx(l,{children:e.jsxs(x,{children:[e.jsx(h,{children:e.jsxs(i,{children:[e.jsx(s,{className:"max-w-96",children:"Domain"}),e.jsx(s,{className:"max-w-96",children:"Public"}),e.jsx(s,{className:"max-w-96",children:"Status"}),e.jsx(s,{className:"max-w-96",children:"Zone"}),e.jsx(s,{className:"max-w-96",children:"Donator"}),e.jsx(s,{className:"text-right",children:"Date of Creation"})]})}),e.jsx(j,{children:n.map(a=>e.jsxs(i,{children:[e.jsx(r,{className:"font-medium",children:a.url}),e.jsx(r,{children:a.public?"Yes":"No"}),e.jsx(r,{children:a.progress}),e.jsx(r,{children:a.zone_id}),e.jsx(r,{children:e.jsx("a",{href:`/admin/profile/${a.donator.id}`,children:a.donator.username})}),e.jsxs(r,{className:"text-right",children:[new Date(a.created_at).toLocaleDateString()," @"," ",new Date(a.created_at).toLocaleTimeString()]})]}))})]})})]})]})}export{R as default};
