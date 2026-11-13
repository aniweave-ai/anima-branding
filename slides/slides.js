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

  // 右下角「所有版型」按鈕：隨時回到一次看全部的總覽
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'deck-toggle';
  progress.after(toggle);
  const syncToggle = () => { toggle.textContent = deck.classList.contains('is-overview') ? '回到投影片' : '所有版型'; };

  // 深色頁開關：<main class="deck" data-dark="all | sections | off">
  //   all（預設）照每頁設定；sections 只留章節頁、logo 結尾頁是深底；off 全部白底。
  //   網址加 ?dark=sections 可以臨時預覽；右下角按鈕可以循環切換。
  const DARK = ['ground-dark', 'ground-dark-warm'];
  const darkSlides = slides.filter(s => DARK.some(c => s.classList.contains(c)));
  darkSlides.forEach(s => { s.dataset.darkClass = DARK.find(c => s.classList.contains(c)); });
  const keepDark = s => s.matches('.section, .closing.center');
  const MODES = { all: '深色頁：照設定', sections: '深色頁：只留章節頁', off: '深色頁：全部白底' };
  function applyDark(mode) {
    if (!MODES[mode]) mode = 'all';
    deck.dataset.dark = mode;
    darkSlides.forEach(s => {
      const on = mode === 'all' || (mode === 'sections' && keepDark(s));
      s.classList.toggle(s.dataset.darkClass, on);
    });
    darkToggle.textContent = MODES[mode];
  }
  const darkToggle = document.createElement('button');
  darkToggle.type = 'button';
  darkToggle.className = 'deck-toggle is-dark-mode';
  toggle.before(darkToggle);
  darkToggle.addEventListener('click', e => {
    e.stopPropagation();
    const order = Object.keys(MODES);
    applyDark(order[(order.indexOf(deck.dataset.dark) + 1) % order.length]);
  });
  applyDark(new URLSearchParams(location.search).get('dark') || deck.dataset.dark || 'all');
  if (!darkSlides.length) darkToggle.hidden = true;

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
    syncToggle();
    document.body.style.overflow = overview() ? 'auto' : 'hidden';
    fit();
    if (overview()) frames[current].scrollIntoView({ block: 'center' });
  }

  addEventListener('keydown', e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest && e.target.closest('button, a, input, textarea, select')) return;   // 讓按鈕自己處理 Enter／空白
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

  toggle.addEventListener('click', e => { e.stopPropagation(); toggleOverview(); });

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
      const sign0 = v => (v > 0 ? 1 : v < 0 ? -1 : 0);
      const dividers = [...box.querySelectorAll(':scope > .lane')].map(l => (l.getBoundingClientRect().top - br.top) / k);
      // 直角折線 → 轉角導圓角（半徑 12，線段太短就縮小）
      const roundPath = pts => {
        const r0 = 10 * unit;
        let d = `M${pts[0][0]},${pts[0][1]}`;
        for (let i = 1; i < pts.length - 1; i++) {
          const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
          const r = Math.min(r0, Math.hypot(cx - px, cy - py) / 2, Math.hypot(nx - cx, ny - cy) / 2);
          const a = [cx - Math.sign(cx - px) * r, cy - Math.sign(cy - py) * r];
          const b = [cx + Math.sign(nx - cx) * r, cy + Math.sign(ny - cy) * r];
          d += ` L${a[0]},${a[1]} Q${cx},${cy} ${b[0]},${b[1]}`;
        }
        const last = pts[pts.length - 1];
        return d + ` L${last[0]},${last[1]}`;
      };
      sources.forEach(src => {
        const style = src.dataset.toStyle || '';
        src.dataset.to.split(/\s+/).filter(Boolean).forEach(id => {
          const tgt = box.querySelector('#' + CSS.escape(id));
          if (!tgt) return;
          const s = rect(src), t = rect(tgt);
          let d, end, dir;
          const sameRow = !(t.b <= s.t + 1 || t.t >= s.b - 1);   // 上下有重疊＝同一列
          if (sameRow && (t.l >= s.r - 1 || t.r <= s.l + 1)) {     // 同一列：從側邊出、進側邊
            const right = t.l >= s.r - 1;
            const x1 = right ? s.r : s.l, x2 = right ? t.l : t.r;
            const lo = Math.max(s.t, t.t), hi = Math.min(s.b, t.b);
            const y1 = hi - lo > 20 ? (lo + hi) / 2 : s.cy, y2 = hi - lo > 20 ? y1 : t.cy;
            dir = right ? 1 : -1;
            const xm = x1 + (x2 - x1) * 0.3;                    // 轉折靠來源側，箭頭前留一段直線
            end = [x2, y2];
            const xe = x2 - dir * ah;
            d = roundPath(y1 === y2 ? [[x1, y1], [xe, y1]] : [[x1, y1], [xm, y1], [xm, y2], [xe, y2]]);
            dir = right ? 'r' : 'l';
          } else {                                              // 上下
            const down = t.t >= s.cy;
            const y1 = down ? s.b : s.t, y2 = down ? t.t : t.b;
            const lo = Math.max(s.l, t.l), hi = Math.min(s.r, t.r);
            const pad = 28 * unit;
            // 上下：有水平重疊就直線；沒有就從來源中央出、在兩列中間轉折，進目標時靠近來源那一側（不同來源不共用同一段線）
            const x1 = hi - lo > 20 ? (lo + hi) / 2 : Math.min(Math.max(t.cx, s.l + pad), s.r - pad);   // 出口也靠向目標那一側
            const x2 = hi - lo > 20 ? x1 : Math.min(Math.max(s.cx, t.l + pad), t.r - pad);
            // 轉折高度：避開泳道分隔線，並在箭頭前留至少 18 的直線
            const minEnd = ah + 18 * unit, minStart = 8 * unit;
            let ym = y1 + (y2 - y1) * 0.3, best = -1;
            const lo2 = Math.min(y1 + sign0(y2 - y1) * minStart, y2 - sign0(y2 - y1) * minEnd), hi2 = Math.max(y1 + sign0(y2 - y1) * minStart, y2 - sign0(y2 - y1) * minEnd);
            for (let y = lo2; y <= hi2; y += 1) {
              const dist = dividers.length ? Math.min(...dividers.map(v => Math.abs(v - y))) : 999;
              if (dist > best + 0.5) { best = dist; ym = y; }
            }
            end = [x2, y2]; const sign = down ? 1 : -1;
            const ye = y2 - sign * ah;
            d = roundPath(x1 === x2 ? [[x1, y1], [x1, ye]] : [[x1, y1], [x1, ym], [x2, ym], [x2, ye]]);
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
  syncToggle();
  fit();
  go((parseInt(location.hash.slice(1), 10) || 1) - 1, { updateHash: false });
  if (new URLSearchParams(location.search).has('overview')) toggleOverview(true);
})();
