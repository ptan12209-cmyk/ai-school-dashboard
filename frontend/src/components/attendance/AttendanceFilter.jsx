// AttendanceFilter.jsx - Filter component for attendance list
import React, { useState } from 'react';
import {
  Form,
  Select,
  Button,
  Space,
  Row,
  Col,
  DatePicker,
  Card,
  Tag,
  Collapse,
  TimePicker
} from 'antd';
import {
  SearchOutlined,
  ClearOutlined,
  FilterOutlined
} from '@ant-design/icons';
import './AttendanceFilter.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const AttendanceFilter = ({ onApply, onReset }) => {
  const [form] = Form.useForm();
  const [activeFilters, setActiveFilters] = useState(0);

  // Handle filter apply
  const handleApply = (values) => {
    // Clean up undefined values
    const filters = Object.keys(values).reduce((acc, key) => {
      if (values[key] !== undefined && values[key] !== null && values[key] !== '') {
        acc[key] = values[key];
      }
      return acc;
    }, {});

    // Count active filters
    setActiveFilters(Object.keys(filters).length);

    if (onApply) {
      onApply(filters);
    }
  };

  // Handle filter reset
  const handleReset = () => {
    form.resetFields();
    setActiveFilters(0);

    if (onReset) {
      onReset();
    }
  };

  return (
    <Card className="attendance-filter-card">
      <Collapse defaultActiveKey={['1']} ghost>
        <Panel
          header={
            <Space>
              <FilterOutlined />
              <span>Advanced Filters</span>
              {activeFilters > 0 && (
                <Tag color="blue">{activeFilters} active</Tag>
              )}
            </Space>
          }
          key="1"
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleApply}
            autoComplete="off"
          >
            <Row gutter={16}>
              {/* Status Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="status" label="Attendance Status">
                  <Select
                    placeholder="All Status"
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="Present">Present</Option>
                    <Option value="Absent">Absent</Option>
                    <Option value="Late">Late</Option>
                    <Option value="Excused">Excused</Option>
                    <Option value="Half-day">Half-day</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Date Range Filter */}
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="dateRange" label="Date Range">
                  <RangePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>

              {/* Day of Week */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="dayOfWeek" label="Day of Week">
                  <Select
                    placeholder="All Days"
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="Monday">Monday</Option>
                    <Option value="Tuesday">Tuesday</Option>
                    <Option value="Wednesday">Wednesday</Option>
                    <Option value="Thursday">Thursday</Option>
                    <Option value="Friday">Friday</Option>
                    <Option value="Saturday">Saturday</Option>
                    <Option value="Sunday">Sunday</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Month Filter */}
              <Col xs={24} sm={12} md={4}>
                <Form.Item name="month" label="Month">
                  <Select placeholder="All Months" allowClear>
                    <Option value="1">January</Option>
                    <Option value="2">February</Option>
                    <Option value="3">March</Option>
                    <Option value="4">April</Option>
                    <Option value="5">May</Option>
                    <Option value="6">June</Option>
                    <Option value="7">July</Option>
                    <Option value="8">August</Option>
                    <Option value="9">September</Option>
                    <Option value="10">October</Option>
                    <Option value="11">November</Option>
                    <Option value="12">December</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Additional Filters - Collapsed by default */}
            <Collapse ghost>
              <Panel header="More Filters" key="2">
                <Row gutter={16}>
                  {/* Check-in Time Range */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="checkInTime" label="Check-in Time">
                      <Select placeholder="All" allowClear>
                        <Option value="on-time">On Time (Before 8:00 AM)</Option>
                        <Option value="late">Late (After 8:00 AM)</Option>
                        <Option value="very-late">Very Late (After 9:00 AM)</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Has Notes */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="hasNotes" label="Notes">
                      <Select placeholder="All" allowClear>
                        <Option value="yes">Has Notes</Option>
                        <Option value="no">No Notes</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Perfect Attendance */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="perfectAttendance" label="Attendance Pattern">
                      <Select placeholder="All" allowClear>
                        <Option value="perfect">Perfect (100%)</Option>
                        <Option value="excellent">Excellent (95-99%)</Option>
                        <Option value="good">Good (90-94%)</Option>
                        <Option value="fair">Fair (80-89%)</Option>
                        <Option value="poor">Poor (&lt;80%)</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Consecutive Absences */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="consecutiveAbsences" label="Consecutive Absences">
                      <Select placeholder="All" allowClear>
                        <Option value="none">None</Option>
                        <Option value="1-2">1-2 days</Option>
                        <Option value="3-5">3-5 days</Option>
                        <Option value="6+">6+ days</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Year */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="year" label="Academic Year">
                      <Select placeholder="All Years" allowClear>
                        <Option value="2024-2025">2024-2025</Option>
                        <Option value="2023-2024">2023-2024</Option>
                        <Option value="2022-2023">2022-2023</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Late Pattern */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="latePattern" label="Late Pattern">
                      <Select placeholder="All" allowClear>
                        <Option value="never">Never Late</Option>
                        <Option value="occasional">Occasionally (1-5 times)</Option>
                        <Option value="frequent">Frequent (6+ times)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
            </Collapse>

            {/* Filter Actions */}
            <Row style={{ marginTop: 16 }}>
              <Col span={24}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    icon={<SearchOutlined />}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    onClick={handleReset}
                    icon={<ClearOutlined />}
                  >
                    Reset All
                  </Button>
                  {activeFilters > 0 && (
                    <Tag color="blue">
                      {activeFilters} filter{activeFilters > 1 ? 's' : ''} active
                    </Tag>
                  )}
                </Space>
              </Col>
            </Row>
          </Form>
        </Panel>
      </Collapse>
    </Card>
  );
};

export default AttendanceFilter;
