import React, { useRef, useEffect, useState, useCallback } from "react";
import { ForceGraph2D } from "react-force-graph";
// For collision forces:
import * as d3 from "d3-force-3d";

//
// 1) Define color map and node groups
//
const colorMap = {
  policy: "#ff6b6b",
  initiative: "#4ecdc4",
  impact: "#45b7d1",
  economic: "#96ceb4"
};

export default function Graph() {
  const graphRef = useRef(null);

  // Hover and selection states
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [isStabilized, setIsStabilized] = useState(false);

  //
  // 2) Store your graph data in a ref to avoid regenerating each render
  //
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

  //
  // 3) Configure forces (including collision for spacing)
  //
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force("charge").strength(-120); // stronger negative charge
      graphRef.current.d3Force("link").distance(100).strength(0.2);
      // Gentle centering
      graphRef.current.d3Force("center").strength(0.1);
      // Collision force to push nodes apart so text doesn't overlap
      graphRef.current.d3Force("collide", d3.forceCollide(30));
    }
  }, []);

  //
  // 4) Node hover highlighting
  //
  const handleNodeHover = useCallback((node) => {
    if (!node) {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      return;
    }
    const neighbors = new Set([node.id]);
    const links = new Set();

    graphDataRef.current.links.forEach((link) => {
      // link.source / link.target might be IDs or objects
      const srcId = typeof link.source === "object" ? link.source.id : link.source;
      const trgId = typeof link.target === "object" ? link.target.id : link.target;
      if (srcId === node.id || trgId === node.id) {
        neighbors.add(srcId);
        neighbors.add(trgId);
        links.add(link);
      }
    });

    setHighlightNodes(neighbors);
    setHighlightLinks(links);
  }, []);

  //
  // 5) Node click -> select node & unfix so user can drag it
  //
  const handleNodeClick = useCallback((node) => {
    if (!node) return;
    // Unfix so user can move it around
    node.fx = null;
    node.fy = null;
    // Toggle selection
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, []);

  //
  // 6) Re-fix node after user drags it
  //
  const handleNodeDragEnd = useCallback((node) => {
    node.fx = node.x;
    node.fy = node.y;
  }, []);

  //
  // 7) Custom paint function for canvas nodes
  //
  const paintNode = useCallback(
    (node, ctx, globalScale) => {
      const label = node.id;
      const fontSize = 14 / globalScale;
      const isHighlighted = highlightNodes.has(node.id);
      const isSelected = selectedNode?.id === node.id;

      // Draw circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = isHighlighted || isSelected
        ? colorMap[node.group]
        : `${colorMap[node.group]}99`;
      ctx.fill();

      // Label
      ctx.font = `${isHighlighted ? "bold" : "normal"} ${fontSize}px Sans-Serif`;
      ctx.fillStyle = isHighlighted ? "#000" : "#666";
      ctx.textAlign = "center";
      ctx.fillText(label, node.x, node.y + 15);
    },
    [highlightNodes, selectedNode]
  );

  //
  // 8) Slide-in side panel for details
  //
  // We’ll show the side panel if `selectedNode` is not null.
  const sidePanelVisible = !!selectedNode;

  //
  // 9) Render
  //
  return (
    <div className="relative w-full h-screen bg-gradient-to-r from-gray-100 to-gray-200">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-2">
          Policy Impact Graph
        </h1>
        <p className="text-lg text-gray-700">
          Explore policy initiatives and their cascading impacts. Drag nodes around (even on mobile).
        </p>
      </header>

      {/* Side Panel (slides in from right) */}
      <div
        className={`
          fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
          ${sidePanelVisible ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-6">
          <h2 className="font-bold text-2xl text-gray-800 mb-4">Details</h2>
          {selectedNode ? (
            <>
              <p className="mb-2 text-gray-700">
                <strong>{selectedNode.id}</strong>
              </p>
              <p className="mb-1 text-gray-600">
                Group: <strong>{selectedNode.group}</strong>
              </p>
              <p className="mb-1 text-gray-600">
                Level: <strong>{selectedNode.level}</strong>
              </p>
            </>
          ) : (
            <p className="text-gray-600">No node selected.</p>
          )}
          <button
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setSelectedNode(null)}
          >
            Close
          </button>
        </div>
      </div>

      {/* Legend (top-right corner) */}
      <div className="absolute top-20 right-4 bg-white p-4 rounded-lg shadow-lg text-sm">
        <h3 className="font-bold mb-3 text-gray-800">Legend</h3>
        {Object.entries(colorMap).map(([group, color]) => (
          <div key={group} className="flex items-center mb-2">
            <span
              style={{ backgroundColor: color }}
              className="w-4 h-4 inline-block rounded-full mr-2"
            />
            <span className="capitalize text-gray-700">{group}</span>
          </div>
        ))}
      </div>

      {/* ForceGraph2D */}
      <div className="w-full h-full">
        <ForceGraph2D
          ref={graphRef}
          // Allow pointer events for node dragging on mobile
          style={{ touchAction: "none" }}
          graphData={graphDataRef.current}
          dagMode="td"
          dagLevelDistance={100}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          backgroundColor="#f9fafb"
          linkColor={(link) => (highlightLinks.has(link) ? "#666" : "#ddd")}
          linkWidth={(link) => (highlightLinks.has(link) ? 2 : 1)}
          nodeCanvasObject={paintNode}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          onNodeDragEnd={handleNodeDragEnd}
          cooldownTicks={100}
          // Lock node positions once stabilized (optional)
          onEngineStop={() => {
            if (!isStabilized) {
              graphDataRef.current.nodes.forEach((node) => {
                node.fx = node.x;
                node.fy = node.y;
              });
              setIsStabilized(true);
            }
          }}
        />
      </div>
    </div>
  );
}
