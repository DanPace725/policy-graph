import React, { useRef, useEffect } from "react";
import { ForceGraph2D } from "react-force-graph";

const graphData = {
  nodes: [
    { id: "Government Restructuring", group: "policy" },
    { id: "Department of Government Efficiency (DOGE)", group: "initiative" },
    { id: "Trade Policy Changes", group: "policy" },
    { id: "US Tariffs on Steel & Aluminum", group: "impact" },
    { id: "Immigration Policy", group: "policy" },
    { id: "Executive Orders on Deportation", group: "impact" },
    { id: "Public Health Measures", group: "policy" },
    { id: "Bird Flu Testing Requirements", group: "impact" },
    { id: "USAID Downsizing", group: "impact" },
    { id: "Agency Disruptions (CDC, CMS, HHS)", group: "impact" },
    { id: "Loss of Institutional Memory", group: "impact" },
    { id: "Chinese Retaliatory Tariffs", group: "impact" },
    { id: "Canadian Oil Tariffs", group: "impact" },
    { id: "Labor Shortages", group: "impact" },
    { id: "Community Disruption", group: "impact" },
    { id: "Lost Grain Deals", group: "impact" },
    { id: "Agricultural Exports", group: "impact" },
    { id: "Farming Costs", group: "impact" },
    { id: "Agricultural Labor Supply", group: "impact" },
    { id: "Disease Surveillance", group: "impact" },
    { id: "Dairy Industry", group: "impact" },
    { id: "Market Disruptions", group: "economic" },
    { id: "Higher Consumer Prices", group: "economic" },
    { id: "Rural Economic Decline", group: "economic" },
  ],
  links: [
    { source: "Government Restructuring", target: "Department of Government Efficiency (DOGE)", label: "Creates" },
    { source: "Trade Policy Changes", target: "US Tariffs on Steel & Aluminum", label: "Implements" },
    { source: "Immigration Policy", target: "Executive Orders on Deportation", label: "Establishes" },
    { source: "Public Health Measures", target: "Bird Flu Testing Requirements", label: "Mandates" },
    { source: "Department of Government Efficiency (DOGE)", target: "USAID Downsizing", label: "Targets" },
    { source: "Department of Government Efficiency (DOGE)", target: "Agency Disruptions (CDC, CMS, HHS)", label: "Affects" },
    { source: "Department of Government Efficiency (DOGE)", target: "Loss of Institutional Memory", label: "Causes" },
    { source: "US Tariffs on Steel & Aluminum", target: "Chinese Retaliatory Tariffs", label: "Triggers" },
    { source: "US Tariffs on Steel & Aluminum", target: "Canadian Oil Tariffs", label: "Triggers" },
    { source: "Executive Orders on Deportation", target: "Labor Shortages", label: "Creates" },
    { source: "Executive Orders on Deportation", target: "Community Disruption", label: "Leads to" },
    { source: "USAID Downsizing", target: "Lost Grain Deals", label: "Cancels" },
    { source: "Chinese Retaliatory Tariffs", target: "Agricultural Exports", label: "Reduces" },
    { source: "Canadian Oil Tariffs", target: "Farming Costs", label: "Increases" },
    { source: "Labor Shortages", target: "Agricultural Labor Supply", label: "Affects" },
    { source: "Agency Disruptions (CDC, CMS, HHS)", target: "Disease Surveillance", label: "Weakens" },
    { source: "Bird Flu Testing Requirements", target: "Dairy Industry", label: "Affects" },
    { source: "Dairy Industry", target: "Market Disruptions", label: "Affects" },
    { source: "Dairy Industry", target: "Higher Consumer Prices", label: "Contributes to" },
    { source: "Dairy Industry", target: "Rural Economic Decline", label: "Part of" },
    { source: "Disease Surveillance", target: "Dairy Industry", label: "Impacts" },
    { source: "Loss of Institutional Memory", target: "Disease Surveillance", label: "Weakens" },
    { source: "Community Disruption", target: "Rural Economic Decline", label: "Affects" },
    { source: "Higher Consumer Prices", target: "Community Disruption", label: "Strains" },
    { source: "Agricultural Exports", target: "Market Disruptions", label: "Affects" },
    { source: "Farming Costs", target: "Higher Consumer Prices", label: "Affects" },
    { source: "Lost Grain Deals", target: "Rural Economic Decline", label: "Affects" },
    { source: "Agricultural Labor Supply", target: "Rural Economic Decline", label: "Affects" },
  ],
};

const Graph = () => {
  const graphRef = useRef();

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force("charge").strength(-200);
    }
  }, []);

  return (
    <div>
      <h1>Policy Impact Graph</h1>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        nodeLabel="id"
        linkLabel="label"
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "black";
          ctx.textAlign = "center";
          ctx.fillText(label, node.x, node.y + 8);
        }}
      />
    </div>
  );
};

export default Graph;
