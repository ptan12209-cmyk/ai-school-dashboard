/**
 * GradesPage Component
 * ====================
 * Grades management page
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
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const GradesPage = () => {
  const [grades, setGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');

  // Mock data
  const mockGrades = [
    {
      id: 1,
      student: 'John Doe',
      subject: 'Mathematics',
      class: '10A',
      grade: 'A',
      score: 85,
      date: '2024-01-15',
    },
    {
      id: 2,
      student: 'Jane Smith',
      subject: 'Physics',
      class: '10B',
      grade: 'A+',
      score: 92,
      date: '2024-01-16',
    },
    {
      id: 3,
      student: 'Mike Johnson',
      subject: 'English',
      class: '9A',
      grade: 'B+',
      score: 78,
      date: '2024-01-17',
    },
  ];

  useEffect(() => {
    setGrades(mockGrades);
  }, []);

  const filteredGrades = grades.filter(grade =>
    grade.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grade.class.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(grade =>
    filterClass === '' || grade.class === filterClass
  );

  const getGradeColor = (grade) => {
    const colors = {
      'A+': 'success',
      'A': 'success',
      'B+': 'primary',
      'B': 'primary',
      'C+': 'warning',
      'C': 'warning',
      'D': 'error',
    };
    return colors[grade] || 'default';
  };

  const handleAddGrade = () => {
    console.log('Add grade clicked');
  };

  const handleEditGrade = (gradeId) => {
    console.log('Edit grade clicked:', gradeId);
  };

  const handleDeleteGrade = (gradeId) => {
    console.log('Delete grade clicked:', gradeId);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Grades
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage student grades and academic performance
        </Typography>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              placeholder="Search grades..."
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
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddGrade}
            >
              Add Grade
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Grade</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredGrades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell>{grade.student}</TableCell>
                  <TableCell>{grade.subject}</TableCell>
                  <TableCell>{grade.class}</TableCell>
                  <TableCell>
                    <Chip
                      label={grade.grade}
                      color={getGradeColor(grade.grade)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{grade.score}</TableCell>
                  <TableCell>{grade.date}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleEditGrade(grade.id)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteGrade(grade.id)}
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

export default GradesPage;
