/**
 * Teacher Assignments Page
 * =========================
 * Manage assignments for teachers
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
  Assignment as AssignmentIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { fetchAssignmentsByCourse, deleteAssignment, publishAssignment } from '../redux/slices/assignmentSlice.js';
import { fetchTeacherCourses, selectTeacherCourses } from '../redux/slices/teacherSlice.js';
import { getCurrentUser } from '../redux/slices/authSlice.js';
import { toast } from 'react-toastify';

const TeacherAssignmentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { assignments, loading, error } = useSelector((state) => state.assignments);
  const { user } = useSelector((state) => state.auth);
  const courses = useSelector(selectTeacherCourses);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState('');

  // Fetch user if not present (e.g. on reload)
  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUser());
    }
  }, [user, dispatch]);

  // Fetch teacher's courses on mount
  useEffect(() => {
    if (user?.data?.profile?.id) {
      dispatch(fetchTeacherCourses(user.data.profile.id));
    }
  }, [user, dispatch]);

  // Automatically select the first course
  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [courses, selectedCourseId]);

  useEffect(() => {
    if (selectedCourseId) {
      dispatch(fetchAssignmentsByCourse({ courseId: selectedCourseId }));
    }
  }, [selectedCourseId, dispatch]);

  const handleMenuClick = (event, assignment) => {
    setAnchorEl(event.currentTarget);
    setSelectedAssignment(assignment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAssignment(null);
  };

  const handleEdit = () => {
    navigate(`/assignments/${selectedAssignment.id}/edit`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      try {
        await dispatch(deleteAssignment(selectedAssignment.id)).unwrap();
        toast.success('Đã xóa bài tập');
      } catch (error) {
        toast.error('Không thể xóa bài tập');
      }
    }
    handleMenuClose();
  };

  const handlePublish = async () => {
    try {
      await dispatch(publishAssignment(selectedAssignment.id)).unwrap();
      toast.success('Đã phát hành bài tập và gửi thông báo');
    } catch (error) {
      toast.error('Không thể phát hành bài tập');
    }
    handleMenuClose();
  };

  const handleViewSubmissions = () => {
    navigate(`/assignments/${selectedAssignment.id}/grading`);
    handleMenuClose();
  };

  const handleViewStatistics = () => {
    navigate(`/assignments/${selectedAssignment.id}/statistics`);
    handleMenuClose();
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'default',
      published: 'success',
      closed: 'warning',
      archived: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Nháp',
      published: 'Đã phát hành',
      closed: 'Đã đóng',
      archived: 'Lưu trữ'
    };
    return labels[status] || status;
  };

  const getTypeLabel = (type) => {
    const labels = {
      homework: 'Bài tập',
      quiz: 'Kiểm tra',
      exam: 'Thi',
      practice: 'Luyện tập'
    };
    return labels[type] || type;
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Quản Lý Bài Tập
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Tạo và quản lý bài tập, kiểm tra
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel>Chọn khóa học</InputLabel>
            <Select
              value={selectedCourseId}
              label="Chọn khóa học"
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.name} {course.class ? `(${course.class.class_name})` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/assignments/create')}
          >
            Tạo bài tập mới
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {assignments.length === 0 ? (
        <Alert severity="info">
          Chưa có bài tập nào. Nhấn "Tạo bài tập mới" để bắt đầu.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {assignments.map((assignment) => (
            <Grid item xs={12} md={6} lg={4} key={assignment.id}>
              <Card>
                <CardContent>
                  {/* Title */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {assignment.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, assignment)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  {/* Type & Status */}
                  <Box sx={{ display: 'flex', gap: 1, my: 2 }}>
                    <Chip
                      label={getTypeLabel(assignment.type)}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={getStatusLabel(assignment.status)}
                      size="small"
                      color={getStatusColor(assignment.status)}
                    />
                  </Box>

                  {/* Stats */}
                  <Typography variant="body2" color="text.secondary">
                    Điểm: {assignment.total_points}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Số câu hỏi: {assignment.questions?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bài nộp: {assignment.total_submissions || 0}
                  </Typography>
                  {assignment.due_date && (
                    <Typography variant="body2" color="text.secondary">
                      Hạn: {new Date(assignment.due_date).toLocaleDateString('vi-VN')}
                    </Typography>
                  )}
                </CardContent>

                <CardActions>
                  {assignment.status === 'published' && (
                    <Button
                      size="small"
                      startIcon={<AssessmentIcon />}
                      onClick={() => navigate(`/assignments/${assignment.id}/grading`)}
                    >
                      Chấm bài
                    </Button>
                  )}
                  {assignment.status === 'draft' && (
                    <Button
                      size="small"
                      startIcon={<PublishIcon />}
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        handlePublish();
                      }}
                    >
                      Phát hành
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Chỉnh sửa
        </MenuItem>
        {selectedAssignment?.status === 'draft' && (
          <MenuItem onClick={handlePublish}>
            <PublishIcon sx={{ mr: 1 }} fontSize="small" />
            Phát hành
          </MenuItem>
        )}
        {selectedAssignment?.status === 'published' && (
          <MenuItem onClick={handleViewSubmissions}>
            <AssessmentIcon sx={{ mr: 1 }} fontSize="small" />
            Xem bài nộp
          </MenuItem>
        )}
        <MenuItem onClick={handleViewStatistics}>
          <AssessmentIcon sx={{ mr: 1 }} fontSize="small" />
          Thống kê
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Xóa
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default TeacherAssignmentsPage;
