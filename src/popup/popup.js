// Popup script — handles side panel interactions (node count, clear data, open in tab).

const wikiPattern = /^https:\/\/[a-z]+\.wikipedia\.org\/wiki\//;

const dot = document.getElementById('wiki-dot');
const nodeCountEl = document.getElementById('node-count');
const openTabBtn = document.getElementById('open-tab');
const clearDataBtn = document.getElementById('clear-data');

// --- Check active tab ---
chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    const onWiki = tab?.url && wikiPattern.test(tab.url);
    dot.classList.add(onWiki ? 'active' : 'inactive');
});

// --- Update UI from count ---
function updateCount(count) {
    nodeCountEl.textContent = count;
    openTabBtn.disabled = count === 0;
    clearDataBtn.disabled = count === 0;
}

// --- Initial load ---
chrome.storage.local.get('graph', ({ graph }) => {
    updateCount(graph?.nodes?.length ?? 0);
});

// --- Live count updates ---
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.graph) {
        updateCount(changes.graph.newValue?.nodes?.length ?? 0);
    }
});

// --- Open graph in new tab ---
openTabBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('graph.html') });
});

// --- Clear stored graph data ---
clearDataBtn.addEventListener('click', () => {
    chrome.storage.local.remove('graph');
});
