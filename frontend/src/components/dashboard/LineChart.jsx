/**
 * LineChart.jsx - Dashboard Line Chart Component
 * =============================================
 * Displays trend data using line charts
 */

import React from 'react';
import { Card } from 'antd';
import { Line } from '@ant-design/charts';

const LineChart = ({ 
  title = "Performance Trend", 
  data = [], 
  xField = 'month', 
  yField = 'value',
  height = 300 
}) => {
  // Mock data if none provided
  const mockData = [
    { month: 'Jan', value: 85 },
    { month: 'Feb', value: 87 },
    { month: 'Mar', value: 82 },
    { month: 'Apr', value: 89 },
    { month: 'May', value: 91 },
    { month: 'Jun', value: 88 }
  ];

  const chartData = data.length > 0 ? data : mockData;

  const config = {
    data: chartData,
    xField,
    yField,
    height,
    smooth: true,
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    color: '#1890ff',
    lineStyle: {
      lineWidth: 3,
    },
  };

  return (
    <Card title={title} style={{ height: height + 80 }}>
      <Line {...config} />
    </Card>
  );
};

export default LineChart;
