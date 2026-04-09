// Popup script — handles toolbar popup interactions (e.g. opening the graph page, toggling the extension).

const wikiPattern = /^https:\/\/[a-z]+\.wikipedia\.org\/wiki\//;

const dot = document.getElementById('wiki-dot');
const statusEl = document.getElementById('wiki-status');
const nodeCountEl = document.getElementById('node-count');
const openGraphBtn = document.getElementById('open-graph');
const clearDataBtn = document.getElementById('clear-data');

// --- Check active tab ---
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
  const onWiki = tab?.url && wikiPattern.test(tab.url);

  dot.classList.add(onWiki ? 'active' : 'inactive');
  statusEl.textContent = onWiki ? 'On a Wikipedia article' : 'Not on Wikipedia';
});

// --- Read node count from storage ---
chrome.storage.local.get('graph', ({ graph }) => {
  const count = graph?.nodes?.length ?? 0;
  nodeCountEl.textContent = count;
  openGraphBtn.disabled = count === 0;
  clearDataBtn.disabled = count === 0;
});

// --- Open the graph page in a new tab ---
openGraphBtn.addEventListener('click', () => {
  chrome.tabs.create({ url: chrome.runtime.getURL('graph.html') });
  window.close();
});

// --- Clear stored graph data ---
clearDataBtn.addEventListener('click', () => {
  chrome.storage.local.remove('graph', () => {
    nodeCountEl.textContent = '0';
    openGraphBtn.disabled = true;
    clearDataBtn.disabled = true;
  });
});
