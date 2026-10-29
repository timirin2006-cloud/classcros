'use strict';
const S=46, O={x:300,y:260}, AN={A:.61,B:2.7,C:-1.4}; // S = px в 1 см
const st={r:3,open:0,prog:0,run:false,pts:{},rad:{},meas:false,lab:true};
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const fmt=n=>(Math.round(n*10)/10).toFixed(1).replace('.',',');
const dist=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y)/S;            // d = √((x2−x1)²+(y2−y1)²), в см
const P=k=>({x:O.x+st.r*S*Math.cos(AN[k]),y:O.y+st.r*S*Math.sin(AN[k])}); // x=x0+r·cos t, y=y0+r·sin t

function grid(){let o='';for(let i=-6;i<=6;i++)o+=`<line class="grd" x1="${O.x+i*S}" y1="0" x2="${O.x+i*S}" y2="520"/>`;
 for(let i=-5;i<=5;i++)o+=`<line class="grd" x1="0" y1="${O.y+i*S}" x2="600" y2="${O.y+i*S}"/>`;
 return o+`<text x="8" y="510" class="tl" style="font-size:16px;stroke-width:3px">клетка = 1 см</text>`}

function compass(){const R=st.r*S,d=st.open*R,t=2*Math.PI*st.prog,L=210;
 const Pp={x:O.x+d*Math.cos(t),y:O.y+d*Math.sin(t)},M={x:(O.x+Pp.x)/2,y:(O.y+Pp.y)/2};
 let nx=Pp.y-O.y,ny=-(Pp.x-O.x),n=Math.hypot(nx,ny)||1;nx/=n;ny/=n;if(d<1){nx=0;ny=-1}
 if(ny>0||(Math.abs(ny)<1e-6&&nx<0)){nx=-nx;ny=-ny}
 const h=Math.sqrt(L*L-d*d/4),H={x:M.x+nx*h,y:M.y+ny*h},T={x:H.x+nx*50,y:H.y+ny*50};
 return `<line class="leg" x1="${O.x}" y1="${O.y}" x2="${H.x}" y2="${H.y}"/><line class="leg" x1="${Pp.x}" y1="${Pp.y}" x2="${H.x}" y2="${H.y}"/>
 <line class="leg" x1="${H.x}" y1="${H.y}" x2="${T.x}" y2="${T.y}" style="stroke:#bbb;stroke-width:10"/><circle cx="${H.x}" cy="${H.y}" r="11" fill="#caa02a"/>
 <circle cx="${Pp.x}" cy="${Pp.y}" r="6" fill="#2563eb"/>`}

function geo(sh){const s=sh.split(' '),h=x=>s.includes(x),full=h('f'),pr=full?1:st.prog,r=st.r*S;let o=grid();
 if((h('c')||full)&&pr>0){const n=Math.max(2,Math.round(pr*120));let d='';
  for(let i=0;i<=n;i++){const t=2*Math.PI*pr*i/n;d+=(i?'L':'M')+(O.x+r*Math.cos(t)).toFixed(1)+' '+(O.y+r*Math.sin(t)).toFixed(1)}
  o+=`<path d="${d}" class="circ"/>`}
 for(const k of 'ABC'){const p=P(k);if(h('r'+k)||(h('u')&&st.rad[k]&&(h(k)||st.pts[k]))){
  o+=`<line class="rad" x1="${O.x}" y1="${O.y}" x2="${p.x}" y2="${p.y}"/>`;
  const mx=(O.x+p.x)/2,my=(O.y+p.y)/2,ox=-(p.y-O.y)/r*18,oy=(p.x-O.x)/r*18;
  if(h('rA')||h('l')&&st.lab)o+=`<text class="tl" x="${mx+ox-10}" y="${my+oy+8}">O${k}</text>`;
  if(h('m')&&st.meas)o+=`<text class="tl" style="fill:#86efac" x="${mx-ox-30}" y="${my-oy+8}">${fmt(dist(O,p))} см</text>`}}
 o+=`<circle cx="${O.x}" cy="${O.y}" r="6" fill="#fff"/><text class="tl" x="${O.x-26}" y="${O.y+28}">O</text>`;
 for(const k of 'ABC')if(h(k)||(h('p')&&st.pts[k])){const p=P(k);
  o+=`<circle cx="${p.x}" cy="${p.y}" r="8" fill="#f87171" stroke="#fff" stroke-width="2"/><text class="tl" x="${p.x+Math.cos(AN[k])*24-9}" y="${p.y+Math.sin(AN[k])*24+9}">${k}</text>`}
 if(h('k'))o+=compass();return o}

