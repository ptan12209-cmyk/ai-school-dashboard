// TeacherCard.jsx - Card component for displaying teacher details
import React, { useState } from 'react';
import {
  Card,
  Avatar,
  Descriptions,
  Tag,
  Space,
  Button,
  Divider,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  Tabs,
  Timeline,
  Table,
  Badge,
  Tooltip,
  Empty,
  Rate,
  List
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  EditOutlined,
  PrinterOutlined,
  ShareAltOutlined,
  TeamOutlined,
  BookOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  IdcardOutlined,
  BankOutlined,
  DollarOutlined,
  LinkedinOutlined,
  GlobalOutlined,
  SafetyOutlined,
  FileTextOutlined,
  StarOutlined,
  ScheduleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './TeacherCard.scss';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const TeacherCard = ({ teacher, onEdit, onPrint, compact = false }) => {
  const [activeTab, setActiveTab] = useState('1');

  if (!teacher) {
    return (
      <Card>
        <Empty description="No teacher data available" />
      </Card>
    );
  }

  // Calculate age
  const calculateAge = (birthDate) => {
    return moment().diff(moment(birthDate), 'years');
  };

  // Status color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      'Active': 'success',
      'On Leave': 'warning',
      'Inactive': 'default',
      'Retired': 'blue'
    };
    return statusColors[status] || 'default';
  };

  // Experience level
  const getExperienceLevel = (years) => {
    if (years >= 20) return { level: 'Senior Expert', color: '#faad14' };
    if (years >= 10) return { level: 'Senior', color: '#1890ff' };
    if (years >= 5) return { level: 'Mid-level', color: '#52c41a' };
    if (years >= 2) return { level: 'Junior', color: '#13c2c2' };
    return { level: 'Fresher', color: '#722ed1' };
  };

  // Mock data for demonstration
  const classSchedule = [
    { time: '08:00-09:00', monday: 'Math 10A', tuesday: 'Math 11B', wednesday: 'Math 10A', thursday: 'Math 11B', friday: 'Math 12A' },
    { time: '09:00-10:00', monday: 'Math 10B', tuesday: 'Free', wednesday: 'Math 10B', thursday: 'Math 12A', friday: 'Math 11A' },
    { time: '10:00-11:00', monday: 'Free', tuesday: 'Math 12B', wednesday: 'Math 11A', thursday: 'Free', friday: 'Math 12B' },
    { time: '11:00-12:00', monday: 'Math 11A', tuesday: 'Math 10A', wednesday: 'Free', thursday: 'Math 10B', friday: 'Free' },
  ];

  const performanceData = {
    studentSatisfaction: 4.5,
    attendanceRate: 95,
    completionRate: 92,
    avgStudentGrade: 7.8
  };

  const recentActivities = [
    { date: '2024-01-20', activity: 'Submitted grade reports for Class 10A' },
    { date: '2024-01-19', activity: 'Conducted extra class for weak students' },
    { date: '2024-01-18', activity: 'Attended professional development workshop' },
    { date: '2024-01-15', activity: 'Parent-teacher meeting completed' },
  ];

  const achievements = [
    { year: 2023, title: 'Best Teacher Award', description: 'Excellence in Mathematics Teaching' },
    { year: 2023, title: 'Innovation in Teaching', description: 'Introduced new teaching methodology' },
    { year: 2022, title: '100% Pass Rate', description: 'All students passed with distinction' },
  ];

  // Compact Card View
  if (compact) {
    return (
      <Card 
        className="teacher-card-compact" 
        hoverable
        actions={[
          <Tooltip title="View Details">
            <UserOutlined key="view" />
          </Tooltip>,
          <Tooltip title="Edit">
            <EditOutlined key="edit" onClick={() => onEdit(teacher)} />
          </Tooltip>,
          <Tooltip title="Print">
            <PrinterOutlined key="print" onClick={() => onPrint(teacher)} />
          </Tooltip>
        ]}
      >
        <Card.Meta
          avatar={
            <Avatar 
              size={64} 
              src={teacher.avatar}
              icon={!teacher.avatar && <UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            >
              {!teacher.avatar && teacher.name?.charAt(0)}
            </Avatar>
          }
          title={
            <Space direction="vertical" size={0}>
              <Text strong>{teacher.name}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                ID: {teacher.teacherId || teacher.id}
              </Text>
            </Space>
          }
          description={
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text><BankOutlined /> {teacher.department || 'N/A'}</Text>
              <Text><BookOutlined /> {teacher.subjects?.join(', ') || 'N/A'}</Text>
              <Text><MailOutlined /> {teacher.email}</Text>
              <Text><PhoneOutlined /> {teacher.phone}</Text>
              <Rate disabled defaultValue={teacher.rating || 4} style={{ fontSize: 14 }} />
              <Badge status={getStatusColor(teacher.status)} text={teacher.status} />
            </Space>
          }
        />
      </Card>
    );
  }

  // Full Detail View
  return (
    <Card className="teacher-card-detail">
      {/* Header Section */}
      <div className="teacher-header">
        <Row gutter={24} align="middle">
          <Col xs={24} sm={6} md={4}>
            <Avatar 
              size={100} 
              src={teacher.avatar}
              icon={!teacher.avatar && <UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            >
              {!teacher.avatar && teacher.name?.charAt(0)}
            </Avatar>
          </Col>
          <Col xs={24} sm={18} md={14}>
            <Title level={3} style={{ marginBottom: 8 }}>
              {teacher.name}
              {teacher.qualifications && (
                <Text type="secondary" style={{ fontSize: 14, marginLeft: 10 }}>
                  {teacher.qualifications[0]}
                </Text>
              )}
            </Title>
            <Space size="middle" wrap>
              <Text><IdcardOutlined /> ID: {teacher.teacherId || teacher.id}</Text>
              <Tag color="blue">{teacher.department || 'N/A'}</Tag>
              <Badge status={getStatusColor(teacher.status)} text={teacher.status} />
              <Rate disabled defaultValue={teacher.rating || 4} />
            </Space>
            <div style={{ marginTop: 8 }}>
              <Space wrap>
                {teacher.subjects?.map((subject) => (
                  <Tag key={subject} color="cyan" icon={<BookOutlined />}>
                    {subject}
                  </Tag>
                ))}
              </Space>
            </div>
          </Col>
          <Col xs={24} sm={24} md={6} style={{ textAlign: 'right' }}>
            <Space direction="vertical">
              <Button icon={<EditOutlined />} onClick={() => onEdit(teacher)}>
                Edit
              </Button>
              <Button icon={<PrinterOutlined />} onClick={() => onPrint(teacher)}>
                Print
              </Button>
              <Button icon={<ShareAltOutlined />}>Share</Button>
            </Space>
          </Col>
        </Row>
      </div>

      <Divider />

      {/* Statistics Row */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <Statistic
            title="Experience"
            value={teacher.experience || 0}
            suffix="years"
            valueStyle={{ color: getExperienceLevel(teacher.experience || 0).color }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Classes"
            value={teacher.classes?.length || 0}
            prefix={<TeamOutlined />}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Rating"
            value={teacher.rating || 4.5}
            precision={1}
            suffix="/5"
            prefix={<StarOutlined />}
            valueStyle={{ color: '#faad14' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Students Taught"
            value={teacher.totalStudents || 120}
            prefix={<UserOutlined />}
          />
        </Col>
      </Row>

      {/* Tabs for different sections */}
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Personal Info" key="1">
          <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Full Name" span={1}>
              {teacher.name}
            </Descriptions.Item>
            <Descriptions.Item label="Teacher ID" span={1}>
              {teacher.teacherId || teacher.id}
            </Descriptions.Item>
            <Descriptions.Item label="Gender" span={1}>
              <Tag color={teacher.gender === 'Male' ? 'cyan' : 'pink'}>
                {teacher.gender}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth" span={1}>
              {moment(teacher.dateOfBirth).format('MMMM DD, YYYY')}
              {` (${calculateAge(teacher.dateOfBirth)} years old)`}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={1}>
              <a href={`mailto:${teacher.email}`}>
                <MailOutlined /> {teacher.email}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Phone" span={1}>
              <a href={`tel:${teacher.phone}`}>
                <PhoneOutlined /> {teacher.phone}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={3}>
              <HomeOutlined /> {teacher.address || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Emergency Contact" span={1}>
              <SafetyOutlined /> {teacher.emergencyContact || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Emergency Contact Name" span={2}>
              {teacher.emergencyContactName || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane tab="Professional" key="2">
          <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Department">
              <BankOutlined /> {teacher.department || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Specialization">
              <TrophyOutlined /> {teacher.specialization || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Qualifications" span={2}>
              {teacher.qualifications?.join(', ') || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Subjects Teaching" span={2}>
              <Space wrap>
                {teacher.subjects?.map((subject) => (
                  <Tag key={subject} color="blue" icon={<BookOutlined />}>
                    {subject}
                  </Tag>
                )) || 'N/A'}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Experience">
              {teacher.experience} years - {getExperienceLevel(teacher.experience || 0).level}
            </Descriptions.Item>
            <Descriptions.Item label="Previous School">
              {teacher.previousSchool || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Certifications" span={2}>
              {teacher.certifications || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Professional Bio" span={2}>
              <Paragraph>{teacher.bio || 'No bio available'}</Paragraph>
            </Descriptions.Item>
          </Descriptions>
          
          {teacher.linkedIn || teacher.website ? (
            <div style={{ marginTop: 16 }}>
              <Space>
                {teacher.linkedIn && (
                  <Button icon={<LinkedinOutlined />} href={teacher.linkedIn} target="_blank">
                    LinkedIn Profile
                  </Button>
                )}
                {teacher.website && (
                  <Button icon={<GlobalOutlined />} href={teacher.website} target="_blank">
                    Personal Website
                  </Button>
                )}
              </Space>
            </div>
          ) : null}
        </TabPane>

        <TabPane tab="Employment" key="3">
          <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Joining Date">
              {moment(teacher.joiningDate).format('MMMM DD, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Employment Type">
              <Tag color="green">{teacher.employmentType || 'Full-time'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Monthly Salary">
              <DollarOutlined /> {teacher.salary ? `$${teacher.salary.toLocaleString()}` : 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Badge status={getStatusColor(teacher.status)} text={teacher.status} />
            </Descriptions.Item>
            <Descriptions.Item label="Working Hours">
              <ClockCircleOutlined /> {teacher.workingHours || '8:00 AM - 4:00 PM'}
            </Descriptions.Item>
            <Descriptions.Item label="Office/Staff Room">
              {teacher.officeRoom || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Total Working Days">
              {moment().diff(moment(teacher.joiningDate), 'days')} days
            </Descriptions.Item>
            <Descriptions.Item label="Years at School">
              {moment().diff(moment(teacher.joiningDate), 'years', true).toFixed(1)} years
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane tab="Schedule" key="4">
          <Title level={5}><ScheduleOutlined /> Weekly Class Schedule</Title>
          <Table
            dataSource={classSchedule}
            pagination={false}
            size="small"
            columns={[
              { title: 'Time', dataIndex: 'time', key: 'time', width: 100 },
              { title: 'Monday', dataIndex: 'monday', key: 'monday' },
              { title: 'Tuesday', dataIndex: 'tuesday', key: 'tuesday' },
              { title: 'Wednesday', dataIndex: 'wednesday', key: 'wednesday' },
              { title: 'Thursday', dataIndex: 'thursday', key: 'thursday' },
              { title: 'Friday', dataIndex: 'friday', key: 'friday' },
            ]}
          />
        </TabPane>

        <TabPane tab="Performance" key="5">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Performance Metrics" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text>Student Satisfaction</Text>
                    <Rate disabled value={performanceData.studentSatisfaction} />
                    <Text type="secondary"> ({performanceData.studentSatisfaction}/5)</Text>
                  </div>
                  <div>
                    <Text>Attendance Rate</Text>
                    <Progress 
                      percent={performanceData.attendanceRate} 
                      strokeColor="#52c41a"
                    />
                  </div>
                  <div>
                    <Text>Course Completion Rate</Text>
                    <Progress 
                      percent={performanceData.completionRate} 
                      strokeColor="#1890ff"
                    />
                  </div>
                  <div>
                    <Text>Average Student Grade</Text>
                    <Progress 
                      percent={performanceData.avgStudentGrade * 10} 
                      strokeColor="#722ed1"
                      format={() => `${performanceData.avgStudentGrade}/10`}
                    />
                  </div>
                </Space>
              </Card>
            </Col>
            
            <Col span={12}>
              <Card title="Recent Activities" size="small">
                <Timeline>
                  {recentActivities.map((activity) => (
                    <Timeline.Item key={`${activity.activity}-${activity.date}`} color="blue">
                      <Text>{activity.activity}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {moment(activity.date).format('MMM DD, YYYY')}
                      </Text>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Achievements" key="6">
          <List
            itemLayout="horizontal"
            dataSource={achievements}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<TrophyOutlined style={{ fontSize: 24, color: '#faad14' }} />}
                  title={<Space><Text strong>{item.title}</Text><Tag color="blue">{item.year}</Tag></Space>}
                  description={item.description}
                />
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default TeacherCard;
