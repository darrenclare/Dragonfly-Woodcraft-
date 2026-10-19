/* Dragonfly Woodcraft: shared site script */

/* Mobile menu */
(function(){
  var b=document.getElementById('burger'),l=document.getElementById('navLinks');
  if(!b||!l)return;
  b.addEventListener('click',function(){var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o)});
  l.addEventListener('click',function(e){if(e.target.tagName==='A'){l.classList.remove('open');b.setAttribute('aria-expanded','false')}});
})();

/* FAQ open/close */
document.querySelectorAll('.faq-item').forEach(function(item){
  var q=item.querySelector('.faq-q');if(!q)return;
  q.setAttribute('aria-expanded','false');
  q.addEventListener('click',function(){var o=item.classList.toggle('open');q.setAttribute('aria-expanded',o)});
});

/* Trust bar: auto-scrolls, swipeable, resumes 2s after the user stops */
(function(){
  var bar=document.querySelector('.trust'),row=bar&&bar.querySelector('.trust-row');if(!row)return;
  row.innerHTML+=row.innerHTML+row.innerHTML;
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var SECONDS_PER_LOOP=40,RESUME_MS=2000,pos=null,last=0,resumeAt=0,hovering=false;
  function hold(){resumeAt=performance.now()+RESUME_MS}
  ['touchstart','touchmove','pointerdown','wheel'].forEach(function(e){bar.addEventListener(e,hold,{passive:true})});
  bar.addEventListener('mouseenter',function(){hovering=true});
  bar.addEventListener('mouseleave',function(){hovering=false;hold()});
  bar.addEventListener('scroll',function(){if(performance.now()<resumeAt){pos=bar.scrollLeft;hold()}},{passive:true});
  function step(now){
    var w=row.scrollWidth/3,dt=last?Math.min(now-last,100):0;last=now;
    if(w>0){
      if(pos===null){pos=w;bar.scrollLeft=pos}
      if(!hovering&&now>=resumeAt){pos+=w/(SECONDS_PER_LOOP*1000)*dt;if(pos>=2*w)pos-=w;else if(pos<w*0.5)pos+=w;bar.scrollLeft=pos}
      else{pos=bar.scrollLeft}
    }
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();
