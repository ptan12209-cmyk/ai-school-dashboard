/**
 * AttendanceSheet.jsx - Attendance Sheet Component
 * ===============================================
 * Displays attendance records in a sheet format
 */

import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Button, 
  Tag, 
  Select, 
  DatePicker, 
  Space,
  Tooltip,
  Avatar 
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  QuestionCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';

const { Option } = Select;
const { RangePicker } = DatePicker;

const AttendanceSheet = ({ 
  attendanceData = [], 
  students = [], 
  onUpdateAttendance,
  loading = false 
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [dateRange, setDateRange] = useState([]);

  // Mock data if none provided
  const mockStudents = [
    { id: 1, name: 'Alice Johnson', rollNumber: '001', class: '10A' },
    { id: 2, name: 'Bob Smith', rollNumber: '002', class: '10A' },
    { id: 3, name: 'Carol Davis', rollNumber: '003', class: '10A' },
    { id: 4, name: 'David Wilson', rollNumber: '004', class: '10A' },
  ];

  const mockAttendance = [
    {
      studentId: 1,
      date: '2024-01-15',
      status: 'present',
      time: '08:30',
      remarks: ''
    },
    {
      studentId: 2,
      date: '2024-01-15',
      status: 'absent',
      time: null,
      remarks: 'Sick leave'
    },
    {
      studentId: 3,
      date: '2024-01-15',
      status: 'late',
      time: '09:15',
      remarks: 'Traffic'
    },
    {
      studentId: 4,
      date: '2024-01-15',
      status: 'present',
      time: '08:25',
      remarks: ''
    }
  ];

  const studentData = students.length > 0 ? students : mockStudents;
  const attendance = attendanceData.length > 0 ? attendanceData : mockAttendance;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'absent':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      case 'late':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return <QuestionCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStatusTag = (status) => {
    const colors = {
      present: 'green',
      absent: 'red',
      late: 'orange',
      excused: 'blue'
    };
    return (
      <Tag color={colors[status] || 'default'} icon={getStatusIcon(status)}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Roll No.',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
      width: 80,
      fixed: 'left'
    },
    {
      title: 'Student',
      key: 'student',
      width: 200,
      fixed: 'left',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" style={{ backgroundColor: '#1890ff', marginRight: 8 }}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontWeight: 'bold' }}>{record.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.class}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Jan 15',
      key: '2024-01-15',
      align: 'center',
      render: (_, record) => {
        const attendanceRecord = attendance.find(a => a.studentId === record.id);
        return attendanceRecord ? getStatusTag(attendanceRecord.status) : getStatusTag('absent');
      }
    },
    {
      title: 'Jan 16',
      key: '2024-01-16',
      align: 'center',
      render: () => getStatusTag('present')
    },
    {
      title: 'Jan 17',
      key: '2024-01-17',
      align: 'center',
      render: () => getStatusTag('present')
    },
    {
      title: 'Jan 18',
      key: '2024-01-18',
      align: 'center',
      render: () => getStatusTag('late')
    },
    {
      title: 'Jan 19',
      key: '2024-01-19',
      align: 'center',
      render: () => getStatusTag('absent')
    },
    {
      title: 'Attendance %',
      key: 'percentage',
      width: 120,
      align: 'center',
      render: () => {
        const percentage = Math.floor(Math.random() * 20) + 80; // Mock percentage
        return (
          <Tag color={percentage >= 90 ? 'green' : percentage >= 75 ? 'orange' : 'red'}>
            {percentage}%
          </Tag>
        );
      }
    }
  ];

  return (
    <Card 
      title="Attendance Sheet"
      extra={
        <Space>
          <Select
            placeholder="Select Class"
            value={selectedClass}
            onChange={setSelectedClass}
            style={{ width: 120 }}
          >
            <Option value="10A">Class 10A</Option>
            <Option value="10B">Class 10B</Option>
            <Option value="11A">Class 11A</Option>
          </Select>
          <RangePicker
            value={dateRange}
            onChange={setDateRange}
            style={{ width: 240 }}
          />
          <Button type="primary">
            Export
          </Button>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={studentData}
        rowKey="id"
        loading={loading}
        scroll={{ x: 800 }}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} students`,
        }}
        size="small"
      />
    </Card>
  );
};

export default AttendanceSheet;
