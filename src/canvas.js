export function initCanvases(){
const $=s=>document.querySelector(s);let stop=false;
/* canvases */
function fit(c){var d=devicePixelRatio||1,w=c.clientWidth,h=c.clientHeight;c.width=w*d;c.height=h*d;c.getContext("2d").setTransform(d,0,0,d,0,0);return[w,h]}
var nc=$("#net"),nx=nc.getContext("2d"),pts=[],NW=0,NH=0,mx=-999,my=-999,i;
function seed(){var s=fit(nc);NW=s[0];NH=s[1];pts=[];var n=Math.min(110,Math.floor(NW*NH/12000));for(i=0;i<n;i++)pts.push({x:Math.random()*NW,y:Math.random()*NH,vx:(Math.random()-.5)*.45,vy:(Math.random()-.5)*.45,r:Math.random()<.12?3.2:1.6})}
addEventListener("resize",function(){seed();vs=0});$("#home").addEventListener("pointermove",function(e){var r=nc.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});seed();
var LT=function(){return document.documentElement.dataset.theme!=="dark"};
function net(t){nx.clearRect(0,0,NW,NH);for(i=0;i<pts.length;i++){var p=pts[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>NW)p.vx*=-1;if(p.y<0||p.y>NH)p.vy*=-1;nx.fillStyle=p.r>3?"#ff5f24":(LT()?"rgba(21,21,21,.4)":"rgba(255,255,255,.55)");nx.beginPath();nx.arc(p.x,p.y,p.r,0,6.3);nx.fill();if(p.r>3){nx.strokeStyle="rgba(255,95,36,"+(.3+.3*Math.sin(t*.003+i))+")";nx.beginPath();nx.arc(p.x,p.y,8+4*Math.sin(t*.003+i),0,6.3);nx.stroke()}
for(var j=i+1;j<pts.length;j++){var q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<135){nx.strokeStyle="rgba(255,95,36,"+(.28*(1-d/135))+")";nx.beginPath();nx.moveTo(p.x,p.y);nx.lineTo(q.x,q.y);nx.stroke()}}
var m=Math.hypot(p.x-mx,p.y-my);if(m<170){nx.strokeStyle=(LT()?"rgba(21,21,21,":"rgba(255,255,255,")+(.5*(1-m/170))+")";nx.beginPath();nx.moveTo(p.x,p.y);nx.lineTo(mx,my);nx.stroke()}}}
var vc=$("#viz"),vx=vc.getContext("2d"),B=[],T=[],nt=0,vs=0;for(i=0;i<44;i++){B.push(.3);T.push(.3)}
function viz(t){if(t>nt){nt=t+1100;for(i=0;i<44;i++)T[i]=Math.max(.1,Math.min(.95,.42+.24*Math.sin(i*.3+t*.0007)+(Math.random()-.5)*.3+i/44*.2))}
if(!vs||vs[0]!==vc.clientWidth)vs=fit(vc);var w=vs[0],h=vs[1],bw=w/44;vx.clearRect(0,0,w,h);vx.strokeStyle="rgba(255,255,255,.08)";for(i=1;i<5;i++){vx.beginPath();vx.moveTo(0,h*i/5);vx.lineTo(w,h*i/5);vx.stroke()}
vx.beginPath();for(i=0;i<44;i++){B[i]+=(T[i]-B[i])*.06;var bh=B[i]*h;vx.fillStyle=B[i]>.68?"#ff5f24":"rgba(255,255,255,.22)";vx.fillRect(i*bw+2,h-bh,bw-4,bh);i?vx.lineTo(i*bw+bw/2,h-bh):vx.moveTo(bw/2,h-bh)}vx.strokeStyle="#fff";vx.lineWidth=2;vx.stroke()}


function frame(t){if(stop)return;requestAnimationFrame(frame);if(!$("#home").classList.contains("on"))return;net(t);viz(t)}
requestAnimationFrame(frame);
return()=>{stop=true};
}
