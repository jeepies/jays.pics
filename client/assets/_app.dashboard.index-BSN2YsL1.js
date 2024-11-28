import{r as i,j as e}from"./jsx-runtime-BMrMXMSG.js";import{B as g}from"./button-DVl6wKDh.js";import{C as c,a as x,c as u,b as m}from"./card-CEVsoCFj.js";import{c as R}from"./index-D3MAovHW.js";import{P}from"./index-De4eUs7t.js";import{c as _}from"./index-CTHubjAk.js";import{p as N}from"./index-BuUnCgYx.js";import{u as E,L as w}from"./components-BwFStQ-X.js";import{c as k}from"./createLucideIcon-CKMWKKJc.js";import"./index-BlA7Mg33.js";import"./index-CFsilEuh.js";/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=k("Plus",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]]);/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=k("Upload",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"17 8 12 3 7 8",key:"t8dd8p"}],["line",{x1:"12",x2:"12",y1:"3",y2:"15",key:"widbto"}]]);var j="Progress",v=100,[V,se]=R(j),[T,B]=V(j),L=i.forwardRef((s,r)=>{const{__scopeProgress:l,value:o=null,max:a,getValueLabel:h=U,...d}=s;(a||a===0)&&!b(a)&&console.error(H(`${a}`,"Progress"));const t=b(a)?a:v;o!==null&&!y(o,t)&&console.error(W(`${o}`,"Progress"));const n=y(o,t)?o:null,f=p(n)?h(n,t):void 0;return e.jsx(T,{scope:l,value:n,max:t,children:e.jsx(P.div,{"aria-valuemax":t,"aria-valuemin":0,"aria-valuenow":p(n)?n:void 0,"aria-valuetext":f,role:"progressbar","data-state":I(n,t),"data-value":n??void 0,"data-max":t,...d,ref:r})})});L.displayName=j;var M="ProgressIndicator",C=i.forwardRef((s,r)=>{const{__scopeProgress:l,...o}=s,a=B(M,l);return e.jsx(P.div,{"data-state":I(a.value,a.max),"data-value":a.value??void 0,"data-max":a.max,...o,ref:r})});C.displayName=M;function U(s,r){return`${Math.round(s/r*100)}%`}function I(s,r){return s==null?"indeterminate":s===r?"complete":"loading"}function p(s){return typeof s=="number"}function b(s){return p(s)&&!isNaN(s)&&s>0}function y(s,r){return p(s)&&!isNaN(s)&&s<=r&&s>=0}function H(s,r){return`Invalid prop \`max\` of value \`${s}\` supplied to \`${r}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${v}\`.`}function W(s,r){return`Invalid prop \`value\` of value \`${s}\` supplied to \`${r}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${v} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`}var $=L,O=C;const S=i.forwardRef(({className:s,value:r,...l},o)=>e.jsx($,{ref:o,className:_("relative h-2 w-full overflow-hidden rounded-full bg-primary/20",s),...l,children:e.jsx(O,{className:"h-full w-full flex-1 bg-primary transition-all",style:{transform:`translateX(-${100-(r||0)}%)`}})}));S.displayName=$.displayName;function re(){const{user:s,referrals:r,images:l,announcement:o}=E(),[a,h]=i.useState(0),[d]=i.useState(s.max_space);return i.useEffect(()=>{const t=l.reduce((n,f)=>n+f.size,0);h(t)},[s.images]),e.jsx("div",{className:"flex h-screen",children:e.jsxs("main",{className:"flex-1 p-8 overflow-y-auto",children:[e.jsxs("h1",{className:"text-2xl font-bold py-2",children:["Welcome, ",e.jsx("span",{className:"text-primary",children:s.username}),"!"]}),e.jsxs(c,{className:"my-2",children:[e.jsx(x,{children:e.jsx(u,{children:"Announcement"})}),e.jsx(m,{children:o[0].content})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",children:[e.jsxs(c,{children:[e.jsxs(x,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(u,{className:"text-sm font-medium",children:"Total Images"}),e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",className:"h-4 w-4 text-muted-foreground",children:[e.jsx("path",{d:"M21 12V7H5a2 2 0 0 1 0-4h14v4"}),e.jsx("path",{d:"M3 5v14a2 2 0 0 0 2 2h16"}),e.jsx("path",{d:"m18 15 3 3-3 3"})]})]}),e.jsxs(m,{children:[e.jsx("div",{className:"text-2xl font-bold",children:l.length}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Lifetime uploads"})]})]}),e.jsxs(c,{children:[e.jsxs(x,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(u,{className:"text-sm font-medium",children:"Storage Used"}),e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",className:"h-4 w-4 text-muted-foreground",children:e.jsx("path",{d:"M22 12h-4l-3 9L9 3l-3 9H2"})})]}),e.jsxs(m,{children:[e.jsx("div",{className:"text-2xl font-bold",children:N(a)}),e.jsx(S,{value:a/d*100,className:"mt-2"}),e.jsxs("p",{className:"text-xs text-muted-foreground mt-2",children:[(a/d*100).toFixed(2),"% of"," ",N(d)," limit"]})]})]}),e.jsxs(c,{children:[e.jsxs(x,{className:"flex flex-row items-center justify-between space-y-0 pb-2",children:[e.jsx(u,{className:"text-sm font-medium",children:"Active Referrals"}),e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",className:"h-4 w-4 text-muted-foreground",children:[e.jsx("path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"}),e.jsx("circle",{cx:"9",cy:"7",r:"4"}),e.jsx("path",{d:"M22 21v-2a4 4 0 0 0-3-3.87"}),e.jsx("path",{d:"M16 3.13a4 4 0 0 1 0 7.75"})]})]}),e.jsxs(m,{children:[e.jsx("div",{className:"text-2xl font-bold",children:r.length}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Total referrals"})]})]})]}),e.jsxs("div",{className:"flex justify-between items-center mb-6",children:[e.jsx("h2",{className:"text-xl font-semibold",children:"Recent Uploads"}),e.jsx(g,{asChild:!0,children:e.jsxs(w,{to:"/dashboard/upload",children:[e.jsx(D,{className:"mr-2 h-4 w-4"})," Upload New Image"]})})]}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4",children:l.slice(Math.max(l.length-15,0)).reverse().map(t=>e.jsx(c,{children:e.jsxs(m,{className:"p-2",children:[e.jsx("img",{src:`/i/${t.id}/raw`,alt:"Image",className:"w-full h-24 object-cover rounded-md"}),e.jsx("p",{className:"mt-2 text-sm font-medium truncate",children:e.jsx("a",{href:`/i/${t.id}`,children:t.display_name})}),e.jsx("p",{className:"text-xs text-muted-foreground",children:new Date(t.created_at).toLocaleDateString()})]})},t.id))}),e.jsx(g,{asChild:!0,className:"mt-6",variant:"outline",children:e.jsxs(w,{to:"/dashboard/images",children:[e.jsx(A,{className:"mr-2 h-4 w-4"})," View All Images"]})})]})})}export{re as default};
