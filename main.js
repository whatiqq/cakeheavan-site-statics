/* header menu, benefits strip animation, seamless looping hero video */
(function(){
  /* nav: mobile menu, dropdowns, search */
  var menu=document.getElementById('menu'), burger=document.getElementById('burger');
  burger.addEventListener('click',function(){
    var o=menu.classList.toggle('open'); burger.setAttribute('aria-expanded',o);
  });
  var dds=[].slice.call(document.querySelectorAll('.has-dd'));
  dds.forEach(function(li){
    li.querySelector('.dd-btn').addEventListener('click',function(e){
      var o=!li.classList.contains('open');
      dds.forEach(function(x){x.classList.remove('open'); x.querySelector('.dd-btn').setAttribute('aria-expanded','false');});
      if(o){li.classList.add('open'); e.currentTarget.setAttribute('aria-expanded','true');}
    });
  });
  document.addEventListener('click',function(e){
    if(!e.target.closest('.has-dd')) dds.forEach(function(x){x.classList.remove('open'); x.querySelector('.dd-btn').setAttribute('aria-expanded','false');});
  });
  document.addEventListener('keydown',function(e){ if(e.key==='Escape') dds.forEach(function(x){x.classList.remove('open');}); });
  var sb=document.getElementById('searchBtn'), sp=document.getElementById('search');
  sb.addEventListener('click',function(){
    var o=sp.classList.toggle('open'); sb.setAttribute('aria-expanded',o);
    if(o) sp.querySelector('input').focus();
  });

  /* benefits: fade up once when the strip scrolls into view */
  var ben=document.querySelector('.benefits');
  var still=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(still||!('IntersectionObserver' in window)){ ben.classList.add('in-view'); }
  else{
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ ben.classList.add('in-view'); io.disconnect(); } });
    },{threshold:.2, rootMargin:'0px 0px -6% 0px'});
    io.observe(ben);
  }

  /* seamless loop: two stacked copies crossfade just before the end, so no black frame or restart hitch */
  var a=document.getElementById('vA'), b=document.getElementById('vB');
  var FADE=0.9, cur=a, nxt=b, switching=false;
  a.removeAttribute('loop');
  [a,b].forEach(function(v){v.muted=true; v.defaultMuted=true;});
  function play(v){var p=v.play(); if(p&&p.catch)p.catch(function(){});}
  play(a);
  function swap(){
    switching=true; nxt.currentTime=0; play(nxt); nxt.classList.add('on');
    var old=cur;
    setTimeout(function(){ old.classList.remove('on'); old.pause(); old.currentTime=0; cur=nxt; nxt=old; switching=false; }, FADE*1000+100);
  }
  function tick(){
    var d=cur.duration;
    if(!switching && d && isFinite(d) && cur.currentTime>=d-FADE-0.05) swap();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  document.addEventListener('visibilitychange',function(){ if(!document.hidden) play(cur); });
  document.addEventListener('touchstart',function(){ if(cur.paused) play(cur); },{once:true,passive:true});
})();
