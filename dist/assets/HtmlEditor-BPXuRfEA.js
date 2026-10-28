import{s as a,r as s,j as e}from"./index-BE4DG54A.js";import{L as u}from"./list-BkiNisFk.js";import{L as m}from"./upload-goFswZxv.js";import{E as p}from"./eye-CAtos-KZ.js";/**
 * @license lucide-react v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const b=[["path",{d:"M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8",key:"mg9rjx"}]],k=a("bold",b);/**
 * @license lucide-react v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",key:"oz39mx"}]],M=a("bookmark",f);/**
 * @license lucide-react v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=[["path",{d:"m16 18 6-6-6-6",key:"eg8j8"}],["path",{d:"m8 6-6 6 6 6",key:"ppft3o"}]],w=a("code",v);/**
 * @license lucide-react v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=[["line",{x1:"19",x2:"10",y1:"4",y2:"4",key:"15jd3p"}],["line",{x1:"14",x2:"5",y1:"20",y2:"20",key:"bu0au3"}],["line",{x1:"15",x2:"9",y1:"4",y2:"20",key:"uljnxc"}]],N=a("italic",j);/**
 * @license lucide-react v1.22.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=[["path",{d:"M6 4v6a6 6 0 0 0 12 0V4",key:"9kb039"}],["line",{x1:"4",x2:"20",y1:"20",y2:"20",key:"nun2al"}]],C=a("underline",L);function E({value:n,onChange:d,placeholder:x="",className:c=""}){const[t,g]=s.useState(!1),r=s.useRef(null);s.useEffect(()=>{r.current&&!t&&r.current.innerHTML!==n&&(r.current.innerHTML=n)},[n,t]);const l=()=>{r.current&&d(r.current.innerHTML)},o=(i,y="")=>{document.execCommand(i,!1,y),l()},h=()=>{g(!t)};return e.jsxs("div",{className:`border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850 focus-within:border-brand-500 transition-all flex flex-col ${c}`,children:[e.jsxs("div",{className:"flex items-center gap-1 p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 select-none",children:[!t&&e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:()=>o("bold"),className:"p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700/50 rounded transition-all cursor-pointer",title:"Bold",children:e.jsx(k,{size:15})}),e.jsx("button",{type:"button",onClick:()=>o("italic"),className:"p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700/50 rounded transition-all cursor-pointer",title:"Italic",children:e.jsx(N,{size:15})}),e.jsx("button",{type:"button",onClick:()=>o("underline"),className:"p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700/50 rounded transition-all cursor-pointer",title:"Underline",children:e.jsx(C,{size:15})}),e.jsx("div",{className:"w-[1px] h-5 bg-gray-300 dark:bg-gray-600 mx-1"}),e.jsx("button",{type:"button",onClick:()=>o("insertUnorderedList"),className:"p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700/50 rounded transition-all cursor-pointer",title:"Bullet List",children:e.jsx(u,{size:15})}),e.jsx("button",{type:"button",onClick:()=>o("insertOrderedList"),className:"p-1.5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700/50 rounded transition-all cursor-pointer",title:"Numbered List",children:e.jsx(m,{size:15})}),e.jsx("div",{className:"w-[1px] h-5 bg-gray-300 dark:bg-gray-600 mx-1"})]}),e.jsx("button",{type:"button",onClick:h,className:`p-1.5 rounded transition-all cursor-pointer ml-auto flex items-center gap-1.5 text-xs font-bold ${t?"bg-brand-500 text-white shadow-sm":"text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700/50"}`,title:t?"Switch to Visual View":"Switch to Code View",children:t?e.jsxs(e.Fragment,{children:[e.jsx(p,{size:14}),"Visual"]}):e.jsxs(e.Fragment,{children:[e.jsx(w,{size:14}),"HTML Code"]})})]}),e.jsx("div",{className:"relative flex-1 flex flex-col min-h-[140px]",children:t?e.jsx("textarea",{value:n,onChange:i=>d(i.target.value),className:"w-full flex-1 p-4 bg-gray-950 text-emerald-400 font-mono text-xs outline-none resize-none min-h-[140px]",placeholder:"<p>Write your raw HTML here...</p>"}):e.jsx("div",{ref:r,contentEditable:!0,onInput:l,className:"w-full flex-1 p-4 outline-none text-sm font-medium text-gray-900 dark:text-white overflow-y-auto prose dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none","data-placeholder":x,style:{minHeight:"140px"}})})]})}export{M as B,E as H};
