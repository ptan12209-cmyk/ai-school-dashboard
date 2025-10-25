import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  CircularProgress,
  FormHelperText,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api.js';

const AssignmentFormPage = () => {
  const navigate = useNavigate();
  const { assignmentId } = useParams();
  const location = useLocation();
  const isEdit = Boolean(assignmentId);

  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState('');
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    course_id: location.state?.courseId || '',
    type: 'homework',
    total_points: 100,
    due_date: '',
    instructions: '',
    attachments: '',
    status: 'draft',
    auto_grade: false,
    allow_late_submission: true,
    max_attempts: 1
  });

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await api.get('/courses', { params: { limit: 1000 } });
        const data = response.data;

        if (data && data.data) {
          const coursesData = Array.isArray(data.data.courses) ? data.data.courses :
                             Array.isArray(data.data) ? data.data :
                             [];
          setCourses(coursesData);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Không thể tải danh sách khóa học');
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch assignment data if editing
  useEffect(() => {
    if (isEdit && assignmentId) {
      const fetchAssignment = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/assignments/${assignmentId}`);
          const data = response.data;

          if (data && data.data) {
            const assignment = data.data;
            setFormData({
              title: assignment.title || '',
              description: assignment.description || '',
              course_id: assignment.course_id || '',
              type: assignment.type || 'homework',
              total_points: assignment.total_points || 100,
              due_date: assignment.due_date ? assignment.due_date.split('T')[0] : '',
              instructions: assignment.instructions || '',
              attachments: assignment.attachments || '',
              status: assignment.status || 'draft',
              auto_grade: assignment.auto_grade || false,
              allow_late_submission: assignment.allow_late_submission !== false,
              max_attempts: assignment.max_attempts || 1
            });
          }
        } catch (error) {
          console.error('Error fetching assignment:', error);
          setError('Không thể tải thông tin bài tập');
          toast.error('Không thể tải thông tin bài tập');
        } finally {
          setLoading(false);
        }
      };

      fetchAssignment();
    }
  }, [isEdit, assignmentId]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.course_id || !formData.due_date) {
      setError('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        total_points: parseFloat(formData.total_points),
        max_attempts: parseInt(formData.max_attempts)
      };

      if (isEdit) {
        await api.put(`/assignments/${assignmentId}`, submitData);
        toast.success('Đã cập nhật bài tập');
      } else {
        await api.post('/assignments', submitData);
        toast.success('Đã tạo bài tập mới');
      }

      navigate('/assignments/teacher');
    } catch (error) {
      console.error('Error saving assignment:', error);
      const errorMsg = error?.response?.data?.message || 'Không thể lưu bài tập';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          {isEdit ? 'Chỉnh Sửa Bài Tập' : 'Tạo Bài Tập Mới'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {isEdit ? 'Cập nhật thông tin bài tập' : 'Tạo bài tập mới cho học sinh'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Tiêu Đề Bài Tập"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề bài tập"
                />
              </Grid>

              {/* Course */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Khóa Học</InputLabel>
                  <Select
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    label="Khóa Học"
                    disabled={loadingCourses}
                  >
                    {courses.map((course) => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.name} ({course.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Type */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Loại Bài Tập</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Loại Bài Tập"
                  >
                    <MenuItem value="homework">Bài Tập</MenuItem>
                    <MenuItem value="quiz">Kiểm Tra</MenuItem>
                    <MenuItem value="exam">Thi</MenuItem>
                    <MenuItem value="practice">Luyện Tập</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Total Points */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Tổng Điểm"
                  name="total_points"
                  value={formData.total_points}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, step: 1 }}
                />
              </Grid>

              {/* Due Date */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="datetime-local"
                  label="Hạn Nộp"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Trạng Thái</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    label="Trạng Thái"
                  >
                    <MenuItem value="draft">Nháp</MenuItem>
                    <MenuItem value="published">Đã Phát Hành</MenuItem>
                    <MenuItem value="closed">Đã Đóng</MenuItem>
                  </Select>
                  <FormHelperText>
                    Chỉ bài tập "Đã phát hành" mới hiển thị cho học sinh
                  </FormHelperText>
                </FormControl>
              </Grid>

              {/* Max Attempts */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Số Lần Nộp Tối Đa"
                  name="max_attempts"
                  value={formData.max_attempts}
                  onChange={handleInputChange}
                  inputProps={{ min: 1, step: 1 }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Mô Tả"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả ngắn gọn về bài tập"
                />
              </Grid>

              {/* Instructions */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  label="Hướng Dẫn"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="Hướng dẫn chi tiết cho học sinh"
                />
              </Grid>

              {/* Attachments */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tài Liệu Đính Kèm (URL)"
                  name="attachments"
                  value={formData.attachments}
                  onChange={handleInputChange}
                  placeholder="https://example.com/file.pdf"
                  helperText="Nhập URL của tài liệu đính kèm"
                />
              </Grid>

              {/* Options */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.auto_grade}
                      onChange={handleInputChange}
                      name="auto_grade"
                    />
                  }
                  label="Tự Động Chấm Điểm"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.allow_late_submission}
                      onChange={handleInputChange}
                      name="allow_late_submission"
                    />
                  }
                  label="Cho Phép Nộp Muộn"
                />
              </Grid>

              {/* Actions */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    startIcon={<CancelIcon />}
                    onClick={() => navigate('/assignments/teacher')}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    disabled={loading}
                  >
                    {loading ? 'Đang lưu...' : (isEdit ? 'Cập Nhật' : 'Tạo Mới')}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AssignmentFormPage;
