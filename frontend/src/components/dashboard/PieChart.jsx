/**
 * PieChart.jsx - Dashboard Pie Chart Component
 * ===========================================
 * Displays distribution data using pie charts
 */

import React from 'react';
import { Card } from 'antd';
import { Pie } from '@ant-design/charts';

const PieChart = ({ 
  title = "Grade Distribution", 
  data = [], 
  angleField = 'value',
  colorField = 'type',
  height = 300 
}) => {
  // Mock data if none provided
  const mockData = [
    { type: 'A (90-100)', value: 25 },
    { type: 'B (80-89)', value: 35 },
    { type: 'C (70-79)', value: 25 },
    { type: 'D (60-69)', value: 10 },
    { type: 'F (0-59)', value: 5 },
  ];

  const chartData = data.length > 0 ? data : mockData;

  const config = {
    data: chartData,
    angleField: angleField,
    colorField: colorField,
    height: height,
    radius: 0.8,
    color: ['#52c41a', '#1890ff', '#faad14', '#fa8c16', '#f5222d'],
  };

  return (
    <Card title={title} style={{ height: height + 80 }}>
      <Pie {...config} />
    </Card>
  );
};

export default PieChart;
