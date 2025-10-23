/**
 * AttendancePage Component - Full CRUD Implementation
 * ====================================================
 * Attendance management page with Add/Edit/Delete/Toggle functionality
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  CircularProgress,
  Alert
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
import * as attendanceService from '../services/attendanceService';

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attendanceToDelete, setAttendanceToDelete] = useState(null);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    student_id: '',
    course_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    check_in_time: '',
    check_out_time: '',
    notes: ''
  });

  // Fetch attendance on component mount
  useEffect(() => {
    fetchAttendance();
  }, []);

  /**
   * Fetch all attendance records from API
   */
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await attendanceService.getAllAttendance();

      // Handle backend response structure: { success: true, data: { attendance: [...], pagination: {...} } }
      if (response && response.data) {
        const attendanceData = Array.isArray(response.data.attendance) ? response.data.attendance :
                              Array.isArray(response.data) ? response.data :
                              [];
        setAttendance(attendanceData);
      } else {
        setAttendance([]);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Failed to load attendance records. Please try again.');
      setAttendance([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Add Attendance
   */
  const handleAddAttendance = () => {
    setSelectedAttendance(null);
    setFormData({
      student_id: '',
      course_id: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      check_in_time: '',
      check_out_time: '',
      notes: ''
    });
    setDialogOpen(true);
  };

  /**
   * Handle Edit Attendance
   */
  const handleEditAttendance = async (attendanceId) => {
    try {
      setLoading(true);
      const response = await attendanceService.getAttendanceById(attendanceId);

      if (response && response.data) {
        setSelectedAttendance(response.data);
        setFormData({
          student_id: response.data.student_id || '',
          course_id: response.data.course_id || '',
          date: response.data.date ? response.data.date.split('T')[0] : new Date().toISOString().split('T')[0],
          status: response.data.status || 'Present',
          check_in_time: response.data.check_in_time || '',
          check_out_time: response.data.check_out_time || '',
          notes: response.data.notes || ''
        });
        setDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching attendance for edit:', error);
      setError('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Delete Attendance
   */
  const handleDeleteClick = (record) => {
    setAttendanceToDelete(record);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!attendanceToDelete) return;

    try {
      setLoading(true);
      await attendanceService.deleteAttendance(attendanceToDelete.id);
      setError('');
      fetchAttendance(); // Refresh list
      setDeleteDialogOpen(false);
      setAttendanceToDelete(null);
    } catch (error) {
      console.error('Error deleting attendance:', error);
      setError('Failed to delete attendance');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Toggle Status (Quick update)
   */
  const handleToggleStatus = async (attendanceId, currentStatus) => {
    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';

    try {
      await attendanceService.updateAttendance(attendanceId, { status: newStatus });
      setError('');
      fetchAttendance(); // Refresh list
    } catch (error) {
      console.error('Error toggling attendance status:', error);
      setError('Failed to update attendance status');
    }
  };

  /**
   * Handle Form Submit (Create or Update)
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.student_id || !formData.course_id || !formData.date) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (selectedAttendance) {
        // Update existing attendance
        await attendanceService.updateAttendance(selectedAttendance.id, formData);
      } else {
        // Create new attendance
        await attendanceService.markAttendance(formData);
      }

      setDialogOpen(false);
      fetchAttendance(); // Refresh list
    } catch (error) {
      console.error('Error saving attendance:', error);
      setError(selectedAttendance ? 'Failed to update attendance' : 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form input changes
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Filter attendance
   */
  const filteredAttendance = attendance.filter(record => {
    const matchesSearch =
      record.Student?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.Student?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.Course?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = !filterClass || record.Student?.Class?.name === filterClass;
    const matchesDate = !filterDate || (record.date && record.date.split('T')[0] === filterDate);
    const matchesStatus = !filterStatus || record.status === filterStatus;

    return matchesSearch && matchesClass && matchesDate && matchesStatus;
  });

  /**
   * Get status color
   */
  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return 'success';
      case 'Late':
        return 'warning';
      case 'Excused':
        return 'info';
      case 'Absent':
        return 'error';
      default:
        return 'default';
    }
  };

  /**
   * Get status icon
   */
  const getStatusIcon = (status) => {
    return status === 'Present' || status === 'Late' ? <PresentIcon /> : <AbsentIcon />;
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

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

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
                {Array.from(new Set(attendance.map(a => a.Student?.Class?.name).filter(Boolean))).map(className => (
                  <MenuItem key={className} value={className}>{className}</MenuItem>
                ))}
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
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
                <MenuItem value="Late">Late</MenuItem>
                <MenuItem value="Excused">Excused</MenuItem>
              </Select>
            </FormControl>
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
        {loading && !dialogOpen ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Quick Toggle</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAttendance.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No attendance records found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAttendance.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        {record.Student ? `${record.Student.first_name} ${record.Student.last_name}` : 'N/A'}
                      </TableCell>
                      <TableCell>{record.Course?.name || 'N/A'}</TableCell>
                      <TableCell>
                        {record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell>{record.check_in_time || '-'}</TableCell>
                      <TableCell>{record.check_out_time || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(record.status)}
                          label={record.status}
                          color={getStatusColor(record.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={record.status === 'Present'}
                              onChange={() => handleToggleStatus(record.id, record.status)}
                              size="small"
                            />
                          }
                          label=""
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => handleEditAttendance(record.id)}
                          color="primary"
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDeleteClick(record)}
                          color="error"
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Add/Edit Attendance Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {selectedAttendance ? 'Edit Attendance' : 'Mark Attendance'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Student ID"
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  required
                  helperText="Enter student UUID"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Course ID"
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleInputChange}
                  required
                  helperText="Enter course UUID"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    <MenuItem value="Present">Present</MenuItem>
                    <MenuItem value="Absent">Absent</MenuItem>
                    <MenuItem value="Late">Late</MenuItem>
                    <MenuItem value="Excused">Excused</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Check In Time"
                  name="check_in_time"
                  type="time"
                  value={formData.check_in_time}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  helperText="Optional"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Check Out Time"
                  name="check_out_time"
                  type="time"
                  value={formData.check_out_time}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  helperText="Optional"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  placeholder="Add any notes (e.g., reason for absence)"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : (selectedAttendance ? 'Update' : 'Mark')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Attendance Record</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this attendance record? This action cannot be undone.
          </Typography>
          {attendanceToDelete && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2">
                <strong>Student:</strong> {attendanceToDelete.Student ? `${attendanceToDelete.Student.first_name} ${attendanceToDelete.Student.last_name}` : 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Course:</strong> {attendanceToDelete.Course?.name || 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Date:</strong> {attendanceToDelete.date ? new Date(attendanceToDelete.date).toLocaleDateString() : 'N/A'}
              </Typography>
              <Typography variant="body2">
                <strong>Status:</strong> {attendanceToDelete.status}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendancePage;
