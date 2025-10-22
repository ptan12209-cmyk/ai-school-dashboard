/**
 * Take Assignment Page
 * ====================
 * Student interface for completing assignments
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Stepper,
  Step,
  StepButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Chip,
  LinearProgress
} from '@mui/material';
import {
  Timer as TimerIcon,
  Send as SendIcon,
  Save as SaveIcon,
  NavigateBefore,
  NavigateNext
} from '@mui/icons-material';
import { fetchAssignment, startAssignment, submitAssignment } from '../redux/slices/assignmentSlice.js';
import { toast } from 'react-toastify';

const TakeAssignmentPage = () => {
  const { assignmentId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentAssignment, currentSubmission, loading } = useSelector((state) => state.assignments);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Submit handlers (defined before useEffect that uses them)
  const confirmSubmit = useCallback(async () => {
    if (!currentSubmission) return;

    setIsSubmitting(true);
    try {
      await dispatch(submitAssignment({
        submissionId: currentSubmission.id,
        answers
      })).unwrap();

      toast.success('Đã nộp bài thành công!');
      navigate('/assignments');
    } catch (error) {
      toast.error(error.message || 'Không thể nộp bài');
    } finally {
      setIsSubmitting(false);
      setShowSubmitDialog(false);
    }
  }, [currentSubmission, answers, dispatch, navigate]);

  const handleAutoSubmit = useCallback(async () => {
    toast.warning('Hết thời gian! Tự động nộp bài...');
    await confirmSubmit();
  }, [confirmSubmit]);

  // Fetch assignment and start submission
  useEffect(() => {
    const init = async () => {
      await dispatch(fetchAssignment(assignmentId));

      // Check if already has draft submission
      if (!currentSubmission) {
        await dispatch(startAssignment(assignmentId));
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignmentId, dispatch]);

  // Timer effect
  useEffect(() => {
    if (!currentAssignment?.time_limit || !currentSubmission?.started_at) return;

    const calculateTimeRemaining = () => {
      const startTime = new Date(currentSubmission.started_at);
      const now = new Date();
      const elapsed = Math.floor((now - startTime) / 1000); // seconds
      const limit = currentAssignment.time_limit * 60; // convert minutes to seconds
      return Math.max(0, limit - elapsed);
    };

    setTimeRemaining(calculateTimeRemaining());

    const timer = setInterval(() => {
      const remaining = calculateTimeRemaining();
      setTimeRemaining(remaining);

      if (remaining === 0) {
        handleAutoSubmit();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentAssignment, currentSubmission, handleAutoSubmit]);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle answer change
  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  // Handle navigation
  const handleNext = () => {
    if (currentQuestionIndex < currentAssignment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Handle submit
  const handleSubmit = async () => {
    setShowSubmitDialog(true);
  };

  // Loading state
  if (loading || !currentAssignment || !currentSubmission) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const questions = currentAssignment.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5">{currentAssignment.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {currentAssignment.course?.name} • {currentAssignment.total_points} điểm
            </Typography>
          </Box>

          {timeRemaining !== null && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" display="block">Thời gian còn lại</Typography>
              <Chip
                icon={<TimerIcon />}
                label={formatTime(timeRemaining)}
                color={timeRemaining < 300 ? 'error' : 'primary'}
                sx={{ fontSize: '1.2rem', p: 2 }}
              />
            </Box>
          )}
        </Box>

        {/* Progress */}
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Đã trả lời: {answeredCount}/{questions.length} câu
            </Typography>
            <Typography variant="body2">{progress.toFixed(0)}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Question Navigator */}
        <Paper sx={{ p: 2, width: 200, flexShrink: 0 }}>
          <Typography variant="subtitle2" gutterBottom>Danh sách câu hỏi</Typography>
          <Stepper nonLinear activeStep={currentQuestionIndex} orientation="vertical">
            {questions.map((q, index) => (
              <Step key={q.id} completed={answers[q.id] !== undefined}>
                <StepButton onClick={() => handleQuestionClick(index)}>
                  Câu {index + 1}
                </StepButton>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* Question Content */}
        <Paper sx={{ p: 3, flexGrow: 1 }}>
          {currentQuestion && (
            <>
              {/* Question Header */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Câu {currentQuestionIndex + 1} ({currentQuestion.points} điểm)
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {currentQuestion.question_text}
                </Typography>
              </Box>

              {/* Answer Input */}
              <Box sx={{ mb: 4 }}>
                {currentQuestion.question_type === 'multiple_choice' && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  >
                    {currentQuestion.options?.map((option, idx) => (
                      <FormControlLabel
                        key={option.id || idx}
                        value={option.id}
                        control={<Radio />}
                        label={option.text}
                      />
                    ))}
                  </RadioGroup>
                )}

                {currentQuestion.question_type === 'true_false' && (
                  <RadioGroup
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Đúng" />
                    <FormControlLabel value="false" control={<Radio />} label="Sai" />
                  </RadioGroup>
                )}

                {(currentQuestion.question_type === 'short_answer' || currentQuestion.question_type === 'fill_blank') && (
                  <TextField
                    fullWidth
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Nhập câu trả lời..."
                  />
                )}

                {currentQuestion.question_type === 'essay' && (
                  <TextField
                    fullWidth
                    multiline
                    rows={8}
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                    placeholder="Nhập câu trả lời..."
                  />
                )}
              </Box>

              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  startIcon={<NavigateBefore />}
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  Câu trước
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={() => toast.success('Đã lưu tự động')}
                >
                  Lưu nháp
                </Button>

                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    variant="contained"
                    color="success"
                    endIcon={<SendIcon />}
                    onClick={handleSubmit}
                  >
                    Nộp bài
                  </Button>
                ) : (
                  <Button
                    endIcon={<NavigateNext />}
                    onClick={handleNext}
                  >
                    Câu sau
                  </Button>
                )}
              </Box>
            </>
          )}
        </Paper>
      </Box>

      {/* Submit Confirmation Dialog */}
      <Dialog open={showSubmitDialog} onClose={() => !isSubmitting && setShowSubmitDialog(false)}>
        <DialogTitle>Xác nhận nộp bài</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Bạn đã trả lời {answeredCount}/{questions.length} câu hỏi.
            {answeredCount < questions.length && ' Các câu chưa trả lời sẽ không được tính điểm.'}
          </Alert>
          <Typography>
            Bạn có chắc chắn muốn nộp bài? Sau khi nộp, bạn sẽ không thể sửa đổi câu trả lời.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            onClick={confirmSubmit}
            variant="contained"
            color="success"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Nộp bài'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TakeAssignmentPage;
