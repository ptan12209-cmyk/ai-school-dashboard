/**
 * RecentActivities.jsx - Dashboard Recent Activities Component
 * ==========================================================
 * Displays recent system activities and notifications
 */

import React from 'react';
import { Card, List, Avatar, Tag, Typography } from 'antd';
import { 
  UserOutlined, 
  BookOutlined, 
  EditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

const RecentActivities = ({ activities = [] }) => {
  // Mock data if none provided
  const mockActivities = [
    {
      id: 1,
      type: 'student',
      action: 'New student registered',
      user: 'John Doe',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      type: 'grade',
      action: 'Grade updated',
      user: 'Math - Class 10A',
      time: '5 minutes ago',
      status: 'info'
    },
    {
      id: 3,
      type: 'attendance',
      action: 'Attendance marked',
      user: 'Science - Class 9B',
      time: '10 minutes ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'teacher',
      action: 'Teacher profile updated',
      user: 'Jane Smith',
      time: '15 minutes ago',
      status: 'warning'
    },
    {
      id: 5,
      type: 'course',
      action: 'New course created',
      user: 'Advanced Physics',
      time: '1 hour ago',
      status: 'success'
    }
  ];

  const activityData = activities.length > 0 ? activities : mockActivities;

  const getIcon = (type) => {
    switch (type) {
      case 'student':
        return <UserOutlined />;
      case 'teacher':
        return <UserOutlined />;
      case 'course':
        return <BookOutlined />;
      case 'grade':
        return <EditOutlined />;
      case 'attendance':
        return <CheckCircleOutlined />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const getTagColor = (status) => {
    switch (status) {
      case 'success':
        return 'green';
      case 'warning':
        return 'orange';
      case 'error':
        return 'red';
      default:
        return 'blue';
    }
  };

  return (
    <Card 
      title="Recent Activities" 
      style={{ height: '400px' }}
      bodyStyle={{ padding: 0 }}
    >
      <List
        itemLayout="horizontal"
        dataSource={activityData}
        style={{ maxHeight: '320px', overflow: 'auto' }}
        renderItem={(item) => (
          <List.Item style={{ padding: '12px 24px' }}>
            <List.Item.Meta
              avatar={
                <Avatar 
                  icon={getIcon(item.type)} 
                  style={{ backgroundColor: '#1890ff' }}
                />
              }
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text strong>{item.action}</Text>
                  <Tag color={getTagColor(item.status)} size="small">
                    {item.status}
                  </Tag>
                </div>
              }
              description={
                <div>
                  <Text type="secondary">{item.user}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {item.time}
                  </Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default RecentActivities;
