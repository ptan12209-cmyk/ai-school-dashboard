/**
 * AIPredictionPage Component
 * ==========================
 * AI predictions and analytics page
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Alert,
  Button,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const AIPredictionPage = () => {
  const theme = useTheme();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Mock data
  const mockPredictions = [
    {
      id: 1,
      student: 'John Doe',
      prediction: 'At Risk',
      confidence: 85,
      factors: ['Low attendance', 'Declining grades', 'Missing assignments'],
      recommendation: 'Schedule parent meeting and provide additional support',
      priority: 'high',
    },
    {
      id: 2,
      student: 'Jane Smith',
      prediction: 'Excellent',
      confidence: 92,
      factors: ['High attendance', 'Consistent grades', 'Active participation'],
      recommendation: 'Consider advanced placement opportunities',
      priority: 'low',
    },
    {
      id: 3,
      student: 'Mike Johnson',
      prediction: 'Needs Attention',
      confidence: 78,
      factors: ['Inconsistent attendance', 'Average grades'],
      recommendation: 'Monitor closely and provide targeted support',
      priority: 'medium',
    },
  ];

  useEffect(() => {
    setPredictions(mockPredictions);
  }, []);

  const getPredictionColor = (prediction) => {
    const colors = {
      'Excellent': 'success',
      'Good': 'primary',
      'Needs Attention': 'warning',
      'At Risk': 'error',
    };
    return colors[prediction] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'error',
      'medium': 'warning',
      'low': 'success',
    };
    return colors[priority] || 'default';
  };

  const getPriorityIcon = (priority) => {
    const icons = {
      'high': <WarningIcon />,
      'medium': <TrendingUpIcon />,
      'low': <CheckCircleIcon />,
    };
    return icons[priority] || <TrendingUpIcon />;
  };

  const handleViewDetails = (prediction) => {
    setSelectedPrediction(prediction);
    setDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsOpen(false);
    setSelectedPrediction(null);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          AI Predictions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered insights and predictions for student performance
        </Typography>
      </Box>

      {/* AI Insights Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PsychologyIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Predictions</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {predictions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WarningIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">At Risk</Typography>
              </Box>
              <Typography variant="h4" color="error">
                {predictions.filter(p => p.prediction === 'At Risk').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Excellent</Typography>
              </Box>
              <Typography variant="h4" color="success.main">
                {predictions.filter(p => p.prediction === 'Excellent').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">Avg Confidence</Typography>
              </Box>
              <Typography variant="h4" color="info.main">
                {Math.round(predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Predictions List */}
      <Grid container spacing={3}>
        {predictions.map((prediction) => (
          <Grid item xs={12} md={6} lg={4} key={prediction.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{prediction.student}</Typography>
                  <Chip
                    icon={getPriorityIcon(prediction.priority)}
                    label={prediction.priority}
                    color={getPriorityColor(prediction.priority)}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Prediction
                  </Typography>
                  <Chip
                    label={prediction.prediction}
                    color={getPredictionColor(prediction.prediction)}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Confidence: {prediction.confidence}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={prediction.confidence}
                    color={prediction.confidence > 80 ? 'success' : prediction.confidence > 60 ? 'warning' : 'error'}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Key Factors
                  </Typography>
                  {prediction.factors.map((factor, index) => (
                    <Chip
                      key={index}
                      label={factor}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>

                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Recommendation:</strong> {prediction.recommendation}
                  </Typography>
                </Alert>

                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  onClick={() => handleViewDetails(prediction)}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Details Modal */}
      <Dialog
        open={detailsOpen}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedPrediction && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5">
                  Prediction Details: {selectedPrediction.student}
                </Typography>
                <Chip
                  icon={getPriorityIcon(selectedPrediction.priority)}
                  label={selectedPrediction.priority.toUpperCase()}
                  color={getPriorityColor(selectedPrediction.priority)}
                />
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Prediction Status
                </Typography>
                <Chip
                  label={selectedPrediction.prediction}
                  color={getPredictionColor(selectedPrediction.prediction)}
                  size="medium"
                  sx={{ mr: 2 }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Confidence Level: {selectedPrediction.confidence}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={selectedPrediction.confidence}
                  color={selectedPrediction.confidence > 80 ? 'success' : selectedPrediction.confidence > 60 ? 'warning' : 'error'}
                  sx={{ mt: 1, height: 8, borderRadius: 4 }}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Key Factors
                </Typography>
                <List>
                  {selectedPrediction.factors.map((factor, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText
                        primary={`• ${factor}`}
                        sx={{ color: 'text.primary' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="h6" gutterBottom>
                  Recommended Actions
                </Typography>
                <Alert severity="info" icon={<PsychologyIcon />}>
                  <Typography variant="body1">
                    {selectedPrediction.recommendation}
                  </Typography>
                </Alert>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="h6" gutterBottom>
                  Additional Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Student ID
                    </Typography>
                    <Typography variant="body1">
                      #{selectedPrediction.id}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Analysis Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDetails} variant="outlined">
                Close
              </Button>
              <Button onClick={handleCloseDetails} variant="contained" color="primary">
                Take Action
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default AIPredictionPage;
