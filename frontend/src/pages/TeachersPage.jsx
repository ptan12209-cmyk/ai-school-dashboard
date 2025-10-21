// TeachersPage.jsx - Main page for teacher management
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
  Upload,
  Select,
  Form,
  List,
  Avatar,
  Tag,
  Divider
} from 'antd';
import {
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HomeOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  BankOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

// Import components
import TeacherList from '../components/teachers/TeacherList';
import TeacherForm from '../components/teachers/TeacherForm';
import TeacherCard from '../components/teachers/TeacherCard';

// Import Redux actions and selectors
import {
  fetchTeachers,
  fetchDepartments,
  fetchSubjects,
  clearMessages,
  importTeachers,
  assignClassToTeacher
} from '../redux/slices/teacherSlice';

import './TeachersPage.scss';

const { Title, Text } = Typography;
const { Option } = Select;

const TeachersPage = () => {
  const dispatch = useDispatch();
  
  // Redux state
  const { 
    teachers, 
    loading, 
    error, 
    successMessage, 
    currentPage, 
    pageSize, 
    totalTeachers
  } = useSelector(state => state.teachers);

  // Local state
  const [formModalVisible, setFormModalVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [assignClassModalVisible, setAssignClassModalVisible] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    avgExperience: 0,
    departments: 0
  });
  
  const [assignClassForm] = Form.useForm();

  // Fetch teachers and related data on mount
  useEffect(() => {
    dispatch(fetchTeachers({ page: 1, pageSize: 10 }));
    dispatch(fetchDepartments());
    dispatch(fetchSubjects());
  }, [dispatch]);

  // Calculate statistics when teachers change
  useEffect(() => {
    const teachersArray = Array.isArray(teachers) ? teachers : [];
    if (teachersArray.length > 0) {
      const stats = {
        total: totalTeachers || teachersArray.length,
        active: teachersArray.filter(t => t.status === 'Active').length,
        onLeave: teachersArray.filter(t => t.status === 'On Leave').length,
        avgExperience: (teachersArray.reduce((sum, t) => sum + (t.experience || 0), 0) / teachersArray.length).toFixed(1),
        departments: new Set(teachersArray.map(t => t.department)).size
      };
      setStatistics(stats);
    }
  }, [teachers, totalTeachers]);

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

  // Handle add teacher
  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setFormMode('add');
    setFormModalVisible(true);
  };

  // Handle edit teacher
  const handleEditTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setFormMode('edit');
    setFormModalVisible(true);
  };

  // Handle view teacher details
  const handleViewTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setDetailDrawerVisible(true);
  };

  // Handle assign class
  const handleAssignClass = (teacher) => {
    setSelectedTeacher(teacher);
    setAssignClassModalVisible(true);
  };

  // Handle assign class submit
  const handleAssignClassSubmit = async (values) => {
    try {
      await dispatch(assignClassToTeacher({
        teacherId: selectedTeacher.id,
        classId: values.classId
      })).unwrap();
      message.success('Class assigned successfully');
      setAssignClassModalVisible(false);
      assignClassForm.resetFields();
      dispatch(fetchTeachers({ 
        page: currentPage, 
        pageSize: pageSize 
      }));
    } catch (error) {
      message.error('Failed to assign class');
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    setFormModalVisible(false);
    setSelectedTeacher(null);
    dispatch(fetchTeachers({ 
      page: currentPage, 
      pageSize: pageSize 
    }));
  };

  // Handle print teacher
  const handlePrintTeacher = (teacher) => {
    window.print(); // In real app, would generate PDF
    message.info('Print feature coming soon!');
  };



  // Handle import
  const handleImport = async (file) => {
    try {
      await dispatch(importTeachers(file)).unwrap();
      setImportModalVisible(false);
      dispatch(fetchTeachers({ page: 1, pageSize: 10 }));
    } catch (error) {
      message.error('Import failed');
    }
    return false; // Prevent default upload
  };

  // Get department statistics
  const getDepartmentStats = () => {
    const teachersArray = Array.isArray(teachers) ? teachers : [];
    const deptCounts = {};
    teachersArray.forEach(teacher => {
      const dept = teacher.department || 'Unassigned';
      deptCounts[dept] = (deptCounts[dept] || 0) + 1;
    });
    return Object.entries(deptCounts).map(([dept, count]) => ({
      department: dept,
      count
    }));
  };

  // Render error state
  if (error && !loading && (!Array.isArray(teachers) || teachers.length === 0)) {
    return (
      <div className="teachers-page">
        <Result
          status="error"
          title="Failed to Load Teachers"
          subTitle={error}
          extra={[
            <Button 
              type="primary" 
              key="retry"
              onClick={() => dispatch(fetchTeachers())}
            >
              Try Again
            </Button>
          ]}
        />
      </div>
    );
  }

  return (
    <div className="teachers-page">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <UserOutlined /> Teachers
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header */}
      <div className="page-header">
        <Title level={2}>
          <TeamOutlined /> Teacher Management
        </Title>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Teachers"
              value={statistics.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Active Teachers"
              value={statistics.active}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="On Leave"
              value={statistics.onLeave}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg Experience"
              value={statistics.avgExperience}
              suffix="years"
              prefix={<TrophyOutlined />}
              precision={1}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Department Distribution */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card 
            title={
              <Space>
                <BankOutlined />
                <span>Department Distribution</span>
              </Space>
            }
          >
            <Row gutter={[16, 16]}>
              {getDepartmentStats().map((dept) => (
                <Col xs={12} sm={8} md={6} lg={4} key={dept.department}>
                  <Card size="small" hoverable>
                    <Statistic
                      title={dept.department}
                      value={dept.count}
                      suffix="teachers"
                      valueStyle={{ fontSize: 20 }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Teacher List */}
      <TeacherList
        onAdd={handleAddTeacher}
        onEdit={handleEditTeacher}
        onView={handleViewTeacher}
        onAssignClass={handleAssignClass}
      />

      {/* Add/Edit Teacher Modal */}
      <Modal
        title={formMode === 'add' ? 'Add New Teacher' : 'Edit Teacher'}
        open={formModalVisible}
        onCancel={() => {
          setFormModalVisible(false);
          setSelectedTeacher(null);
        }}
        footer={null}
        width={1000}
        destroyOnClose
      >
        <TeacherForm
          teacher={formMode === 'edit' ? selectedTeacher : null}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setFormModalVisible(false);
            setSelectedTeacher(null);
          }}
        />
      </Modal>

      {/* Teacher Detail Drawer */}
      <Drawer
        title="Teacher Details"
        placement="right"
        width={900}
        onClose={() => {
          setDetailDrawerVisible(false);
          setSelectedTeacher(null);
        }}
        open={detailDrawerVisible}
      >
        {selectedTeacher && (
          <TeacherCard
            teacher={selectedTeacher}
            onEdit={(teacher) => {
              setDetailDrawerVisible(false);
              handleEditTeacher(teacher);
            }}
            onPrint={handlePrintTeacher}
          />
        )}
      </Drawer>

      {/* Assign Class Modal */}
      <Modal
        title={`Assign Class to ${selectedTeacher?.name}`}
        open={assignClassModalVisible}
        onCancel={() => {
          setAssignClassModalVisible(false);
          setSelectedTeacher(null);
          assignClassForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        {selectedTeacher && (
          <div>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Space>
                <Avatar src={selectedTeacher.avatar} icon={<UserOutlined />} />
                <div>
                  <Text strong>{selectedTeacher.name}</Text>
                  <br />
                  <Text type="secondary">{selectedTeacher.department}</Text>
                </div>
              </Space>
            </Card>
            
            <Form
              form={assignClassForm}
              layout="vertical"
              onFinish={handleAssignClassSubmit}
            >
              <Form.Item
                name="classId"
                label="Select Class"
                rules={[{ required: true, message: 'Please select a class' }]}
              >
                <Select placeholder="Select a class to assign" size="large">
                  <Option value="1">Class 10A - Mathematics</Option>
                  <Option value="2">Class 10B - Mathematics</Option>
                  <Option value="3">Class 11A - Mathematics</Option>
                  <Option value="4">Class 11B - Mathematics</Option>
                  <Option value="5">Class 12A - Mathematics</Option>
                  <Option value="6">Class 12B - Mathematics</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="subject"
                label="Subject to Teach"
                rules={[{ required: true, message: 'Please select a subject' }]}
              >
                <Select placeholder="Select subject" size="large">
                  {selectedTeacher.subjects?.map((subject) => (
                    <Option key={subject} value={subject}>
                      {subject}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    Assign Class
                  </Button>
                  <Button onClick={() => {
                    setAssignClassModalVisible(false);
                    assignClassForm.resetFields();
                  }}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>

            {/* Current Classes */}
            {selectedTeacher.classes && selectedTeacher.classes.length > 0 && (
              <>
                <Divider>Current Classes</Divider>
                <List
                  size="small"
                  dataSource={selectedTeacher.classes}
                  renderItem={item => (
                    <List.Item>
                      <Tag color="blue">{item}</Tag>
                    </List.Item>
                  )}
                />
              </>
            )}
          </div>
        )}
      </Modal>

      {/* Import Modal */}
      <Modal
        title="Import Teachers"
        open={importModalVisible}
        onCancel={() => setImportModalVisible(false)}
        footer={null}
      >
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Typography.Text>
              Upload an Excel or CSV file with teacher data
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

export default TeachersPage;
