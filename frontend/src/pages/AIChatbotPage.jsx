/**
 * AI Chatbot Page
 * ===============
 * Interactive AI assistant for students and teachers
 */

import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Send as SendIcon,
  Psychology as AIIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';
import { format } from 'date-fns';

const AIChatbotPage = () => {
  const { user } = useSelector((state) => state.auth || {});
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggested questions based on role
  const suggestedQuestions = {
    student: [
      'Làm thế nào để cải thiện điểm số của tôi?',
      'Tôi nên tập trung học môn nào?',
      'Mẹo học tập hiệu quả là gì?',
      'Cách quản lý thời gian học tập?'
    ],
    teacher: [
      'Cách tạo bài giảng hấp dẫn?',
      'Phương pháp đánh giá học sinh hiệu quả?',
      'Xử lý học sinh yếu kém như thế nào?',
      'Gợi ý hoạt động lớp học?'
    ],
    admin: [
      'Phân tích hiệu suất trường học?',
      'Cách cải thiện chất lượng giảng dạy?',
      'Xu hướng giáo dục hiện đại?',
      'Quản lý giáo viên hiệu quả?'
    ]
  };

  const currentSuggestions = suggestedQuestions[user?.role] || suggestedQuestions.student;

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  // Send message
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/ai/chat', {
        message: input
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.data.message,
        timestamp: new Date(response.data.data.timestamp)
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg = error.response?.data?.message || 'Không thể kết nối với AI. Vui lòng thử lại.';
      toast.error(errorMsg);

      // Remove user message if AI fails
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  // Clear chat history
  const handleClear = async () => {
    try {
      await api.delete('/ai/chat/history');
      setMessages([]);
      toast.success('Đã xóa lịch sử trò chuyện');
    } catch (error) {
      toast.error('Không thể xóa lịch sử');
    }
  };

  // Handle suggested question click
  const handleSuggestionClick = (question) => {
    setInput(question);
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              <AIIcon sx={{ mr: 1, verticalAlign: 'middle', color: 'primary.main' }} />
              AI Assistant
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Trợ lý AI thông minh - Hỏi bất cứ điều gì về học tập!
            </Typography>
          </Box>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClear}
            disabled={messages.length === 0}
          >
            Xóa lịch sử
          </Button>
        </Box>
      </Box>

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
              <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Câu hỏi gợi ý:
            </Typography>
            <Grid container spacing={1}>
              {currentSuggestions.map((question, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Chip
                    label={question}
                    onClick={() => handleSuggestionClick(question)}
                    sx={{
                      width: '100%',
                      height: 'auto',
                      py: 1.5,
                      px: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontSize: '0.9rem',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '& .MuiChip-label': {
                        whiteSpace: 'normal',
                        textAlign: 'left'
                      }
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Chat Messages */}
      <Paper
        elevation={3}
        sx={{
          flex: 1,
          p: 3,
          mb: 2,
          overflow: 'auto',
          backgroundColor: '#f8f9fa'
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary'
            }}
          >
            <AIIcon sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6">Xin chào! Tôi có thể giúp gì cho bạn?</Typography>
            <Typography variant="body2">
              Hãy chọn câu hỏi gợi ý hoặc nhập câu hỏi của bạn bên dưới
            </Typography>
          </Box>
        ) : (
          messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  maxWidth: '70%',
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: message.role === 'user' ? 'primary.main' : 'secondary.main',
                    width: 36,
                    height: 36
                  }}
                >
                  {message.role === 'user' ? <PersonIcon /> : <AIIcon />}
                </Avatar>
                <Box>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      backgroundColor: message.role === 'user' ? 'primary.light' : 'white',
                      color: message.role === 'user' ? 'white' : 'text.primary',
                      borderRadius: 2
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                      }}
                    >
                      {message.content}
                    </Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 0.5,
                      ml: message.role === 'user' ? 0 : 1,
                      mr: message.role === 'user' ? 1 : 0,
                      textAlign: message.role === 'user' ? 'right' : 'left',
                      color: 'text.secondary'
                    }}
                  >
                    {format(new Date(message.timestamp), 'HH:mm')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))
        )}
        {loading && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Avatar sx={{ bgcolor: 'secondary.main', width: 36, height: 36 }}>
              <AIIcon />
            </Avatar>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" component="span" sx={{ ml: 2 }}>
                Đang suy nghĩ...
              </Typography>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input Area */}
      <Paper elevation={3} sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập câu hỏi của bạn..."
            disabled={loading}
            variant="outlined"
          />
          <Button
            variant="contained"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            sx={{ minWidth: '120px', height: '56px' }}
            endIcon={<SendIcon />}
          >
            Gửi
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Nhấn Enter để gửi, Shift+Enter để xuống dòng
        </Typography>
      </Paper>
    </Box>
  );
};

export default AIChatbotPage;
