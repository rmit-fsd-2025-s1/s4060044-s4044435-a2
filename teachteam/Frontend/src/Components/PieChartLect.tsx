//Using recharts for this Pie Chart Component
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Label,
} from "recharts";

// Incoming data defined props
interface PieProp {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

//PieChartLect Component - renders the selection distribution as a pie chart
const PieChartLect = ({ data }: PieProp) => {
  return (
    <div className="chart-container">
      {/* Chart heading */}
      <div className="chart-title">Selction Chart</div>
      {/* Recharts PieChart component with custom settings */}
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          fill="#8884d8"
          label
        >
          {/*Render a colored slice for each data entry */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        {/*Add tooltip on hover */}
        <Tooltip></Tooltip>
        <Label></Label>
      </PieChart>
    </div>
  );
};
export default PieChartLect;
