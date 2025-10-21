// StudentCard.jsx - Card component for displaying student details
import React from 'react';
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
  Empty
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
  DownloadOutlined,
  TeamOutlined,
  BookOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  IdcardOutlined,
  HeartOutlined,
  SafetyOutlined
} from '@ant-design/icons';
import moment from 'moment';
import './StudentCard.scss';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const StudentCard = ({ student, onEdit, onPrint, compact = false }) => {
  if (!student) {
    return (
      <Card>
        <Empty description="No student data available" />
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
      'Inactive': 'default',
      'Graduated': 'blue',
      'Suspended': 'error',
      'Transferred': 'warning'
    };
    return statusColors[status] || 'default';
  };

  // Grade color
  const getGradeColor = (grade) => {
    if (grade >= 8.5) return '#52c41a';
    if (grade >= 7) return '#1890ff';
    if (grade >= 5.5) return '#faad14';
    return '#f5222d';
  };

  // Mock data for demonstration
  const recentGrades = [
    { subject: 'Mathematics', score: 8.5, date: '2024-01-15' },
    { subject: 'Physics', score: 7.8, date: '2024-01-14' },
    { subject: 'Chemistry', score: 9.0, date: '2024-01-13' },
    { subject: 'English', score: 8.2, date: '2024-01-12' },
  ];

  const attendanceData = {
    present: 85,
    absent: 10,
    late: 5
  };

  // Compact Card View
  if (compact) {
    return (
      <Card 
        className="student-card-compact" 
        hoverable
        actions={[
          <Tooltip title="View Details">
            <UserOutlined key="view" />
          </Tooltip>,
          <Tooltip title="Edit">
            <EditOutlined key="edit" onClick={() => onEdit(student)} />
          </Tooltip>,
          <Tooltip title="Print">
            <PrinterOutlined key="print" onClick={() => onPrint(student)} />
          </Tooltip>
        ]}
      >
        <Card.Meta
          avatar={
            <Avatar 
              size={64} 
              src={student.avatar}
              icon={!student.avatar && <UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            >
              {!student.avatar && student.name?.charAt(0)}
            </Avatar>
          }
          title={
            <Space direction="vertical" size={0}>
              <Text strong>{student.name}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                ID: {student.studentId || student.id}
              </Text>
            </Space>
          }
          description={
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text><BookOutlined /> {student.className || 'N/A'}</Text>
              <Text><MailOutlined /> {student.email}</Text>
              <Text><PhoneOutlined /> {student.phone}</Text>
              <Badge status={getStatusColor(student.status)} text={student.status} />
            </Space>
          }
        />
      </Card>
    );
  }

  // Full Detail View
  return (
    <Card className="student-card-detail">
      {/* Header Section */}
      <div className="student-header">
        <Row gutter={24} align="middle">
          <Col xs={24} sm={6} md={4}>
            <Avatar 
              size={100} 
              src={student.avatar}
              icon={!student.avatar && <UserOutlined />}
              style={{ backgroundColor: '#1890ff' }}
            >
              {!student.avatar && student.name?.charAt(0)}
            </Avatar>
          </Col>
          <Col xs={24} sm={18} md={14}>
            <Title level={3} style={{ marginBottom: 8 }}>
              {student.name}
            </Title>
            <Space size="middle" wrap>
              <Text><IdcardOutlined /> ID: {student.studentId || student.id}</Text>
              <Tag color="blue">{student.className || 'N/A'}</Tag>
              <Badge status={getStatusColor(student.status)} text={student.status} />
            </Space>
          </Col>
          <Col xs={24} sm={24} md={6} style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<EditOutlined />} onClick={() => onEdit(student)}>
                Edit
              </Button>
              <Button icon={<PrinterOutlined />} onClick={() => onPrint(student)}>
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
            title="Grade Average"
            value={student.gradeAverage || 0}
            precision={1}
            suffix="/10"
            valueStyle={{ color: getGradeColor(student.gradeAverage || 0) }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Attendance"
            value={attendanceData.present}
            suffix="%"
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Age"
            value={calculateAge(student.dateOfBirth)}
            suffix="years"
            prefix={<CalendarOutlined />}
          />
        </Col>
        <Col xs={12} sm={6}>
          <Statistic
            title="Subjects"
            value={6}
            prefix={<BookOutlined />}
          />
        </Col>
      </Row>

      {/* Tabs for different sections */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="Personal Info" key="1">
          <Descriptions bordered column={{ xxl: 3, xl: 3, lg: 2, md: 2, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Full Name" span={1}>
              {student.name}
            </Descriptions.Item>
            <Descriptions.Item label="Student ID" span={1}>
              {student.studentId || student.id}
            </Descriptions.Item>
            <Descriptions.Item label="Gender" span={1}>
              <Tag color={student.gender === 'Male' ? 'cyan' : 'pink'}>
                {student.gender}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Date of Birth" span={1}>
              {moment(student.dateOfBirth).format('MMMM DD, YYYY')}
              {` (${calculateAge(student.dateOfBirth)} years old)`}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={1}>
              <a href={`mailto:${student.email}`}>
                <MailOutlined /> {student.email}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Phone" span={1}>
              <a href={`tel:${student.phone}`}>
                <PhoneOutlined /> {student.phone}
              </a>
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={3}>
              <HomeOutlined /> {student.address || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Enrollment Date" span={1}>
              {moment(student.enrollmentDate).format('MMMM DD, YYYY')}
            </Descriptions.Item>
            <Descriptions.Item label="Class" span={1}>
              <Tag color="blue">{student.className || 'N/A'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Status" span={1}>
              <Badge status={getStatusColor(student.status)} text={student.status} />
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane tab="Parent/Guardian" key="2">
          <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
            <Descriptions.Item label="Parent/Guardian Name">
              <TeamOutlined /> {student.parentName || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Relationship">
              {student.relationship || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Parent Phone">
              <PhoneOutlined /> {student.parentPhone || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Parent Email">
              <MailOutlined /> {student.parentEmail || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Emergency Contact" span={2}>
              <SafetyOutlined /> {student.emergencyContact || student.parentPhone || 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        <TabPane tab="Academic" key="3">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Recent Grades" size="small">
                <Table
                  dataSource={recentGrades}
                  columns={[
                    { title: 'Subject', dataIndex: 'subject', key: 'subject' },
                    { 
                      title: 'Score', 
                      dataIndex: 'score', 
                      key: 'score',
                      render: (score) => (
                        <Tag color={getGradeColor(score)}>{score}</Tag>
                      )
                    },
                    { title: 'Date', dataIndex: 'date', key: 'date' }
                  ]}
                  pagination={false}
                  size="small"
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Attendance Summary" size="small">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text>Present</Text>
                    <Progress 
                      percent={attendanceData.present} 
                      strokeColor="#52c41a"
                      format={(percent) => `${percent}%`}
                    />
                  </div>
                  <div>
                    <Text>Absent</Text>
                    <Progress 
                      percent={attendanceData.absent} 
                      strokeColor="#f5222d"
                      format={(percent) => `${percent}%`}
                    />
                  </div>
                  <div>
                    <Text>Late</Text>
                    <Progress 
                      percent={attendanceData.late} 
                      strokeColor="#faad14"
                      format={(percent) => `${percent}%`}
                    />
                  </div>
                </Space>
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane tab="Activity" key="4">
          <Timeline>
            <Timeline.Item color="green" dot={<CheckCircleOutlined />}>
              <p>Submitted Math Assignment</p>
              <Text type="secondary">2 hours ago</Text>
            </Timeline.Item>
            <Timeline.Item color="blue">
              <p>Attended Physics Lab</p>
              <Text type="secondary">Yesterday at 2:00 PM</Text>
            </Timeline.Item>
            <Timeline.Item color="orange" dot={<ExclamationCircleOutlined />}>
              <p>Late for Morning Assembly</p>
              <Text type="secondary">3 days ago</Text>
            </Timeline.Item>
            <Timeline.Item>
              <p>Parent-Teacher Meeting</p>
              <Text type="secondary">Last week</Text>
            </Timeline.Item>
            <Timeline.Item color="green" dot={<TrophyOutlined />}>
              <p>Won Science Competition</p>
              <Text type="secondary">2 weeks ago</Text>
            </Timeline.Item>
          </Timeline>
        </TabPane>

        <TabPane tab="Health & Notes" key="5">
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Medical Information">
              <HeartOutlined /> {student.medicalInfo || 'No medical conditions reported'}
            </Descriptions.Item>
            <Descriptions.Item label="Notes">
              {student.notes || 'No additional notes'}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default StudentCard;
