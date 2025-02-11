import React, { useRef, useEffect, useState, useCallback } from "react";
import { ForceGraph2D } from "react-force-graph";
import * as d3 from "d3-force-3d";

const colorMap = {
  policy: "#ff6b6b",
  initiative: "#4ecdc4",
  impact: "#45b7d1",
  economic: "#96ceb4"
};

const Graph = () => {
  const graphRef = useRef(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [isStabilized, setIsStabilized] = useState(false);

  // Use a ref to keep the graph data from recreating each render
  const graphDataRef = useRef({
    nodes: [
      { id: "Government Restructuring", group: "policy", level: 1 },
      { id: "Department of Government Efficiency (DOGE)", group: "initiative", level: 2 },
      { id: "Trade Policy Changes", group: "policy", level: 1 },
      { id: "US Tariffs on Steel & Aluminum", group: "impact", level: 2 },
      { id: "Immigration Policy", group: "policy", level: 1 },
      { id: "Executive Orders on Deportation", group: "impact", level: 2 },
      { id: "Public Health Measures", group: "policy", level: 1 },
      { id: "Bird Flu Testing Requirements", group: "impact", level: 2 },
      { id: "USAID Downsizing", group: "impact", level: 3 },
      { id: "Agency Disruptions (CDC, CMS, HHS)", group: "impact", level: 3 },
      { id: "Loss of Institutional Memory", group: "impact", level: 3 },
      { id: "Chinese Retaliatory Tariffs", group: "impact", level: 3 },
      { id: "Canadian Oil Tariffs", group: "impact", level: 3 },
      { id: "Labor Shortages", group: "impact", level: 3 },
      { id: "Community Disruption", group: "impact", level: 3 },
      { id: "Lost Grain Deals", group: "impact", level: 4 },
      { id: "Agricultural Exports", group: "impact", level: 4 },
      { id: "Farming Costs", group: "impact", level: 4 },
      { id: "Agricultural Labor Supply", group: "impact", level: 4 },
      { id: "Disease Surveillance", group: "impact", level: 4 },
      { id: "Dairy Industry", group: "impact", level: 4 },
      { id: "Market Disruptions", group: "economic", level: 5 },
      { id: "Higher Consumer Prices", group: "economic", level: 5 },
      { id: "Rural Economic Decline", group: "economic", level: 5 }
    ],
    links: [
      { source: "Government Restructuring", target: "Department of Government Efficiency (DOGE)" },
      { source: "Trade Policy Changes", target: "US Tariffs on Steel & Aluminum" },
      { source: "Immigration Policy", target: "Executive Orders on Deportation" },
      { source: "Public Health Measures", target: "Bird Flu Testing Requirements" },
      { source: "Department of Government Efficiency (DOGE)", target: "USAID Downsizing" },
      { source: "Department of Government Efficiency (DOGE)", target: "Agency Disruptions (CDC, CMS, HHS)" },
      { source: "Department of Government Efficiency (DOGE)", target: "Loss of Institutional Memory" },
      { source: "US Tariffs on Steel & Aluminum", target: "Chinese Retaliatory Tariffs" },
      { source: "US Tariffs on Steel & Aluminum", target: "Canadian Oil Tariffs" },
      { source: "Executive Orders on Deportation", target: "Labor Shortages" },
      { source: "Executive Orders on Deportation", target: "Community Disruption" },
      { source: "USAID Downsizing", target: "Lost Grain Deals" },
      { source: "Chinese Retaliatory Tariffs", target: "Agricultural Exports" },
      { source: "Canadian Oil Tariffs", target: "Farming Costs" },
      { source: "Labor Shortages", target: "Agricultural Labor Supply" },
      { source: "Agency Disruptions (CDC, CMS, HHS)", target: "Disease Surveillance" },
      { source: "Bird Flu Testing Requirements", target: "Dairy Industry" },
      { source: "Dairy Industry", target: "Market Disruptions" },
      { source: "Dairy Industry", target: "Higher Consumer Prices" },
      { source: "Dairy Industry", target: "Rural Economic Decline" },
      { source: "Disease Surveillance", target: "Dairy Industry" },
      { source: "Loss of Institutional Memory", target: "Disease Surveillance" },
      { source: "Community Disruption", target: "Rural Economic Decline" },
      { source: "Higher Consumer Prices", target: "Community Disruption" },
      { source: "Agricultural Exports", target: "Market Disruptions" },
      { source: "Farming Costs", target: "Higher Consumer Prices" },
      { source: "Lost Grain Deals", target: "Rural Economic Decline" },
      { source: "Agricultural Labor Supply", target: "Rural Economic Decline" }
    ]
  });

  useEffect(() => {
    if (graphRef.current) {
      // Increase negative charge for more spread
      graphRef.current.d3Force("charge").strength(-120);
      // Increase link distance so connected nodes are not too close
      graphRef.current.d3Force("link").distance(100).strength(0.2);
      // Adjust center if you prefer
      graphRef.current.d3Force("center").strength(0.1);
      // Add collision force with a collision radius of 30
      graphRef.current.d3Force("collide", d3.forceCollide(30));
    }
  }, []);

  const handleNodeHover = useCallback(node => {
    if (!node) {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      return;
    }
    const neighbors = new Set([node.id]);
    const links = new Set();
    graphDataRef.current.links.forEach(link => {
      const srcId = link.source.id || link.source;
      const trgId = link.target.id || link.target;
      if (srcId === node.id || trgId === node.id) {
        neighbors.add(srcId);
        neighbors.add(trgId);
        links.add(link);
      }
    });
    setHighlightNodes(neighbors);
    setHighlightLinks(links);
  }, []);

  const handleNodeClick = useCallback(node => {
    if (!node) return;
    // Unfix so the user can drag it
    node.fx = null;
    node.fy = null;
    setSelectedNode(selectedNode?.id === node.id ? null : node);
  }, [selectedNode]);

  const handleNodeDragEnd = useCallback(node => {
    // Fix position after dragging, so it doesn't snap back
    node.fx = node.x;
    node.fy = node.y;
  }, []);

  const paintNode = useCallback((node, ctx, globalScale) => {
    const label = node.id;
    const fontSize = 14 / globalScale;
    const isHighlighted = highlightNodes.has(node.id);
    const isSelected = selectedNode?.id === node.id;

    ctx.beginPath();
    ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = isHighlighted || isSelected
      ? colorMap[node.group]
      : `${colorMap[node.group]}99`;
    ctx.fill();

    ctx.font = `${isHighlighted ? "bold" : "normal"} ${fontSize}px Sans-Serif`;
    ctx.fillStyle = isHighlighted ? "#000" : "#666";
    ctx.textAlign = "center";
    ctx.fillText(label, node.x, node.y + 15);
  }, [highlightNodes, selectedNode]);

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Policy Impact Graph</h1>
        {selectedNode && (
          <div className="mb-4 p-4 bg-white rounded shadow">
            <h2 className="font-bold">{selectedNode.id}</h2>
            <p className="text-gray-600">Type: {selectedNode.group}</p>
            <p className="text-gray-600">Impact Level: {selectedNode.level}</p>
          </div>
        )}
      </div>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphDataRef.current}
        dagMode="td"
        dagLevelDistance={100} // can tweak for vertical separation
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        backgroundColor="#f9fafb"
        linkColor={link => highlightLinks.has(link) ? "#666" : "#ddd"}
        linkWidth={link => highlightLinks.has(link) ? 2 : 1}
        nodeCanvasObject={paintNode}
        onNodeHover={handleNodeHover}
        onNodeClick={handleNodeClick}
        onNodeDragEnd={handleNodeDragEnd}
        cooldownTicks={100}
        onEngineStop={() => {
          if (!isStabilized) {
            // If you want them fixed after layout
            graphDataRef.current.nodes.forEach(node => {
              node.fx = node.x;
              node.fy = node.y;
            });
            setIsStabilized(true);
          }
        }}
      />
    </div>
  );
};

export default Graph;
