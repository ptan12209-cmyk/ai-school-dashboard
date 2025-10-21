// StudentsPage.jsx - Main page for student management
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Button,
  Modal,
  Drawer,
  Space,
  Typography,
  Breadcrumb,
  Row,
  Col,
  Statistic,
  message,
  Result,
  Upload
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  DownloadOutlined,
  FileExcelOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

// Import components
import StudentList from '../components/students/StudentList';
import StudentForm from '../components/students/StudentForm';
import StudentCard from '../components/students/StudentCard';

// Import Redux actions and selectors
import {
  fetchStudents,
  clearMessages,
  importStudents
} from '../redux/slices/studentSlice';

import './StudentsPage.scss';

const { Title } = Typography;

const StudentsPage = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    students, 
    loading, 
    error, 
    successMessage, 
    currentPage, 
    pageSize, 
    totalStudents 
  } = useSelector(state => state.students);


  // Local state
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    avgGrade: 0
  });

  // Fetch students on mount
  useEffect(() => {
    dispatch(fetchStudents({ page: 1, pageSize: 10 }));
  }, [dispatch]);

  // Calculate statistics when students change
  useEffect(() => {
    const studentsArray = Array.isArray(students) ? students : [];
    if (studentsArray.length > 0) {
      const stats = {
        total: totalStudents || studentsArray.length,
        active: studentsArray.filter(s => s.status === 'Active').length,
        inactive: studentsArray.filter(s => s.status === 'Inactive').length,
        avgGrade: (studentsArray.reduce((sum, s) => sum + (s.gradeAverage || 0), 0) / studentsArray.length).toFixed(1)
      };
      setStatistics(stats);
    }
  }, [students, totalStudents]);

  // Show messages
  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      dispatch(clearMessages());
    }
    if (error) {
      message.error(error);
      dispatch(clearMessages());
    }
  }, [successMessage, error, dispatch]);

  // Handle add student
  const handleAddStudent = () => {
    setSelectedStudent(null);
    setFormMode('add');
    setFormModalVisible(true);
  };

  // Handle edit student
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setFormMode('edit');
    setFormModalVisible(true);
  };

  // Handle view student details
  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setDetailDrawerVisible(true);
  };

  // Handle form success
  const handleFormSuccess = () => {
    setFormModalVisible(false);
    setSelectedStudent(null);
    dispatch(fetchStudents({ 
      page: currentPage, 
      pageSize: pageSize 
    }));
  };

  // Handle print student
  const handlePrintStudent = (student) => {
    window.print(); // In real app, would generate PDF
    message.info('Print feature coming soon!');
  };

  // Handle import
  const handleImport = async (file) => {
    try {
      await dispatch(importStudents(file)).unwrap();
      setImportModalVisible(false);
      dispatch(fetchStudents({ page: 1, pageSize: 10 }));
    } catch (error) {
      message.error('Import failed');
    }
    return false; // Prevent default upload
  };

  // Render error state
  if (error && !loading && (!Array.isArray(students) || students.length === 0)) {
    return (
      <div className="students-page">
        <Result
          status="error"
          title="Failed to Load Students"
          subTitle={error}
          extra={[
            <Button 
              type="primary" 
              key="retry"
              onClick={() => dispatch(fetchStudents())}
            >
              Try Again
            </Button>
          ]}
        />
      </div>
    );
  }

  return (
    <div className="students-page">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <UserOutlined /> Students
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header */}
      <div className="page-header">
        <Title level={2}>
          <TeamOutlined /> Student Management
        </Title>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={statistics.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Students"
              value={statistics.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Inactive Students"
              value={statistics.inactive}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Average Grade"
              value={statistics.avgGrade}
              suffix="/10"
              precision={1}
              valueStyle={{ color: statistics.avgGrade >= 7 ? '#52c41a' : '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Student List */}
      <StudentList
        onAdd={handleAddStudent}
        onEdit={handleEditStudent}
        onView={handleViewStudent}
      />

      {/* Add/Edit Student Modal */}
      <Modal
        title={formMode === 'add' ? 'Add New Student' : 'Edit Student'}
        open={formModalVisible}
        onCancel={() => {
          setFormModalVisible(false);
          setSelectedStudent(null);
        }}
        footer={null}
        width={900}
        destroyOnClose
      >
        <StudentForm
          student={formMode === 'edit' ? selectedStudent : null}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setFormModalVisible(false);
            setSelectedStudent(null);
          }}
        />
      </Modal>

      {/* Student Detail Drawer */}
      <Drawer
        title="Student Details"
        placement="right"
        width={800}
        onClose={() => {
          setDetailDrawerVisible(false);
          setSelectedStudent(null);
        }}
        open={detailDrawerVisible}
      >
        {selectedStudent && (
          <StudentCard
            student={selectedStudent}
            onEdit={(student) => {
              setDetailDrawerVisible(false);
              handleEditStudent(student);
            }}
            onPrint={handlePrintStudent}
          />
        )}
      </Drawer>

      {/* Import Modal */}
      <Modal
        title="Import Students"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
      >
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Text>
              Upload an Excel or CSV file with student data
            </Typography.Text>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                // Download template
                message.info('Template download coming soon!');
              }}
            >
              Download Template
            </Button>
            <Upload.Dragger
              name="file"
              multiple={false}
              accept=".xlsx,.xls,.csv"
              beforeUpload={handleImport}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <FileExcelOutlined style={{ fontSize: 48, color: '#52c41a' }} />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for Excel (.xlsx, .xls) and CSV files
              </p>
            </Upload.Dragger>
          </Space>
        </Card>
      </Modal>
    </div>
  );
};

export default StudentsPage;
