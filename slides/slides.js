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

  // 頁底品牌列：每一頁自動加（左 slogan、右 ANIWEAVE logo）。<section> 或 <main class="deck"> 加 data-brand="off" 就不放。
  if (deck.dataset.brand !== 'off') {
    const css = document.querySelector('link[href*="slides.css"]');
    const logo = (css ? css.href.replace(/slides\/slides\.css.*$/, '') : '../') + 'anima-brand/assets/logo/ANIWEAVE_textlogo_primary.svg';
    slides.forEach(slide => {
      if (slide.dataset.brand === 'off' || slide.querySelector(':scope > .slide-brand')) return;
      const bar = document.createElement('div');
      bar.className = 'slide-brand';
      bar.innerHTML = `<span>Bringing intelligence into every workspace</span><img src="${logo}" alt="ANIWEAVE">`;
      slide.append(bar);
    });
  }

  // 字的上下緣：CSS 預設裁到中文字墨跡（text）。純英文、數字的元素改裁到大寫頂和基線（cap alphabetic），
  // 數字類（大數字、價格、章節號）一律用 cap，即使後面接 <small> 中文單位。
  const NUM = '.kpi-value, .stat-value, .option-price, .ratio-value, .fact-value, .ask-value, .section-num, .section-band-num, .col-bar';
  const CJK = /[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]/;
  slides.forEach(slide => slide.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.textBoxTrim === 'none' && !el.matches(NUM)) return;
    if (el.matches(NUM) || !CJK.test(el.textContent)) el.style.textBoxEdge = 'cap alphabetic';
  }));

  const progress = document.createElement('div');
  progress.className = 'deck-progress';
  deck.after(progress);

  // 右下角「所有版型」按鈕：隨時回到一次看全部的總覽
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'deck-toggle';
  progress.after(toggle);
  const syncToggle = () => { toggle.textContent = deck.classList.contains('is-overview') ? '回到投影片' : '所有版型'; };

  // 深色頁開關：<main class="deck" data-dark="all | sections | off | ambient">
  //   all 照每頁設定；sections 只留章節頁、logo 結尾頁是深底；
  //   off（預設）真的全白：深底、淡漸層、Sky、Sand、灰底都換白底（流動玻璃圖片頁不動）；
  //   ambient 全部淡漸層：白底、深底、淺色底都換 .ground-ambient（流動玻璃圖片頁不動）。
  //   網址加 ?dark=sections 可以臨時預覽；右下角按鈕可以循環切換。
  const DARK = ['ground-dark', 'ground-dark-warm'];
  const LIGHT = ['ground-ambient', 'ground-sky', 'ground-brand', 'ground-neutral'];
  const darkSlides = slides.filter(s => DARK.some(c => s.classList.contains(c)));
  darkSlides.forEach(s => { s.dataset.darkClass = DARK.find(c => s.classList.contains(c)); });
  const lightSlides = slides.filter(s => LIGHT.some(c => s.classList.contains(c)));
  lightSlides.forEach(s => { s.dataset.lightClass = LIGHT.find(c => s.classList.contains(c)); });
  const plainSlides = slides.filter(s => ![...s.classList].some(c => c.startsWith('ground-')));
  const keepDark = s => s.matches('.section, .closing.center');
  const MODES = { all: '深色頁：照設定', sections: '深色頁：只留章節頁', off: '底色：全部白底', ambient: '底色：全部淡漸層' };
  function applyDark(mode) {
    if (!MODES[mode]) mode = 'all';
    deck.dataset.dark = mode;
    const amb = mode === 'ambient';
    darkSlides.forEach(s => {
      s.classList.toggle(s.dataset.darkClass, mode === 'all' || (mode === 'sections' && keepDark(s)));
      s.classList.toggle('ground-ambient', amb);
    });
    lightSlides.forEach(s => {
      s.classList.remove(...LIGHT);
      if (amb) s.classList.add('ground-ambient');
      else if (mode !== 'off') s.classList.add(s.dataset.lightClass);
    });
    plainSlides.forEach(s => s.classList.toggle('ground-ambient', amb));
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
  applyDark(new URLSearchParams(location.search).get('dark') || deck.dataset.dark || 'off');

  // 頁內進場順序（照官網 MOTION.md 7.1）：標題 0 → 標題區其他 90 → 主內容 180（裡面的卡片、清單每個再錯開 110）→ 備註 320
  const MEDIA = '.art, figure, .glass, .stage, .panel-flow, img, video';
  const enter = (el, ms) => { el.dataset.enter = ''; el.style.setProperty('--enter-delay', ms + 'ms'); if (el.matches(MEDIA)) el.style.setProperty('--enter-y', '24px'); };
  slides.forEach(slide => {
    const head = slide.querySelector(':scope > .slide-head, :scope .slide-head');
    const body = slide.querySelector(':scope > .slide-body') || slide.querySelector('.slide-body');
    let last = 0;
    if (head) [...head.children].forEach((c, i) => enter(c, c.matches('.title') ? 0 : 90));
    if (body && body.parentElement === slide) {
      let items = [...body.children].filter(c => !c.matches('svg.links'));
      if (items.length === 1 && items[0].children.length > 1 && !items[0].matches(MEDIA)) items = [...items[0].children].filter(c => !c.matches('svg.links'));
      const container = items.length > 1 && !body.matches('.diagram, .chain, .hub, .lanes, .arch') && !(items[0].parentElement.matches('.diagram, .chain, .hub, .lanes, .arch'));
      // 卡片組、清單組再往下拆一層，每張卡、每一項各自錯開
      const GROUP = '.grid, .stats, .options, .flow, .steps, .list, .split-3, .numcols, .logos, .rows-sources, .facts, .people, .kpis, .features, .milestones, .track';
      if (container) items = items.flatMap(c => c.matches(GROUP) && c.children.length > 1 ? [...c.children] : [c]);
      if (container) items.forEach((c, i) => { last = 180 + 110 * Math.min(i, 5); enter(c, last); });
      else { last = 180; enter(body, last); }
    }
    // 頁首列、頁底品牌列每頁都一樣，不做進場
    const STATIC = '.slide-foot, .slide-brand, .slide-frame-skip';
    [...slide.children].forEach(c => {
      if (c === head || c === body || c.matches(STATIC)) return;
      if (c.matches('.slide-note')) enter(c, Math.max(320, last + 110));
      else if (!head && !body) enter(c, 0);
      else if (head && c.contains(head)) {   // 標題包在別的版型裡（例：4A 的 .showcase）：標題以外的東西依序進場
        let i = 0;
        const walk = el => [...el.children].forEach(d => {
          if (d === head) return;
          if (d.contains(head)) walk(d); else enter(d, 180 + 110 * Math.min(i++, 5));
        });
        walk(c);
      }
      else if (!c.contains(body) && !c.dataset.enter) enter(c, 180);
    });
    if (!head && !body) [...slide.children].filter(c => !c.matches(STATIC)).forEach((c, i) => enter(c, Math.min(i, 4) * 90));
  });

  let current = 0;
  const overview = () => deck.classList.contains('is-overview');

  function fit() {
    const w = slides[0].offsetWidth, h = slides[0].offsetHeight;
    const k = overview()
      ? Math.min(1, (Math.min(innerWidth, 1800) - 64 - 32 * 2) / 3 / w)   // 一排三張
      : Math.min(innerWidth / w, innerHeight / h);
    deck.style.setProperty('--k', k);
  }

  // 換頁特效（README「換頁與進場」）：背景溶接，內容舊頁淡出＋模糊、新頁從模糊淡入；連按（上一次換頁 600ms 內）直接切，不播
  let lastGo = 0, leaveTimer = 0;
  function go(i, { updateHash = true } = {}) {
    const prev = current;
    current = Math.max(0, Math.min(frames.length - 1, i));
    const now = performance.now();
    const moved = prev !== current && lastGo !== 0;
    deck.classList.toggle('is-rushing', moved && now - lastGo < 600);
    if (moved) lastGo = now; else if (!lastGo) lastGo = now;
    frames.forEach(f => f.classList.remove('is-leaving', 'is-entering'));
    clearTimeout(leaveTimer);
    deck.classList.remove('keep-logo', 'keep-section');
    if (moved && !deck.classList.contains('is-rushing')) {
      // 頁首列兩頁一樣的部分（右上 logo、左上頁名）不做轉場，固定不動
      const logoOf = f => f.querySelector('.slide-foot img');
      const a = logoOf(frames[prev]), b = logoOf(frames[current]);
      if (a && b) {
        const sig = img => { const cs = getComputedStyle(img); return [img.currentSrc || img.src, cs.content, img.offsetLeft, img.offsetTop, img.offsetWidth, img.offsetHeight, cs.opacity].join('|'); };
        if (sig(a) === sig(b)) deck.classList.add('keep-logo');
      }
      // 左上頁名也一樣：同一段字、同字型顏色、同位置就固定不動
      const secOf = f => f.querySelector('.slide-foot .slide-section');
      const c = secOf(frames[prev]), d = secOf(frames[current]);
      if (c && d) {
        const sig = el => { const cs = getComputedStyle(el); return [el.textContent.trim(), cs.font, cs.color, cs.opacity, el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight].join('|'); };
        if (sig(c) === sig(d)) deck.classList.add('keep-section');
      }
      frames[prev].classList.add('is-leaving');
      frames[current].classList.add('is-entering');
      leaveTimer = setTimeout(() => frames[prev].classList.remove('is-leaving'), 650);   // 背景溶接 600ms 跑完才收掉舊頁
    }
    deck.style.setProperty('--enter-base', moved ? '200ms' : '0ms');
    frames.forEach((f, n) => f.classList.toggle('is-active', n === current));
    progress.style.transform = `scaleX(${(current + 1) / frames.length})`;
    if (updateHash) history.replaceState(null, '', `#${current + 1}`);
  }

  function toggleOverview(force) {
    deck.classList.toggle('is-overview', force);
    syncToggle();
    document.body.style.overflow = overview() ? 'auto' : 'hidden';
    fit();
    if (overview()) { frames[current].scrollIntoView({ block: 'center' }); requestAnimationFrame(() => typeof markSparse === 'function' && markSparse()); }
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

  // 內容上限檢查（README「一頁的內容上限」）：超過的頁在總覽縮圖左上角標紅，有 data-dense 的標黃；console 也列出來。只在總覽出現，不進 PDF。
  const LIMIT = { chars: 250, rows: 8, cols: 5, nodes: 10, blocks: 4, items: 8, callouts: 2, ledeChars: 60, ledeLines: 2 };
  const SKIP = '.slide-head .title, .lede, .slide-foot, .slide-brand, .slide-note, svg, .legend, .columns-axis, .timeline-week, .cover-meta';
  const overList = [];
  slides.forEach((slide, i) => {
    if ('appendix' in slide.dataset) return;   // 附錄頁（data-appendix）不套上限
    const copy = slide.cloneNode(true);
    copy.querySelectorAll(SKIP).forEach(el => el.remove());
    const text = (copy.textContent || '').replace(/\s+/g, '');
    const cjk = (text.match(/[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]/g) || []).length;
    const chars = Math.round(cjk + (text.length - cjk) / 2);
    const max = (sel, fn) => Math.max(0, ...[...slide.querySelectorAll(sel)].map(fn));
    const over = [];
    if (chars > LIMIT.chars) over.push(`內文 ${chars} 字＞${LIMIT.chars}`);
    const rows = max('table', t => t.querySelectorAll('tbody > tr').length);
    if (rows > LIMIT.rows) over.push(`表格 ${rows} 列＞${LIMIT.rows}`);
    const cols = max('table', t => ((t.querySelector('thead tr') || t.querySelector('tr'))?.children.length || 1) - 1);   // 不算第一欄的項目名
    if (cols > LIMIT.cols) over.push(`表格 ${cols} 欄＞${LIMIT.cols}`);
    const nodes = slide.querySelectorAll('.node').length;
    if (nodes > LIMIT.nodes) over.push(`節點 ${nodes} 個＞${LIMIT.nodes}`);
    const blocks = Math.max(max('.grid', g => g.querySelectorAll(':scope > .card').length),
      max('.options:not(.compact)', g => g.querySelectorAll(':scope > .option').length),
      max('.stats', g => g.querySelectorAll(':scope > .stat').length));
    if (blocks > LIMIT.blocks) over.push(`並列 ${blocks} 塊＞${LIMIT.blocks}`);
    const items = max('ul, ol', l => l.children.length);
    if (items > LIMIT.items) over.push(`清單 ${items} 項＞${LIMIT.items}`);
    const callouts = slide.querySelectorAll('.callout').length;
    if (callouts > LIMIT.callouts) over.push(`說明條 ${callouts} 個＞${LIMIT.callouts}`);
    if (!over.length) return;
    const frame = frames[i];
    frame.dataset.over = over.join('、');
    if (slide.dataset.dense) frame.dataset.denseOk = slide.dataset.dense;
    overList.push(`第 ${i + 1} 頁：${over.join('、')}${slide.dataset.dense ? `（data-dense：${slide.dataset.dense}）` : ''}`);
  });
  if (overList.length) console.warn('超過內容上限的頁（README「一頁的內容上限」）：\n' + overList.join('\n'));

  // 拆頁後太空（README「拆頁後太空」）：量標題底到內容頂的空白，超過內容區（144–936，高 792）四成就在總覽標藍色。
  var markSparse = () => {
    const sparse = [];
    slides.forEach((slide, i) => {
      const head = slide.querySelector(':scope > .slide-head'), body = slide.querySelector(':scope > .slide-body');
      const frame = frames[i];
      delete frame.dataset.sparse;
      if (!head || !body || slide.dataset.sparseOk || 'appendix' in slide.dataset) return;
      const k = slide.getBoundingClientRect().width / 1920;
      if (!k) return;
      const tops = [...body.children].map(el => el.getBoundingClientRect()).filter(r => r.height > 0).map(r => r.top);
      if (!tops.length) return;
      const gap = (Math.min(...tops) - head.getBoundingClientRect().bottom) / k;
      if (gap > 792 * 0.4) {
        frame.dataset.sparse = `標題下空 ${Math.round(gap)}px，換版型或合併`;
        sparse.push(`第 ${i + 1} 頁：標題下空 ${Math.round(gap)}px`);
      }
    });
    if (sparse.length) console.info('拆頁後太空的頁（README「拆頁後太空」）：\n' + sparse.join('\n'));
  };
  // 副標（.lede）不算進 250 字，另外管：60 字；標題列（.slide-head）的副標另外管最多 2 行，窄欄版型只看字數。行數要等字型載入、排版完才量得準，所以跟太空一起量。
  const countChars = el => { const t = (el.textContent || '').replace(/\s+/g, ''); const c = (t.match(/[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]/g) || []).length; return Math.round(c + (t.length - c) / 2); };
  const markLede = () => {
    const list = [];
    slides.forEach((slide, i) => {
      if ('appendix' in slide.dataset) return;
      const over = [];
      slide.querySelectorAll('.lede').forEach(el => {
        const n = countChars(el);
        const r = document.createRange(); r.selectNodeContents(el);
        const rects = [...r.getClientRects()].filter(b => b.width > 1 && b.height > 0);
        const tol = Math.min(...rects.map(b => b.height), Infinity) / 2;
        const lines = rects.map(b => b.bottom).sort((a, b) => a - b).filter((y, j, a) => j === 0 || y - a[j - 1] > tol).length;
        if (n > LIMIT.ledeChars) over.push(`副標 ${n} 字＞${LIMIT.ledeChars}`);
        if (lines > LIMIT.ledeLines && el.closest('.slide-head:not(.split)')) over.push(`副標 ${lines} 行＞${LIMIT.ledeLines}`);
      });
      if (!over.length) return;
      const frame = frames[i];
      frame.dataset.over = [frame.dataset.over, ...over].filter(Boolean).join('、');
      if (slide.dataset.dense) frame.dataset.denseOk = slide.dataset.dense;
      list.push(`第 ${i + 1} 頁：${over.join('、')}`);
    });
    if (list.length) console.warn('副標超過 2 行或 60 字的頁（README「一頁的內容上限」）：\n' + list.join('\n'));
  };
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => setTimeout(() => { markLede(); overview() && markSparse(); }, 300));

  document.body.style.overflow = 'hidden';
  syncToggle();
  fit();
  go((parseInt(location.hash.slice(1), 10) || 1) - 1, { updateHash: false });
  if (new URLSearchParams(location.search).has('overview')) toggleOverview(true);
})();

