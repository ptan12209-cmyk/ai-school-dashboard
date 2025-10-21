/**
 * ClassesPage Component
 * =====================
 * Manages school classes/homerooms
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Room as RoomIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    grade_level: 1,
    room_number: '',
    max_students: 30,
    school_year: '2024-2025',
    is_active: true
  });

  // Filter states
  const [filterGrade, setFilterGrade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
    fetchStats();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/classes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClasses(response.data.data.classes || response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/classes/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleOpenDialog = (classData = null) => {
    if (classData) {
      setEditingClass(classData);
      setFormData({
        name: classData.name || '',
        grade_level: classData.grade_level || 1,
        room_number: classData.room_number || '',
        max_students: classData.max_students || 30,
        school_year: classData.school_year || '2024-2025',
        is_active: classData.is_active !== undefined ? classData.is_active : true
      });
    } else {
      setEditingClass(null);
      setFormData({
        name: '',
        grade_level: 1,
        room_number: '',
        max_students: 30,
        school_year: '2024-2025',
        is_active: true
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingClass(null);
    setFormData({
      name: '',
      grade_level: 1,
      room_number: '',
      max_students: 30,
      school_year: '2024-2025',
      is_active: true
    });
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (editingClass) {
        // Update existing class
        await axios.put(`${API_URL}/classes/${editingClass.id}`, formData, config);
        setSuccess('Class updated successfully!');
      } else {
        // Create new class
        await axios.post(`${API_URL}/classes`, formData, config);
        setSuccess('Class created successfully!');
      }

      handleCloseDialog();
      fetchClasses();
      fetchStats();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving class:', err);
      setError(err.response?.data?.message || 'Failed to save class. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (classId) => {
    if (!window.confirm('Are you sure you want to delete this class?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/classes/${classId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Class deleted successfully!');
      fetchClasses();
      fetchStats();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting class:', err);
      setError('Failed to delete class. Please try again.');
      setTimeout(() => setError(null), 3000);
    }
  };

  // Filter classes
  const filteredClasses = classes.filter(cls => {
    const matchesGrade = !filterGrade || cls.grade_level === parseInt(filterGrade);
    const matchesSearch = !searchQuery ||
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cls.room_number && cls.room_number.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesSearch;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Classes Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Class
        </Button>
      </Box>

      {/* Alerts */}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Classes</Typography>
                </Box>
                <Typography variant="h4" color="primary">
                  {stats.total || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  <Typography variant="h6">Active Classes</Typography>
                </Box>
                <Typography variant="h4" color="success.main">
                  {stats.active || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PeopleIcon color="info" sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Students</Typography>
                </Box>
                <Typography variant="h4" color="info.main">
                  {stats.totalStudents || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <RoomIcon color="warning" sx={{ mr: 1 }} />
                  <Typography variant="h6">Avg Students/Class</Typography>
                </Box>
                <Typography variant="h4" color="warning.main">
                  {stats.active ? Math.round(stats.totalStudents / stats.active) : 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search by name or room"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter by Grade</InputLabel>
                <Select
                  value={filterGrade}
                  label="Filter by Grade"
                  onChange={(e) => setFilterGrade(e.target.value)}
                >
                  <MenuItem value="">All Grades</MenuItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                    <MenuItem key={grade} value={grade}>Grade {grade}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchQuery('');
                  setFilterGrade('');
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell><strong>Class Name</strong></TableCell>
                    <TableCell><strong>Grade Level</strong></TableCell>
                    <TableCell><strong>Room</strong></TableCell>
                    <TableCell><strong>Capacity</strong></TableCell>
                    <TableCell><strong>School Year</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell align="center"><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredClasses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        <Typography variant="body1" color="text.secondary" sx={{ py: 3 }}>
                          No classes found. Click "Add New Class" to create one.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredClasses.map((cls) => (
                      <TableRow key={cls.id} hover>
                        <TableCell>{cls.name}</TableCell>
                        <TableCell>
                          <Chip label={`Grade ${cls.grade_level}`} color="primary" size="small" />
                        </TableCell>
                        <TableCell>{cls.room_number || '-'}</TableCell>
                        <TableCell>{cls.max_students}</TableCell>
                        <TableCell>{cls.school_year}</TableCell>
                        <TableCell>
                          {cls.is_active ? (
                            <Chip icon={<CheckCircleIcon />} label="Active" color="success" size="small" />
                          ) : (
                            <Chip icon={<CancelIcon />} label="Inactive" color="default" size="small" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              size="small"
                              onClick={() => handleOpenDialog(cls)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDelete(cls.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingClass ? 'Edit Class' : 'Add New Class'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Class Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
              placeholder="e.g., Class 10A"
            />

            <FormControl fullWidth required>
              <InputLabel>Grade Level</InputLabel>
              <Select
                value={formData.grade_level}
                label="Grade Level"
                onChange={(e) => handleFormChange('grade_level', e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(grade => (
                  <MenuItem key={grade} value={grade}>Grade {grade}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Room Number"
              fullWidth
              value={formData.room_number}
              onChange={(e) => handleFormChange('room_number', e.target.value)}
              placeholder="e.g., Room 101"
            />

            <TextField
              label="Max Students"
              fullWidth
              type="number"
              required
              value={formData.max_students}
              onChange={(e) => handleFormChange('max_students', parseInt(e.target.value))}
              inputProps={{ min: 1, max: 100 }}
            />

            <TextField
              label="School Year"
              fullWidth
              required
              value={formData.school_year}
              onChange={(e) => handleFormChange('school_year', e.target.value)}
              placeholder="e.g., 2024-2025"
              helperText="Format: YYYY-YYYY"
            />

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.is_active}
                label="Status"
                onChange={(e) => handleFormChange('is_active', e.target.value)}
              >
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingClass ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassesPage;
