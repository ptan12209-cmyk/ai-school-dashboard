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
      action: 'Học sinh mới đăng ký',
      user: 'Nguyễn Văn A',
      time: '2 phút trước',
      status: 'success'
    },
    {
      id: 2,
      type: 'grade',
      action: 'Cập nhật điểm',
      user: 'Toán - Lớp 10A',
      time: '5 phút trước',
      status: 'info'
    },
    {
      id: 3,
      type: 'attendance',
      action: 'Điểm danh hoàn tất',
      user: 'Lý - Lớp 9B',
      time: '10 phút trước',
      status: 'success'
    },
    {
      id: 4,
      type: 'teacher',
      action: 'Cập nhật hồ sơ giáo viên',
      user: 'Trần Thị B',
      time: '15 phút trước',
      status: 'warning'
    },
    {
      id: 5,
      type: 'course',
      action: 'Tạo khóa học mới',
      user: 'Vật Lý Nâng Cao',
      time: '1 giờ trước',
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
      title="Hoạt Động Gần Đây"
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
