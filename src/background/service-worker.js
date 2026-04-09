chrome.runtime.onMessage.addListener(({ source, links }) => {
    chrome.storage.local.get('graph').then(({ graph = { nodes: [], edges: [] } }) => {
        const nodeSet = new Set(graph.nodes);
        const edgeSet = new Set(graph.edges.map(e => `${e.source}→${e.target}`));

        nodeSet.add(source);
        for (const link of links) {
            nodeSet.add(link);
            edgeSet.add(`${source}→${link}`);
        }

        const nodes = Array.from(nodeSet);
        const edges = Array.from(edgeSet).map(key => {
            const [s, t] = key.split('→');
            return { source: s, target: t };
        });

        chrome.storage.local.set({ graph: { nodes, edges } });
    });
});