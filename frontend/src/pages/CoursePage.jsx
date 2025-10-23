// CoursePage.jsx - Course Management Page with Full CRUD
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
  message,
  Descriptions,
  Spin
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
  TeamOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import * as courseService from '../services/courseService';
import api from '../services/api.js';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [form] = Form.useForm();

  // Fetch courses, teachers, and classes on component mount
  useEffect(() => {
    fetchCourses();
    fetchTeachers();
    fetchClasses();
  }, []);

  /**
   * Fetch all courses from API
   */
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getAllCourses();

      // Handle backend response structure: { success: true, data: { courses: [...], pagination: {...} } }
      if (response && response.data) {
        const coursesData = Array.isArray(response.data.courses) ? response.data.courses :
                           Array.isArray(response.data) ? response.data :
                           [];
        setCourses(coursesData);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      message.error('Không thể tải danh sách khóa học');
      setCourses([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all teachers from API
   */
  const fetchTeachers = async () => {
    try {
      const response = await api.get('/teachers', { params: { limit: 1000 } });
      const data = response.data;

      if (data && data.data) {
        const teachersData = Array.isArray(data.data.teachers) ? data.data.teachers :
                            Array.isArray(data.data) ? data.data :
                            [];
        setTeachers(teachersData);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      message.error('Không thể tải danh sách giáo viên');
      setTeachers([]);
    }
  };

  /**
   * Fetch all classes from API
   */
  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes', { params: { limit: 1000 } });
      const data = response.data;

      if (data && data.data) {
        const classesData = Array.isArray(data.data.classes) ? data.data.classes :
                           Array.isArray(data.data) ? data.data :
                           [];
        setClasses(classesData);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      message.error('Không thể tải danh sách lớp học');
      setClasses([]);
    }
  };

  /**
   * Handle View Course
   */
  const handleViewCourse = async (courseId) => {
    try {
      setLoading(true);
      const response = await courseService.getCourseById(courseId);

      if (response && response.data) {
        setSelectedCourse(response.data);
        setViewModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      message.error('Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Edit Course
   */
  const handleEditCourse = async (courseId) => {
    try {
      setLoading(true);
      const response = await courseService.getCourseById(courseId);

      if (response && response.data) {
        setSelectedCourse(response.data);

        // Populate form with course data
        form.setFieldsValue({
          name: response.data.name,
          code: response.data.code,
          description: response.data.description,
          subject: response.data.subject,
          credits: response.data.credits,
          semester: response.data.semester,
          school_year: response.data.school_year,
          teacher_id: response.data.teacher_id,
          class_id: response.data.class_id
        });

        setModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching course for edit:', error);
      message.error('Không thể tải thông tin khóa học');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Delete Course
   */
  const handleDeleteCourse = (courseId, courseName) => {
    confirm({
      title: 'Xóa Khóa Học',
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xóa khóa học "${courseName}"? Hành động này không thể hoàn tác.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await courseService.deleteCourse(courseId);
          message.success('Xóa khóa học thành công!');
          fetchCourses(); // Refresh list
        } catch (error) {
          console.error('Error deleting course:', error);
          message.error('Không thể xóa khóa học');
        }
      }
    });
  };

  /**
   * Handle Add New Course
   */
  const handleAddCourse = () => {
    setSelectedCourse(null);
    form.resetFields();
    setModalVisible(true);
  };

  /**
   * Handle Form Submit (Create or Update)
   */
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (selectedCourse) {
        // Update existing course
        await courseService.updateCourse(selectedCourse.id, values);
        message.success('Cập nhật khóa học thành công!');
      } else {
        // Create new course
        await courseService.createCourse(values);
        message.success('Tạo khóa học thành công!');
      }

      setModalVisible(false);
      form.resetFields();
      setSelectedCourse(null);
      fetchCourses(); // Refresh list
    } catch (error) {
      console.error('Error saving course:', error);
      const errorMsg = error?.response?.data?.message || error?.message || '';
      message.error(errorMsg || (selectedCourse ? 'Không thể cập nhật khóa học' : 'Không thể tạo khóa học'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filter courses based on search and category
   */
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.subject?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filterCategory || course.subject === filterCategory;

    return matchesSearch && matchesCategory;
  });

  /**
   * Table columns configuration
   */
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
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => <Tag color="blue">{subject}</Tag>
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
      render: (semester) => <Text>{semester}</Text>
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      render: (credits) => <Text>{credits}</Text>
    },
    {
      title: 'School Year',
      dataIndex: 'school_year',
      key: 'school_year',
      render: (year) => <Text>{year}</Text>
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active) => (
        <Tag color={is_active ? 'green' : 'orange'}>
          {is_active ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleViewCourse(record.id)}
            title="View Details"
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditCourse(record.id)}
            title="Edit Course"
          />
          <Button
            type="text"
            icon={<DeleteOutlined />}
            size="small"
            danger
            onClick={() => handleDeleteCourse(record.id, record.name)}
            title="Delete Course"
          />
        </Space>
      )
    }
  ];

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
              value={courses.filter(c => c.is_active).length}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Subjects"
              value={new Set(courses.map(c => c.subject)).size}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Course List */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <Space>
            <Search
              placeholder="Search courses..."
              allowClear
              style={{ width: 300 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="Filter by subject"
              style={{ width: 150 }}
              value={filterCategory}
              onChange={(value) => setFilterCategory(value)}
              allowClear
            >
              {Array.from(new Set(courses.map(c => c.subject))).map(subject => (
                <Option key={subject} value={subject}>{subject}</Option>
              ))}
            </Select>
          </Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCourse}>
            Add Course
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredCourses}
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
        title={selectedCourse ? 'Chỉnh Sửa Khóa Học' : 'Thêm Khóa Học Mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setSelectedCourse(null);
        }}
        footer={null}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="Tên Khóa Học"
            rules={[{ required: true, message: 'Vui lòng nhập tên khóa học' }]}
          >
            <Input placeholder="Nhập tên khóa học" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Mã Khóa Học"
            rules={[
              { required: true, message: 'Vui lòng nhập mã khóa học' },
              { pattern: /^[A-Z0-9-]+$/, message: 'Mã chỉ chứa chữ in hoa, số và dấu gạch ngang' }
            ]}
          >
            <Input placeholder="VD: MATH301" />
          </Form.Item>

          <Form.Item name="description" label="Mô Tả">
            <Input.TextArea rows={3} placeholder="Mô tả khóa học" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="teacher_id"
                label="Giáo Viên"
                rules={[{ required: true, message: 'Vui lòng chọn giáo viên' }]}
              >
                <Select
                  placeholder="Chọn giáo viên"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {teachers.map(teacher => (
                    <Option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="class_id"
                label="Lớp Học"
                rules={[{ required: true, message: 'Vui lòng chọn lớp học' }]}
              >
                <Select
                  placeholder="Chọn lớp học"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {classes.map(cls => (
                    <Option key={cls.id} value={cls.id}>
                      {cls.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="subject"
                label="Môn Học"
                rules={[{ required: true, message: 'Vui lòng nhập môn học' }]}
              >
                <Input placeholder="VD: Toán học" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="credits"
                label="Số Tín Chỉ"
                rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
              >
                <Input type="number" placeholder="VD: 3" min="0.5" step="0.5" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="semester"
                label="Học Kỳ"
                rules={[{ required: true, message: 'Vui lòng chọn học kỳ' }]}
              >
                <Select placeholder="Chọn học kỳ">
                  <Option value="1">Học Kỳ 1</Option>
                  <Option value="2">Học Kỳ 2</Option>
                  <Option value="Full Year">Cả Năm</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="school_year"
                label="Năm Học"
                initialValue="2024-2025"
              >
                <Input placeholder="VD: 2024-2025" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                {selectedCourse ? 'Cập Nhật' : 'Tạo Mới'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setSelectedCourse(null);
              }}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Course Details Modal */}
      <Modal
        title="Course Details"
        open={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
          setSelectedCourse(null);
        }}
        footer={[
          <Button key="close" onClick={() => {
            setViewModalVisible(false);
            setSelectedCourse(null);
          }}>
            Close
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setViewModalVisible(false);
              handleEditCourse(selectedCourse?.id);
            }}
          >
            Edit Course
          </Button>
        ]}
        width={700}
      >
        {selectedCourse && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Course Name" span={2}>
              {selectedCourse.name}
            </Descriptions.Item>
            <Descriptions.Item label="Course Code">
              {selectedCourse.code}
            </Descriptions.Item>
            <Descriptions.Item label="Subject">
              {selectedCourse.subject}
            </Descriptions.Item>
            <Descriptions.Item label="Credits">
              {selectedCourse.credits}
            </Descriptions.Item>
            <Descriptions.Item label="Semester">
              {selectedCourse.semester}
            </Descriptions.Item>
            <Descriptions.Item label="School Year" span={2}>
              {selectedCourse.school_year}
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={2}>
              <Tag color={selectedCourse.is_active ? 'green' : 'orange'}>
                {selectedCourse.is_active ? 'Active' : 'Inactive'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {selectedCourse.description || 'No description available'}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(selectedCourse.created_at).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {new Date(selectedCourse.updated_at).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default CoursePage;
