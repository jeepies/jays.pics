import{j as e}from"./jsx-runtime-BMrMXMSG.js";import{B as i}from"./button-DVl6wKDh.js";import{C as n,a as d,c as o,b as c,d as h}from"./card-CEVsoCFj.js";import{I as j}from"./input-DHMy5rOh.js";import{T as p,a as u,b as m,c as x,d as C,e as f}from"./table-CFscRwcK.js";import{u as T,L as b}from"./components-BwFStQ-X.js";import"./index-CTHubjAk.js";import"./index-BlA7Mg33.js";import"./index-CFsilEuh.js";function g(r){const a=document.getElementById("referral-code"),s=r.target;a.select(),a.setSelectionRange(0,99999),navigator.clipboard.writeText(a.value),s.innerText="Copied",setTimeout(()=>{s.innerText="Copy"},1200)}function H(){var s,l;const{user:r,data:a}=T();return e.jsx(e.Fragment,{children:e.jsxs("div",{className:"container mx-auto px-4 py-8",children:[e.jsxs(n,{children:[e.jsx(d,{children:e.jsx(o,{children:"Your Referral Code"})}),e.jsxs(c,{children:[e.jsx(j,{id:"referral-code",className:"text-center",value:(s=r==null?void 0:r.referrer_profile)==null?void 0:s.referral_code,readOnly:!0}),e.jsx(i,{id:"copy-button",onClick:g,className:"mt-2 w-full",children:"Copy"}),e.jsx(b,{to:"?regenerate",children:e.jsx(i,{className:"mt-2 w-full",children:"Regenerate"})})]})]}),e.jsxs(n,{className:"mt-4",children:[e.jsxs(d,{children:[e.jsx(o,{children:"Your Referrals"}),e.jsxs(h,{children:["You have used ",a.referrals.length," of ",(l=r==null?void 0:r.referrer_profile)==null?void 0:l.referral_limit," referrals"]})]}),e.jsx(c,{children:e.jsxs(p,{children:[e.jsx(u,{children:e.jsxs(m,{children:[e.jsx(x,{className:"w-[100px]",children:"User"}),e.jsx(x,{className:"text-right",children:"Date"})]})}),e.jsx(C,{children:a.referrals.map(t=>e.jsxs(m,{children:[e.jsx(f,{className:"font-medium",children:e.jsx("a",{href:`/profile/${t.referred.id}`,children:t.referred.username})}),e.jsx(f,{className:"text-right",children:new Date(t.created_at).toLocaleDateString()})]},t.referred.id))})]})})]})]})})}export{H as default};
