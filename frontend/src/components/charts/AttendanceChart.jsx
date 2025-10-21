/**
 * AttendanceChart Component
 * ========================
 * Chart component for attendance data visualization
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const AttendanceChart = ({ data = [], title = "Attendance Overview" }) => {
  const theme = useTheme();

  // Default data if none provided
  const defaultData = [
    { name: 'Mon', present: 85, absent: 15 },
    { name: 'Tue', present: 90, absent: 10 },
    { name: 'Wed', present: 88, absent: 12 },
    { name: 'Thu', present: 92, absent: 8 },
    { name: 'Fri', present: 87, absent: 13 },
    { name: 'Sat', present: 95, absent: 5 },
    { name: 'Sun', present: 89, absent: 11 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Box sx={{ height: 300, width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="present"
                stroke={theme.palette.success.main}
                strokeWidth={2}
                name="Present"
              />
              <Line
                type="monotone"
                dataKey="absent"
                stroke={theme.palette.error.main}
                strokeWidth={2}
                name="Absent"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AttendanceChart;