// ---- 官網動畫（照 anima-web 首頁 Story 區的程式動畫移植，不另外畫） ----------------------------
// <div class="art flow-05 story" data-story="context"></div>：底圖照原本的畫面塊，只加模糊；上面放動畫。
// 設計尺寸 400×560（官網 STORY_SIZE.wide），等比縮放塞進格子。只有該頁在投影時才播；總覽、印 PDF、減少動態效果時停在最後一格。
// 時間軸、彈簧、版面數值都跟官網 index.html 的 StoryContextScene 一樣，改官網時要同步這裡。
(() => {
  const stories = [...document.querySelectorAll('.story[data-story]')];
  if (!stories.length) return;
  const css = document.querySelector('link[href*="slides.css"]');
  const ASSETS = css ? css.href.replace(/slides\/slides\.css.*$/, 'anima-brand/assets/') : '../anima-brand/assets/';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 官網 story-demos 的動態工具
  const spr = (t, at, dur = 700, zeta = 0.86) => {
    if (t <= at) return 0;
    const x = (t - at) / dur;
    if (x >= 1.4) return 1;
    const w = 4.6 / zeta, wd = w * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w * x) * (Math.cos(wd * x) + (zeta * w / wd) * Math.sin(wd * x));
  };
  const lerp = (a, b, k) => a + (b - a) * k;
  const blend = (a, b, k) => (k <= 0 ? a : k >= 1 ? b : `color-mix(in oklch, ${b} ${Math.round(k * 100)}%, ${a})`);
  const swapK = (t, at, dur = 320) => Math.min(1, Math.max(0, (t - at) / dur));
  const rise = (el, t, at, dur = 640, dy = 12) => { const p = spr(t, at, dur); el.style.opacity = Math.min(1, p * 1.3); el.style.transform = `translateY(${(1 - p) * dy}px)`; };
  const blurX = (el, k, inward) => {
    el.style.opacity = inward ? k : 1 - k;
    el.style.filter = k > 0 && k < 1 ? `blur(${(inward ? 1 - k : k) * 4}px)` : 'none';
    el.style.transform = `translateY(${inward ? (1 - k) * 4 : -k * 4}px)`;
  };
  const h = (tag, cls, html) => { const el = document.createElement(tag); if (cls) el.className = cls; if (html != null) el.innerHTML = html; return el; };

  // ---- 從分散資訊到完整脈絡（官網首頁 Story 3） ----
  // 六個來源散在四周 → 各拉一條線接到 ANIMA → 收攏成一張「會議前重點」，來源飛進每一行變成來源標記 → 引用 6 個來源。
  const SCENES = {
    context(stage) {
      const W = 400, H = 560, cx = W / 2, cy = H / 2, tile = 56, badge = 24, TOTAL = 7800, HOLD = 1800;
      const SOURCES = [['line', 'LINE'], ['teams', 'Teams'], ['slack', 'Slack'], ['gmail', 'Gmail'], ['digiwin-erp', '鼎新 ERP'], ['google-drive', '雲端硬碟']];
      const SPOTS = [[0.2, 0.2], [0.5, 0.12], [0.8, 0.2], [0.18, 0.8], [0.5, 0.88], [0.82, 0.8]];
      const ROWS = [
        { text: '對方問交期，業務回覆可提前一週', src: ['line', 'slack'], at: 4600 },
        { text: '承諾的兩款樣品已於週三寄出', src: ['teams', 'gmail'], at: 5200 },
        { text: '去年同期 3,200 件，報價單已備妥', src: ['digiwin-erp', 'google-drive'], at: 5800 },
      ];
      const DONE = 6400;
      const slotOf = {};
      ROWS.forEach((r, ri) => r.src.forEach((k, j) => { slotOf[k] = { id: `s${ri}${j}`, at: r.at - 250 + j * 140 }; }));

      const svgNS = 'http://www.w3.org/2000/svg';
      const threads = document.createElementNS(svgNS, 'svg');
      threads.setAttribute('class', 'st-threads'); threads.setAttribute('width', W); threads.setAttribute('height', H); threads.setAttribute('aria-hidden', 'true');
      const lines = SPOTS.map(([x, y]) => {
        const l = document.createElementNS(svgNS, 'line');
        l.setAttribute('x1', x * W); l.setAttribute('y1', y * H); l.setAttribute('x2', cx); l.setAttribute('y2', cy);
        l.dataset.len = Math.hypot(cx - x * W, cy - y * H); l.setAttribute('stroke-dasharray', l.dataset.len);
        threads.appendChild(l); return l;
      });

      const wrap = h('div', 'st-brief');
      const card = h('div', 'st-card');
      const head = h('div', 'st-head');
      head.append(h('span', 'st-slot st-icon-slot'), h('span', 'st-title', '會議前重點：晨光文具'));
      const pill = h('span', 'st-pill');
      const pillA = h('span', 'st-pill-text', '整理中'), pillB = h('span', 'st-pill-text', '已整理');
      pill.append(pillA, pillB); head.append(pill);
      head.firstChild.dataset.m = 'icon';
      const rowsEl = h('div', 'st-rows');
      const rowEls = ROWS.map((r, ri) => {
        const row = h('div', 'st-row'), dot = h('span', 'st-dot'), text = h('span', 'st-row-text', r.text), badges = h('span', 'st-badges');
        r.src.forEach((k, j) => { const b = h('span', 'st-slot st-badge-slot'); b.dataset.m = `s${ri}${j}`; badges.append(b); });
        row.append(dot, text, badges); rowsEl.append(row); return { dot, text };
      });
      const foot = h('div', 'st-foot', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" stroke-dasharray="24"/><circle cx="12" cy="12" r="8" stroke-dasharray="14 40"/></svg><span>引用 6 個來源</span>');
      card.append(head, h('div', 'st-rule'), rowsEl, foot); wrap.append(card);

      const srcEls = SOURCES.map(([key, name]) => { const d = h('div', 'st-source'); const img = h('img'); img.src = `${ASSETS}logos/tools-plain/${key}.svg`; img.alt = name; d.append(img); return { d, img, key }; });
      const hub = h('div', 'st-hub');
      const hubLogo = h('span', 'st-hub-logo'); const logo = h('img'); logo.src = `${ASSETS}logo/ANIMA_logomark_default.svg`; logo.alt = ''; hubLogo.append(logo);
      const hubIcon = h('span', 'st-hub-icon', '<i class="ico ico-projects"></i>');
      hub.append(hubLogo, hubIcon);
      stage.append(threads, wrap, ...srcEls.map(s => s.d), hub);

      let R = null;
      const measure = () => {
        const m = {};
        stage.querySelectorAll('[data-m]').forEach(el => {
          let x = 0, y = 0, n = el;
          while (n && n !== stage) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
          m[el.dataset.m] = { x, y };
        });
        R = m;
      };
      const pillW = () => [pillA, pillB].map(el => el.scrollWidth);

      const render = (t) => {
        if (!R) measure();
        const cardK = spr(t, 3300, 900), hubMove = spr(t, 3350, 1000), hubIn = spr(t, 1800, 700);
        card.style.opacity = Math.min(1, cardK * 1.4); card.style.transform = `scale(${0.96 + 0.04 * cardK})`;
        ROWS.forEach((r, i) => { rowEls[i].dot.style.opacity = spr(t, r.at - 300, 400); rise(rowEls[i].text, t, r.at - 300, 640, 6); });
        rise(foot, t, DONE, 600, 4);
        const [path, circ] = foot.querySelector('svg').children;
        path.style.display = t >= DONE + 200 ? '' : 'none'; circ.style.display = t >= DONE + 200 ? 'none' : '';
        path.setAttribute('stroke-dashoffset', 24 * (1 - spr(t, DONE + 200, 420)));
        circ.setAttribute('transform', `rotate(${(t / 2) % 360} 12 12)`);
        // 狀態膠囊：整理中 → 已整理（同一顆變形，字模糊交替）
        const pk = spr(t, DONE, 560), pq = t >= DONE ? swapK(t, DONE) : 0, ws = pillW();
        pill.style.width = `${lerp(ws[0], ws[1], t >= DONE ? pk : 0)}px`;
        pill.style.background = blend('var(--mist-100)', 'color-mix(in oklch, var(--current-500) 14%, transparent)', t >= DONE ? pk : 0);
        pill.style.color = blend('var(--mist-600)', 'var(--current-500)', t >= DONE ? pk : 0);
        blurX(pillA, pq, false); blurX(pillB, pq, true);
        // 線
        threads.style.opacity = 1 - spr(t, 3300, 500);
        lines.forEach((l, i) => l.setAttribute('stroke-dashoffset', l.dataset.len * (1 - spr(t, 2200 + i * 120, 800))));
        // 中間的 ANIMA 移到卡片左上角，變成卡片的 icon
        const icon = R.icon;
        const hx = icon ? lerp(cx, icon.x + 16, hubMove) : cx, hy = icon ? lerp(cy, icon.y + 16, hubMove) : cy, hs = lerp(68, 32, hubMove);
        Object.assign(hub.style, { left: `${hx - hs / 2}px`, top: `${hy - hs / 2}px`, width: `${hs}px`, height: `${hs}px`, borderRadius: `${lerp(hs / 2, 8, hubMove)}px`,
          background: blend('#fff', 'var(--mist-100)', hubMove), boxShadow: `0 12px 30px -18px rgba(14,26,34,${0.5 * (1 - hubMove)})`,
          opacity: Math.min(1, hubIn * 1.3), transform: `scale(${0.85 + 0.15 * hubIn})` });
        logo.style.height = `${30 * lerp(1, 0.6, hubMove)}px`;
        blurX(hubLogo, swapK(t, 3900, 360), false); blurX(hubIcon, swapK(t, 3900, 360), true);
        // 來源：先散在四周，輪到那一行時飛進去變成來源標記
        srcEls.forEach((s, i) => {
          const [x, y] = SPOTS[i], slot = slotOf[s.key], dest = R[slot.id];
          const k = dest ? spr(t, slot.at, 900) : 0, appear = spr(t, 200 + i * 220, 640);
          const drift = (1 - k) * Math.sin(t / 700 + i * 1.7) * 3, size = lerp(tile, badge, k);
          const px = dest ? lerp(x * W, dest.x + badge / 2, k) : x * W, py = (dest ? lerp(y * H, dest.y + badge / 2, k) : y * H) + drift;
          Object.assign(s.d.style, { left: `${px - size / 2}px`, top: `${py - size / 2}px`, width: `${size}px`, height: `${size}px`, borderRadius: `${lerp(14, 6, k)}px`,
            boxShadow: `0 10px 24px -16px rgba(14,26,34,${0.5 * (1 - k)})`, opacity: Math.min(1, appear * 1.3), transform: `translateY(${(1 - appear) * 10}px)`, zIndex: k > 0 ? 2 : 1 });
          const is = size * lerp(0.55, 0.625, k); s.img.style.width = s.img.style.height = `${is}px`;
        });
      };
      return { W, H, TOTAL, HOLD, render, measure };
    },

    // ---- 工具原樣不動（舊 sales deck 第 2 頁的圖，用官網 Story 的動態語彙重做） ----
    // ANIMA 條先出現 → 六個工具卡依序浮上來 → 線從 ANIMA 拉到每個工具 → 群組／文件標籤 → 說明。停格時有小點沿線從工具流向 ANIMA。
    tools(stage) {
      const W = 688, H = 448, TOTAL = 4200, HOLD = 4200;
      const GROUPS = [['群組', [['line', 'LINE'], ['slack', 'Slack'], ['teams', 'Teams']]], ['文件', [['google-drive', 'Google Drive'], ['notion', 'Notion'], ['synology-nas', 'NAS']]]];
      const card = h('div', 'tl-card');
      const bar = h('div', 'tl-bar', `<img class="tl-bar-logo" src="${ASSETS}logo/ANIMA_horizontal_primary_dark.svg" alt="ANIMA"><span class="tl-bar-rule"></span><span class="tl-bar-do"><b>在原本的群組裡 @ANIMA</b><span>附來源回答、起草回應</span></span><span class="tl-bar-model"><span>模型</span><b>可以換</b></span>`);
      const tools = h('div', 'tl-groups');
      const tiles = [], labels = [];
      GROUPS.forEach(([name, list]) => {
        const g = h('div', 'tl-group'), row = h('div', 'tl-tiles');
        list.forEach(([key, label]) => { const tile = h('div', 'tl-tile', `<img src="${ASSETS}logos/tools-plain/${key}.svg" alt=""><span>${label}</span>`); row.append(tile); tiles.push(tile); });
        const lab = h('div', 'tl-label', name); labels.push(lab);
        g.append(row, lab); tools.append(g);
      });
      const cap = h('p', 'tl-cap', '公司已經在用的工具，原樣不動');
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('class', 'tl-lines'); svg.setAttribute('width', W); svg.setAttribute('height', H);
      const lines = tiles.map(() => { const l = document.createElementNS(svgNS, 'line'); svg.append(l); return l; });
      const dots = tiles.map(() => { const c = document.createElementNS(svgNS, 'circle'); c.setAttribute('r', 3.5); svg.append(c); return c; });
      card.append(bar, tools, cap);
      stage.append(card, svg);

      let G = null;
      const off = (el) => { let x = 0, y = 0, n = el; while (n && n !== stage) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x, y, w: el.offsetWidth, h: el.offsetHeight }; };
      const measure = () => { const b = off(bar); G = tiles.map(tl => { const r = off(tl); const x = r.x + r.w / 2; return { x, y1: b.y + b.h, y2: r.y }; }); };
      const render = (t) => {
        if (!G) measure();
        const c = spr(t, 0, 700); card.style.opacity = Math.min(1, c * 1.4); card.style.transform = `scale(${0.97 + 0.03 * c})`;
        rise(bar, t, 200, 700, 10);
        tiles.forEach((tl, i) => rise(tl, t, 700 + i * 120, 640, 12));
        lines.forEach((l, i) => {
          const g = G[i], len = g.y2 - g.y1, p = spr(t, 1500 + i * 110, 800);
          l.setAttribute('x1', g.x); l.setAttribute('x2', g.x); l.setAttribute('y1', g.y1); l.setAttribute('y2', g.y2);
          l.setAttribute('stroke-dasharray', len); l.setAttribute('stroke-dashoffset', len * (1 - p));
        });
        labels.forEach((lb, i) => rise(lb, t, 2500 + i * 160, 600, 6));
        rise(cap, t, 3000, 600, 4);
        // 停格時：小點從工具沿線往上流到 ANIMA（資料還在原處，只是被讀到）
        dots.forEach((d, i) => {
          const g = G[i], start = 3400 + i * 90;
          if (t < start || t >= TOTAL) { d.style.opacity = 0; return; }
          const k = ((t - start) % 1400) / 1400;
          d.setAttribute('cx', g.x); d.setAttribute('cy', lerp(g.y2, g.y1, k)); d.style.opacity = Math.sin(Math.PI * k);
        });
      };
      // 停格那段也要動小點：把 hold 算進時間軸，render 收到的 t 會被截在 TOTAL，所以用 renderHold
      const renderAll = (t) => { render(Math.min(t, TOTAL)); if (t > TOTAL) dots.forEach((d, i) => { const g = G[i], k = ((t - 3400 - i * 90) % 1400) / 1400; d.setAttribute('cx', g.x); d.setAttribute('cy', lerp(g.y2, g.y1, k)); d.style.opacity = t > TOTAL + HOLD - 900 ? 0 : Math.sin(Math.PI * k); }); };
      return { W, H, TOTAL, HOLD, render, renderAll, measure };
    },
  };

  const FADE = 700;
  const items = stories.map(box => {
    const make = SCENES[box.dataset.story];
    if (!make) return null;
    const stage = h('div', 'story-stage');
    box.append(stage);
    const scene = make(stage);
    const fitStage = () => {
      const s = Math.min(box.offsetWidth / scene.W, box.offsetHeight / scene.H);
      if (!s) return;
      stage.style.width = `${scene.W}px`; stage.style.height = `${scene.H}px`;
      stage.style.left = `${(box.offsetWidth - scene.W * s) / 2}px`; stage.style.top = `${(box.offsetHeight - scene.H * s) / 2}px`;
      stage.style.transform = `scale(${s})`;
    };
    return { box, stage, scene, fitStage, t: scene.TOTAL, playing: false };
  }).filter(Boolean);

  const deck = document.querySelector('.deck');
  const still = it => { it.fitStage(); it.scene.measure(); it.stage.style.opacity = 1; it.scene.render(it.scene.TOTAL); };
  items.forEach(still);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => items.forEach(it => { if (!it.playing) still(it); else it.scene.measure(); }));
  addEventListener('resize', () => items.forEach(it => it.fitStage()));
  addEventListener('beforeprint', () => items.forEach(it => { it.playing = false; still(it); }));
  if (reduce) return;

  let last = performance.now();
  const tick = now => {
    const dt = Math.min(64, now - last); last = now;
    const overview = deck && deck.classList.contains('is-overview');
    items.forEach(it => {
      const frame = it.box.closest('.slide-frame');
      const active = !overview && (!frame || frame.classList.contains('is-active'));
      if (!active) { if (it.playing) { it.playing = false; still(it); } return; }
      if (!it.playing) { it.playing = true; const calm = deck && (deck.classList.contains('is-rushing') || deck.dataset.transition === 'none'); it.t = calm ? 0 : -900; it.fitStage(); it.scene.measure(); }   // 等換頁和進場跑完（約 0.9 秒）才開始播
      const { TOTAL, HOLD } = it.scene;
      it.t = it.t + dt >= TOTAL + HOLD ? 0 : it.t + dt;
      if (it.t < 0) { if (it.scene.renderAll) it.scene.renderAll(0); else it.scene.render(0); it.stage.style.opacity = 1; return; }
      const out = Math.min(1, Math.max(0, (it.t - (TOTAL + HOLD - FADE)) / FADE));
      it.stage.style.opacity = 1 - out;
      if (it.scene.renderAll) it.scene.renderAll(it.t); else it.scene.render(Math.min(it.t, TOTAL));
    });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

/* ── logo 大小一致（2026-11-16）────────────────────────────
   logo 檔案各自留白不同（Web DS 的工具 logo 有 18% 邊、舊稿的 png 有的貼邊），
   直接給同一個高度，看起來會一大一小。這裡把每個 logo 裁到實際圖案的範圍，
   再用同一個基準算大小：接近正方形的圖示，圖案高度一樣；橫式文字 logo，圖案面積一樣。
   高度 h＝S × 寬高比^-0.4（最多 1.15S；img.logo.is-wordmark 取代名字時固定 1.15S），基準 S＝原本 CSS 給的高度 × 0.8；logo 牆（.logo-cell）用格高的 0.5，寬度不超過格寬 85%。 */
(function () {
  const SEL = '.deck .slide :is(.chip > img, img.logo, .logo-row img, .logo-cell img, .partner img, .partners-head img)';
  const inkBox = (img) => {
    const n = 160, w = img.naturalWidth, h = img.naturalHeight;
    if (!w || !h) return null;
    const k = n / Math.max(w, h), cw = Math.max(1, Math.round(w * k)), ch = Math.max(1, Math.round(h * k));
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0, cw, ch);
    let d; try { d = g.getImageData(0, 0, cw, ch).data; } catch (e) { return null; }   // file:// 讀不到像素就照原樣
    let t = ch, l = cw, b = -1, r = -1;
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const i = (y * cw + x) * 4, a = d[i + 3];
      if (a < 16 || (d[i] > 242 && d[i + 1] > 242 && d[i + 2] > 242)) continue;   // 透明或白底不算圖案
      if (y < t) t = y; if (y > b) b = y; if (x < l) l = x; if (x > r) r = x;
    }
    if (b < 0) return null;
    return { t: t / ch, l: l / cw, b: (ch - 1 - b) / ch, r: (cw - 1 - r) / cw, a: ((r - l + 1) / cw * w) / ((b - t + 1) / ch * h) };
  };
  // 字前面的 logo：量旁邊那段字的中線，把 logo 的中線對上（vertical-align 用算的，不用猜）
  const align = (img) => {
    if (!img.classList.contains('logo')) return;
    let t = img.nextSibling;
    while (t && !(t.nodeType === 3 && t.textContent.trim())) t = t.nextSibling;
    if (!t) { t = img.previousSibling; while (t && !(t.nodeType === 3 && t.textContent.trim())) t = t.previousSibling; }
    if (!t) return;
    const r = document.createRange(); r.setStart(t, 0); r.setEnd(t, Math.min(1, t.textContent.length));
    const k = t.textContent.search(/\S/); r.setStart(t, k); r.setEnd(t, k + 1);
    const tr = r.getBoundingClientRect(), ir = img.getBoundingClientRect();
    if (!tr.height || !ir.height) return;
    const scale = ir.height / img.offsetHeight || 1;
    const cur = parseFloat(getComputedStyle(img).verticalAlign) || 0;
    const d = ((ir.top + ir.bottom) / 2 - (tr.top + tr.bottom) / 2) / scale;
    img.style.verticalAlign = (cur + d).toFixed(2) + 'px';
  };
  const fit = (img) => {
    if (img.dataset.logoFit) return;
    const box = inkBox(img); if (!box) return;
    img.dataset.logoFit = '1';
    const cell = img.closest('.logo-cell');
    let S, maxW = Infinity;
    if (cell) { S = cell.clientHeight * 0.5; maxW = cell.clientWidth * 0.85; }
    else S = (parseFloat(img.dataset.logoBase) || img.offsetHeight) * 0.8;
    if (!S) { delete img.dataset.logoFit; return; }
    const a = box.a;
    let h = Math.min(S * 1.15, S * Math.pow(a, -0.4)), w = h * a;   // 介於「等高」和「等面積」之間：橫式不會縮太小、直式不會太瘦
    if (img.matches('img.logo.is-wordmark')) { h = S * 1.15; w = h * a; }   // logo 取代名字（例：比較表 ANIMA 欄頭）：照字高，不因為橫式縮小
    if (w > maxW) { w = maxW; h = w / a; }
    const p = (v) => (v * 100).toFixed(2) + '%';
    img.style.objectViewBox = `inset(${p(box.t)} ${p(box.r)} ${p(box.b)} ${p(box.l)})`;
    img.style.objectFit = 'contain';
    img.style.width = w.toFixed(1) + 'px'; img.style.height = h.toFixed(1) + 'px';
    img.style.maxWidth = 'none'; img.style.maxHeight = 'none';
    requestAnimationFrame(() => align(img));
  };
  const run = () => document.querySelectorAll(SEL).forEach((img) => {
    if (!img.dataset.logoBase && img.offsetHeight) img.dataset.logoBase = img.offsetHeight;
    if (img.complete) fit(img); else img.addEventListener('load', () => fit(img), { once: true });
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', run);
  document.fonts && document.fonts.ready.then(run);
})();
