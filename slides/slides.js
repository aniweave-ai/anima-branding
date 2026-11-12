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
    progress.style.width = `${((current + 1) / frames.length) * 100}%`;
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

  document.body.style.overflow = 'hidden';
  fit();
  go((parseInt(location.hash.slice(1), 10) || 1) - 1, { updateHash: false });
  if (new URLSearchParams(location.search).has('overview')) toggleOverview(true);
})();
