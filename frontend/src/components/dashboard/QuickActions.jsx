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
      title: 'Add Student',
      icon: <UserAddOutlined />,
      color: '#1890ff',
      description: 'Register new student'
    },
    {
      key: 'add-teacher',
      title: 'Add Teacher',
      icon: <PlusOutlined />,
      color: '#52c41a',
      description: 'Add new teacher'
    },
    {
      key: 'create-course',
      title: 'Create Course',
      icon: <BookOutlined />,
      color: '#faad14',
      description: 'Setup new course'
    },
    {
      key: 'mark-attendance',
      title: 'Mark Attendance',
      icon: <CalendarOutlined />,
      color: '#722ed1',
      description: 'Take attendance'
    },
    {
      key: 'enter-grades',
      title: 'Enter Grades',
      icon: <EditOutlined />,
      color: '#f5222d',
      description: 'Input student grades'
    },
    {
      key: 'generate-report',
      title: 'Generate Report',
      icon: <FileTextOutlined />,
      color: '#13c2c2',
      description: 'Create reports'
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
    <Card title="Quick Actions" style={{ height: '400px' }}>
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
