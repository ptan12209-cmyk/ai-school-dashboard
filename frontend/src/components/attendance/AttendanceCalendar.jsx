/**
 * AttendanceCalendar.jsx - Attendance Calendar Component
 * ====================================================
 * Displays attendance data in a calendar format
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Card, 
  Badge, 
  Select, 
  Typography,
  Tooltip,
  Row,
  Col 
} from 'antd';
import { 
  CheckCircleOutlined, 
  CloseCircleOutlined, 
  ClockCircleOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { Title, Text } = Typography;

const AttendanceCalendar = ({ 
  attendanceData = [], 
  students = [], 
  onDateSelect 
}) => {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(moment());

  // Mock data if none provided
  const mockStudents = [
    { id: 1, name: 'Alice Johnson', class: '10A' },
    { id: 2, name: 'Bob Smith', class: '10A' },
    { id: 3, name: 'Carol Davis', class: '10B' },
  ];

  const mockAttendance = [
    { studentId: 1, date: '2024-01-15', status: 'present' },
    { studentId: 1, date: '2024-01-16', status: 'present' },
    { studentId: 1, date: '2024-01-17', status: 'late' },
    { studentId: 1, date: '2024-01-18', status: 'absent' },
    { studentId: 1, date: '2024-01-19', status: 'present' },
    { studentId: 2, date: '2024-01-15', status: 'present' },
    { studentId: 2, date: '2024-01-16', status: 'absent' },
    { studentId: 2, date: '2024-01-17', status: 'present' },
  ];

  const studentData = students.length > 0 ? students : mockStudents;
  const attendance = attendanceData.length > 0 ? attendanceData : mockAttendance;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'present':
        return <Badge status="success" text="Present" />;
      case 'absent':
        return <Badge status="error" text="Absent" />;
      case 'late':
        return <Badge status="warning" text="Late" />;
      default:
        return <Badge status="default" text="No Data" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return '#52c41a';
      case 'absent':
        return '#f5222d';
      case 'late':
        return '#faad14';
      default:
        return '#d9d9d9';
    }
  };

  const dateCellRender = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    
    if (selectedStudent) {
      // Show attendance for selected student
      const record = attendance.find(
        a => a.studentId === parseInt(selectedStudent) && a.date === dateStr
      );
      
      if (record) {
        return (
          <div style={{ 
            width: '100%', 
            height: '100%', 
            backgroundColor: getStatusColor(record.status),
            opacity: 0.3,
            borderRadius: '4px'
          }}>
            <Tooltip title={getStatusBadge(record.status)}>
              <div style={{ padding: '2px', textAlign: 'center' }}>
                {record.status === 'present' && <CheckCircleOutlined />}
                {record.status === 'absent' && <CloseCircleOutlined />}
                {record.status === 'late' && <ClockCircleOutlined />}
              </div>
            </Tooltip>
          </div>
        );
      }
    } else {
      // Show overall class attendance summary
      const dayRecords = attendance.filter(a => a.date === dateStr);
      if (dayRecords.length > 0) {
        const presentCount = dayRecords.filter(a => a.status === 'present').length;
        const totalCount = dayRecords.length;
        const rate = (presentCount / totalCount) * 100;
        
        return (
          <Tooltip title={`${presentCount}/${totalCount} present (${rate.toFixed(0)}%)`}>
            <div style={{
              width: '100%',
              height: '20px',
              backgroundColor: rate >= 90 ? '#52c41a' : rate >= 75 ? '#faad14' : '#f5222d',
              opacity: 0.6,
              borderRadius: '2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {rate.toFixed(0)}%
            </div>
          </Tooltip>
        );
      }
    }
    
    return null;
  };

  const onPanelChange = (value, mode) => {
    setSelectedMonth(value);
  };

  const onSelect = (date) => {
    if (onDateSelect) {
      onDateSelect(date.format('YYYY-MM-DD'));
    }
  };

  // Calculate monthly statistics
  const monthStart = selectedMonth.clone().startOf('month');
  const monthEnd = selectedMonth.clone().endOf('month');
  const monthAttendance = attendance.filter(a => {
    const date = moment(a.date);
    return date.isBetween(monthStart, monthEnd, 'day', '[]');
  });

  const monthlyStats = {
    totalDays: monthAttendance.length,
    presentDays: monthAttendance.filter(a => a.status === 'present').length,
    absentDays: monthAttendance.filter(a => a.status === 'absent').length,
    lateDays: monthAttendance.filter(a => a.status === 'late').length
  };

  return (
    <Card title="Attendance Calendar">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12}>
          <Select
            placeholder="Select Student (or leave empty for class overview)"
            value={selectedStudent}
            onChange={setSelectedStudent}
            style={{ width: '100%' }}
            allowClear
          >
            {studentData.map(student => (
              <Option key={student.id} value={student.id.toString()}>
                {student.name} - {student.class}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12}>
          <div style={{ textAlign: 'right' }}>
            <Title level={5} style={{ margin: 0 }}>
              {selectedMonth.format('MMMM YYYY')}
            </Title>
            <Text type="secondary">
              {selectedStudent 
                ? `Viewing: ${studentData.find(s => s.id === parseInt(selectedStudent))?.name || 'Unknown'}`
                : 'Class Overview'
              }
            </Text>
          </div>
        </Col>
      </Row>

      {/* Monthly Statistics */}
      {monthlyStats.totalDays > 0 && (
        <Row gutter={8} style={{ marginBottom: 16 }}>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                {monthlyStats.presentDays}
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Present</Text>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#faad14' }}>
                {monthlyStats.lateDays}
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Late</Text>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f5222d' }}>
                {monthlyStats.absentDays}
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Absent</Text>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ textAlign: 'center', padding: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                {((monthlyStats.presentDays + monthlyStats.lateDays) / monthlyStats.totalDays * 100).toFixed(0)}%
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Rate</Text>
            </div>
          </Col>
        </Row>
      )}

      <Calendar
        dateCellRender={dateCellRender}
        onPanelChange={onPanelChange}
        onSelect={onSelect}
      />

      {/* Legend */}
      <div style={{ marginTop: 16, textAlign: 'center' }}>
        <Text type="secondary">Legend: </Text>
        <Badge status="success" text="Present" style={{ marginRight: 16 }} />
        <Badge status="warning" text="Late" style={{ marginRight: 16 }} />
        <Badge status="error" text="Absent" />
      </div>
    </Card>
  );
};

export default AttendanceCalendar;
