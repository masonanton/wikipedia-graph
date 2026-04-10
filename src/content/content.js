const title = document.title.replace(/ - Wikipedia$/, '');

const links = Array.from(
    document.querySelectorAll('#mw-content-text a[href^="/wiki/"]')
).filter(a => !a.getAttribute('href').includes(':') && !a.querySelector('img'))
 .map(a => decodeURIComponent(a.getAttribute('href').replace('/wiki/', '').replace(/_/g, ' ')))
 .filter(Boolean);

console.log({ source: title, links: [...links] });
chrome.runtime.sendMessage({ source: title, links });

