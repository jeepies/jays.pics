import{j as e}from"./jsx-runtime-BMrMXMSG.js";import{C as n,a as c,c as l,d as m,b as x}from"./card-CEVsoCFj.js";import{T as h,a as j,b as s,c as r,d as p,e as t}from"./table-CFscRwcK.js";import{u}from"./_admin-TbWPlviG.js";import{u as T}from"./components-BwFStQ-X.js";import"./index-CTHubjAk.js";import"./button-DVl6wKDh.js";import"./separator-Cu6-nCqS.js";import"./createLucideIcon-CKMWKKJc.js";import"./index-De4eUs7t.js";import"./index-BlA7Mg33.js";import"./index-CFsilEuh.js";function y(){u();const{count:i,logs:o}=T();return e.jsxs(e.Fragment,{children:[" ",e.jsxs(n,{className:"mt-4",children:[e.jsxs(c,{children:[e.jsx(l,{children:"Logs"}),e.jsxs(m,{children:["There are ",i," logs"]})]}),e.jsx(x,{children:e.jsxs(h,{children:[e.jsx(j,{children:e.jsxs(s,{children:[e.jsx(r,{className:"max-w-96",children:"Message"}),e.jsx(r,{className:"text-right",children:"Date of Creation"})]})}),e.jsx(p,{children:o.sort((a,d)=>+new Date(d.created_at)-+new Date(a.created_at)).map(a=>e.jsxs(s,{children:[e.jsx(t,{className:"font-medium",children:a.message}),e.jsxs(t,{className:"text-right",children:[new Date(a.created_at).toLocaleDateString()," @"," ",new Date(a.created_at).toLocaleTimeString()]})]}))})]})})]})]})}export{y as default};