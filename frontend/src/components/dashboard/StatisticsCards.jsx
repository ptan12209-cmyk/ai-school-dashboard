/**
 * StatisticsCards.jsx - Dashboard Statistics Overview
 * ==================================================
 * Displays key metrics in card format
 */

import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  BookOutlined, 
  TrophyOutlined 
} from '@ant-design/icons';

const StatisticsCards = ({ stats = {} }) => {
  const statisticsData = [
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      icon: <UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
      color: '#1890ff'
    },
    {
      title: 'Total Teachers',
      value: stats.totalTeachers || 0,
      icon: <TeamOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
      color: '#52c41a'
    },
    {
      title: 'Total Courses',
      value: stats.totalCourses || 0,
      icon: <BookOutlined style={{ fontSize: '24px', color: '#faad14' }} />,
      color: '#faad14'
    },
    {
      title: 'Average Grade',
      value: stats.averageGrade || '0.0',
      suffix: '/10',
      icon: <TrophyOutlined style={{ fontSize: '24px', color: '#f5222d' }} />,
      color: '#f5222d'
    }
  ];

  return (
    <Row gutter={[16, 16]}>
      {statisticsData.map((stat) => (
        <Col xs={24} sm={12} lg={6} key={stat.title}>
          <Card 
            hoverable
            style={{ 
              borderLeft: `4px solid ${stat.color}`,
              height: '120px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  suffix={stat.suffix}
                  valueStyle={{ color: stat.color, fontSize: '24px' }}
                />
              </div>
              <div>
                {stat.icon}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default StatisticsCards;
