import{r as i,j as e}from"./jsx-runtime-BMrMXMSG.js";import{u as p,a as f,O as g}from"./index-CFsilEuh.js";import{b as y,c as S,_ as w,M as x,d as j,S as k}from"./components-BwFStQ-X.js";import"./index-BlA7Mg33.js";/**
 * @remix-run/react v2.12.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let c="positions";function M({getKey:s,...t}){let{isSpaMode:a}=y(),o=p(),m=f();S({getKey:s,storageKey:c});let u=i.useMemo(()=>{if(!s)return null;let r=s(o,m);return r!==o.key?r:null},[]);if(a)return null;let h=((r,d)=>{if(!window.history.state||!window.history.state.key){let n=Math.random().toString(32).slice(2);window.history.replaceState({key:n},"")}try{let l=JSON.parse(sessionStorage.getItem(r)||"{}")[d||window.history.state.key];typeof l=="number"&&window.scrollTo(0,l)}catch(n){console.error(n),sessionStorage.removeItem(r)}}).toString();return i.createElement("script",w({},t,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${h})(${JSON.stringify(c)}, ${JSON.stringify(u)})`}}))}const b=()=>[{rel:"preconnect",href:"https://fonts.googleapis.com"},{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"},{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"}];function v({children:s}){const[t,a]=i.useState(()=>{if(typeof window<"u"){const o=localStorage.getItem("theme");return o||(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}return"light"});return i.useEffect(()=>{localStorage.getItem("theme")!==t&&(document.documentElement.setAttribute("data-theme",t),localStorage.setItem("theme",t))},[t]),e.jsxs("html",{lang:"en",children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx(x,{}),e.jsx(j,{})]}),e.jsxs("body",{children:[s,e.jsx(M,{}),e.jsx(k,{})]})]})}function L(){return e.jsx(g,{})}export{v as Layout,L as default,b as links};