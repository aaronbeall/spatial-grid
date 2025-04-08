var at=globalThis,J=at.trustedTypes,$t=J?J.createPolicy("lit-html",{createHTML:r=>r}):void 0,Mt="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,St="?"+I,zt=`<${St}>`,E=document,X=()=>E.createComment(""),Y=r=>r===null||typeof r!="object"&&typeof r!="function",ct=Array.isArray,Rt=r=>ct(r)||typeof r?.[Symbol.iterator]=="function",it=`[ 	
\f\r]`,W=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,yt=/-->/g,vt=/>/g,w=RegExp(`>|${it}(?:([^\\s"'>=/]+)(${it}*=${it}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),At=/'/g,xt=/"/g,jt=/^(?:script|style|textarea|title)$/i,ht=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),T=ht(1),Ft=ht(2),Zt=ht(3),D=Symbol.for("lit-noChange"),g=Symbol.for("lit-nothing"),_t=new WeakMap,L=E.createTreeWalker(E,129);function It(r,t){if(!ct(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return $t!==void 0?$t.createHTML(t):t}var Pt=(r,t)=>{let e=r.length-1,i=[],s,o=t===2?"<svg>":t===3?"<math>":"",n=W;for(let a=0;a<e;a++){let l=r[a],u,d,h=-1,p=0;for(;p<l.length&&(n.lastIndex=p,d=n.exec(l),d!==null);)p=n.lastIndex,n===W?d[1]==="!--"?n=yt:d[1]!==void 0?n=vt:d[2]!==void 0?(jt.test(d[2])&&(s=RegExp("</"+d[2],"g")),n=w):d[3]!==void 0&&(n=w):n===w?d[0]===">"?(n=s??W,h=-1):d[1]===void 0?h=-2:(h=n.lastIndex-d[2].length,u=d[1],n=d[3]===void 0?w:d[3]==='"'?xt:At):n===xt||n===At?n=w:n===yt||n===vt?n=W:(n=w,s=void 0);let b=n===w&&r[a+1].startsWith("/>")?" ":"";o+=n===W?l+zt:h>=0?(i.push(u),l.slice(0,h)+Mt+l.slice(h)+I+b):l+I+(h===-2?a:b)}return[It(r,o+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},U=class r{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,n=0,a=t.length-1,l=this.parts,[u,d]=Pt(t,e);if(this.el=r.createElement(u,i),L.currentNode=this.el.content,e===2||e===3){let h=this.el.content.firstChild;h.replaceWith(...h.childNodes)}for(;(s=L.nextNode())!==null&&l.length<a;){if(s.nodeType===1){if(s.hasAttributes())for(let h of s.getAttributeNames())if(h.endsWith(Mt)){let p=d[n++],b=s.getAttribute(h).split(I),S=/([.?@])?(.*)/.exec(p);l.push({type:1,index:o,name:S[2],strings:b,ctor:S[1]==="."?nt:S[1]==="?"?ot:S[1]==="@"?rt:G}),s.removeAttribute(h)}else h.startsWith(I)&&(l.push({type:6,index:o}),s.removeAttribute(h));if(jt.test(s.tagName)){let h=s.textContent.split(I),p=h.length-1;if(p>0){s.textContent=J?J.emptyScript:"";for(let b=0;b<p;b++)s.append(h[b],X()),L.nextNode(),l.push({type:2,index:++o});s.append(h[p],X())}}}else if(s.nodeType===8)if(s.data===St)l.push({type:2,index:o});else{let h=-1;for(;(h=s.data.indexOf(I,h+1))!==-1;)l.push({type:7,index:o}),h+=I.length-1}o++}}static createElement(t,e){let i=E.createElement("template");return i.innerHTML=t,i}};function P(r,t,e=r,i){if(t===D)return t;let s=i!==void 0?e._$Co?.[i]:e._$Cl,o=Y(t)?void 0:t._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),o===void 0?s=void 0:(s=new o(r),s._$AT(r,e,i)),i!==void 0?(e._$Co??=[])[i]=s:e._$Cl=s),s!==void 0&&(t=P(r,s._$AS(r,t.values),s,i)),t}var st=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){let{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??E).importNode(e,!0);L.currentNode=s;let o=L.nextNode(),n=0,a=0,l=i[0];for(;l!==void 0;){if(n===l.index){let u;l.type===2?u=new V(o,o.nextSibling,this,t):l.type===1?u=new l.ctor(o,l.name,l.strings,this,t):l.type===6&&(u=new lt(o,this,t)),this._$AV.push(u),l=i[++a]}n!==l?.index&&(o=L.nextNode(),n++)}return L.currentNode=E,s}p(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},V=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=g,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=P(this,t,e),Y(t)?t===g||t==null||t===""?(this._$AH!==g&&this._$AR(),this._$AH=g):t!==this._$AH&&t!==D&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Rt(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==g&&Y(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){let{values:e,_$litType$:i}=t,s=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=U.createElement(It(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{let o=new st(s,this),n=o.u(this.options);o.p(e),this.T(n),this._$AH=o}}_$AC(t){let e=_t.get(t.strings);return e===void 0&&_t.set(t.strings,e=new U(t)),e}k(t){ct(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,s=0;for(let o of t)s===e.length?e.push(i=new r(this.O(X()),this.O(X()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t&&t!==this._$AB;){let i=t.nextSibling;t.remove(),t=i}}setConnected(t){this._$AM===void 0&&(this._$Cv=t,this._$AP?.(t))}},G=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=g,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=g}_$AI(t,e=this,i,s){let o=this.strings,n=!1;if(o===void 0)t=P(this,t,e,0),n=!Y(t)||t!==this._$AH&&t!==D,n&&(this._$AH=t);else{let a=t,l,u;for(t=o[0],l=0;l<o.length-1;l++)u=P(this,a[i+l],e,l),u===D&&(u=this._$AH[l]),n||=!Y(u)||u!==this._$AH[l],u===g?t=g:t!==g&&(t+=(u??"")+o[l+1]),this._$AH[l]=u}n&&!s&&this.j(t)}j(t){t===g?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},nt=class extends G{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===g?void 0:t}},ot=class extends G{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==g)}},rt=class extends G{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=P(this,t,e,0)??g)===D)return;let i=this._$AH,s=t===g&&i!==g||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==g&&(i===g||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},lt=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){P(this,t)}};var Gt=at.litHtmlPolyfillSupport;Gt?.(U,V),(at.litHtmlVersions??=[]).push("3.2.1");var K=(r,t,e)=>{let i=e?.renderBefore??t,s=i._$litPart$;if(s===void 0){let o=e?.renderBefore??null;i._$litPart$=s=new V(t.insertBefore(X(),o),o,void 0,e??{})}return s._$AI(r),s};var Q=class{constructor({width:t,height:e,tileSize:i,debug:s=!1}){this.objects=[];this.debug=!1;this.lastCheckedTiles=[];this.#t=[];this.width=t,this.height=e,this.tileSize=i,this.debug=s}#t;add(...t){this.objects.push(...t)}remove(...t){this.objects=this.objects.filter(e=>!t.includes(e))}get xTiles(){return Math.floor(this.width/this.tileSize)}get yTiles(){return Math.floor(this.height/this.tileSize)}update(){this.#t=Array.from({length:this.xTiles*this.yTiles},()=>[]);for(let t of this.objects){let e=Math.floor((t.left??t.x-(t.radius??0))/this.tileSize),i=Math.floor((t.top??t.y-(t.radius??0))/this.tileSize),s=Math.floor((t.right??t.x+(t.radius??0))/this.tileSize),o=Math.floor((t.bottom??t.y+(t.radius??0))/this.tileSize);for(let n=e;n<=s;n++)for(let a=i;a<=o;a++)if(n>=0&&n<this.xTiles&&a>=0&&a<this.yTiles){let l=a*this.xTiles+n;this.#t[l].push(t)}}}getNeighbors(t,e,i=1){let s=new Set;this.debug&&(this.lastCheckedTiles=[]);let o=Math.floor(t/this.tileSize),n=Math.floor(e/this.tileSize);for(let a=-i;a<=i;a++)for(let l=-i;l<=i;l++){let u=o+a,d=n+l;if(u>=0&&u<this.xTiles&&d>=0&&d<this.yTiles){this.debug&&this.lastCheckedTiles.push({x:u,y:d});let h=d*this.xTiles+u;for(let p of this.#t[h])s.add(p)}}return Array.from(s)}getObjectsIntersectingCircle(t,e,i){this.debug&&(this.lastCheckedTiles=[]);let s=this.getNeighbors(t,e,Math.ceil(i/this.tileSize)),o=[];for(let n of s){let a=n.radius||0,l=n.x-t,u=n.y-e,d=l*l+u*u,h=a+i;d<=h*h&&o.push(n)}return o}getObjectsIntersectingRect(t,e,i,s){this.debug&&(this.lastCheckedTiles=[]);let o=[],n=Math.floor(t/this.tileSize),a=Math.floor(e/this.tileSize),l=Math.floor((t+i)/this.tileSize),u=Math.floor((e+s)/this.tileSize);for(let d=n;d<=l;d++)for(let h=a;h<=u;h++)if(d>=0&&d<this.xTiles&&h>=0&&h<this.yTiles){this.debug&&this.lastCheckedTiles.push({x:d,y:h});let p=h*this.xTiles+d;for(let b of this.#t[p]){let S=b.left??b.x,q=b.right??b.x,Z=b.top??b.y,R=b.bottom??b.y;q>=t&&S<=t+i&&R>=e&&Z<=e+s&&o.push(b)}}return o}getObjectsIntersectingLine(t,e,i,s,o=0){this.debug&&(this.lastCheckedTiles=[]);let n=new Set,a=Math.floor(t/this.tileSize),l=Math.floor(e/this.tileSize),u=Math.floor(i/this.tileSize),d=Math.floor(s/this.tileSize),h=Math.abs(u-a),p=Math.abs(d-l),b=a<u?1:-1,S=l<d?1:-1,q=h-p;for(;a>=0&&a<this.xTiles&&l>=0&&l<this.yTiles&&(n.add({x:a,y:l}),this.debug&&this.lastCheckedTiles.push({x:a,y:l})),!(a===u&&l===d);){let $=2*q;$>-p&&(q-=p,a+=b),$<h&&(q+=h,l+=S)}let Z=new Set,R=Math.ceil(o/(2*this.tileSize));for(let $ of n)for(let C=-R;C<=R;C++)for(let j=-R;j<=R;j++){let k=$.x+C,H=$.y+j;k>=0&&k<this.xTiles&&H>=0&&H<this.yTiles&&(Z.add({x:k,y:H}),this.debug&&this.lastCheckedTiles.push({x:k,y:H}))}let bt=new Set;for(let $ of Z){let C=$.y*this.xTiles+$.x;for(let j of this.#t[C])bt.add(j)}let Ht=Array.from(bt),gt=[],wt=(i-t)**2+(s-e)**2;for(let $ of Ht){let C=$.radius||0,j=$.x,k=$.y,H=Math.max(0,Math.min(1,((j-t)*(i-t)+(k-e)*(s-e))/wt)),Lt=t+H*(i-t),Et=e+H*(s-e),pt=j-Lt,ft=k-Et,Nt=pt*pt+ft*ft,mt=C+o/2;Nt<=mt*mt&&gt.push($)}return gt}};var Bt=T`
  <div id="controls">
    <label>
      Width:
      <input id="widthInput" type="number" placeholder="Width" value="800" />
    </label>
    <label>
      Height:
      <input id="heightInput" type="number" placeholder="Height" value="600" />
    </label>
    <label>
      Tile Size:
      <input id="tileSizeInput" type="number" placeholder="Tile Size" value="50" />
    </label>
    <label>
      Number of Objects:
      <input id="objectCountInput" type="number" placeholder="Number of Objects" value="100" />
    </label>
    <button id="generateButton">Generate</button>
    <div id="getMethods">
      <label>
        <input type="radio" name="getMethod" value="getNeighbors" checked />
        Get Neighbors
      </label>
      <label>
        <input type="radio" name="getMethod" value="getObjectsIntersectingCircle" />
        Get Objects Intersecting Circle
      </label>
      <label>
        <input type="radio" name="getMethod" value="getObjectsIntersectingRect" />
        Get Objects Intersecting Rectangle
      </label>
      <label>
        <input type="radio" name="getMethod" value="getObjectsIntersectingLine" />
        Get Objects Intersecting Line
      </label>
    </div>
    <hr />
    <div id="instructions"></div>
  </div>
  <div id="status"></div>
  <canvas></canvas>
`,A=document.body;K(Bt,A);var f=A.querySelector("canvas"),c=f.getContext("2d");if(!c)throw new Error("Canvas context not supported");f.style.cursor="crosshair";var qt=A.querySelector("#widthInput"),Wt=A.querySelector("#heightInput"),Xt=A.querySelector("#tileSizeInput"),Yt=A.querySelector("#objectCountInput"),Tt=A.querySelector("#generateButton"),Ot=A.querySelectorAll('input[name="getMethod"]'),Dt=A.querySelector("#status"),Ut=A.querySelector("#instructions"),M,tt=[],O="getNeighbors",N=[],dt=1,B=50,v={x:50,y:50},m={x:150,y:150},y={x:0,y:0},z=10,et=!1;function F(){if(!A.querySelector("#controls"))return;let t;switch(O){case"getNeighbors":t=T`
        <div>
          <label>
            Neighbor Tiles:
            <input
              type="number"
              value="${dt}"
              placeholder="Neighbor Tiles"
              @input="${n=>{dt=parseInt(n.target.value,10)??1}}"
            />
          </label>
        </div>
      `;break;case"getObjectsIntersectingCircle":t=T`
        <div>
          <label>
            Circle Radius:
            <input
              type="number"
              value="${B}"
              placeholder="Circle Radius"
              @input="${n=>{B=parseInt(n.target.value,10)??50}}"
            />
          </label>
          <i>(Click and drag on the canvas to set circle radius)</i>
        </div>
      `;break;case"getObjectsIntersectingRect":let e=Math.min(v.y,m.y),i=Math.max(v.y,m.y),s=Math.min(v.x,m.x),o=Math.max(v.x,m.x);t=T`
        <div>
          <label>Top: ${e}</label>
          <label>Left: ${s}</label>
          <label>Bottom: ${i}</label>
          <label>Right: ${o}</label>
          <i>(Click and drag on the canvas to set rectangle bounds)</i>
        </div>
      `;break;case"getObjectsIntersectingLine":t=T`
        <div>
          <label>Line Start: (${y.x}, ${y.y})</label>
          <label>Line End: (${x}, ${_})</label>
          <label>
            Line Width:
            <input
              type="number"
              value="${z}"
              placeholder="Line Width"
              @input="${n=>{z=parseInt(n.target.value,10)??10}}"
            />
          </label>
          <i>(Click to set line segment origin)</i>
        </div>
      `;break;default:t=T``;break}K(t,Ut)}Ot.forEach(r=>{r.addEventListener("change",()=>{O=A.querySelector('input[name="getMethod"]:checked').value,F()})});F();Tt.addEventListener("click",()=>{let r=parseInt(qt.value,10),t=parseInt(Wt.value,10),e=parseInt(Xt.value,10),i=parseInt(Yt.value,10);f.width=r,f.height=t,M=new Q({width:r,height:t,tileSize:e,debug:!0}),tt=[];for(let s=0;s<i;s++){let o=Math.random()*r,n=Math.random()*t,a=Math.random()*10+5,l={x:o,y:n,radius:a,left:o-a,right:o+a,top:n-a,bottom:n+a};tt.push(l)}M.add(...tt),M.update(),ut()});function Vt(r,t,e){K(T`<div id="status">Mouse: ${r},${t} | Intersecting Objects: ${e}</div>`,Dt)}var x=0,_=0,Ct=0,kt=0;f.addEventListener("mousedown",r=>{let t=f.getBoundingClientRect(),e=r.clientX-t.left,i=r.clientY-t.top;switch(O){case"getObjectsIntersectingCircle":et=!0,Ct=e,kt=i,B=0;break;case"getObjectsIntersectingRect":et=!0,v={x:e,y:i},m={x:e,y:i};break;case"getObjectsIntersectingLine":y={x:e,y:i};break;default:break}});f.addEventListener("mousemove",r=>{let t=f.getBoundingClientRect(),e=r.clientX-t.left,i=r.clientY-t.top;if(et)switch(O){case"getObjectsIntersectingCircle":let s=e-Ct,o=i-kt;B=Math.round(Math.sqrt(s*s+o*o)),F();break;case"getObjectsIntersectingRect":m={x:e,y:i},F();break;default:break}x=e,_=i,O==="getObjectsIntersectingLine"&&F(),requestAnimationFrame(ut)});f.addEventListener("mouseup",()=>{et=!1});f.addEventListener("mousemove",r=>{let t=f.getBoundingClientRect();switch(x=r.clientX-t.left,_=r.clientY-t.top,O){case"getNeighbors":N=M.getNeighbors(x,_,dt);break;case"getObjectsIntersectingCircle":N=M.getObjectsIntersectingCircle(x,_,B);break;case"getObjectsIntersectingRect":let e=Math.abs(m.x-v.x),i=Math.abs(m.y-v.y),s=Math.min(v.x,m.x),o=Math.min(v.y,m.y);N=M.getObjectsIntersectingRect(s,o,e,i);break;case"getObjectsIntersectingLine":N=M.getObjectsIntersectingLine(y.x,y.y,x,_,z);break;default:N=[]}Vt(Math.floor(x),Math.floor(_),N.length),requestAnimationFrame(ut)});Ot.forEach(r=>{r.addEventListener("change",()=>{O=A.querySelector('input[name="getMethod"]:checked').value})});function ut(){if(!c)return;c.clearRect(0,0,f.width,f.height);let r=M.tileSize;c.strokeStyle="#ddd";for(let t=0;t<f.width;t+=r)c.beginPath(),c.moveTo(t,0),c.lineTo(t,f.height),c.stroke();for(let t=0;t<f.height;t+=r)c.beginPath(),c.moveTo(0,t),c.lineTo(f.width,t),c.stroke();c.fillStyle="#007bff";for(let t of tt)c.beginPath(),c.arc(t.x,t.y,t.radius||5,0,Math.PI*2),c.fill();c.fillStyle="#ff0000";for(let t of N)c.beginPath(),c.arc(t.x,t.y,t.radius||5,0,Math.PI*2),c.fill();c.strokeStyle="red",c.lineWidth=.5;for(let t of M.lastCheckedTiles)c.strokeRect(t.x*r,t.y*r,r,r);switch(c.lineWidth=2,O){case"getNeighbors":break;case"getObjectsIntersectingCircle":c.beginPath(),c.arc(x,_,B,0,Math.PI*2),c.stroke();break;case"getObjectsIntersectingRect":let t=Math.abs(m.x-v.x),e=Math.abs(m.y-v.y),i=Math.min(v.x,m.x),s=Math.min(v.y,m.y);c.strokeRect(i,s,t,e);break;case"getObjectsIntersectingLine":let o=Math.atan2(_-y.y,x-y.x),n=z/2*Math.sin(o),a=z/2*Math.cos(o);c.beginPath(),c.moveTo(y.x-n,y.y+a),c.lineTo(x-n,_+a),c.lineTo(x+n,_-a),c.lineTo(y.x+n,y.y-a),c.closePath(),c.stroke(),c.beginPath(),c.arc(y.x,y.y,z/2,0,Math.PI*2),c.stroke(),c.beginPath(),c.arc(x,_,z/2,0,Math.PI*2),c.stroke();break;default:break}}window.addEventListener("load",()=>{Tt.click()});
/*! Bundled license information:

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
