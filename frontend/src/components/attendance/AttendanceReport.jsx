/**
 * AttendanceReport.jsx - Attendance Report Component
 * =================================================
 * Generates comprehensive attendance reports
 */

import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Select, 
  DatePicker, 
  Button, 
  Table, 
  Row, 
  Col,
  Statistic,
  Typography,
  Divider,
  Space 
} from 'antd';
import { 
  DownloadOutlined, 
  PrinterOutlined,
  FileExcelOutlined,
  FilePdfOutlined 
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

const AttendanceReport = ({ 
  students = [], 
  classes = [], 
  attendanceData = [],
  onGenerateReport 
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  // Mock data if none provided
  const mockStudents = [
    { id: 1, name: 'Alice Johnson', class: '10A', rollNumber: '001' },
    { id: 2, name: 'Bob Smith', class: '10A', rollNumber: '002' },
    { id: 3, name: 'Carol Davis', class: '10B', rollNumber: '003' },
  ];

  const mockClasses = [
    { id: '10A', name: 'Class 10A' },
    { id: '10B', name: 'Class 10B' },
    { id: '11A', name: 'Class 11A' },
  ];

  const mockAttendance = [
    { studentId: 1, date: '2024-01-15', status: 'present' },
    { studentId: 1, date: '2024-01-16', status: 'present' },
    { studentId: 1, date: '2024-01-17', status: 'late' },
    { studentId: 2, date: '2024-01-15', status: 'present' },
    { studentId: 2, date: '2024-01-16', status: 'absent' },
    { studentId: 3, date: '2024-01-15', status: 'present' },
  ];

  const studentData = students.length > 0 ? students : mockStudents;
  const classData = classes.length > 0 ? classes : mockClasses;
  const attendance = attendanceData.length > 0 ? attendanceData : mockAttendance;

  const generateReport = async (values) => {
    setLoading(true);
    try {
      // Filter data based on form values
      let filteredStudents = studentData;
      let filteredAttendance = attendance;

      if (values.class) {
        filteredStudents = studentData.filter(s => s.class === values.class);
      }

      if (values.student) {
        filteredStudents = studentData.filter(s => s.id === values.student);
      }

      if (values.dateRange) {
        const [startDate, endDate] = values.dateRange;
        filteredAttendance = attendance.filter(a => {
          const date = moment(a.date);
          return date.isBetween(startDate, endDate, 'day', '[]');
        });
      }

      // Generate report data
      const report = filteredStudents.map(student => {
        const studentAttendance = filteredAttendance.filter(a => a.studentId === student.id);
        const present = studentAttendance.filter(a => a.status === 'present').length;
        const late = studentAttendance.filter(a => a.status === 'late').length;
        const absent = studentAttendance.filter(a => a.status === 'absent').length;
        const total = studentAttendance.length;
        const rate = total > 0 ? ((present + late) / total * 100) : 0;

        return {
          ...student,
          present,
          late,
          absent,
          total,
          rate: rate.toFixed(1)
        };
      });

      setReportData({
        students: report,
        summary: {
          totalStudents: report.length,
          averageRate: (report.reduce((sum, s) => sum + parseFloat(s.rate), 0) / report.length).toFixed(1),
          totalPresent: report.reduce((sum, s) => sum + s.present, 0),
          totalAbsent: report.reduce((sum, s) => sum + s.absent, 0),
          totalLate: report.reduce((sum, s) => sum + s.late, 0)
        },
        filters: values
      });

      if (onGenerateReport) {
        onGenerateReport(report);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format) => {
    console.log(`Exporting report in ${format} format`);
    // Implementation for export functionality
  };

  const columns = [
    {
      title: 'Roll No.',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
      width: 80
    },
    {
      title: 'Student Name',
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
      render: (count) => <span style={{ color: '#52c41a', fontWeight: 'bold' }}>{count}</span>
    },
    {
      title: 'Late',
      dataIndex: 'late',
      key: 'late',
      align: 'center',
      render: (count) => <span style={{ color: '#faad14', fontWeight: 'bold' }}>{count}</span>
    },
    {
      title: 'Absent',
      dataIndex: 'absent',
      key: 'absent',
      align: 'center',
      render: (count) => <span style={{ color: '#f5222d', fontWeight: 'bold' }}>{count}</span>
    },
    {
      title: 'Total Days',
      dataIndex: 'total',
      key: 'total',
      align: 'center'
    },
    {
      title: 'Attendance Rate',
      dataIndex: 'rate',
      key: 'rate',
      align: 'center',
      sorter: (a, b) => parseFloat(a.rate) - parseFloat(b.rate),
      render: (rate) => {
        const numRate = parseFloat(rate);
        const color = numRate >= 90 ? '#52c41a' : numRate >= 75 ? '#faad14' : '#f5222d';
        return <span style={{ color, fontWeight: 'bold' }}>{rate}%</span>;
      }
    }
  ];

  return (
    <Card title="Attendance Report Generator">
      <Form
        form={form}
        layout="vertical"
        onFinish={generateReport}
      >
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item name="class" label="Class">
              <Select placeholder="Select class (optional)" allowClear>
                {classData.map(cls => (
                  <Option key={cls.id} value={cls.id}>{cls.name}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="student" label="Student">
              <Select placeholder="Select student (optional)" allowClear>
                {studentData.map(student => (
                  <Option key={student.id} value={student.id}>
                    {student.name} - {student.class}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={8}>
            <Form.Item name="dateRange" label="Date Range">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Generate Report
          </Button>
        </Form.Item>
      </Form>

      {reportData && (
        <>
          <Divider />
          
          {/* Report Header */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Title level={3}>Attendance Report</Title>
            <Text type="secondary">
              Generated on {moment().format('MMMM DD, YYYY')}
            </Text>
            {reportData.filters.dateRange && (
              <div>
                <Text type="secondary">
                  Period: {reportData.filters.dateRange[0].format('MMM DD, YYYY')} - {reportData.filters.dateRange[1].format('MMM DD, YYYY')}
                </Text>
              </div>
            )}
          </div>

          {/* Summary Statistics */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={6}>
              <Card size="small">
                <Statistic
                  title="Total Students"
                  value={reportData.summary.totalStudents}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card size="small">
                <Statistic
                  title="Average Rate"
                  value={reportData.summary.averageRate}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card size="small">
                <Statistic
                  title="Total Present"
                  value={reportData.summary.totalPresent}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={6}>
              <Card size="small">
                <Statistic
                  title="Total Absent"
                  value={reportData.summary.totalAbsent}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Export Options */}
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Space>
              <Button 
                icon={<FileExcelOutlined />} 
                onClick={() => exportReport('excel')}
              >
                Export Excel
              </Button>
              <Button 
                icon={<FilePdfOutlined />} 
                onClick={() => exportReport('pdf')}
              >
                Export PDF
              </Button>
              <Button 
                icon={<PrinterOutlined />} 
                onClick={() => window.print()}
              >
                Print
              </Button>
            </Space>
          </div>

          {/* Report Table */}
          <Table
            columns={columns}
            dataSource={reportData.students}
            rowKey="id"
            pagination={{
              pageSize: 20,
              showSizeChanger: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} students`,
            }}
            size="small"
          />
        </>
      )}
    </Card>
  );
};

export default AttendanceReport;
