/**
 * AttendancePage Component
 * =======================
 * Attendance management page
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
} from '@mui/icons-material';

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // Mock data
  const mockAttendance = [
    {
      id: 1,
      student: 'John Doe',
      class: '10A',
      date: '2024-01-15',
      status: 'present',
      time: '09:00',
    },
    {
      id: 2,
      student: 'Jane Smith',
      class: '10B',
      date: '2024-01-15',
      status: 'absent',
      time: '09:00',
    },
    {
      id: 3,
      student: 'Mike Johnson',
      class: '9A',
      date: '2024-01-15',
      status: 'present',
      time: '09:00',
    },
  ];

  useEffect(() => {
    setAttendance(mockAttendance);
  }, []);

  const filteredAttendance = attendance.filter(record =>
    record.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.class.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(record =>
    filterClass === '' || record.class === filterClass
  ).filter(record =>
    filterDate === '' || record.date === filterDate
  );

  const getStatusColor = (status) => {
    return status === 'present' ? 'success' : 'error';
  };

  const getStatusIcon = (status) => {
    return status === 'present' ? <PresentIcon /> : <AbsentIcon />;
  };

  const handleAddAttendance = () => {
    console.log('Add attendance clicked');
  };

  const handleEditAttendance = (attendanceId) => {
    console.log('Edit attendance clicked:', attendanceId);
  };

  const handleDeleteAttendance = (attendanceId) => {
    console.log('Delete attendance clicked:', attendanceId);
  };

  const handleToggleStatus = (attendanceId) => {
    setAttendance(prev => prev.map(record => 
      record.id === attendanceId 
        ? { ...record, status: record.status === 'present' ? 'absent' : 'present' }
        : record
    ));
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Attendance
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage student attendance records
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search attendance..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1, minWidth: 200 }}
            />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Class</InputLabel>
              <Select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                label="Class"
              >
                <MenuItem value="">All Classes</MenuItem>
                <MenuItem value="9A">9A</MenuItem>
                <MenuItem value="9B">9B</MenuItem>
                <MenuItem value="10A">10A</MenuItem>
                <MenuItem value="10B">10B</MenuItem>
              </Select>
            </FormControl>
            <TextField
              type="date"
              label="Date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ minWidth: 150 }}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddAttendance}
            >
              Mark Attendance
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.student}</TableCell>
                  <TableCell>{record.class}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.time}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        icon={getStatusIcon(record.status)}
                        label={record.status}
                        color={getStatusColor(record.status)}
                        size="small"
                      />
                      <FormControlLabel
                        control={
                          <Switch
                            checked={record.status === 'present'}
                            onChange={() => handleToggleStatus(record.id)}
                            size="small"
                          />
                        }
                        label=""
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEditAttendance(record.id)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteAttendance(record.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default AttendancePage;
