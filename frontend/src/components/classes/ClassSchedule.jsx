/**
 * ClassSchedule.jsx - Class Schedule Component
 * ===========================================
 * Displays class schedules in a calendar/timetable format
 */

import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Select, 
  Typography,
  Tag,
  Row,
  Col,
  Button 
} from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;

const ClassSchedule = ({ 
  schedules = [], 
  classes = [], 
  onScheduleClick 
}) => {
  const [selectedClass, setSelectedClass] = useState('');
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'daily'

  // Mock data if none provided
  const mockClasses = [
    { id: 1, name: 'Class 10A', grade: '10', section: 'A' },
    { id: 2, name: 'Class 10B', grade: '10', section: 'B' },
    { id: 3, name: 'Class 11A', grade: '11', section: 'A' },
  ];

  const mockSchedules = [
    { id: 1, classId: 1, day: 'Monday', time: '09:00', subject: 'Mathematics', teacher: 'Dr. Sarah Miller', room: 'Room 101', duration: 60 },
    { id: 2, classId: 1, day: 'Monday', time: '10:30', subject: 'Physics', teacher: 'Prof. John Anderson', room: 'Room 102', duration: 60 },
    { id: 3, classId: 1, day: 'Tuesday', time: '09:00', subject: 'English', teacher: 'Ms. Emily Taylor', room: 'Room 201', duration: 60 },
    { id: 4, classId: 1, day: 'Wednesday', time: '09:00', subject: 'Mathematics', teacher: 'Dr. Sarah Miller', room: 'Room 101', duration: 60 },
    { id: 5, classId: 1, day: 'Thursday', time: '10:30', subject: 'Chemistry', teacher: 'Dr. Michael Lee', room: 'Lab A', duration: 90 },
    { id: 6, classId: 1, day: 'Friday', time: '09:00', subject: 'Biology', teacher: 'Dr. Lisa Wang', room: 'Lab B', duration: 90 },
  ];

  const classData = classes.length > 0 ? classes : mockClasses;
  const scheduleData = schedules.length > 0 ? schedules : mockSchedules;

  const timeSlots = [
    '08:00', '09:00', '10:00', '10:30', '11:30', '12:30', '13:30', '14:30', '15:30'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const getFilteredSchedules = () => {
    if (selectedClass) {
      return scheduleData.filter(s => s.classId === parseInt(selectedClass));
    }
    return scheduleData;
  };

  const getScheduleForTimeSlot = (day, time) => {
    const filtered = getFilteredSchedules();
    return filtered.find(s => s.day === day && s.time === time);
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': '#1890ff',
      'Physics': '#52c41a',
      'Chemistry': '#faad14',
      'Biology': '#722ed1',
      'English': '#f5222d',
      'History': '#fa8c16',
      'Geography': '#13c2c2'
    };
    return colors[subject] || '#d9d9d9';
  };

  const renderScheduleCell = (day, time) => {
    const schedule = getScheduleForTimeSlot(day, time);
    
    if (!schedule) {
      return <div style={{ height: '60px', padding: '4px' }}></div>;
    }

    return (
      <div 
        style={{ 
          height: '60px', 
          padding: '4px',
          backgroundColor: getSubjectColor(schedule.subject),
          color: 'white',
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        onClick={() => onScheduleClick && onScheduleClick(schedule)}
      >
        <div style={{ fontWeight: 'bold', fontSize: '12px' }}>
          {schedule.subject}
        </div>
        <div style={{ fontSize: '10px', opacity: 0.9 }}>
          {schedule.teacher}
        </div>
        <div style={{ fontSize: '10px', opacity: 0.8 }}>
          {schedule.room}
        </div>
      </div>
    );
  };

  const weeklyColumns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 80,
      fixed: 'left',
      render: (time) => (
        <div style={{ fontWeight: 'bold', textAlign: 'center' }}>
          {time}
        </div>
      )
    },
    ...weekDays.map(day => ({
      title: day,
      key: day,
      width: 150,
      render: (_, record) => renderScheduleCell(day, record.time)
    }))
  ];

  const weeklyData = timeSlots.map(time => ({ time }));

  const dailyColumns = [
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
      width: 100
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => (
        <Tag color={getSubjectColor(subject)}>{subject}</Tag>
      )
    },
    {
      title: 'Teacher',
      dataIndex: 'teacher',
      key: 'teacher'
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room'
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration',
      render: (duration) => `${duration} min`
    }
  ];

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CalendarOutlined style={{ marginRight: 8 }} />
          Class Schedule
        </div>
      }
      extra={
        <div style={{ display: 'flex', gap: 8 }}>
          <Select
            placeholder="Select Class"
            value={selectedClass}
            onChange={setSelectedClass}
            style={{ width: 150 }}
            allowClear
          >
            {classData.map(cls => (
              <Option key={cls.id} value={cls.id.toString()}>
                {cls.name}
              </Option>
            ))}
          </Select>
          <Select
            value={viewMode}
            onChange={setViewMode}
            style={{ width: 120 }}
          >
            <Option value="weekly">Weekly</Option>
            <Option value="daily">Daily</Option>
          </Select>
        </div>
      }
    >
      {selectedClass && (
        <div style={{ marginBottom: 16 }}>
          <Text strong>
            Viewing schedule for: {classData.find(c => c.id === parseInt(selectedClass))?.name}
          </Text>
        </div>
      )}

      {viewMode === 'weekly' ? (
        <Table
          columns={weeklyColumns}
          dataSource={weeklyData}
          rowKey="time"
          pagination={false}
          scroll={{ x: 1000 }}
          size="small"
          bordered
        />
      ) : (
        <div>
          {weekDays.map(day => (
            <Card 
              key={day} 
              size="small" 
              title={day} 
              style={{ marginBottom: 16 }}
            >
              <Table
                columns={dailyColumns}
                dataSource={getFilteredSchedules().filter(s => s.day === day)}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          ))}
        </div>
      )}

      {/* Legend */}
      <div style={{ marginTop: 16, padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <Title level={5}>Subject Legend:</Title>
        <Row gutter={[8, 8]}>
          {Object.entries({
            'Mathematics': '#1890ff',
            'Physics': '#52c41a',
            'Chemistry': '#faad14',
            'Biology': '#722ed1',
            'English': '#f5222d',
            'History': '#fa8c16'
          }).map(([subject, color]) => (
            <Col key={subject}>
              <Tag color={color}>{subject}</Tag>
            </Col>
          ))}
        </Row>
      </div>
    </Card>
  );
};

export default ClassSchedule;
