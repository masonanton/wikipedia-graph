// Graph page script — initialises and renders the D3.js force-directed graph using data from chrome.storage.local.
import * as d3 from 'd3';

const container = document.getElementById('graph-container');
const width = container.clientWidth || window.innerWidth;
const height = container.clientHeight || window.innerHeight;

const svg = d3.select('#graph-container').append('svg')
    .attr('width', width)
    .attr('height', height);

const zoomLayer = svg.append('g');

svg.call(d3.zoom().on('zoom', e => zoomLayer.attr('transform', e.transform)));

const linkGroup = zoomLayer.append('g').attr('class', 'links');
const nodeGroup = zoomLayer.append('g').attr('class', 'nodes');
const labelGroup = zoomLayer.append('g').attr('class', 'labels');

const simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(d => d.isParent ? 20 : 12));

function render({ nodes, edges }) {
    const parentIds = new Set(edges.map(e => e.source));
    const nodeData = nodes.map(id => ({ id, isParent: parentIds.has(id) }));
    const linkData = edges.map(e => ({ source: e.source, target: e.target }));

    // Edges
    const link = linkGroup.selectAll('line').data(linkData);
    link.enter().append('line').merge(link)
        .attr('stroke', '#8b8f97d0')
        .attr('stroke-width', 0.5);
    link.exit().remove();

    // Nodes
    const node = nodeGroup.selectAll('circle').data(nodeData, d => d.id);
    node.enter().append('circle')
        .call(d3.drag()
            .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
            .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
            .on('end', (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }))
        .merge(node)
        .attr('r', d => d.isParent ? 14 : 6)
        .attr('fill', d => d.isParent ? '#6366f1' : '#475569')
        .attr('stroke', d => d.isParent ? '#a5b4fc' : 'none');
    node.exit().remove();

    // Labels
    const label = labelGroup.selectAll('text').data(nodeData, d => d.id);
    label.enter().append('text')
        .merge(label)
        .text(d => d.id)
        .attr('font-size', d => d.isParent ? 12 : 9)
        .attr('font-weight', d => d.isParent ? '600' : '400')
        .attr('dx', d => d.isParent ? 17 : 10)
        .attr('dy', 4);
    label.exit().remove();

    simulation.nodes(nodeData).on('tick', () => {
        linkGroup.selectAll('line')
            .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
        nodeGroup.selectAll('circle')
            .attr('cx', d => d.x).attr('cy', d => d.y);
        labelGroup.selectAll('text')
            .attr('x', d => d.x).attr('y', d => d.y);
    });

    simulation.force('link').links(linkData);
    simulation.alpha(0.3).restart();
}

// Initial load
chrome.storage.local.get('graph', ({ graph }) => {
    if (graph) render(graph);
});

// Live updates
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.graph) {
        render(changes.graph.newValue);
    }
});
