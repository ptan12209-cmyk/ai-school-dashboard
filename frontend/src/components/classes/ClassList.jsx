/**
 * ClassList.jsx - Class List Component
 * ===================================
 * Displays list of classes with search and filter functionality
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
  Popconfirm 
} from 'antd';
import { 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  BookOutlined 
} from '@ant-design/icons';

const { Option } = Select;

const ClassList = ({ 
  classes = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onView,
  onRefresh 
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('');

  // Mock data if none provided
  const mockClasses = [
    {
      id: 1,
      name: 'Class 10A',
      grade: '10',
      section: 'A',
      teacher: 'Dr. Sarah Miller',
      teacherId: 1,
      subject: 'Mathematics',
      studentCount: 32,
      capacity: 35,
      room: 'Room 101',
      schedule: 'Mon, Wed, Fri - 9:00 AM',
      status: 'active'
    },
    {
      id: 2,
      name: 'Class 10B',
      grade: '10',
      section: 'B',
      teacher: 'Prof. John Anderson',
      teacherId: 2,
      subject: 'Physics',
      studentCount: 28,
      capacity: 30,
      room: 'Room 102',
      schedule: 'Tue, Thu - 10:30 AM',
      status: 'active'
    },
    {
      id: 3,
      name: 'Class 11A',
      grade: '11',
      section: 'A',
      teacher: 'Ms. Emily Taylor',
      teacherId: 3,
      subject: 'English',
      studentCount: 25,
      capacity: 30,
      room: 'Room 201',
      schedule: 'Mon, Wed, Fri - 11:00 AM',
      status: 'inactive'
    }
  ];

  const classData = classes.length > 0 ? classes : mockClasses;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getCapacityColor = (current, capacity) => {
    const percentage = (current / capacity) * 100;
    if (percentage >= 90) return '#f5222d';
    if (percentage >= 75) return '#faad14';
    return '#52c41a';
  };

  const columns = [
    {
      title: 'Class',
      key: 'class',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.name.toLowerCase().includes(value.toLowerCase()) ||
        record.subject.toLowerCase().includes(value.toLowerCase()),
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{record.name}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>
            <BookOutlined style={{ marginRight: 4 }} />
            {record.subject}
          </div>
        </div>
      ),
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher',
      render: (teacher, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" style={{ backgroundColor: '#1890ff', marginRight: 8 }}>
            {teacher.split(' ').map(n => n.charAt(0)).join('')}
          </Avatar>
          <span>{teacher}</span>
        </div>
      ),
    },
    {
      title: 'Students',
      key: 'students',
      align: 'center',
      render: (_, record) => (
        <div>
          <div style={{ 
            fontSize: '16px', 
            fontWeight: 'bold',
            color: getCapacityColor(record.studentCount, record.capacity)
          }}>
            {record.studentCount}/{record.capacity}
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {((record.studentCount / record.capacity) * 100).toFixed(0)}% full
          </div>
        </div>
      ),
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
      align: 'center',
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      key: 'schedule',
      render: (schedule) => (
        <div style={{ fontSize: '12px' }}>
          {schedule.split(' - ').map((part, index) => (
            <div key={`${part}-${index}`}>{part}</div>
          ))}
        </div>
      ),
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
              title="Are you sure you want to delete this class?"
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

  // Get unique grades for filter
  const grades = [...new Set(classData.map(cls => cls.grade))];

  return (
    <Card 
      title="Class Management"
      extra={
        <Button onClick={onRefresh} loading={loading}>
          Refresh
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Search by class name or subject"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by grade"
            value={selectedGrade}
            onChange={setSelectedGrade}
            style={{ width: 150 }}
            allowClear
          >
            {grades.map(grade => (
              <Option key={grade} value={grade}>Grade {grade}</Option>
            ))}
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={classData.filter(cls => 
          !selectedGrade || cls.grade === selectedGrade
        )}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} classes`,
        }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
};

export default ClassList;
