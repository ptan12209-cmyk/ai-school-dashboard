/**
 * BarChart.jsx - Dashboard Bar Chart Component
 * ===========================================
 * Displays categorical data using bar charts
 */

import React from 'react';
import { Card } from 'antd';
import { Bar } from '@ant-design/charts';

const BarChart = ({ 
  title = "Subject Performance", 
  data = [], 
  xField = 'value',
  yField = 'subject',
  height = 300 
}) => {
  // Mock data if none provided
  const mockData = [
    { subject: 'Math', value: 92 },
    { subject: 'Science', value: 88 },
    { subject: 'History', value: 85 },
    { subject: 'English', value: 90 },
    { subject: 'Art', value: 95 },
  ];

  const chartData = data.length > 0 ? data : mockData;

  const config = {
    data: chartData,
    xField: xField,
    yField: yField,
    height: height,
    color: ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'],
  };

  return (
    <Card title={title} style={{ height: height + 80 }}>
      <Bar {...config} />
    </Card>
  );
};

export default BarChart;
