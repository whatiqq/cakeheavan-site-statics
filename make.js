/* scroll-driven cake-making animation (section 2) */
(function(){
  var track=document.getElementById('makeTrack'); if(!track) return;
  var NS='http://www.w3.org/2000/svg';
  var $=function(id){return document.getElementById(id)};
  var clamp=function(x,a,b){return Math.min(b,Math.max(a,x))};
  var seg=function(p,a,b){return clamp((p-a)/(b-a),0,1)};
  var lerp=function(a,b,t){return a+(b-a)*t};
  var eio=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
  var eo=function(t){return 1-Math.pow(1-t,3)};
  var ei=function(t){return t*t*t};
  function el(tag,attrs,parent){var e=document.createElementNS(NS,tag); for(var k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.appendChild(e); return e;}
  function op(e,v){e.setAttribute('opacity',v.toFixed(3));}
  function tf(e,dx,dy,s,cx,cy){ e.setAttribute('transform','translate('+(cx+dx).toFixed(2)+' '+(cy+dy).toFixed(2)+') scale('+s.toFixed(4)+') translate('+(-cx)+' '+(-cy)+')'); }

  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- build dynamic bits once ---------- */
  var s1=$('s1'), s2=$('s2'), s3=$('s3'), plate=$('plate');
  var batter=$('batter'), swirl=$('swirl'), whisk=$('whisk'), dip=$('dip');
  var ingsG=$('ings');

  var ING=[ {id:'egg',x:232,a:.012,b:.072,rot:-18}, {id:'egg',x:368,a:.055,b:.115,rot:22},
            {id:'butter',x:300,a:.095,b:.155,rot:-8}, {id:'vanilla',x:402,a:.135,b:.195,rot:14} ];
  ING.forEach(function(g){
    g.rip=el('ellipse',{cx:g.x,cy:308,rx:10,ry:3,fill:'none',stroke:'#fff','stroke-width':3,opacity:0},ingsG);
    g.node=el('g',{opacity:0},ingsG);
    el('use',{href:'#'+g.id},g.node);
  });

  var dustG=$('dust'), dust=[];
  for(var i=0;i<18;i++){
    var d={x:90+Math.random()*420, y:200+Math.random()*300, r:1.8+Math.random()*2.6, s:.6+Math.random()*1.2, w:Math.random()*6};
    d.n=el('circle',{r:d.r,opacity:0},dustG); dust.push(d);
  }

  function scallops(g,cy,rx,ry,n){
    for(var i=0;i<n;i++){ var t=Math.PI*(.06+.88*i/(n-1));
      el('circle',{cx:300+rx*Math.cos(t), cy:cy+ry*Math.sin(t), r:8.5, fill:'url(#gCream)', stroke:'#F3DACB','stroke-width':.8},g);
    }
  }
  scallops($('C1d'),370,114,31,11);
  scallops($('C2d'),328,114,31,11);

  var BPOS=[[-64,-6],[-30,10],[0,-14],[24,12],[62,-4]];
  function berries(g,cyTop){
    var arr=[];
    BPOS.slice().sort(function(a,b){return a[1]-b[1]}).forEach(function(p){
      var n=el('g',{opacity:0},g); el('use',{href:'#sb',transform:'translate('+(300+p[0])+' '+(cyTop+p[1]-6)+') scale(.82)'},n); arr.push(n);
    });
    return arr;
  }
  var B1=berries($('B1'),354), B2=berries($('B2'),312);

  var edgeG=$('edgeB');
  [362,304].forEach(function(cy){
    [.2,.34,.5,.66,.8].forEach(function(f){
      var t=Math.PI*f; el('use',{href:'#sb',transform:'translate('+(300+112*Math.cos(t))+' '+(cy+30*Math.sin(t)+1)+') scale(.58)'},edgeG);
    });
  });

  var topD=$('topD');
  for(var k=0;k<12;k++){
    var t=Math.PI*2*k/12;
    el('circle',{cx:300+98*Math.cos(t), cy:254+26*Math.sin(t), r:9.5, fill:'url(#gCream)', stroke:'#F3DACB','stroke-width':.8},topD);
  }
  [[-34,-2],[34,-2],[0,10]].forEach(function(p){
    el('use',{href:'#sb',transform:'translate('+(300+p[0])+' '+(254+p[1]-8)+') scale(.9)'},topD);
  });

  var spark=$('sparkles'), SP=[
    [92,150,1.4,'#E0527A'],[520,130,1.1,'#F7B34A'],[70,300,.9,'#fff'],[540,300,1.3,'#E0527A'],[120,470,1.1,'#F7B34A'],
    [500,480,1,'#fff'],[300,50,1.2,'#E0527A'],[190,60,.8,'#fff'],[420,70,.9,'#F7B34A'],[40,420,.8,'#E0527A'],[565,420,.8,'#fff'],[330,555,.9,'#E0527A']];
  SP.forEach(function(s,i){
    var u=el('use',{href:'#star',transform:'translate('+s[0]+' '+s[1]+') scale('+(s[2]*1.5)+')',fill:s[3],'class':'sparkle'},spark);
    u.style.animationDelay=(i*.27)+'s';
  });

  /* ---------- render ---------- */
  var stepsLi=[].slice.call(document.querySelectorAll('#steps li'));
  var photo=$('cakePhoto'), glow=$('glow'), sparklesG=$('sparkles');
  var spBodyP=$('spBodyP'), spBodyG=$('spBodyG'), spTopP=$('spTopP'), spTopG=$('spTopG'), spGold=$('spGold');
  var ringBack=$('ringBack'), ringFront=$('ringFront'), heat=$('heat');
  var L1=$('L1'),L2=$('L2'),L3=$('L3'),C1=$('C1'),C2=$('C2'),cut=$('cutLines'),edgeB=$('edgeB'),topDecor=$('topDecor');
  var swirls=$('swirls'), sw1=$('sw1'), sw2=$('sw2');
  var lastStep=-1;

  function render(p){
    /* scene visibility */
    var out1=seg(p,.23,.285);
    op(s1,1-out1); tf(s1,0,26*out1,1-.08*out1,300,330);
    s1.style.display=out1>=1?'none':'';
    var o2=seg(p,.245,.29)*(1-seg(p,.495,.505));
    op(s2,o2); s2.style.display=o2<=0?'none':'';
    var o3=seg(p,.495,.505)*(1-seg(p,.8,.885));
    op(s3,o3); s3.style.display=o3<=0?'none':'';
    tf(s3,0,-8*seg(p,.8,.885),1+.06*seg(p,.8,.885),300,330);
    var po=seg(p,.245,.29)*(1-seg(p,.8,.885)); op(plate,po);
    tf(s2,0,(1-seg(p,.245,.295))*-40,1,300,330);

    /* 1. whisk */
    var w=seg(p,0,.23), th=w*Math.PI*2*3.5;
    var wx=300+36*Math.cos(th), wy=306+9*Math.sin(th);
    whisk.setAttribute('transform','translate('+wx.toFixed(1)+' '+wy.toFixed(1)+') rotate('+(15*Math.cos(th+1.2)).toFixed(1)+')');
    op(whisk,seg(p,0,.025)); op(dip,seg(p,0,.025)*.92);
    dip.setAttribute('cx',wx.toFixed(1)); dip.setAttribute('cy',(wy+4).toFixed(1));
    var fill=eo(seg(p,.01,.2));
    batter.setAttribute('cy',(302+lerp(30,0,fill)).toFixed(1));
    swirl.setAttribute('transform','translate(300 312) scale(1 .27) rotate('+(w*720).toFixed(1)+')');
    op(swirl,seg(p,.03,.1));
    ING.forEach(function(g){
      var u=seg(p,g.a,g.b), land=seg(u,.86,1);
      var y=lerp(-110,296,ei(u)*.55+u*.45);
      op(g.node,clamp(u/.12,0,1)*(1-land)*(u>0&&u<1?1:0));
      g.node.setAttribute('transform','translate('+g.x+' '+y.toFixed(1)+') rotate('+(g.rot*u).toFixed(1)+') scale('+(1-.55*land).toFixed(3)+')');
      g.rip.setAttribute('rx',(10+62*seg(u,.85,1)).toFixed(1)); g.rip.setAttribute('ry',((10+62*seg(u,.85,1))*.26).toFixed(1));
      g.rip.setAttribute('opacity',(seg(u,.86,.92)*(1-seg(u,.94,1))*.9).toFixed(3));
    });

    /* dust */
    var dOp=seg(p,0,.04)*(1-seg(p,.42,.55));
    dust.forEach(function(d){
      d.n.setAttribute('cx',(d.x+Math.sin(p*14+d.w)*12).toFixed(1));
      d.n.setAttribute('cy',(d.y-p*320*d.s).toFixed(1));
      d.n.setAttribute('opacity',(dOp*.75).toFixed(3));
    });

    /* 2. bake */
    var b=eio(seg(p,.29,.435)), T=lerp(404,286,b);
    var body='M184 '+T.toFixed(1)+'L184 412A116 32 0 0 0 416 412L416 '+T.toFixed(1)+'Z';
    spBodyP.setAttribute('d',body); spBodyG.setAttribute('d',body);
    spTopP.setAttribute('cy',T.toFixed(1)); spTopG.setAttribute('cy',T.toFixed(1));
    op(spGold,seg(p,.34,.44));
    var lift=eio(seg(p,.445,.5));
    var ringTf='translate(0 '+(-170*lift).toFixed(1)+')';
    ringBack.setAttribute('transform',ringTf); ringFront.setAttribute('transform',ringTf);
    op(ringBack,1-seg(p,.455,.5)); op(ringFront,1-seg(p,.455,.5));
    op(heat,seg(p,.31,.35)*(1-seg(p,.44,.47))*.55);
    heat.setAttribute('transform','translate(0 '+(-6*Math.sin(p*70)).toFixed(1)+')');

    /* 3. layer */
    var q=seg(p,.5,.75);
    var cutE=seg(q,0,.18);
    cut.setAttribute('stroke-dashoffset',(260*(1-cutE)).toFixed(1));
    op(cut,cutE*(1-seg(q,.2,.3)));
    var e1=eio(seg(q,.2,.45)), e2=eio(seg(q,.66,.86));
    var off2=-70*e1+54*e2, off3=-140*e1+108*e2;
    L2.setAttribute('transform','translate(0 '+off2.toFixed(2)+')');
    L3.setAttribute('transform','translate(0 '+off3.toFixed(2)+')');
    var cr=seg(q,.36,.5);
    C1.setAttribute('opacity',cr.toFixed(3)); tf(C1,0,0,1,300,370);
    C2.setAttribute('opacity',seg(q,.42,.54).toFixed(3));
    var bFade=1-seg(q,.72,.8);
    [B1,B2].forEach(function(arr,gi){
      arr.forEach(function(n,i){
        var u=eo(seg(q,.5+gi*.04+i*.025,.6+gi*.04+i*.025));
        n.setAttribute('opacity',(u*bFade).toFixed(3));
        n.setAttribute('transform','translate(0 '+(lerp(-60,0,u)).toFixed(1)+')');
      });
    });
    op(edgeB,seg(q,.76,.88));
    var td=eo(seg(q,.86,.98));
    op(topDecor,td); tf(topDecor,0,(1-td)*-14,lerp(.8,1,td),300,254);
    var swO=seg(p,.52,.58)*(1-seg(p,.7,.76));
    op(swirls,swO);
    sw1.setAttribute('stroke-dashoffset',(190*(1-seg(p,.52,.64))).toFixed(1));
    sw2.setAttribute('stroke-dashoffset',(190*(1-seg(p,.55,.67))).toFixed(1));

    /* 4. bloom */
    var pb=seg(p,.8,.93), pe=eo(pb);
    photo.style.opacity=pb.toFixed(3);
    photo.style.transform='translate(-50%,-50%) scale('+lerp(.86,1,pe).toFixed(4)+')';
    op(glow,Math.sin(Math.PI*seg(p,.78,1))*.5+seg(p,.9,1)*.35);
    glow.setAttribute('r',lerp(200,285,pe).toFixed(0));
    op(sparklesG,seg(p,.84,.95));

    var idx=p<.25?0:p<.5?1:p<.75?2:3;
    if(idx!==lastStep){ lastStep=idx; stepsLi.forEach(function(li,i){ li.className=i===idx?'on':(i<idx?'done':''); if(i===idx) li.setAttribute('aria-current','step'); else li.removeAttribute('aria-current'); }); }
  }

  /* ---------- scroll driving with soft easing ---------- */
  var target=0, cur=-1, raf=0;
  function readTarget(){
    var r=track.getBoundingClientRect(), total=r.height-window.innerHeight;
    target=clamp((-r.top)/Math.max(total,1)/.9,0,1);
  }
  function frame(){
    raf=0;
    var diff=target-cur;
    if(reduce||Math.abs(diff)<.0006){ cur=target; } else { cur+=diff*.14; }
    render(cur);
    if(cur!==target) raf=requestAnimationFrame(frame);
  }
  function onScroll(){ readTarget(); if(!raf) raf=requestAnimationFrame(frame); }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll);
  readTarget(); cur=target; render(cur);

  /* copy fades in once the section arrives */
  var copy=$('makeCopy');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ copy.classList.add('in'); io.disconnect(); } }); },{threshold:.25});
    io.observe(copy);
  } else copy.classList.add('in');
})();
