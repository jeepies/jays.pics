import{j as e,r as h,R as v}from"./jsx-runtime-BMrMXMSG.js";import{B}from"./button-DVl6wKDh.js";import{L as k,u as L}from"./components-BwFStQ-X.js";import{c as D}from"./index-CTHubjAk.js";import{p as U}from"./index-BuUnCgYx.js";import{c as y}from"./createLucideIcon-CKMWKKJc.js";import{U as V}from"./user-C2m8xjw0.js";import"./index-BlA7Mg33.js";import"./index-CFsilEuh.js";/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=y("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=y("Database",[["ellipse",{cx:"12",cy:"5",rx:"9",ry:"3",key:"msslwz"}],["path",{d:"M3 5V19A9 3 0 0 0 21 19V5",key:"1wlel7"}],["path",{d:"M3 12A9 3 0 0 0 21 12",key:"mv7ke4"}]]);/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=y("FileImage",[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["circle",{cx:"10",cy:"12",r:"2",key:"737tya"}],["path",{d:"m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22",key:"wt3hpn"}]]);/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=y("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]);/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=y("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=y("Zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]);function X(){return e.jsx("header",{className:"sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",children:e.jsxs("div",{className:"container px-4 mx-auto flex h-14 items-center",children:[e.jsx("div",{className:"flex-1",children:e.jsx(k,{to:"/",className:"flex items-center",children:e.jsx("span",{className:"font-bold text-white",children:"jays.pics"})})}),e.jsx("div",{className:"flex justify-end",children:e.jsx(k,{to:"/register",children:e.jsx(B,{variant:"secondary",size:"sm",children:"Get Started"})})})]})})}function ee({children:t,className:s,align:r="center"}){return e.jsxs("div",{className:D("group relative flex max-w-fit flex-row items-center rounded-2xl bg-white/40 px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#8fdfff1f] backdrop-blur-sm transition-shadow duration-500 ease-out [--bg-size:300%] hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-black/40",{"mx-auto":r==="center","mr-auto":r==="left","ml-auto":r==="right"},s),children:[e.jsx("div",{className:"absolute inset-0 block h-full w-full animate-gradient bg-gradient-to-r from-primary/50 via-secondary/50 to-primary/50 bg-[length:var(--bg-size)_100%] p-[1px] ![mask-composite:subtract] [border-radius:inherit] [mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]"}),t]})}const te="/assets/uploadIllustration-CIHM2AoU.svg",_=({squareSize:t=4,gridGap:s=6,flickerChance:r=.3,color:a="rgb(0, 0, 0)",width:m,height:u,className:C,maxOpacity:g=.3})=>{const p=h.useRef(null),I=h.useRef(null),[P,T]=h.useState(!1),[M,$]=h.useState({width:0,height:0}),S=h.useMemo(()=>(l=>{if(typeof window>"u")return"rgba(0, 0, 0,";const n=document.createElement("canvas");n.width=n.height=1;const c=n.getContext("2d");if(!c)return"rgba(255, 0, 0,";c.fillStyle=l,c.fillRect(0,0,1,1);const[o,f,d]=Array.from(c.getImageData(0,0,1,1).data);return`rgba(${o}, ${f}, ${d},`})(a),[a]),A=h.useCallback((i,l,n)=>{const c=window.devicePixelRatio||1;i.width=l*c,i.height=n*c,i.style.width=`${l}px`,i.style.height=`${n}px`;const o=Math.floor(l/(t+s)),f=Math.floor(n/(t+s)),d=new Float32Array(o*f);for(let x=0;x<d.length;x++)d[x]=Math.random()*g;return{cols:o,rows:f,squares:d,dpr:c}},[t,s,g]),R=h.useCallback((i,l)=>{for(let n=0;n<i.length;n++)Math.random()<r*l&&(i[n]=Math.random()*g)},[r,g]),E=h.useCallback((i,l,n,c,o,f,d)=>{i.clearRect(0,0,l,n),i.fillStyle="transparent",i.fillRect(0,0,l,n);for(let x=0;x<c;x++)for(let j=0;j<o;j++){const N=f[x*o+j];i.fillStyle=`${S}${N})`,i.fillRect(x*(t+s)*d,j*(t+s)*d,t*d,t*d)}},[S,t,s]);return h.useEffect(()=>{const i=p.current,l=I.current;if(!i||!l)return;const n=i.getContext("2d");if(!n)return;let c,o;const f=()=>{const b=m||l.clientWidth,w=u||l.clientHeight;$({width:b,height:w}),o=A(i,b,w)};f();let d=0;const x=b=>{if(!P)return;const w=(b-d)/1e3;d=b,R(o.squares,w),E(n,i.width,i.height,o.cols,o.rows,o.squares,o.dpr),c=requestAnimationFrame(x)},j=new ResizeObserver(()=>{f()});j.observe(l);const N=new IntersectionObserver(([b])=>{T(b.isIntersecting)},{threshold:0});return N.observe(i),P&&(c=requestAnimationFrame(x)),()=>{cancelAnimationFrame(c),j.disconnect(),N.disconnect()}},[A,R,E,m,u,P]),e.jsx("div",{ref:I,className:`w-full h-full ${C}`,children:e.jsx("canvas",{ref:p,className:"pointer-events-none",style:{width:M.width,height:M.height}})})};var q={color:void 0,size:void 0,className:void 0,style:void 0,attr:void 0},F=v.createContext&&v.createContext(q),se=["attr","size","title"];function re(t,s){if(t==null)return{};var r=ae(t,s),a,m;if(Object.getOwnPropertySymbols){var u=Object.getOwnPropertySymbols(t);for(m=0;m<u.length;m++)a=u[m],!(s.indexOf(a)>=0)&&Object.prototype.propertyIsEnumerable.call(t,a)&&(r[a]=t[a])}return r}function ae(t,s){if(t==null)return{};var r={};for(var a in t)if(Object.prototype.hasOwnProperty.call(t,a)){if(s.indexOf(a)>=0)continue;r[a]=t[a]}return r}function z(){return z=Object.assign?Object.assign.bind():function(t){for(var s=1;s<arguments.length;s++){var r=arguments[s];for(var a in r)Object.prototype.hasOwnProperty.call(r,a)&&(t[a]=r[a])}return t},z.apply(this,arguments)}function G(t,s){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(t);s&&(a=a.filter(function(m){return Object.getOwnPropertyDescriptor(t,m).enumerable})),r.push.apply(r,a)}return r}function O(t){for(var s=1;s<arguments.length;s++){var r=arguments[s]!=null?arguments[s]:{};s%2?G(Object(r),!0).forEach(function(a){ie(t,a,r[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):G(Object(r)).forEach(function(a){Object.defineProperty(t,a,Object.getOwnPropertyDescriptor(r,a))})}return t}function ie(t,s,r){return s=ne(s),s in t?Object.defineProperty(t,s,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[s]=r,t}function ne(t){var s=le(t,"string");return typeof s=="symbol"?s:s+""}function le(t,s){if(typeof t!="object"||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var a=r.call(t,s||"default");if(typeof a!="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(s==="string"?String:Number)(t)}function W(t){return t&&t.map((s,r)=>v.createElement(s.tag,O({key:r},s.attr),W(s.child)))}function ce(t){return s=>v.createElement(oe,z({attr:O({},t.attr)},s),W(t.child))}function oe(t){var s=r=>{var{attr:a,size:m,title:u}=t,C=re(t,se),g=m||r.size||"1em",p;return r.className&&(p=r.className),t.className&&(p=(p?p+" ":"")+t.className),v.createElement("svg",z({stroke:"currentColor",fill:"currentColor",strokeWidth:"0"},r.attr,a,C,{className:p,style:O(O({color:t.color||r.color},r.style),t.style),height:g,width:g,xmlns:"http://www.w3.org/2000/svg"}),u&&v.createElement("title",null,u),t.children)};return F!==void 0?v.createElement(F.Consumer,null,r=>s(r)):s(q)}function de(t){return ce({tag:"svg",attr:{viewBox:"0 0 496 512"},child:[{tag:"path",attr:{d:"M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"},child:[]}]})(t)}function ve(){const{imageTotal:t,userTotal:s,storageTotal:r}=L();return e.jsxs("div",{className:"flex min-h-screen flex-col items-center bg-background dark",children:[e.jsx(X,{}),e.jsxs("div",{className:"relative mx-auto container dark",children:[e.jsx("section",{id:"hero",children:e.jsxs("div",{className:"relative grid grid-cols-1 lg:grid-cols-2 gap-x-8 w-full p-6 lg:p-12 border-x overflow-hidden",children:[e.jsxs("div",{className:"z-10 flex min-h-64 items-start justify-center flex-col",children:[e.jsxs(ee,{align:"left",children:["🎉 ",e.jsx("hr",{className:"mx-2 h-4 w-px shrink-0 bg-gray-300"})," ",e.jsx("span",{className:D("inline animate-gradient bg-gradient-to-r from-primary via-secondary to-primary bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent"),children:"jays.pics v2"})]}),e.jsxs("p",{className:"text-[3.5rem] font-semibold text-left text-white",children:["jays",e.jsx("span",{className:"text-primary",children:"."}),"pics"]}),e.jsx("h2",{className:"mt-[.5rem] text-[1rem] leading-relaxed max-w-md text-left text-white",children:"Say goodbye to complicated image hosting. jays.pics gives you a streamlined platform to store and share your files, with enterprise-grade security and lightning-fast delivery on your images."}),e.jsx("div",{className:"mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start text-lg",children:e.jsx("div",{className:"rounded-md shadow",children:e.jsx(k,{to:"/register",children:e.jsxs(B,{size:"lg",className:"group text-white",children:["Get Started",e.jsx(H,{className:"ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform"})]})})})})]}),e.jsx("div",{className:"z-0 relative flex items-center justify-center",children:e.jsx("img",{src:te,alt:"A person uploading a file",className:"w-full"})})]})}),e.jsx("section",{id:"statistics",children:e.jsxs("div",{className:"relative mx-auto container text-white",children:[e.jsxs("div",{className:"text-center relative mx-auto border-x border-t overflow-hidden p-2 py-8 md:p-12",children:[e.jsx("h1",{className:"text-sm text-muted-foreground text-balance font-semibold tracking-tigh uppercase relative z-20",children:"Statistics"}),e.jsx("div",{className:"pointer-events-none absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-r from-transparent via-background to-transparent z-10"}),e.jsx(_,{className:"z-0 absolute inset-0 size-full",squareSize:4,gridGap:6,color:"#6B7280",maxOpacity:.5,flickerChance:.1,width:2560,height:1440})]}),e.jsxs("div",{className:"border-x border-t grid grid-cols-1 sm:grid-cols-3",children:[e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-2 p-4 border-r",children:[e.jsx("div",{className:"text-[4rem] font-bold font-mono tracking-tight",children:t}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Q,{className:"h-4 w-4"}),e.jsx("span",{children:"Uploads"})]})]}),e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-2 p-4 border-r",children:[e.jsx("div",{className:"text-[4rem] font-bold font-mono tracking-tight",children:s}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(V,{className:"h-4 w-4"}),e.jsx("span",{children:"Users"})]})]}),e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-2 p-4",children:[e.jsx("div",{className:"text-[4rem] font-bold font-mono tracking-tight",children:U(r).replace(" ","")}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx(Z,{className:"h-4 w-4"}),e.jsx("span",{children:"Stored"})]})]})]})]})}),e.jsx("section",{id:"features",children:e.jsxs("div",{className:"relative mx-auto container text-white",children:[e.jsxs("div",{className:"text-center relative mx-auto border-x border-t overflow-hidden p-2 py-8 md:p-12",children:[e.jsx("h1",{className:"text-sm text-muted-foreground text-balance font-semibold tracking-tigh uppercase relative z-20",children:"Features"}),e.jsx("div",{className:"pointer-events-none absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-r from-transparent via-background to-transparent z-10"}),e.jsx(_,{className:"z-0 absolute inset-0 size-full",squareSize:4,gridGap:6,color:"#6B7280",maxOpacity:.5,flickerChance:.1,width:2560,height:1440})]}),e.jsxs("div",{className:"border-x border-t grid grid-cols-1 sm:grid-cols-3",children:[e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-2 p-8 border-r",children:[e.jsx("div",{className:"text-2xl mb-2",children:e.jsx(J,{className:"h-8 w-8"})}),e.jsx("h3",{className:"font-semibold text-lg",children:"Custom Domains"}),e.jsx("p",{className:"text-sm text-muted-foreground text-center",children:"Use your own domain or another from the community pool"})]}),e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-2 p-8 border-r",children:[e.jsx("div",{className:"text-2xl mb-2",children:e.jsx(K,{className:"h-8 w-8"})}),e.jsx("h3",{className:"font-semibold text-lg",children:"Cool Support"}),e.jsx("p",{className:"text-sm text-muted-foreground text-center",children:"Friendly team ready to help you with any issues"})]}),e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-2 p-8",children:[e.jsx("div",{className:"text-2xl mb-2",children:e.jsx(Y,{className:"h-8 w-8"})}),e.jsx("h3",{className:"font-semibold text-lg",children:"Lightning Fast"}),e.jsx("p",{className:"text-sm text-muted-foreground text-center",children:"We make sure to deliver your images as fast as possible"})]})]})]})}),e.jsx("section",{id:"faq",children:e.jsxs("div",{className:"relative mx-auto container text-white",children:[e.jsxs("div",{className:"text-center relative mx-auto border-x border-t overflow-hidden p-2 py-8 md:p-12",children:[e.jsx("h1",{className:"text-sm text-muted-foreground text-balance font-semibold tracking-tigh uppercase relative z-20",children:"Frequently Asked Questions (FAQ)"}),e.jsx("div",{className:"pointer-events-none absolute bottom-0 left-0 right-0 h-full w-full bg-gradient-to-r from-transparent via-background to-transparent z-10"}),e.jsx(_,{className:"z-0 absolute inset-0 size-full",squareSize:4,gridGap:6,color:"#6B7280",maxOpacity:.5,flickerChance:.1,width:2560,height:1440})]}),e.jsxs("div",{className:"border-x border-t grid grid-cols-1 sm:grid-cols-3",children:[e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-2 p-8 border-r",children:[e.jsx("h3",{className:"font-semibold text-lg",children:"What is jays.pics?"}),e.jsx("p",{className:"text-sm text-muted-foreground text-center",children:"jays.pics is a modern image hosting platform focused on simplicity and speed."})]}),e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-2 p-8 border-r",children:[e.jsx("h3",{className:"font-semibold text-lg",children:"Is it free?"}),e.jsx("p",{className:"text-sm text-muted-foreground text-center",children:"Yes, we offers a generous free tier with essential features."})]}),e.jsxs("div",{className:"flex flex-col items-center justify-center space-y-2 p-8",children:[e.jsx("h3",{className:"font-semibold text-lg",children:"What files can I upload?"}),e.jsx("p",{className:"text-sm text-muted-foreground text-center",children:"We support most common image formats including PNG, JPEG, GIF etc."})]})]})]})})]}),e.jsx("footer",{className:"w-full border-t",children:e.jsx("div",{className:"container mx-auto text-white",children:e.jsxs("div",{className:"flex items-center justify-between p-4",children:[e.jsx("div",{className:"text-sm text-muted-foreground",children:"© 2025 jays.pics. All rights reserved."}),e.jsx("div",{className:"flex items-center space-x-4",children:e.jsx(k,{to:"https://github.com/jeepies/jays.pics",className:"text-muted-foreground hover:text-foreground",children:e.jsx(de,{className:"h-4 w-4"})})})]})})})]})}export{ve as default};
