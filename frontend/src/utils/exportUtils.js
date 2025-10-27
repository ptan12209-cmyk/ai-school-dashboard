/**
 * Export Utilities
 * ================
 * Functions to export data to Excel and CSV formats
 */

import * as XLSX from 'xlsx';

/**
 * Export data to Excel file
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the file (without extension)
 * @param {String} sheetName - Name of the Excel sheet
 */
export const exportToExcel = (data, filename = 'export', sheetName = 'Sheet1') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Generate timestamp for unique filename
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}.xlsx`;

  // Write file
  XLSX.writeFile(workbook, fullFilename);
};

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the file (without extension)
 */
export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Convert data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Generate timestamp for unique filename
  const timestamp = new Date().toISOString().split('T')[0];
  const fullFilename = `${filename}_${timestamp}.csv`;

  // Write CSV file
  XLSX.writeFile(workbook, fullFilename, { bookType: 'csv' });
};

/**
 * Format students data for export
 * @param {Array} students - Array of student objects
 * @returns {Array} Formatted data for export
 */
export const formatStudentsForExport = (students) => {
  return students.map(student => ({
    'Student ID': student.student_id || student.id,
    'First Name': student.first_name,
    'Last Name': student.last_name,
    'Email': student.email,
    'Phone': student.phone || '-',
    'Date of Birth': student.date_of_birth ? new Date(student.date_of_birth).toLocaleDateString() : '-',
    'Gender': student.gender || '-',
    'Class': student.class?.name || '-',
    'Status': student.status || 'Active',
    'Parent Name': student.parent_name || '-',
    'Parent Phone': student.parent_phone || '-',
    'Parent Email': student.parent_email || '-',
    'Address': student.address || '-',
    'Enrollment Date': student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : '-',
    'Emergency Contact': student.emergency_contact || '-',
    'Medical Info': student.medical_info || '-',
  }));
};

/**
 * Format grades data for export
 * @param {Array} grades - Array of grade objects
 * @returns {Array} Formatted data for export
 */
export const formatGradesForExport = (grades) => {
  return grades.map(grade => ({
    'Student Name': grade.student ? `${grade.student.first_name} ${grade.student.last_name}` : 'N/A',
    'Student ID': grade.student?.student_id || 'N/A',
    'Course': grade.course?.name || 'N/A',
    'Course Code': grade.course?.course_code || 'N/A',
    'Grade Type': grade.grade_type,
    'Score': grade.score,
    'Grade Letter': getGradeLetter(grade.score),
    'Semester': grade.semester,
    'Weight (%)': grade.weight || 0,
    'Graded Date': grade.graded_date ? new Date(grade.graded_date).toLocaleDateString() : 'N/A',
    'Published': grade.is_published ? 'Yes' : 'No',
    'Notes': grade.notes || '-',
  }));
};

/**
 * Format attendance data for export
 * @param {Array} attendance - Array of attendance objects
 * @returns {Array} Formatted data for export
 */
export const formatAttendanceForExport = (attendance) => {
  return attendance.map(record => ({
    'Student Name': record.student ? `${record.student.first_name} ${record.student.last_name}` : 'N/A',
    'Student ID': record.student?.student_id || 'N/A',
    'Course': record.course?.name || 'N/A',
    'Date': record.date ? new Date(record.date).toLocaleDateString() : 'N/A',
    'Status': record.status,
    'Check In Time': record.check_in_time || '-',
    'Check Out Time': record.check_out_time || '-',
    'Notes': record.notes || '-',
  }));
};

/**
 * Helper function to get grade letter from score
 */
const getGradeLetter = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 75) return 'B';
  if (score >= 70) return 'C+';
  if (score >= 65) return 'C';
  if (score >= 60) return 'D';
  return 'F';
};

/**
 * Download template file for bulk upload
 * @param {String} type - Type of template ('students', 'grades', 'attendance')
 */
export const downloadTemplate = (type) => {
  let templateData = [];

  switch (type) {
    case 'students':
      templateData = [{
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john.doe@example.com',
        'phone': '0123456789',
        'date_of_birth': '2005-01-15',
        'gender': 'Male',
        'class_id': 'class-uuid-here',
        'parent_name': 'Jane Doe',
        'parent_phone': '0987654321',
        'parent_email': 'jane.doe@example.com',
        'address': '123 Main St',
        'enrollment_date': '2023-09-01',
      }];
      break;

    case 'grades':
      templateData = [{
        'student_id': 'student-uuid-here',
        'course_id': 'course-uuid-here',
        'score': '85',
        'grade_type': 'Assignment',
        'semester': '1',
        'graded_date': '2025-01-15',
        'weight': '10',
        'notes': 'Good work',
      }];
      break;

    case 'attendance':
      templateData = [{
        'student_id': 'student-uuid-here',
        'course_id': 'course-uuid-here',
        'date': '2025-01-15',
        'status': 'Present',
        'check_in_time': '08:00:00',
        'check_out_time': '16:00:00',
        'notes': '',
      }];
      break;

    default:
      console.error('Unknown template type');
      return;
  }

  exportToExcel(templateData, `${type}_template`, 'Template');
};

/**
 * Parse Excel file and return data as array of objects
 * @param {File} file - Excel file to parse
 * @returns {Promise<Array>} Parsed data
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false, // Keep values as strings for better control
          defval: '' // Default value for empty cells
        });

        resolve(jsonData);
      } catch (error) {
        reject(new Error('Failed to parse Excel file: ' + error.message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Validate and transform students data from Excel
 * @param {Array} data - Raw data from Excel
 * @returns {Object} { valid: Array, errors: Array }
 */
export const validateStudentsData = (data) => {
  const valid = [];
  const errors = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2; // +2 because Excel is 1-indexed and has header row
    const rowErrors = [];

    // Required fields validation
    if (!row.first_name || row.first_name.trim() === '') {
      rowErrors.push('First name is required');
    }
    if (!row.last_name || row.last_name.trim() === '') {
      rowErrors.push('Last name is required');
    }
    if (!row.email || row.email.trim() === '') {
      rowErrors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
      rowErrors.push('Invalid email format');
    }

    // Optional field validation
    if (row.phone && row.phone.length > 0 && !/^[0-9+\-() ]+$/.test(row.phone)) {
      rowErrors.push('Invalid phone format');
    }

    if (row.gender && !['Male', 'Female', 'Other'].includes(row.gender)) {
      rowErrors.push('Gender must be Male, Female, or Other');
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: rowNumber,
        data: row,
        errors: rowErrors
      });
    } else {
      // Transform data to match backend expectations
      valid.push({
        first_name: row.first_name.trim(),
        last_name: row.last_name.trim(),
        email: row.email.trim().toLowerCase(),
        phone: row.phone?.trim() || '',
        date_of_birth: row.date_of_birth || null,
        gender: row.gender || 'Other',
        class_id: row.class_id || null,
        parent_name: row.parent_name?.trim() || '',
        parent_phone: row.parent_phone?.trim() || '',
        parent_email: row.parent_email?.trim() || '',
        address: row.address?.trim() || '',
        enrollment_date: row.enrollment_date || new Date().toISOString().split('T')[0],
        status: row.status || 'Active'
      });
    }
  });

  return { valid, errors };
};

/**
 * Validate and transform grades data from Excel
 * @param {Array} data - Raw data from Excel
 * @returns {Object} { valid: Array, errors: Array }
 */
export const validateGradesData = (data) => {
  const valid = [];
  const errors = [];

  data.forEach((row, index) => {
    const rowNumber = index + 2;
    const rowErrors = [];

    // Required fields validation
    if (!row.student_id || row.student_id.trim() === '') {
      rowErrors.push('Student ID is required');
    }
    if (!row.course_id || row.course_id.trim() === '') {
      rowErrors.push('Course ID is required');
    }
    if (!row.score && row.score !== 0) {
      rowErrors.push('Score is required');
    } else {
      const score = parseFloat(row.score);
      if (isNaN(score) || score < 0 || score > 100) {
        rowErrors.push('Score must be between 0 and 100');
      }
    }

    if (!row.grade_type || row.grade_type.trim() === '') {
      rowErrors.push('Grade type is required');
    } else if (!['Quiz', 'Test', 'Assignment', 'Project', 'Midterm', 'Final', 'Participation'].includes(row.grade_type)) {
      rowErrors.push('Invalid grade type');
    }

    if (rowErrors.length > 0) {
      errors.push({
        row: rowNumber,
        data: row,
        errors: rowErrors
      });
    } else {
      valid.push({
        student_id: row.student_id.trim(),
        course_id: row.course_id.trim(),
        score: parseFloat(row.score),
        grade_type: row.grade_type.trim(),
        semester: row.semester || '1',
        graded_date: row.graded_date || new Date().toISOString().split('T')[0],
        weight: parseFloat(row.weight) || 10,
        notes: row.notes?.trim() || '',
        is_published: row.is_published === 'true' || row.is_published === true || false
      });
    }
  });

  return { valid, errors };
};
