/* ANIMA slides.js v1.4（草稿）
   換頁：→ ↓ 空白 PageDown 下一頁；← ↑ PageUp 上一頁；Home／End 第一頁／最後一頁
   點畫面右側 2/3 下一頁、左側 1/3 上一頁；網址 #5 跳到第 5 頁
   O 總覽（所有頁縮圖，點一頁跳過去）；F 全螢幕
   列印／PDF 時每頁一張，不用額外設定。 */
(() => {
  const deck = document.querySelector('.deck');
  if (!deck) return;

  // 每一頁包一層 .slide-frame，縮放用
  const slides = [...deck.querySelectorAll(':scope > .slide')];
  const frames = slides.map((slide, i) => {
    const frame = document.createElement('div');
    frame.className = 'slide-frame';
    frame.dataset.index = i + 1;
    slide.before(frame);
    frame.append(slide);
    slide.querySelectorAll('[data-page]').forEach(el => { el.textContent = String(i + 1).padStart(2, '0'); });
    return frame;
  });

  const progress = document.createElement('div');
  progress.className = 'deck-progress';
  deck.after(progress);

  let current = 0;
  const overview = () => deck.classList.contains('is-overview');

  function fit() {
    const w = slides[0].offsetWidth, h = slides[0].offsetHeight;
    const k = overview()
      ? Math.min(1, (Math.min(innerWidth, 1800) - 64 - 32 * 2) / 3 / w)   // 一排三張
      : Math.min(innerWidth / w, innerHeight / h);
    deck.style.setProperty('--k', k);
  }

  function go(i, { updateHash = true } = {}) {
    current = Math.max(0, Math.min(frames.length - 1, i));
    frames.forEach((f, n) => f.classList.toggle('is-active', n === current));
    progress.style.transform = `scaleX(${(current + 1) / frames.length})`;
    if (updateHash) history.replaceState(null, '', `#${current + 1}`);
  }

  function toggleOverview(force) {
    deck.classList.toggle('is-overview', force);
    document.body.style.overflow = overview() ? 'auto' : 'hidden';
    fit();
    if (overview()) frames[current].scrollIntoView({ block: 'center' });
  }

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) { if (overview()) toggleOverview(false); else go(current + 1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) go(current - 1);
    else if (k === 'Home') go(0);
    else if (k === 'End') go(frames.length - 1);
    else if (k === 'o' || k === 'O') toggleOverview();
    else if (k === 'Escape' && overview()) toggleOverview(false);
    else if (k === 'f' || k === 'F') { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }
    else return;
    e.preventDefault();
  });

  deck.addEventListener('click', e => {
    if (e.target.closest('a, button, input, video')) return;
    if (overview()) {
      const f = e.target.closest('.slide-frame');
      if (f) { go(+f.dataset.index - 1); toggleOverview(false); }
      return;
    }
    go(current + (e.clientX > innerWidth / 3 ? 1 : -1));
  });

  addEventListener('hashchange', () => go(parseInt(location.hash.slice(1), 10) - 1 || 0, { updateHash: false }));
  addEventListener('resize', fit);
  document.fonts?.ready.then(fit);

  // 連接線：.diagram 裡有 data-to 的元素，畫箭頭到指定 id。座標用未縮放的尺寸算，縮放、列印都不用重畫。
  const NS = 'http://www.w3.org/2000/svg';
  function drawLinks() {
    deck.querySelectorAll('.diagram').forEach(box => {
      box.querySelector(':scope > svg.links')?.remove();
      const sources = box.querySelectorAll('[data-to]');
      if (!sources.length) return;
      const br = box.getBoundingClientRect();
      const k = br.width / box.offsetWidth || 1;
      const rect = el => { const r = el.getBoundingClientRect();
        return { l: (r.left - br.left) / k, t: (r.top - br.top) / k, r: (r.right - br.left) / k, b: (r.bottom - br.top) / k,
                 cx: (r.left + r.width / 2 - br.left) / k, cy: (r.top + r.height / 2 - br.top) / k }; };
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'links');
      svg.setAttribute('width', box.offsetWidth); svg.setAttribute('height', box.offsetHeight);
      const unit = parseFloat(getComputedStyle(box).getPropertyValue('--u')) || 1;
      const ah = 14 * unit;                                     // 箭頭長度
      sources.forEach(src => {
        const style = src.dataset.toStyle || '';
        src.dataset.to.split(/\s+/).filter(Boolean).forEach(id => {
          const tgt = box.querySelector('#' + CSS.escape(id));
          if (!tgt) return;
          const s = rect(src), t = rect(tgt);
          let d, end, dir;
          if (t.l >= s.r - 1 || t.r <= s.l + 1) {                 // 左右：從側邊出、進側邊，中間轉折
            const right = t.l >= s.r - 1;
            const x1 = right ? s.r : s.l, x2 = right ? t.l : t.r;
            const lo = Math.max(s.t, t.t), hi = Math.min(s.b, t.b);
            const y1 = hi - lo > 20 ? (lo + hi) / 2 : s.cy, y2 = hi - lo > 20 ? y1 : t.cy;
            const xm = (x1 + x2) / 2;
            end = [x2, y2]; dir = right ? 1 : -1;
            const xe = x2 - dir * ah;
            d = y1 === y2 ? `M${x1},${y1} H${xe}` : `M${x1},${y1} H${xm} V${y2} H${xe}`;
            dir = right ? 'r' : 'l';
          } else {                                              // 上下
            const down = t.t >= s.cy;
            const y1 = down ? s.b : s.t, y2 = down ? t.t : t.b;
            const lo = Math.max(s.l, t.l), hi = Math.min(s.r, t.r);
            const x1 = hi - lo > 20 ? (lo + hi) / 2 : s.cx, x2 = hi - lo > 20 ? x1 : t.cx;
            const ym = (y1 + y2) / 2;
            end = [x2, y2]; const sign = down ? 1 : -1;
            const ye = y2 - sign * ah;
            d = x1 === x2 ? `M${x1},${y1} V${ye}` : `M${x1},${y1} V${ym} H${x2} V${ye}`;
            dir = down ? 'd' : 'u';
          }
          const path = document.createElementNS(NS, 'path');
          path.setAttribute('d', d);
          path.setAttribute('class', style.split(/\s+/).filter(Boolean).map(c => 'is-' + c).join(' '));
          svg.append(path);
          const [ex, ey] = end, w = ah * 0.55;
          const pts = { r: [[ex, ey], [ex - ah, ey - w], [ex - ah, ey + w]], l: [[ex, ey], [ex + ah, ey - w], [ex + ah, ey + w]],
                        d: [[ex, ey], [ex - w, ey - ah], [ex + w, ey - ah]], u: [[ex, ey], [ex - w, ey + ah], [ex + w, ey + ah]] }[dir];
          const head = document.createElementNS(NS, 'polygon');
          head.setAttribute('points', pts.map(p => p.join(',')).join(' '));
          head.setAttribute('class', 'head' + (style.includes('accent') ? ' is-accent' : ''));
          svg.append(head);
        });
      });
      box.prepend(svg);
    });
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(drawLinks);
  addEventListener('beforeprint', drawLinks);

  document.body.style.overflow = 'hidden';
  fit();
  go((parseInt(location.hash.slice(1), 10) || 1) - 1, { updateHash: false });
  if (new URLSearchParams(location.search).has('overview')) toggleOverview(true);
})();
