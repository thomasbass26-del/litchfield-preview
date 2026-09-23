/* The gallery: photographs loaded a few at a time. Shared by every page with a theatre. */
(function(){
  var stage=document.getElementById('stage'); if(!stage) return;
  var frames=[].slice.call(stage.querySelectorAll('.frame')), n=frames.length;
  var thumbs=[].slice.call(document.querySelectorAll('#strip button')), chaps=[].slice.call(document.querySelectorAll('.chapters button'));
  var count=document.querySelector('[data-n]'), chEl=document.querySelector('[data-ch]');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var i=0, timer=null, paused=false, DWELL=6000;
  function load(k){ var im=frames[k]&&frames[k].querySelector('img'); if(im&&im.dataset.src){ im.src=im.dataset.src; delete im.dataset.src; } }
  function show(k,manual){
    k=(k+n)%n; if(k===i&&frames[k].classList.contains('is-on')) return;
    for(var d=-1; d<=2; d++) load(k+d<0?k+d+n:(k+d)%n);
    frames[i].classList.remove('is-on'); frames[i].setAttribute('aria-hidden','true');
    frames[k].classList.add('is-on'); frames[k].removeAttribute('aria-hidden'); i=k;
    thumbs.forEach(function(t,j){ t.classList.toggle('is-on',j===k); });
    var ch=frames[k].getAttribute('data-ch'); chaps.forEach(function(b){ b.classList.toggle('is-on',b.textContent.indexOf(ch)===0); });
    if(count) count.textContent=k+1; if(chEl) chEl.textContent=ch;
    var t=thumbs[k], strip=document.getElementById('strip');
    if(t&&strip){ var left=t.offsetLeft-(strip.clientWidth-t.offsetWidth)/2; if(strip.scrollTo) strip.scrollTo({left:Math.max(0,left),behavior:reduce?'auto':'smooth'}); else strip.scrollLeft=Math.max(0,left); }
    if(manual) restart();
  }
  function tick(){ if(paused||document.hidden) return; show(i+1,false); }
  function restart(){ if(timer) clearInterval(timer); timer=null; if(reduce) return; timer=setInterval(tick,DWELL); }
  frames.forEach(function(f,k){ if(k!==0) f.setAttribute('aria-hidden','true'); });
  [].forEach.call(stage.querySelectorAll('[data-step]'),function(b){ b.addEventListener('click',function(e){ e.stopPropagation(); show(i+parseInt(b.getAttribute('data-step'),10),true); }); });
  thumbs.concat(chaps).forEach(function(b){ b.addEventListener('click',function(){ show(parseInt(b.getAttribute('data-go'),10),true); }); });
  stage.addEventListener('mouseenter',function(){paused=true;}); stage.addEventListener('mouseleave',function(){paused=false;});
  stage.addEventListener('keydown',function(e){ if(e.key==='ArrowLeft'){show(i-1,true);e.preventDefault();} if(e.key==='ArrowRight'){show(i+1,true);e.preventDefault();} });
  var full=document.getElementById('thFull');
  if(full){ if(!stage.requestFullscreen&&!stage.webkitRequestFullscreen) full.style.display='none';
    full.addEventListener('click',function(){ if(document.fullscreenElement){ document.exitFullscreen(); } else if(stage.requestFullscreen){ stage.requestFullscreen(); } else if(stage.webkitRequestFullscreen){ stage.webkitRequestFullscreen(); } });
    document.addEventListener('fullscreenchange',function(){ full.textContent=document.fullscreenElement?'Exit full screen':'Full screen'; }); }
  thumbs[0].classList.add('is-on'); chaps[0].classList.add('is-on');
  window.addEventListener('load',function(){ load(1); load(2); load(3); restart(); });
})();
