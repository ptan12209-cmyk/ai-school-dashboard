/**
 * TopPerformers.jsx - Dashboard Top Performers Component
 * =====================================================
 * Displays top performing students and teachers
 */

import React from 'react';
import { Card, List, Avatar, Progress, Typography, Tabs } from 'antd';
import { 
  TrophyOutlined, 
  StarOutlined,
  CrownOutlined 
} from '@ant-design/icons';

const { Text } = Typography;
const { TabPane } = Tabs;

const TopPerformers = ({ students = [], teachers = [] }) => {
  // Mock data for students if none provided
  const mockStudents = [
    {
      id: 1,
      name: 'Nguyễn Thị Mai',
      grade: 98.5,
      subject: 'Toán Học',
      avatar: null,
      rank: 1
    },
    {
      id: 2,
      name: 'Trần Văn Nam',
      grade: 96.2,
      subject: 'Khoa Học',
      avatar: null,
      rank: 2
    },
    {
      id: 3,
      name: 'Lê Thu Hà',
      grade: 94.8,
      subject: 'Văn Học',
      avatar: null,
      rank: 3
    },
    {
      id: 4,
      name: 'Phạm Đức Anh',
      grade: 93.1,
      subject: 'Lịch Sử',
      avatar: null,
      rank: 4
    },
    {
      id: 5,
      name: 'Hoàng Minh Châu',
      grade: 92.7,
      subject: 'Mỹ Thuật',
      avatar: null,
      rank: 5
    }
  ];

  // Mock data for teachers if none provided
  const mockTeachers = [
    {
      id: 1,
      name: 'TS. Nguyễn Thị Lan',
      rating: 4.9,
      subject: 'Toán Học',
      studentsCount: 120,
      avatar: null
    },
    {
      id: 2,
      name: 'GS. Trần Văn Đức',
      rating: 4.8,
      subject: 'Vật Lý',
      studentsCount: 95,
      avatar: null
    },
    {
      id: 3,
      name: 'Cô Lê Thu Hương',
      rating: 4.7,
      subject: 'Tiếng Anh',
      studentsCount: 110,
      avatar: null
    },
    {
      id: 4,
      name: 'Thầy Phạm Minh Tuấn',
      rating: 4.6,
      subject: 'Hóa Học',
      studentsCount: 85,
      avatar: null
    },
    {
      id: 5,
      name: 'TS. Hoàng Thị Nga',
      rating: 4.5,
      subject: 'Sinh Học',
      studentsCount: 100,
      avatar: null
    }
  ];

  const studentData = students.length > 0 ? students : mockStudents;
  const teacherData = teachers.length > 0 ? teachers : mockTeachers;

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <CrownOutlined style={{ color: '#faad14', fontSize: '16px' }} />;
      case 2:
        return <TrophyOutlined style={{ color: '#c0c0c0', fontSize: '16px' }} />;
      case 3:
        return <TrophyOutlined style={{ color: '#cd7f32', fontSize: '16px' }} />;
      default:
        return <StarOutlined style={{ color: '#1890ff', fontSize: '16px' }} />;
    }
  };

  const StudentList = () => (
    <List
      itemLayout="horizontal"
      dataSource={studentData}
      style={{ maxHeight: '280px', overflow: 'auto' }}
      renderItem={(student, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <div style={{ position: 'relative' }}>
                <Avatar 
                  src={student.avatar} 
                  style={{ backgroundColor: '#1890ff' }}
                >
                  {student.name.charAt(0)}
                </Avatar>
                <div style={{ 
                  position: 'absolute', 
                  top: -5, 
                  right: -5,
                  background: 'white',
                  borderRadius: '50%',
                  padding: '2px'
                }}>
                  {getRankIcon(student.rank)}
                </div>
              </div>
            }
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>{student.name}</Text>
                <Text type="success" strong>{student.grade}%</Text>
              </div>
            }
            description={
              <div>
                <Text type="secondary">{student.subject}</Text>
                <br />
                <Progress 
                  percent={student.grade} 
                  size="small" 
                  showInfo={false}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068'
                  }}
                />
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  const TeacherList = () => (
    <List
      itemLayout="horizontal"
      dataSource={teacherData}
      style={{ maxHeight: '280px', overflow: 'auto' }}
      renderItem={(teacher) => (
        <List.Item>
          <List.Item.Meta
            avatar={
              <Avatar 
                src={teacher.avatar} 
                style={{ backgroundColor: '#52c41a' }}
              >
                {teacher.name.split(' ').map(n => n.charAt(0)).join('')}
              </Avatar>
            }
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>{teacher.name}</Text>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <StarOutlined style={{ color: '#faad14', marginRight: '4px' }} />
                  <Text strong>{teacher.rating}</Text>
                </div>
              </div>
            }
            description={
              <div>
                <Text type="secondary">{teacher.subject}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {teacher.studentsCount} học sinh
                </Text>
              </div>
            }
          />
        </List.Item>
      )}
    />
  );

  return (
    <Card title="Thành Tích Xuất Sắc" style={{ height: '400px' }}>
      <Tabs defaultActiveKey="students" size="small">
        <TabPane tab="Học Sinh" key="students">
          <StudentList />
        </TabPane>
        <TabPane tab="Giáo Viên" key="teachers">
          <TeacherList />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default TopPerformers;
