// ReportPage.jsx - Reports and Analytics Page
import React, { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Breadcrumb,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Table,
  Progress,
  Empty,
  Tabs,
  List,
  Avatar,
  Tag
} from 'antd';
import {
  BarChartOutlined,
  HomeOutlined,
  DownloadOutlined,
  PrinterOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  TrophyOutlined,
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const ReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('academic');
  const [dateRange, setDateRange] = useState(null);

  // Mock data for reports
  const academicData = [
    { subject: 'Mathematics', avgGrade: 8.5, students: 120, passRate: 92 },
    { subject: 'Science', avgGrade: 7.8, students: 115, passRate: 88 },
    { subject: 'English', avgGrade: 8.2, students: 125, passRate: 95 },
    { subject: 'History', avgGrade: 7.5, students: 110, passRate: 85 }
  ];

  const attendanceData = [
    { class: '10A', present: 28, total: 30, rate: 93.3 },
    { class: '10B', present: 25, total: 28, rate: 89.3 },
    { class: '11A', present: 30, total: 32, rate: 93.8 },
    { class: '11B', present: 27, total: 30, rate: 90.0 }
  ];

  const topPerformers = [
    { name: 'Alice Johnson', grade: 9.5, class: '10A', subject: 'Mathematics' },
    { name: 'Bob Smith', grade: 9.2, class: '11B', subject: 'Science' },
    { name: 'Carol Davis', grade: 9.0, class: '10B', subject: 'English' }
  ];

  const academicColumns = [
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      render: (subject) => (
        <Space>
          <BookOutlined />
          <Text strong>{subject}</Text>
        </Space>
      )
    },
    {
      title: 'Students',
      dataIndex: 'students',
      key: 'students',
      render: (count) => (
        <Space>
          <TeamOutlined />
          <Text>{count}</Text>
        </Space>
      )
    },
    {
      title: 'Average Grade',
      dataIndex: 'avgGrade',
      key: 'avgGrade',
      render: (grade) => (
        <Tag color={grade >= 8 ? 'green' : grade >= 7 ? 'orange' : 'red'}>
          {grade.toFixed(1)}
        </Tag>
      )
    },
    {
      title: 'Pass Rate',
      dataIndex: 'passRate',
      key: 'passRate',
      render: (rate) => (
        <Progress 
          percent={rate} 
          size="small" 
          status={rate >= 90 ? 'success' : rate >= 80 ? 'normal' : 'exception'}
        />
      )
    }
  ];

  const attendanceColumns = [
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      render: (className) => (
        <Tag color="blue">{className}</Tag>
      )
    },
    {
      title: 'Present/Total',
      key: 'attendance',
      render: (_, record) => (
        <Text>{record.present}/{record.total}</Text>
      )
    },
    {
      title: 'Attendance Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate) => (
        <Progress 
          percent={rate} 
          size="small" 
          status={rate >= 95 ? 'success' : rate >= 85 ? 'normal' : 'exception'}
        />
      )
    }
  ];

  const handleExport = (format) => {
    console.log(`Exporting report as ${format}`);
    // Implementation would go here
  };

  return (
    <div className="report-page">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <BarChartOutlined /> Reports
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header */}
      <div className="page-header">
        <Title level={2}>
          <BarChartOutlined /> Reports & Analytics
        </Title>
      </div>

      {/* Report Controls */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col>
            <Space>
              <Text strong>Report Type:</Text>
              <Select 
                value={reportType} 
                onChange={setReportType}
                style={{ width: 150 }}
              >
                <Option value="academic">Academic Performance</Option>
                <Option value="attendance">Attendance</Option>
                <Option value="teacher">Teacher Performance</Option>
                <Option value="financial">Financial</Option>
              </Select>
            </Space>
          </Col>
          <Col>
            <Space>
              <Text strong>Date Range:</Text>
              <RangePicker onChange={setDateRange} />
            </Space>
          </Col>
          <Col flex="auto" style={{ textAlign: 'right' }}>
            <Space>
              <Button icon={<FileExcelOutlined />} onClick={() => handleExport('excel')}>
                Export Excel
              </Button>
              <Button icon={<FilePdfOutlined />} onClick={() => handleExport('pdf')}>
                Export PDF
              </Button>
              <Button icon={<PrinterOutlined />} onClick={() => window.print()}>
                Print
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Report Content */}
      <Row gutter={16}>
        <Col span={16}>
          <Card title="Performance Overview" style={{ marginBottom: 16 }}>
            <Tabs defaultActiveKey="academic">
              <TabPane tab="Academic Performance" key="academic">
                <Table
                  columns={academicColumns}
                  dataSource={academicData}
                  rowKey="subject"
                  pagination={false}
                  size="small"
                />
              </TabPane>
              <TabPane tab="Attendance Report" key="attendance">
                <Table
                  columns={attendanceColumns}
                  dataSource={attendanceData}
                  rowKey="class"
                  pagination={false}
                  size="small"
                />
              </TabPane>
            </Tabs>
          </Card>

          {/* Summary Statistics */}
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Overall Pass Rate"
                  value={90}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                  prefix={<TrophyOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Average Attendance"
                  value={91.6}
                  suffix="%"
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Total Students"
                  value={470}
                  valueStyle={{ color: '#722ed1' }}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </Col>

        <Col span={8}>
          <Card title="Top Performers" style={{ marginBottom: 16 }}>
            <List
              dataSource={topPerformers}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: index === 0 ? '#faad14' : 
                                          index === 1 ? '#c0c0c0' : '#cd7f32' 
                        }}
                      >
                        {index + 1}
                      </Avatar>
                    }
                    title={item.name}
                    description={
                      <Space direction="vertical" size={0}>
                        <Text type="secondary">{item.class} - {item.subject}</Text>
                        <Tag color="green">Grade: {item.grade}</Tag>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block icon={<BarChartOutlined />}>
                Generate Custom Report
              </Button>
              <Button block icon={<CalendarOutlined />}>
                Schedule Report
              </Button>
              <Button block icon={<DownloadOutlined />}>
                Download Templates
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportPage;
