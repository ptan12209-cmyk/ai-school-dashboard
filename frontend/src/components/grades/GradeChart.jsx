/**
 * GradeChart.jsx - Grade Chart Component
 * =====================================
 * Displays grade data in various chart formats
 */

import React, { useState } from 'react';
import { Card, Select, Row, Col } from 'antd';
import { Line, Bar, Pie } from '@ant-design/charts';

const { Option } = Select;

const GradeChart = ({ grades = [], title = "Grade Analysis" }) => {
  const [chartType, setChartType] = useState('line');

  // Mock data if none provided
  const mockGrades = [
    { student: 'Alice', grade: 95, subject: 'Math', date: '2024-01-15' },
    { student: 'Bob', grade: 87, subject: 'Math', date: '2024-01-15' },
    { student: 'Carol', grade: 92, subject: 'Math', date: '2024-01-15' },
    { student: 'David', grade: 78, subject: 'Math', date: '2024-01-15' },
    { student: 'Eva', grade: 89, subject: 'Math', date: '2024-01-15' },
  ];

  const gradeData = grades.length > 0 ? grades : mockGrades;

  // Prepare data for different chart types
  const lineData = gradeData.map((item, index) => ({
    student: item.student,
    grade: item.grade,
    index: index + 1
  }));

  const barData = gradeData.map(item => ({
    student: item.student,
    grade: item.grade
  }));

  // Grade distribution for pie chart
  const gradeRanges = {
    'A (90-100)': gradeData.filter(g => g.grade >= 90).length,
    'B (80-89)': gradeData.filter(g => g.grade >= 80 && g.grade < 90).length,
    'C (70-79)': gradeData.filter(g => g.grade >= 70 && g.grade < 80).length,
    'D (60-69)': gradeData.filter(g => g.grade >= 60 && g.grade < 70).length,
    'F (0-59)': gradeData.filter(g => g.grade < 60).length,
  };

  const pieData = Object.entries(gradeRanges)
    .filter(([_, count]) => count > 0)
    .map(([range, count]) => ({
      type: range,
      value: count
    }));

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <Line
            data={lineData}
            xField="student"
            yField="grade"
            height={300}
            point={{
              size: 5,
              shape: 'diamond',
            }}
            smooth={true}
            color="#1890ff"
          />
        );
      
      case 'bar':
        return (
          <Bar
            data={barData}
            xField="grade"
            yField="student"
            height={300}
            color="#52c41a"
          />
        );
      
      case 'pie':
        return (
          <Pie
            data={pieData}
            angleField="value"
            colorField="type"
            height={300}
            radius={0.8}
            label={{
              type: 'outer',
              content: '{name} ({percentage})',
            }}
            color={['#52c41a', '#1890ff', '#faad14', '#fa8c16', '#f5222d']}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Card
      title={title}
      extra={
        <Select
          value={chartType}
          onChange={setChartType}
          style={{ width: 120 }}
        >
          <Option value="line">Line Chart</Option>
          <Option value="bar">Bar Chart</Option>
          <Option value="pie">Pie Chart</Option>
        </Select>
      }
    >
      {renderChart()}
    </Card>
  );
};

export default GradeChart;
