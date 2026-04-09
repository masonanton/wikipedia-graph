const title = document.title.replace(/ - Wikipedia$/, '');

const links = Array.from(
    document.querySelectorAll('#mw-content-text a[href^="/wiki/"]')
).map(a => a.title || a.textContent.trim()).filter(Boolean);

console.log({ source: title, links: [...links] });
chrome.runtime.sendMessage({ source: title, links });

