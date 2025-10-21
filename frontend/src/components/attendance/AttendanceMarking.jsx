/**
 * AttendanceMarking.jsx - Attendance Marking Component
 * ===================================================
 * Form for marking student attendance
 */

import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Select, 
  DatePicker, 
  Button, 
  Table, 
  Radio, 
  Input,
  Space,
  message,
  Row,
  Col,
  Avatar 
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined,
  SaveOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const AttendanceMarking = ({ 
  students = [], 
  classes = [], 
  onSubmit,
  loading = false 
}) => {
  const [form] = Form.useForm();
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(moment());
  const [attendanceData, setAttendanceData] = useState({});

  // Mock data if none provided
  const mockStudents = [
    { id: 1, name: 'Alice Johnson', rollNumber: '001', class: '10A' },
    { id: 2, name: 'Bob Smith', rollNumber: '002', class: '10A' },
    { id: 3, name: 'Carol Davis', rollNumber: '003', class: '10A' },
    { id: 4, name: 'David Wilson', rollNumber: '004', class: '10A' },
    { id: 5, name: 'Eva Brown', rollNumber: '005', class: '10A' },
  ];

  const mockClasses = [
    { id: '10A', name: 'Class 10A', subject: 'Mathematics' },
    { id: '10B', name: 'Class 10B', subject: 'Science' },
    { id: '11A', name: 'Class 11A', subject: 'English' },
  ];

  const studentData = students.length > 0 ? students : mockStudents;
  const classData = classes.length > 0 ? classes : mockClasses;

  const handleAttendanceChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const values = {
        class: selectedClass,
        date: selectedDate.format('YYYY-MM-DD'),
        attendance: Object.entries(attendanceData).map(([studentId, data]) => ({
          studentId: parseInt(studentId),
          status: data.status || 'absent',
          remarks: data.remarks || ''
        }))
      };

      if (onSubmit) {
        await onSubmit(values);
      } else {
        console.log('Attendance data:', values);
      }
      
      message.success('Attendance marked successfully!');
    } catch (error) {
      message.error('Failed to mark attendance');
    }
  };

  const markAllPresent = () => {
    const newData = {};
    studentData.forEach(student => {
      newData[student.id] = { status: 'present', remarks: '' };
    });
    setAttendanceData(newData);
  };

  const markAllAbsent = () => {
    const newData = {};
    studentData.forEach(student => {
      newData[student.id] = { status: 'absent', remarks: '' };
    });
    setAttendanceData(newData);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'absent':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      case 'late':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Roll No.',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
      width: 80
    },
    {
      title: 'Student',
      key: 'student',
      width: 200,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar size="small" style={{ backgroundColor: '#1890ff', marginRight: 8 }}>
            {record.name.charAt(0)}
          </Avatar>
          <span>{record.name}</span>
        </div>
      )
    },
    {
      title: 'Attendance',
      key: 'attendance',
      width: 300,
      render: (_, record) => (
        <Radio.Group
          value={attendanceData[record.id]?.status}
          onChange={(e) => handleAttendanceChange(record.id, e.target.value)}
        >
          <Radio.Button value="present">
            <CheckCircleOutlined style={{ color: '#52c41a' }} /> Present
          </Radio.Button>
          <Radio.Button value="absent">
            <CloseCircleOutlined style={{ color: '#f5222d' }} /> Absent
          </Radio.Button>
          <Radio.Button value="late">
            <ClockCircleOutlined style={{ color: '#faad14' }} /> Late
          </Radio.Button>
        </Radio.Group>
      )
    },
    {
      title: 'Remarks',
      key: 'remarks',
      render: (_, record) => (
        <Input
          placeholder="Optional remarks..."
          value={attendanceData[record.id]?.remarks || ''}
          onChange={(e) => handleRemarksChange(record.id, e.target.value)}
          style={{ width: 200 }}
        />
      )
    }
  ];

  return (
    <Card title="Mark Attendance">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Select
            placeholder="Select Class"
            value={selectedClass}
            onChange={setSelectedClass}
            style={{ width: '100%' }}
          >
            {classData.map(cls => (
              <Option key={cls.id} value={cls.id}>
                {cls.name} - {cls.subject}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={8}>
          <DatePicker
            value={selectedDate}
            onChange={setSelectedDate}
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={8}>
          <Space>
            <Button onClick={markAllPresent} size="small">
              Mark All Present
            </Button>
            <Button onClick={markAllAbsent} size="small">
              Mark All Absent
            </Button>
          </Space>
        </Col>
      </Row>

      {selectedClass && (
        <>
          <Table
            columns={columns}
            dataSource={studentData.filter(s => s.class === selectedClass)}
            rowKey="id"
            pagination={false}
            size="small"
            style={{ marginBottom: 16 }}
          />

          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSubmit}
              loading={loading}
              size="large"
            >
              Save Attendance
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default AttendanceMarking;
