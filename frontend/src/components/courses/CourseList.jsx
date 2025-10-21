/**
 * CourseList.jsx - Course List Component
 * =====================================
 * Displays list of courses with search and filter functionality
 */

import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Space,
  Avatar,
  Tooltip,
  Popconfirm,
  Progress 
} from 'antd';
import { 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  BookOutlined,
  UserOutlined 
} from '@ant-design/icons';

const { Option } = Select;

const CourseList = ({ 
  courses = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  onRefresh 
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  // Mock data if none provided
  const mockCourses = [
    {
      id: 1,
      name: 'Advanced Mathematics',
      code: 'MATH301',
      department: 'Mathematics',
      level: 'Advanced',
      credits: 4,
      duration: '1 Semester',
      instructor: 'Dr. Sarah Miller',
      instructorId: 1,
      enrolledStudents: 28,
      maxStudents: 30,
      status: 'active',
      description: 'Advanced calculus and linear algebra'
    },
    {
      id: 2,
      name: 'Physics Fundamentals',
      code: 'PHY101',
      department: 'Science',
      level: 'Beginner',
      credits: 3,
      duration: '1 Semester',
      instructor: 'Prof. John Anderson',
      instructorId: 2,
      enrolledStudents: 25,
      maxStudents: 35,
      status: 'active',
      description: 'Introduction to basic physics concepts'
    },
    {
      id: 3,
      name: 'English Literature',
      code: 'ENG201',
      department: 'Languages',
      level: 'Intermediate',
      credits: 3,
      duration: '1 Semester',
      instructor: 'Ms. Emily Taylor',
      instructorId: 3,
      enrolledStudents: 22,
      maxStudents: 25,
      status: 'active',
      description: 'Study of classic and modern literature'
    }
  ];

  const courseData = courses.length > 0 ? courses : mockCourses;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'draft':
        return 'orange';
      case 'completed':
        return 'blue';
      default:
        return 'default';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'green';
      case 'Intermediate':
        return 'orange';
      case 'Advanced':
        return 'red';
      default:
        return 'default';
    }
  };

  const getEnrollmentColor = (enrolled, max) => {
    const percentage = (enrolled / max) * 100;
    if (percentage >= 90) return '#f5222d';
    if (percentage >= 75) return '#faad14';
    return '#52c41a';
  };

  const columns = [
    {
      title: 'Course',
      key: 'course',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()) ||
        record.code.toLowerCase().includes(value.toLowerCase()),
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{record.name}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            <BookOutlined style={{ marginRight: 4 }} />
            {record.code}
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      filteredValue: selectedDepartment ? [selectedDepartment] : null,
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      filteredValue: selectedLevel ? [selectedLevel] : null,
      onFilter: (value, record) => record.level === value,
      render: (level) => (
        <Tag color={getLevelColor(level)}>{level}</Tag>
      ),
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
      render: (instructor) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" style={{ backgroundColor: '#1890ff', marginRight: 8 }}>
            {instructor.split(' ').map(n => n.charAt(0)).join('')}
          </Avatar>
          <span>{instructor}</span>
        </div>
      ),
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
      align: 'center',
      sorter: (a, b) => a.credits - b.credits,
    },
    {
      title: 'Enrollment',
      key: 'enrollment',
      align: 'center',
      render: (_, record) => {
        const percentage = (record.enrolledStudents / record.maxStudents) * 100;
        return (
          <div>
            <div style={{ 
              fontSize: '14px', 
              fontWeight: 'bold',
              color: getEnrollmentColor(record.enrolledStudents, record.maxStudents)
            }}>
              {record.enrolledStudents}/{record.maxStudents}
            </div>
            <Progress 
              percent={percentage} 
              size="small" 
              showInfo={false}
              strokeColor={getEnrollmentColor(record.enrolledStudents, record.maxStudents)}
            />
          </div>
        );
      },
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      align: 'center',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView && onView(record)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit && onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this course?"
              onConfirm={() => onDelete && onDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Get unique departments and levels for filters
  const departments = [...new Set(courseData.map(course => course.department))];
  const levels = [...new Set(courseData.map(course => course.level))];

  return (
    <Card 
      title="Course Management"
      extra={
        <Button onClick={onRefresh} loading={loading}>
          Refresh
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Search by course name or code"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by department"
            value={selectedDepartment}
            onChange={setSelectedDepartment}
            style={{ width: 150 }}
            allowClear
          >
            {departments.map(dept => (
              <Option key={dept} value={dept}>{dept}</Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by level"
            value={selectedLevel}
            onChange={setSelectedLevel}
            style={{ width: 150 }}
            allowClear
          >
            {levels.map(level => (
              <Option key={level} value={level}>{level}</Option>
            ))}
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={courseData}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} courses`,
        }}
        scroll={{ x: 1000 }}
      />
    </Card>
  );
};

export default CourseList;
