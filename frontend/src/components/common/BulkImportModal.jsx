/**
 * Bulk Import Modal Component
 * ===========================
 * Reusable modal for importing Excel files with validation and error reporting
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  LinearProgress,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { parseExcelFile, downloadTemplate } from '../../utils/exportUtils';

const BulkImportModal = ({
  open,
  onClose,
  onImport,
  validateData,
  type = 'students', // 'students' or 'grades'
  title = 'Bulk Import'
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [parsedData, setParsedData] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [importResult, setImportResult] = useState(null);

  const steps = ['Upload File', 'Validate Data', 'Import'];

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setActiveStep(0);
      setParsedData(null);
      setValidationResult(null);
      setImportResult(null);
    }
  };

  const handleParse = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const data = await parseExcelFile(file);

      if (data.length === 0) {
        throw new Error('Excel file is empty');
      }

      setParsedData(data);
      setActiveStep(1);

      // Auto-validate
      const result = validateData(data);
      setValidationResult(result);

      if (result.errors.length === 0) {
        setActiveStep(1);
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!validationResult || validationResult.valid.length === 0) return;

    setLoading(true);
    setActiveStep(2);

    try {
      const result = await onImport(validationResult.valid);
      setImportResult({
        success: true,
        message: `Successfully imported ${validationResult.valid.length} ${type}`,
        ...result
      });
    } catch (error) {
      setImportResult({
        success: false,
        message: error.message || 'Import failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setActiveStep(0);
    setParsedData(null);
    setValidationResult(null);
    setImportResult(null);
    onClose();
  };

  const handleDownloadTemplate = () => {
    downloadTemplate(type);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">{title}</Typography>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleDownloadTemplate}
            size="small"
            variant="outlined"
          >
            Download Template
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Progress Stepper */}
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step 1: Upload File */}
        {activeStep === 0 && (
          <Box>
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: 'center',
                border: '2px dashed',
                borderColor: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <input
                id="file-upload-input"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <UploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {file ? file.name : 'Click to upload Excel file'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Supports .xlsx and .xls files
              </Typography>
            </Paper>

            <Alert severity="info" sx={{ mt: 2 }}>
              <AlertTitle>How to import</AlertTitle>
              <Typography variant="body2">
                1. Download the template file above<br />
                2. Fill in the data following the template format<br />
                3. Upload your completed Excel file<br />
                4. Review validation results and import
              </Typography>
            </Alert>
          </Box>
        )}

        {/* Step 2: Validation Results */}
        {activeStep === 1 && validationResult && (
          <Box>
            {/* Summary */}
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <Chip
                icon={<SuccessIcon />}
                label={`${validationResult.valid.length} Valid`}
                color="success"
                variant="outlined"
              />
              <Chip
                icon={<ErrorIcon />}
                label={`${validationResult.errors.length} Errors`}
                color="error"
                variant="outlined"
              />
            </Box>

            {/* Errors List */}
            {validationResult.errors.length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>Validation Errors</AlertTitle>
                <List dense>
                  {validationResult.errors.slice(0, 10).map((error, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemText
                        primary={`Row ${error.row}`}
                        secondary={error.errors.join(', ')}
                      />
                    </ListItem>
                  ))}
                  {validationResult.errors.length > 10 && (
                    <Typography variant="caption" color="text.secondary">
                      ... and {validationResult.errors.length - 10} more errors
                    </Typography>
                  )}
                </List>
              </Alert>
            )}

            {/* Success message */}
            {validationResult.valid.length > 0 && (
              <Alert severity="success">
                <AlertTitle>Ready to Import</AlertTitle>
                {validationResult.valid.length} {type} are valid and ready to be imported.
              </Alert>
            )}
          </Box>
        )}

        {/* Step 3: Import Results */}
        {activeStep === 2 && importResult && (
          <Alert severity={importResult.success ? 'success' : 'error'}>
            <AlertTitle>{importResult.success ? 'Import Successful' : 'Import Failed'}</AlertTitle>
            {importResult.message}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {activeStep === 0 ? 'Parsing Excel file...' : 'Importing data...'}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {importResult?.success ? 'Close' : 'Cancel'}
        </Button>

        {activeStep === 0 && file && (
          <Button
            onClick={handleParse}
            variant="contained"
            disabled={loading}
          >
            Validate Data
          </Button>
        )}

        {activeStep === 1 && validationResult && validationResult.valid.length > 0 && !importResult && (
          <Button
            onClick={handleImport}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? null : <UploadIcon />}
          >
            Import {validationResult.valid.length} {type}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BulkImportModal;
