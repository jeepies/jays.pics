import{j as e}from"./jsx-runtime-BMrMXMSG.js";import{C as n,a as o,c as m,d as c,b as h}from"./card-CEVsoCFj.js";import{T as x,a as j,b as i,c as a,d as p,e as r}from"./table-CFscRwcK.js";import{u as f}from"./_admin-TbWPlviG.js";import{p as g}from"./index-BuUnCgYx.js";import{u}from"./components-BwFStQ-X.js";import"./index-CTHubjAk.js";import"./button-DVl6wKDh.js";import"./separator-Cu6-nCqS.js";import"./createLucideIcon-CKMWKKJc.js";import"./index-De4eUs7t.js";import"./index-BlA7Mg33.js";import"./index-CFsilEuh.js";function R(){f();const{count:t,users:d}=u();return e.jsx(e.Fragment,{children:e.jsxs(n,{className:"mt-4",children:[e.jsxs(o,{children:[e.jsx(m,{children:"Users"}),e.jsxs(c,{children:["There are ",t," users"]})]}),e.jsx(h,{children:e.jsxs(x,{children:[e.jsx(j,{children:e.jsxs(i,{children:[e.jsx(a,{className:"w-[100px]",children:"User"}),e.jsx(a,{children:"Images Uploaded"}),e.jsx(a,{children:"Donated Domains"}),e.jsx(a,{children:"Admin"}),e.jsx(a,{className:"text-right",children:"Date of Creation"})]})}),e.jsx(p,{children:d.map(s=>e.jsxs(i,{children:[e.jsx(r,{className:"font-medium",children:e.jsx("a",{href:`/admin/profile/${s.id}`,children:s.username})}),e.jsxs(r,{children:[s.images.filter(l=>l.deleted_at===null).length," ","(",g(s.space_used),", w/ deleted:"," ",s.images.length,")"]}),e.jsx(r,{children:s.donated_urls.length}),e.jsx(r,{children:s.is_admin?"Yes":"No"}),e.jsx(r,{className:"text-right",children:new Date(s.created_at).toLocaleDateString()})]}))})]})})]})})}export{R as default};