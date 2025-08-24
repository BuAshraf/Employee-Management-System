import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const DashboardChart = ({ byDepartment }) => {
  const deptData = Object.entries(byDepartment || {}).map(([name, value]) => ({
    name,
    value
  }));

  const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={deptData}
        dataKey="value"
        outerRadius={100}
        fill="#8884d8"
        label
      >
        {deptData.map((_, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default DashboardChart;
