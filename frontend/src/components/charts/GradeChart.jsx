/**
 * GradeChart Component
 * ===================
 * Chart component for grade distribution visualization
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const GradeChart = ({ 
  data = [], 
  title = "Grade Distribution",
  type = "bar" // "bar" or "pie"
}) => {
  const theme = useTheme();

  // Default data if none provided
  const defaultData = [
    { name: 'A+', value: 15, count: 15 },
    { name: 'A', value: 25, count: 25 },
    { name: 'B+', value: 20, count: 20 },
    { name: 'B', value: 18, count: 18 },
    { name: 'C+', value: 12, count: 12 },
    { name: 'C', value: 8, count: 8 },
    { name: 'D', value: 2, count: 2 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const COLORS = [
    theme.palette.success.main,
    theme.palette.primary.main,
    theme.palette.info.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.secondary.main,
    theme.palette.grey[500],
  ];

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === 'pie' ? (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill={theme.palette.primary.main} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default GradeChart;
