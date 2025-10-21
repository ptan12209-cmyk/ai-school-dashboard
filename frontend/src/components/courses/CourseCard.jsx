/**
 * CourseCard.jsx - Course Card Component
 * =====================================
 * Displays course information in a card format
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
  TrophyOutlined,
  TeamOutlined,
  EditOutlined,
  EyeOutlined 
} from '@ant-design/icons';

const { Text, Title } = Typography;

const CourseCard = ({ 
  courseData = {}, 
  onEdit, 
  onView,
  style = {} 
}) => {
  // Mock data if none provided
  const mockCourse = {
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
    description: 'Advanced calculus and linear algebra for senior students'
  };

  const data = Object.keys(courseData).length > 0 ? courseData : mockCourse;

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
      case 'Expert':
        return 'purple';
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

  const enrollmentPercentage = (data.enrolledStudents / data.maxStudents) * 100;

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
            <Text type="secondary">{data.code}</Text>
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
              <Text strong>{data.department}</Text>
            </div>
          </Col>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <UserOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              <Text>{data.instructor}</Text>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
              <Text>{data.credits} Credits</Text>
            </div>
          </Col>
          <Col span={12}>
            <Tag color={getLevelColor(data.level)} style={{ margin: 0 }}>
              {data.level}
            </Tag>
          </Col>
        </Row>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text strong>Enrollment</Text>
          <Text style={{ 
            color: getEnrollmentColor(data.enrolledStudents, data.maxStudents),
            fontWeight: 'bold'
          }}>
            {data.enrolledStudents}/{data.maxStudents}
          </Text>
        </div>
        <Progress 
          percent={enrollmentPercentage} 
          strokeColor={getEnrollmentColor(data.enrolledStudents, data.maxStudents)}
          format={() => `${enrollmentPercentage.toFixed(0)}%`}
          size="small"
        />
      </div>

      {data.description && (
        <div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {data.description.length > 100 
              ? `${data.description.substring(0, 100)}...` 
              : data.description
            }
          </Text>
        </div>
      )}
    </Card>
  );
};

export default CourseCard;
