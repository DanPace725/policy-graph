import React, { useRef, useEffect } from "react";
import { ForceGraph2D } from "react-force-graph";

const graphData = {
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
    { id: "Rural Economic Decline", group: "economic", level: 5 },
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
    { source: "Agricultural Labor Supply", target: "Rural Economic Decline" },
  ],
};

const Graph = () => {
  const graphRef = useRef();

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force("charge").strength(-500);
      graphRef.current.d3Force("link").distance(200);
    }
  }, []);

  return (
    <div>
      <h1>Policy Impact Graph</h1>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={8}
        linkDirectionalArrowRelPos={1}
        dagMode="td" // Set to "top-down" hierarchy
        dagLevelDistance={100} // Space out the levels more
        nodeRelSize={8} // Increase node size
        linkColor={() => "gray"} // Improve contrast
        linkWidth={1.5}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 14 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(label, node.x, node.y + 10);
        }}
      />
    </div>
  );
};

export default Graph;
