/**
 * AttendanceStats.jsx - Attendance Statistics Component
 * ====================================================
 * Displays attendance statistics and analytics
 */

import React from 'react';
import { 
  Card, 
  Row, 
  Col, 
  Statistic, 
  Progress, 
  Typography,
  Table,
  Tag 
} from 'antd';
import { 
  UserOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AttendanceStats = ({ 
  attendanceData = [], 
  students = [], 
  dateRange = 'This Month' 
}) => {
  // Mock data if none provided
  const mockAttendance = [
    { studentId: 1, status: 'present', date: '2024-01-15' },
    { studentId: 1, status: 'present', date: '2024-01-16' },
    { studentId: 1, status: 'late', date: '2024-01-17' },
    { studentId: 2, status: 'present', date: '2024-01-15' },
    { studentId: 2, status: 'absent', date: '2024-01-16' },
    { studentId: 2, status: 'present', date: '2024-01-17' },
  ];

  const mockStudents = [
    { id: 1, name: 'Alice Johnson', class: '10A' },
    { id: 2, name: 'Bob Smith', class: '10A' },
    { id: 3, name: 'Carol Davis', class: '10B' },
  ];

  const attendance = attendanceData.length > 0 ? attendanceData : mockAttendance;
  const studentData = students.length > 0 ? students : mockStudents;

  // Calculate statistics
  const totalRecords = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const lateCount = attendance.filter(a => a.status === 'late').length;

  const attendanceRate = totalRecords > 0 ? ((presentCount + lateCount) / totalRecords * 100) : 0;
  const absenteeRate = totalRecords > 0 ? (absentCount / totalRecords * 100) : 0;

  // Student-wise statistics
  const studentStats = studentData.map(student => {
    const studentAttendance = attendance.filter(a => a.studentId === student.id);
    const studentPresent = studentAttendance.filter(a => a.status === 'present').length;
    const studentLate = studentAttendance.filter(a => a.status === 'late').length;
    const studentAbsent = studentAttendance.filter(a => a.status === 'absent').length;
    const studentTotal = studentAttendance.length;
    const studentRate = studentTotal > 0 ? ((studentPresent + studentLate) / studentTotal * 100) : 0;

    return {
      ...student,
      present: studentPresent,
      late: studentLate,
      absent: studentAbsent,
      total: studentTotal,
      rate: studentRate
    };
  });

  const getAttendanceColor = (rate) => {
    if (rate >= 90) return 'green';
    if (rate >= 75) return 'orange';
    return 'red';
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.class}</div>
        </div>
      )
    },
    {
      title: 'Present',
      dataIndex: 'present',
      key: 'present',
      align: 'center',
      render: (count) => (
        <Tag color="green" icon={<CheckCircleOutlined />}>
          {count}
        </Tag>
      )
    },
    {
      title: 'Late',
      dataIndex: 'late',
      key: 'late',
      align: 'center',
      render: (count) => (
        <Tag color="orange" icon={<ClockCircleOutlined />}>
          {count}
        </Tag>
      )
    },
    {
      title: 'Absent',
      dataIndex: 'absent',
      key: 'absent',
      align: 'center',
      render: (count) => (
        <Tag color="red" icon={<CloseCircleOutlined />}>
          {count}
        </Tag>
      )
    },
    {
      title: 'Attendance Rate',
      dataIndex: 'rate',
      key: 'rate',
      align: 'center',
      sorter: (a, b) => a.rate - b.rate,
      render: (rate) => (
        <div>
          <Tag color={getAttendanceColor(rate)}>
            {rate.toFixed(1)}%
          </Tag>
          <Progress 
            percent={rate} 
            size="small" 
            showInfo={false}
            strokeColor={getAttendanceColor(rate)}
          />
        </div>
      )
    }
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        Attendance Statistics - {dateRange}
      </Title>

      {/* Overall Statistics */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={studentData.length}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Attendance Rate"
              value={attendanceRate.toFixed(1)}
              suffix="%"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Absentee Rate"
              value={absenteeRate.toFixed(1)}
              suffix="%"
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Late Arrivals"
              value={lateCount}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Attendance Overview */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Overall Performance" size="small">
            <div style={{ marginBottom: 16 }}>
              <Text>Class Attendance Rate</Text>
              <Progress 
                percent={attendanceRate} 
                strokeColor={{
                  '0%': '#f5222d',
                  '50%': '#faad14',
                  '100%': '#52c41a',
                }}
              />
            </div>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                    {presentCount}
                  </div>
                  <Text type="secondary">Present</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#faad14' }}>
                    {lateCount}
                  </div>
                  <Text type="secondary">Late</Text>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f5222d' }}>
                    {absentCount}
                  </div>
                  <Text type="secondary">Absent</Text>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Performance Insights" size="small">
            <Row gutter={[8, 8]}>
              <Col span={12}>
                <Statistic
                  title="Perfect Attendance"
                  value={studentStats.filter(s => s.rate === 100).length}
                  suffix={`/ ${studentData.length}`}
                  valueStyle={{ fontSize: '18px', color: '#52c41a' }}
                  prefix={<TrophyOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="At Risk (< 75%)"
                  value={studentStats.filter(s => s.rate < 75).length}
                  suffix={`/ ${studentData.length}`}
                  valueStyle={{ fontSize: '18px', color: '#f5222d' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Average Rate"
                  value={(studentStats.reduce((sum, s) => sum + s.rate, 0) / studentStats.length).toFixed(1)}
                  suffix="%"
                  valueStyle={{ fontSize: '18px' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Total Days"
                  value={Math.max(...studentStats.map(s => s.total), 0)}
                  valueStyle={{ fontSize: '18px' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Student-wise Statistics Table */}
      <Card title="Student-wise Attendance" size="small">
        <Table
          columns={columns}
          dataSource={studentStats}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
          }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default AttendanceStats;
