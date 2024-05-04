chrome.storage.local.get({
  size: 50,
  width: 1
}, prefs => {
  document.body.style.setProperty('--size', prefs.size + 'px');
  document.body.style.setProperty('--thickness', prefs.width + 'px');

  document.getElementById('unit').dataset.msg = prefs.size + 'px';
});
chrome.storage.onChanged.addListener(ps => {
  if (ps.size) {
    document.body.style.setProperty('--size', ps.size.newValue + 'px');
    document.getElementById('unit').dataset.msg = ps.size.newValue + 'px';
  }
  if (ps.width) {
    document.body.style.setProperty('--thickness', ps.width.newValue + 'px');
  }
});

const pos = {
  pageX: 0,
  pageY: 0
};

const ruler = document.getElementById('ruler');
const mousemove = e => {
  const x1 = Math.min(e.pageX, pos.pageX);
  const y1 = Math.min(e.pageY, pos.pageY);
  const x2 = Math.max(e.pageX, pos.pageX);
  const y2 = Math.max(e.pageY, pos.pageY);

  ruler.style.left = x1 + 'px';
  ruler.style.top = y1 + 'px';
  ruler.style.width = (x2 - x1) + 'px';
  ruler.style.height = (y2 - y1) + 'px';
  if (x2 - x1 > 5 || y2 - y1 > 5) {
    ruler.dataset.start = `${x1}px × ${y1}px`;
    ruler.dataset.end = `${x2}px × ${y2}px`;
  }
  else {
    ruler.dataset.start = '';
    ruler.dataset.end = '';
  }
  if (x2 - x1 > 100 && y2 - y1 > 100) {
    ruler.textContent = `${x2 - x1}px × ${y2 - y1}px`;
  }
  else {
    ruler.textContent = '';
  }
};

addEventListener('mousedown', e => {
  pos.pageX = e.pageX;
  pos.pageY = e.pageY;
  ruler.style.width = 0;
  ruler.style.height = 0;
  ruler.textContent = '';
  ruler.dataset.start = '';
  ruler.dataset.end = '';

  document.body.dataset.busy = true;

  addEventListener('mousemove', mousemove);
  addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', mousemove);
  }, {
    once: true
  });
});

addEventListener('keydown', e => {
  if (e.code === 'Escape') {
    if (window.top === window) {
      window.close();
    }
    else {
      chrome.runtime.sendMessage({
        method: 'remove'
      });
    }
  }
});
