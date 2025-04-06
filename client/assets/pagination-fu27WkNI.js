import{j as t}from"./jsx-runtime-BMrMXMSG.js";import{B as a}from"./button-DVl6wKDh.js";import{L as r}from"./components-BwFStQ-X.js";import{c as i}from"./createLucideIcon-CKMWKKJc.js";import{C as c}from"./chevron-right-BQKuohgu.js";/**
 * @license lucide-react v0.445.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const s=i("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);function x(e){const o=Math.ceil(e.totalCount/h);return t.jsxs(t.Fragment,{children:[t.jsx(a,{variant:"outline",children:t.jsx(r,{to:`${e.path}?page=${e.currentPage-1}`,children:t.jsx(s,{})})}),new Array(10).fill(0).map((l,n)=>t.jsx(a,{variant:"outline",disabled:n>o-1,children:t.jsx(r,{to:`${e.path}?page=${n+1}`,children:n+1})},n)),t.jsx(a,{variant:"outline",children:t.jsx(r,{to:`${e.path}?page=${e.currentPage+1}`,children:t.jsx(c,{})})})]})}const h=25;export{x as P};
