import{j as e}from"./jsx-runtime-BMrMXMSG.js";import{C as t,a,c as d,b as m}from"./card-CEVsoCFj.js";import{u as f}from"./_app-BEEOCYaM.js";import{I as l}from"./input-DHMy5rOh.js";import{B as i}from"./button-DVl6wKDh.js";import{L as n}from"./label-Bok1Uajx.js";import{D as b}from"./url-data-table-9tPtDM2n.js";import{C as x}from"./checkbox-7b-1935D.js";import{u as _,a as g,F as p}from"./components-BwFStQ-X.js";import"./index-CTHubjAk.js";import"./sidebar-B5rxhk5X.js";import"./separator-Cu6-nCqS.js";import"./createLucideIcon-CKMWKKJc.js";import"./index-De4eUs7t.js";import"./index-BlA7Mg33.js";import"./user-DJfuBIeY.js";import"./index-CFsilEuh.js";import"./index-CxDjNTdQ.js";import"./table-CFscRwcK.js";import"./index-D3MAovHW.js";import"./index-DI2hRbsd.js";import"./index-DX9bpRaH.js";const y=[{id:"select",header:({table:r})=>e.jsx(x,{checked:r.getIsAllPageRowsSelected()||r.getIsSomePageRowsSelected()&&"indeterminate",onCheckedChange:o=>r.toggleAllPageRowsSelected(!!o),"aria-label":"Select all"}),cell:({row:r})=>e.jsx(x,{checked:r.getIsSelected(),onCheckedChange:o=>r.toggleSelected(!!o),"aria-label":"Select row"}),enableSorting:!1,enableHiding:!1},{accessorKey:"url",header:"Domain"},{accessorKey:"donator.username",header:"Donator"}];function $(){var c,u,h;const r=f(),o=_(),s=g(),j=r.user.upload_preferences.urls;return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"container mx-auto px-4 py-8",children:[e.jsxs(t,{children:[e.jsx(a,{children:e.jsx(d,{children:"Uploader Configuration"})}),e.jsxs(m,{children:[e.jsx("label",{children:"Upload Key:"}),e.jsx(l,{className:"my-2",readOnly:!0,value:r==null?void 0:r.user.upload_key}),e.jsx("label",{children:"Download Configs for:"}),e.jsx("br",{}),e.jsx(i,{children:e.jsx("a",{href:`/api/sharex/${r==null?void 0:r.user.id}`,children:"ShareX"})})]})]}),e.jsxs(t,{className:"mt-4",children:[e.jsx(a,{children:e.jsx(d,{children:"Embed Content"})}),e.jsx(m,{children:e.jsxs(p,{method:"post",children:[e.jsx(l,{className:"hidden",value:"update_embed",name:"type",readOnly:!0}),e.jsx(n,{htmlFor:"embed_title",children:"Title"}),e.jsx(l,{className:"my-2",name:"embed_title",defaultValue:(c=r==null?void 0:r.user.upload_preferences)==null?void 0:c.embed_title}),e.jsx("div",{className:"text-red-500 text-sm",children:s==null?void 0:s.fieldErrors.embed_title}),e.jsx(n,{htmlFor:"embed_author",children:"Author"}),e.jsx(l,{className:"my-2",name:"embed_author",defaultValue:(u=r==null?void 0:r.user.upload_preferences)==null?void 0:u.embed_author}),e.jsx("div",{className:"text-red-500 text-sm",children:s==null?void 0:s.fieldErrors.embed_author}),e.jsx(n,{htmlFor:"embed_colour",children:"Colour"}),e.jsx(l,{className:"my-2",name:"embed_colour",defaultValue:(h=r==null?void 0:r.user.upload_preferences)==null?void 0:h.embed_colour}),e.jsx("div",{className:"text-red-500 text-sm",children:s==null?void 0:s.fieldErrors.embed_colour}),e.jsx(i,{type:"submit",children:"Save"})]})})]}),e.jsxs(t,{className:"mt-4",children:[e.jsx(a,{children:e.jsx(d,{children:"Domains"})}),e.jsx(m,{children:e.jsxs(p,{method:"post",children:[e.jsx(l,{className:"hidden",value:"update_urls",name:"type",readOnly:!0}),e.jsx(b,{columns:y,data:o,selected:j}),e.jsx(i,{type:"submit",children:"Save"})]})})]})]})})}export{$ as default};