// CoursePage.jsx - Course Management Page
import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Breadcrumb,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Avatar,
  Empty,
  Input,
  Select,
  Modal,
  Form,
  message
} from 'antd';
import {
  BookOutlined,
  HomeOutlined,
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  ClockCircleOutlined,
  TeamOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [form] = Form.useForm();

  // Mock data
  const mockCourses = [
    {
      id: 1,
      name: 'Advanced Mathematics',
      code: 'MATH301',
      description: 'Advanced calculus and linear algebra',
      teacher: 'Dr. Sarah Miller',
      students: 25,
      duration: '16 weeks',
      status: 'Active',
      category: 'Mathematics'
    },
    {
      id: 2,
      name: 'Physics Laboratory',
      code: 'PHYS201',
      description: 'Experimental physics and lab work',
      teacher: 'Prof. John Anderson',
      students: 20,
      duration: '12 weeks',
      status: 'Active',
      category: 'Science'
    },
    {
      id: 3,
      name: 'English Literature',
      code: 'ENG101',
      description: 'Classic and modern literature analysis',
      teacher: 'Ms. Emily Taylor',
      students: 30,
      duration: '14 weeks',
      status: 'Active',
      category: 'Language Arts'
    }
  ];

  useEffect(() => {
    setCourses(mockCourses);
  }, []);

  const columns = [
    {
      title: 'Course',
      key: 'course',
      render: (_, record) => (
        <Space>
          <Avatar icon={<BookOutlined />} style={{ backgroundColor: '#1890ff' }} />
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary">{record.code}</Text>
          </div>
        </Space>
      )
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher) => (
        <Space>
          <Avatar icon={<UserOutlined />} size="small" />
          <Text>{teacher}</Text>
        </Space>
      )
    },
    {
      title: 'Students',
      dataIndex: 'students',
      key: 'students',
      render: (count) => (
        <Space>
          <TeamOutlined />
          <Text>{count}</Text>
        </Space>
      )
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => (
        <Space>
          <ClockCircleOutlined />
          <Text>{duration}</Text>
        </Space>
      )
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'orange'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
          <Button type="text" icon={<DeleteOutlined />} size="small" danger />
        </Space>
      )
    }
  ];

  const handleAddCourse = () => {
    setSelectedCourse(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = (values) => {
    console.log('Course data:', values);
    message.success('Course saved successfully!');
    setModalVisible(false);
    form.resetFields();
  };

  return (
    <div className="course-page">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <BookOutlined /> Courses
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header */}
      <div className="page-header">
        <Title level={2}>
          <BookOutlined /> Course Management
        </Title>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Courses"
              value={courses.length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Courses"
              value={courses.filter(c => c.status === 'Active').length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Students"
              value={courses.reduce((sum, c) => sum + c.students, 0)}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Course List */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <Search
              placeholder="Search courses..."
              allowClear
              style={{ width: 300 }}
            />
            <Select placeholder="Filter by category" style={{ width: 150 }}>
              <Option value="Mathematics">Mathematics</Option>
              <Option value="Science">Science</Option>
              <Option value="Language Arts">Language Arts</Option>
            </Select>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCourse}>
            Add Course
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          locale={{
            emptyText: (
              <Empty
                description="No courses found"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button type="primary" onClick={handleAddCourse}>
                  Add First Course
                </Button>
              </Empty>
            )
          }}
        />
      </Card>

      {/* Add/Edit Course Modal */}
      <Modal
        title={selectedCourse ? 'Edit Course' : 'Add New Course'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Course Name"
            rules={[{ required: true, message: 'Please enter course name' }]}
          >
            <Input placeholder="Enter course name" />
          </Form.Item>
          
          <Form.Item
            name="code"
            label="Course Code"
            rules={[{ required: true, message: 'Please enter course code' }]}
          >
            <Input placeholder="e.g., MATH301" />
          </Form.Item>
          
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Course description" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="Mathematics">Mathematics</Option>
                  <Option value="Science">Science</Option>
                  <Option value="Language Arts">Language Arts</Option>
                  <Option value="Social Studies">Social Studies</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="duration"
                label="Duration"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <Input placeholder="e.g., 16 weeks" />
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Save Course
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CoursePage;
