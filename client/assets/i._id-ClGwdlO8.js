import{j as e}from"./jsx-runtime-BMrMXMSG.js";import{c as _,t as N}from"./index-CTHubjAk.js";import{p as t}from"./index-BuUnCgYx.js";import{S as b}from"./sidebar-B5rxhk5X.js";import{B as r}from"./button-DVl6wKDh.js";import{S as v,H as w,T as k}from"./separator-Cu6-nCqS.js";import{L as j,u as C}from"./components-BwFStQ-X.js";import{c as L}from"./createLucideIcon-CKMWKKJc.js";import{C as I,b as S}from"./card-CEVsoCFj.js";import"./user-DJfuBIeY.js";import"./index-De4eUs7t.js";import"./index-BlA7Mg33.js";import"./index-CFsilEuh.js";/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=L("LogIn",[["path",{d:"M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4",key:"u53s6r"}],["polyline",{points:"10 17 15 12 10 7",key:"1ail0h"}],["line",{x1:"15",x2:"3",y1:"12",y2:"12",key:"v6grx8"}]]);function z({className:a}){return e.jsxs("div",{className:_("pb-12 w-64 relative",a),children:[e.jsx("div",{className:"space-y-4 py-4",children:e.jsxs("div",{className:"px-3 py-2",children:[e.jsx("h2",{className:"mb-2 px-4 text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100",children:"jays.pics"}),e.jsx(v,{className:"my-4"}),e.jsx("div",{className:"space-y-1",children:e.jsx(r,{asChild:!0,variant:"ghost",className:"w-full justify-start text-gray-900 dark:text-gray-100",children:e.jsxs(j,{to:"/",children:[e.jsx(w,{className:"mr-2 h-4 w-4"}),"Index"]})})})]})}),e.jsx("div",{className:"absolute bottom-4 left-0 right-0 px-3",children:e.jsxs("div",{className:"space-y-1",children:[e.jsx(r,{asChild:!0,variant:"ghost",className:"w-full justify-start text-gray-900 dark:text-gray-100",children:e.jsx(k,{})}),e.jsx(r,{asChild:!0,variant:"ghost",className:"w-full justify-start text-gray-900 dark:text-gray-100",children:e.jsxs(j,{to:"/login",children:[e.jsx($,{className:"mr-2 h-4 w-4"}),"Login"]})})]})})]})}function O(){const{data:a,user:s}=C();return e.jsxs("div",{className:"flex h-screen overflow-hidden",children:[s.id!==""?e.jsx(b,{user:{username:s.username,is_admin:s.is_admin,notifications:s.notifications},className:"border-r"}):e.jsx(z,{className:"border-r"}),e.jsx("div",{className:"container mx-auto px-4 py-8",children:e.jsx(I,{className:"w-full h-2/3",children:e.jsx(S,{children:e.jsx("img",{src:`/i/${a.image.id}/raw`})})})})]})}const P=({data:a})=>{var i,o,m,l,n,c,d,p,g,u,x,y,h;if(!a)return[{title:"Image | jays.pics "}];const s={"image.name":(i=a.data.image)==null?void 0:i.display_name,"image.size_bytes":(o=a.data.image)==null?void 0:o.size,"image.size":t(a.data.image.size),"image.created_at":(m=a.data.image)==null?void 0:m.created_at,"uploader.name":(l=a.data.uploader)==null?void 0:l.username,"uploader.storage_used_bytes":(n=a.data.uploader)==null?void 0:n.space_used,"uploader.storage_used":t(a.data.uploader.space_used),"uploader.total_storage_bytes":(c=a.data.uploader)==null?void 0:c.max_space,"uploader.total_storage":t(a.data.uploader.max_space)},f=N(((p=(d=a.data.uploader)==null?void 0:d.upload_preferences)==null?void 0:p.embed_title)??"",s);return[{title:(g=a.data.image)==null?void 0:g.display_name},{property:"og:title",content:f},{property:"og:description",content:""},{property:"og:type",content:"website"},{property:"og:url",content:`https://jays.pics/i/${(u=a.data.image)==null?void 0:u.id}`},{property:"og:image",content:`https://jays.pics/i/${(x=a.data.image)==null?void 0:x.id}/raw${a.data.image.type==="image/gif"?".gif":""}`},{name:"theme-color",content:(h=(y=a.data.uploader)==null?void 0:y.upload_preferences)==null?void 0:h.embed_colour},{tagName:"link",type:"application/json+oembed",href:`https://jays.pics/i/${a.data.image.id}/oembed.json`},{name:"twitter:card",content:"summary_large_image"}]};export{O as default,P as meta};