// поля с перетаскиваемыми точками (экраны 11 и 13)
const pol=(n,d,a)=>({n,x:O.x+d*S*Math.cos(a),y:O.y+d*S*Math.sin(a)});
const F0=()=>({f11:{circ:1,drag:0,chk:0,p:[pol('K',1.5,.5),pol('L',3,2.2),pol('M',4.5,-.8),pol('N',3,-2.3)]},
 f13:{circ:0,drag:1,chk:0,p:[pol('A',1.5,-.6),pol('B',3,.9),pol('C',4.2,2.4),pol('D',3,-2.4),pol('E',2.3,3.5)]}});
let F=F0();
function fld(id){const f=F[id];let o=grid()+(f.circ?`<circle cx="${O.x}" cy="${O.y}" r="${3*S}" class="circ"/>`:'')+
 `<circle cx="${O.x}" cy="${O.y}" r="6" fill="#fff"/><text class="tl" x="${O.x-26}" y="${O.y+28}">O</text>`;
 f.p.forEach((p,i)=>{const d=dist(O,p),c=Math.abs(d-3)<.1?'ok':d<3?'in':'out',nm={ok:'на окружности',in:'внутри',out:'вне окружности'}[c],e=p.x>360;
  o+=`<g data-i="${i}" class="pt ${f.chk?c:''}"><circle cx="${p.x}" cy="${p.y}" r="16"/><text class="pl" x="${p.x}" y="${p.y+6}" text-anchor="middle">${p.n}</text></g>`;
  if(f.chk)o+=`<text class="tl" style="font-size:20px" text-anchor="${e?'end':'start'}" x="${p.x+(e?-22:22)}" y="${p.y-14}">${fmt(d)} см — ${nm}</text>`});
 $('#'+id).innerHTML=o}

function render(){$$('[data-show]').forEach(e=>e.innerHTML=geo(e.dataset.show));fld('f11');fld('f13');
 const m=$('#mt');m.innerHTML=['A','B','C'].map(k=>`O${k} = ${fmt(dist(O,P(k)))} см`).join('<br>')+'<br>OA = OB = OC';m.classList.toggle('on',st.meas)}

// анимация циркуля
let last=0;
function loop(ts){if(!st.run)return;const dt=last?(ts-last)/1000:0;last=ts;
 if(st.open<1)st.open=Math.min(1,st.open+dt/.9);else{st.prog=Math.min(1,st.prog+dt/5);if(st.prog>=1)st.run=false}
 render();if(st.run)requestAnimationFrame(loop)}
const run=()=>{st.run=true;last=0;requestAnimationFrame(loop)};
const clr=()=>{st.run=false;st.open=st.prog=0;st.pts={};st.rad={};st.meas=false;render()};

// навигация
const sl=$$('.s');let cur=0;
function show(i){cur=Math.max(0,Math.min(sl.length-1,i));const n=cur+1;
 sl.forEach((s,j)=>s.classList.toggle('on',j===cur));$$('video').forEach(v=>v.pause());$('#pop').classList.remove('on');
 if(n>=5){st.run=false;st.open=st.prog=1}if(n>=6)'ABC'.split('').forEach(k=>st.pts[k]=1);if(n>=7)'ABC'.split('').forEach(k=>st.rad[k]=1);
 $('#stg').textContent=sl[cur].dataset.t;$('#cnt').textContent=n+' / '+sl.length;$('#stage').dataset.theme=sl[cur].dataset.th;
 $('#bk').style.visibility=cur?'visible':'hidden';$('#nx').style.visibility=cur<sl.length-1?'visible':'hidden';render()}
