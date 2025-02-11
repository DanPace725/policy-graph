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
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [isStabilized, setIsStabilized] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Add resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
      const fontSize = isMobile ? 12 / globalScale : 14 / globalScale;
      const nodeRadius = isMobile ? 6 : 8;
      const isHighlighted = highlightNodes.has(node.id);
      const isSelected = selectedNode?.id === node.id;

      // Draw circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = isHighlighted || isSelected
        ? colorMap[node.group]
        : `${colorMap[node.group]}99`;
      ctx.fill();

      // Label
      ctx.font = `${isHighlighted ? "bold" : "normal"} ${fontSize}px Sans-Serif`;
      ctx.fillStyle = isHighlighted ? "#000" : "#666";
      ctx.textAlign = "center";
      ctx.fillText(label, node.x, node.y + nodeRadius + 5);
    },
    [highlightNodes, selectedNode, isMobile]
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
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200">
      {/* Responsive Header */}
      <header className={`p-4 ${isMobile ? 'pb-2' : 'p-8'} text-center`}>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
          Policy Impact Graph
        </h1>
        {!isMobile && (
          <p className="text-lg text-gray-600">
            Explore policy initiatives and their cascading impacts
          </p>
        )}
      </header>

      {/* Mobile-friendly Side Panel */}
      <div
        className={`
          fixed inset-y-0 right-0 w-full md:w-96 bg-white/95 backdrop-blur-sm shadow-2xl 
          transform transition-all duration-300 ease-in-out z-50
          ${sidePanelVisible ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="p-4 md:p-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl md:text-2xl text-gray-800">Node Details</h2>
            <button
              onClick={() => setSelectedNode(null)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
          
          {selectedNode ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{selectedNode.id}</h3>
                <div className="space-y-2">
                  <p className="flex justify-between items-center text-gray-600">
                    <span>Group:</span>
                    <span className="font-medium capitalize">{selectedNode.group}</span>
                  </p>
                  <p className="flex justify-between items-center text-gray-600">
                    <span>Level:</span>
                    <span className="font-medium">{selectedNode.level}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">Select a node to view details</p>
          )}
          
          {!isMobile && (
            <button
              className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setSelectedNode(null)}
            >
              Close
            </button>
          )}
        </div>
      </div>

      {/* Responsive Legend */}
      <div className={`
        ${isMobile ? 'fixed bottom-4 left-4 right-4' : 'absolute top-24 right-4'} 
        bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg z-40
      `}>
        <div className={`flex ${isMobile ? 'justify-around' : 'flex-col space-y-3'}`}>
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
          // Mobile-specific props
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