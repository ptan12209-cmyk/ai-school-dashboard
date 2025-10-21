/**
 * QuickActions.jsx - Dashboard Quick Actions Component
 * ==================================================
 * Provides quick access to common actions
 */

import React from 'react';
import { Card, Button, Row, Col } from 'antd';
import { 
  PlusOutlined, 
  UserAddOutlined, 
  BookOutlined,
  EditOutlined,
  FileTextOutlined,
  CalendarOutlined 
} from '@ant-design/icons';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      key: 'add-student',
      title: 'Thêm Học Sinh',
      icon: <UserAddOutlined />,
      color: '#1890ff',
      description: 'Đăng ký học sinh mới'
    },
    {
      key: 'add-teacher',
      title: 'Thêm Giáo Viên',
      icon: <PlusOutlined />,
      color: '#52c41a',
      description: 'Thêm giáo viên mới'
    },
    {
      key: 'create-course',
      title: 'Tạo Khóa Học',
      icon: <BookOutlined />,
      color: '#faad14',
      description: 'Thiết lập khóa học mới'
    },
    {
      key: 'mark-attendance',
      title: 'Điểm Danh',
      icon: <CalendarOutlined />,
      color: '#722ed1',
      description: 'Thực hiện điểm danh'
    },
    {
      key: 'enter-grades',
      title: 'Nhập Điểm',
      icon: <EditOutlined />,
      color: '#f5222d',
      description: 'Nhập điểm học sinh'
    },
    {
      key: 'generate-report',
      title: 'Tạo Báo Cáo',
      icon: <FileTextOutlined />,
      color: '#13c2c2',
      description: 'Tạo báo cáo'
    }
  ];

  const handleAction = (actionKey) => {
    if (onAction) {
      onAction(actionKey);
    } else {
      console.log(`Action triggered: ${actionKey}`);
    }
  };

  return (
    <Card title="Thao Tác Nhanh" style={{ height: '400px' }}>
      <Row gutter={[16, 16]}>
        {actions.map((action) => (
          <Col xs={24} sm={12} key={action.key}>
            <Button
              type="default"
              size="large"
              icon={action.icon}
              onClick={() => handleAction(action.key)}
              style={{
                width: '100%',
                height: '80px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: action.color,
                color: action.color
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '4px' }}>
                {action.title}
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                {action.description}
              </div>
            </Button>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default QuickActions;