function fit(){const s=Math.min(innerWidth/1280,innerHeight/720);$('#stage').style.transform=`translate(${-640*s}px,${-360*s}px) scale(${s})`}

const T={c:'Окружность — это линия. Точки внутри ей не принадлежат.',k:'Круг — это окружность вместе со всеми точками внутри неё.'};
const act={next:()=>show(cur+1),back:()=>show(cur-1),
 fs:()=>document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen(),
 rad:b=>{st.r=+b.dataset.v;$$('#rb .b').forEach(x=>x.classList.toggle('on',x===b));clr()},
 build:()=>{if(st.prog>=1){st.open=st.prog=0}run()},pause:()=>{st.run=false},cont:()=>{if(st.prog<1)run()},
 again:()=>{st.open=st.prog=0;st.pts={};st.rad={};run()},reset:clr,
 pt:b=>{(b.dataset.k=='all'?['A','B','C']:[b.dataset.k]).forEach(k=>st.pts[k]=1);render()},
 rd:b=>{const k=b.dataset.k;st.rad[k]=!st.rad[k];render()},
 rall:()=>{const on='ABC'.split('').every(k=>st.rad[k]);'ABC'.split('').forEach(k=>st.rad[k]=!on);render()},
 lab:()=>{st.lab=!st.lab;render()},meas:()=>{st.meas=true;render()},
 chk11:()=>{F.f11.chk=1;render()},rst11:()=>{F.f11=F0().f11;render()},
 chk13:()=>{F.f13.chk=1;render()},circ13:()=>{F.f13.circ=!F.f13.circ;render()},rst13:()=>{F.f13=F0().f13;render()},
 mode:b=>{$('#s14').dataset.m=b.dataset.v;$('#mtxt').textContent=T[b.dataset.v]},
 play:b=>{const v=$('#'+b.dataset.v);v.play().catch(()=>{})},
 hint:b=>{const p=$('#pop');p.textContent=b.dataset.h;p.classList.toggle('on')}};
document.addEventListener('click',e=>{const m=e.target.closest('.more');if(m){const s=m.closest('.s'),n=s.querySelector('.step:not(.on):not(#mt)');
  if(n)n.classList.add('on');if(!s.querySelector('.step:not(.on):not(#mt)'))m.style.visibility='hidden';return}
 const a=e.target.closest('[data-a]');if(a)act[a.dataset.a](a)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('#pop').classList.remove('on');return}
 if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();document.activeElement.blur();show(cur+1)}
 else if(e.key==='ArrowLeft'){e.preventDefault();show(cur-1)}});
$$('video').forEach(v=>v.addEventListener('error',()=>{const i=new Image();i.src=v.poster;i.style.cssText='width:100%;border-radius:14px';v.replaceWith(i)}));

// перетаскивание точек (мышь и касание)
const f13=$('#f13');let dr=-1;
const loc=e=>{const p=f13.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(f13.getScreenCTM().inverse())};
f13.addEventListener('pointerdown',e=>{const g=e.target.closest('[data-i]');if(!g)return;dr=+g.dataset.i;f13.setPointerCapture(e.pointerId)});
f13.addEventListener('pointermove',e=>{if(dr<0)return;const p=loc(e),q=F.f13.p[dr];q.x=Math.max(20,Math.min(580,p.x));q.y=Math.max(20,Math.min(500,p.y));fld('f13')});
f13.addEventListener('pointerup',()=>{dr=-1});
addEventListener('resize',fit);fit();show(0);
