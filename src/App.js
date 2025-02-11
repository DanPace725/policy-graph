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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Listen for window resizes to update isMobile
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      // Adjust forces based on device
      const chargeStrength = isMobile ? -80 : -120;
      const linkDistance = isMobile ? 60 : 100;
      const collideRadius = isMobile ? 30 : 50;

      graphRef.current.d3Force("charge").strength(chargeStrength);
      graphRef.current.d3Force("link").distance(linkDistance).strength(0.2);
      graphRef.current.d3Force("center").strength(0.1);
      graphRef.current.d3Force("collide", d3.forceCollide(collideRadius));
      
      // Zoom to fit on mobile
      if (isMobile) {
        graphRef.current.zoomToFit(400, 50);
      }
    }
  }, [isMobile]);

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
  // 5) Node click -> select node (removed unfixing so nodes don't jump)
  //
  const handleNodeClick = useCallback((node) => {
    if (!node) return;
    // Simply toggle the selection without unfixing the node position:
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
      const fontSize = isMobile ? 12 / globalScale : 14 / globalScale;
      const nodeRadius = isMobile ? 6 : 8;
      const isHighlighted = highlightNodes.has(node.id);
      const isSelected = selectedNode?.id === node.id;

      // Draw node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = isHighlighted || isSelected
        ? colorMap[node.group]
        : `${colorMap[node.group]}99`;
      ctx.fill();

      // Draw label below the node
      ctx.font = `${isHighlighted ? "bold" : "normal"} ${fontSize}px Sans-Serif`;
      ctx.fillStyle = isHighlighted ? "#000" : "#666";
      ctx.textAlign = "center";
      ctx.fillText(label, node.x, node.y + nodeRadius + 5);
    },
    [highlightNodes, selectedNode, isMobile]
  );

  //
  // 8) Render (header simplified, sidebar removed)
  //
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Header with only the title */}
      <header className="p-4 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">
          Policy Impact Graph
        </h1>
      </header>

      {/* Responsive Legend */}
      <div
        className={`${
          isMobile ? "fixed bottom-4 left-4 right-4" : "absolute top-24 right-4"
        } bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg z-40`}
      >
        <div className={`${isMobile ? "justify-around" : "flex flex-col space-y-3"} flex`}>
          {Object.entries(colorMap).map(([group, color]) => (
            <div key={group} className="flex items-center gap-2">
              <span
                style={{ backgroundColor: color }}
                className="w-4 h-4 rounded-full shadow-sm flex-shrink-0"
              />
              <span className="capitalize text-gray-700 text-sm">{group}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ForceGraph2D */}
      <div className="w-full h-full">
        <ForceGraph2D
          ref={graphRef}
          graphData={graphDataRef.current}
          nodeCanvasObject={paintNode}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
          onNodeDragEnd={handleNodeDragEnd}
          dagMode="td"
          dagLevelDistance={isMobile ? 60 : 100}
          linkDirectionalArrowLength={6}
          linkDirectionalArrowRelPos={1}
          backgroundColor="#f9fafb"
          linkColor={(link) => (highlightLinks.has(link) ? "#666" : "#ddd")}
          linkWidth={(link) => (highlightLinks.has(link) ? 2 : 1)}
          cooldownTicks={100}
          onEngineStop={() => {
            if (!isStabilized) {
              graphDataRef.current.nodes.forEach((node) => {
                node.fx = node.x;
                node.fy = node.y;
              });
              setIsStabilized(true);
            }
          }}
          enableNodeDrag={true}
          enableZoomPanInteraction={true}
          minZoom={0.5}
          maxZoom={4}
          style={{ touchAction: "none" }}
        />
      </div>
    </div>
  );
}
