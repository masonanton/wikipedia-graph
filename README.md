<img width="2399" height="1350" alt="image" src="https://github.com/user-attachments/assets/137f5296-1ab8-418c-a612-eef2f3282064" />

# Wikipedia Graph

A Chrome extension that visualizes your Wikipedia browsing as a force-directed graph. As you navigate articles, it maps the connections between them in a live side panel.

## How it works

- A content script runs on every Wikipedia article you visit and extracts links from the summary section
- The links are sent to a background service worker which accumulates nodes and edges in `chrome.storage.local`
- The side panel renders the graph using D3.js and updates in real time as you browse

Articles you've visited appear as larger purple nodes. Linked articles appear as smaller grey nodes.

## Setup

```bash
npm install
npm run build
```

Then go to `chrome://extensions`, enable Developer mode, click **Load unpacked**, and select the `dist` folder.

## Development

```bash
npm run dev
```

Watches for file changes and rebuilds automatically. After each rebuild, click the reload button on the extension card in `chrome://extensions`.
