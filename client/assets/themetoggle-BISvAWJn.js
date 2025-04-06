import{c as i}from"./createLucideIcon-CKMWKKJc.js";import{r as n,j as e}from"./jsx-runtime-BMrMXMSG.js";import{P as p}from"./index-De4eUs7t.js";import{c as k}from"./index-CTHubjAk.js";import{B as u}from"./button-DVl6wKDh.js";/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=i("Earth",[["path",{d:"M21.54 15H17a2 2 0 0 0-2 2v4.54",key:"1djwo0"}],["path",{d:"M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",key:"1tzkfa"}],["path",{d:"M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05",key:"14pb5j"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]]);/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=i("House",[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"1d0kgt"}]]);/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=i("Moon",[["path",{d:"M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",key:"a7tn18"}]]);/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=i("Sun",[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]);var v="Separator",d="horizontal",g=["horizontal","vertical"],h=n.forwardRef((t,r)=>{const{decorative:s,orientation:a=d,...o}=t,c=w(a)?a:d,m=s?{role:"none"}:{"aria-orientation":c==="vertical"?c:void 0,role:"separator"};return e.jsx(p.div,{"data-orientation":c,...m,...o,ref:r})});h.displayName=v;function w(t){return g.includes(t)}var l=h;const x=n.forwardRef(({className:t,orientation:r="horizontal",decorative:s=!0,...a},o)=>e.jsx(l,{ref:o,decorative:s,orientation:r,className:k("shrink-0 bg-border",r==="horizontal"?"h-[1px] w-full":"h-full w-[1px]",t),...a}));x.displayName=l.displayName;function O(){const[t,r]=n.useState(()=>{if(typeof window<"u"){const a=localStorage.getItem("theme");return a||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}return"light"});n.useEffect(()=>{const a="dark",o=window.document.body.classList;t==="dark"?o.add(a):o.remove(a),localStorage.setItem("theme",t)},[t]);const s=()=>{r(a=>a==="dark"?"light":"dark")};return e.jsx(u,{onClick:s,variant:"ghost",className:"w-full justify-start",children:t==="dark"?e.jsxs(e.Fragment,{children:[e.jsx(f,{className:"mr-2 h-4 w-4"}),"Light Mode"]}):e.jsxs(e.Fragment,{children:[e.jsx(y,{className:"mr-2 h-4 w-4"}),"Dark Mode"]})})}export{z as E,I as H,x as S,O as T};
