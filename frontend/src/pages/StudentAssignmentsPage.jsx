/**
 * Student Assignments Page
 * ========================
 * Displays all assignments for the logged-in student
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
  PlayArrow as PlayArrowIcon
} from '@mui/icons-material';
import { fetchStudentAssignments } from '../redux/slices/assignmentSlice.js';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const StudentAssignmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assignments, loading, error } = useSelector((state) => state.assignments);

  useEffect(() => {
    dispatch(fetchStudentAssignments());
  }, [dispatch]);

  // Get status chip props
  const getStatusChip = (assignment) => {
    if (assignment.submission_status === 'graded') {
      return {
        label: `Đã chấm - ${assignment.submission_score}/${assignment.assignment?.total_points || 0}`,
        color: 'success',
        icon: <CheckCircleIcon />
      };
    }

    if (assignment.submission_status === 'submitted' || assignment.submission_status === 'grading') {
      return {
        label: 'Đang chấm điểm',
        color: 'info',
        icon: <ScheduleIcon />
      };
    }

    if (assignment.is_overdue) {
      return {
        label: 'Quá hạn',
        color: 'error',
        icon: <WarningIcon />
      };
    }

    return {
      label: 'Chưa nộp',
      color: 'warning',
      icon: <ScheduleIcon />
    };
  };

  // Get type label
  const getTypeLabel = (type) => {
    const labels = {
      homework: 'Bài tập',
      quiz: 'Kiểm tra',
      exam: 'Thi',
      practice: 'Luyện tập'
    };
    return labels[type] || type;
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Không giới hạn';
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
    } catch {
      return new Date(date).toLocaleString('vi-VN');
    }
  };

  // Handle start/continue assignment
  const handleStartAssignment = (assignmentId) => {
    navigate(`/assignments/${assignmentId}/take`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Bài Tập Của Tôi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Quản lý và làm bài tập, kiểm tra
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {assignments.length === 0 ? (
        <Alert severity="info">
          Chưa có bài tập nào được giao
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {assignments.map((assignment) => {
            const statusChip = getStatusChip(assignment);

            return (
              <Grid item xs={12} md={6} lg={4} key={assignment.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: assignment.is_overdue && assignment.submission_status === 'not_started'
                      ? '2px solid'
                      : 'none',
                    borderColor: 'error.main'
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Title */}
                    <Typography variant="h6" gutterBottom>
                      {assignment.title}
                    </Typography>

                    {/* Course */}
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {assignment.course?.name}
                    </Typography>

                    {/* Type & Status Chips */}
                    <Box sx={{ display: 'flex', gap: 1, my: 2, flexWrap: 'wrap' }}>
                      <Chip
                        label={getTypeLabel(assignment.type)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={statusChip.label}
                        size="small"
                        color={statusChip.color}
                        icon={statusChip.icon}
                      />
                    </Box>

                    {/* Due date */}
                    {assignment.due_date && (
                      <Typography variant="body2" color={assignment.is_overdue ? 'error' : 'text.secondary'}>
                        <ScheduleIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                        Hạn nộp: {formatDate(assignment.due_date)}
                      </Typography>
                    )}

                    {/* Points */}
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Điểm tối đa: {assignment.total_points}
                    </Typography>

                    {/* Progress for graded */}
                    {assignment.submission_status === 'graded' && assignment.submission_score !== null && (
                      <Box sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">Điểm số</Typography>
                          <Typography variant="caption">
                            {((assignment.submission_score / assignment.total_points) * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(assignment.submission_score / assignment.total_points) * 100}
                          color={
                            (assignment.submission_score / assignment.total_points) >= 0.8 ? 'success' :
                            (assignment.submission_score / assignment.total_points) >= 0.5 ? 'warning' :
                            'error'
                          }
                        />
                      </Box>
                    )}
                  </CardContent>

                  <CardActions>
                    {assignment.can_submit ? (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<PlayArrowIcon />}
                        onClick={() => handleStartAssignment(assignment.id)}
                        fullWidth
                      >
                        {assignment.submission_status === 'draft' ? 'Tiếp tục làm' : 'Bắt đầu'}
                      </Button>
                    ) : assignment.submission_status === 'graded' ? (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => navigate(`/assignments/${assignment.id}/result`)}
                        fullWidth
                      >
                        Xem kết quả
                      </Button>
                    ) : (
                      <Button size="small" disabled fullWidth>
                        {assignment.submission_status === 'submitted' || assignment.submission_status === 'grading'
                          ? 'Đang chờ chấm điểm'
                          : 'Đã quá hạn'}
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default StudentAssignmentsPage;
