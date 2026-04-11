const title = document.title.replace(/ - Wikipedia$/, '');

const output = document.querySelector('#mw-content-text .mw-parser-output');
const summaryLinks = [];

// Get all of the links before the first heading
for (const el of output.children) {
    if (el.tagName === 'H2' || el.classList.contains('mw-heading')) break;
    for (const a of el.querySelectorAll('a[href^="/wiki/"]')) {
        summaryLinks.push(a);
    }
}

// Filter all of the links
const links = summaryLinks
    .filter(a => !a.getAttribute('href').includes(':') && !a.querySelector('img'))
    .map(a => decodeURIComponent(a.getAttribute('href').replace('/wiki/', '').replace(/_/g, ' ')))
    .filter(Boolean);

console.log({ source: title, links: [...links] });
chrome.runtime.sendMessage({ source: title, links });

