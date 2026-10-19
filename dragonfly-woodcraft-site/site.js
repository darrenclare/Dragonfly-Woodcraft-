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

/* Reviews carousel buttons */
(function(){
  var t=document.getElementById('rvTrack');if(!t)return;
  function step(d){var c=t.querySelector('.rv');var w=c?c.getBoundingClientRect().width+19:300;
    if(d>0&&t.scrollLeft+t.clientWidth>=t.scrollWidth-4)t.scrollTo({left:0});else if(d<0&&t.scrollLeft<=4)t.scrollTo({left:t.scrollWidth});else t.scrollBy({left:d*w});}
  document.getElementById('rvPrev').addEventListener('click',function(){step(-1)});
  document.getElementById('rvNext').addEventListener('click',function(){step(1)});
})();

/* Full-screen photo viewer: tap any gallery photo; swipe, arrow keys or buttons to move; Esc or X to close */
(function(){
  var groups='.gal-grid,.seq-row,.work-grid,.job-grid,.svc-detail-photo';
  var imgs=[].slice.call(document.querySelectorAll(groups.split(',').map(function(g){return g+' img'}).join(',')));
  if(!imgs.length)return;
  var box=document.createElement('div');box.className='lb';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Photo viewer');box.hidden=true;
  box.innerHTML='<button class="lb-close" aria-label="Close">&times;</button><button class="lb-prev" aria-label="Previous photo">&#8249;</button><figure class="lb-fig"><img alt=""/><figcaption></figcaption></figure><button class="lb-next" aria-label="Next photo">&#8250;</button><div class="lb-count"></div>';
  document.body.appendChild(box);
  var bImg=box.querySelector('img'),bCap=box.querySelector('figcaption'),bCount=box.querySelector('.lb-count'),set=[],i=0,lastFocus=null;
  function caption(el){var f=el.closest('figure,li');var c=f&&f.querySelector('figcaption,span');return c?c.textContent:(el.alt||'')}
  function show(n){i=(n+set.length)%set.length;var el=set[i];bImg.src=el.currentSrc||el.src;bImg.alt=el.alt;bCap.textContent=caption(el);bCount.textContent=(i+1)+' / '+set.length;
    box.querySelector('.lb-prev').hidden=box.querySelector('.lb-next').hidden=set.length<2}
  function open(el){var g=el.closest(groups);set=[].slice.call(g.parentNode.querySelectorAll(groups.split(',').map(function(s){return s+' img'}).join(','))).filter(function(x){return x.closest(groups)===g});
    if(set.length<2&&g.matches('.svc-detail-photo'))set=[el];lastFocus=document.activeElement;show(set.indexOf(el));box.hidden=false;document.body.style.overflow='hidden';box.querySelector('.lb-close').focus()}
  function close(){box.hidden=true;document.body.style.overflow='';if(lastFocus)lastFocus.focus()}
  imgs.forEach(function(el){el.style.cursor='zoom-in';el.setAttribute('tabindex','0');el.setAttribute('role','button');
    el.addEventListener('click',function(e){e.preventDefault();open(el)});
    el.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();open(el)}})});
  box.querySelector('.lb-close').addEventListener('click',close);
  box.querySelector('.lb-prev').addEventListener('click',function(){show(i-1)});
  box.querySelector('.lb-next').addEventListener('click',function(){show(i+1)});
  box.addEventListener('click',function(e){if(e.target===box||e.target.classList.contains('lb-fig'))close()});
  document.addEventListener('keydown',function(e){if(box.hidden)return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)});
  var x0=null;box.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  box.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)show(i+(dx<0?1:-1));x0=null});
})();
