/**
 * ClassCard.jsx - Class Card Component
 * ===================================
 * Displays class information in a card format
 */

import React from 'react';
import { 
  Card, 
  Avatar, 
  Progress, 
  Tag, 
  Typography,
  Row,
  Col,
  Button,
  Space 
} from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  ClockCircleOutlined,
  EnvironmentOutlined,
  EditOutlined,
  EyeOutlined 
} from '@ant-design/icons';

const { Text, Title } = Typography;

const ClassCard = ({ 
  classData = {}, 
  onEdit, 
  onView,
  style = {} 
}) => {
  // Mock data if none provided
  const mockClass = {
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
    status: 'active',
    description: 'Advanced Mathematics class for Grade 10 students'
  };

  const data = Object.keys(classData).length > 0 ? classData : mockClass;

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

  const capacityPercentage = (data.studentCount / data.capacity) * 100;

  return (
    <Card
      style={{ 
        width: '100%', 
        maxWidth: 400,
        ...style 
      }}
      actions={[
        <Button 
          type="text" 
          icon={<EyeOutlined />} 
          onClick={() => onView && onView(data)}
        >
          View
        </Button>,
        <Button 
          type="text" 
          icon={<EditOutlined />} 
          onClick={() => onEdit && onEdit(data)}
        >
          Edit
        </Button>
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: 4 }}>
              {data.name}
            </Title>
            <Text type="secondary">Grade {data.grade} - Section {data.section}</Text>
          </div>
          <Tag color={getStatusColor(data.status)}>
            {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </Tag>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <BookOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              <Text strong>{data.subject}</Text>
            </div>
          </Col>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <UserOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              <Text>{data.teacher}</Text>
            </div>
          </Col>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <EnvironmentOutlined style={{ marginRight: 8, color: '#faad14' }} />
              <Text>{data.room}</Text>
            </div>
          </Col>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <ClockCircleOutlined style={{ marginRight: 8, color: '#722ed1' }} />
              <Text style={{ fontSize: '12px' }}>{data.schedule}</Text>
            </div>
          </Col>
        </Row>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text strong>Student Enrollment</Text>
          <Text style={{ 
            color: getCapacityColor(data.studentCount, data.capacity),
            fontWeight: 'bold'
          }}>
            {data.studentCount}/{data.capacity}
          </Text>
        </div>
        <Progress 
          percent={capacityPercentage} 
          strokeColor={getCapacityColor(data.studentCount, data.capacity)}
          format={() => `${capacityPercentage.toFixed(0)}%`}
          size="small"
        />
      </div>

      {data.description && (
        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {data.description}
          </Text>
        </div>
      )}
    </Card>
  );
};

export default ClassCard;
