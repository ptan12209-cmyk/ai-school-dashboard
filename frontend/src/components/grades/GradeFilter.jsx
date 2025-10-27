// GradeFilter.jsx - Filter component for grades list
import React, { useState } from 'react';
import {
  Form,
  Select,
  Button,
  Space,
  Row,
  Col,
  DatePicker,
  InputNumber,
  Card,
  Tag,
  Collapse,
  Slider
} from 'antd';
import {
  SearchOutlined,
  ClearOutlined,
  FilterOutlined
} from '@ant-design/icons';
import './GradeFilter.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const GradeFilter = ({ onApply, onReset }) => {
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
    <Card className="grade-filter-card">
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
              {/* Grade Type Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="gradeType" label="Grade Type">
                  <Select
                    placeholder="All Types"
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="Quiz">Quiz</Option>
                    <Option value="Test">Test</Option>
                    <Option value="Assignment">Assignment</Option>
                    <Option value="Project">Project</Option>
                    <Option value="Midterm">Midterm</Option>
                    <Option value="Final">Final</Option>
                    <Option value="Participation">Participation</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Semester Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="semester" label="Semester">
                  <Select placeholder="All Semesters" allowClear>
                    <Option value="1">Semester 1</Option>
                    <Option value="2">Semester 2</Option>
                    <Option value="Summer">Summer</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Published Status */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="isPublished" label="Status">
                  <Select placeholder="All Status" allowClear>
                    <Option value="true">Published</Option>
                    <Option value="false">Draft</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Letter Grade */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="letterGrade" label="Letter Grade">
                  <Select
                    placeholder="All Grades"
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="A+">A+</Option>
                    <Option value="A">A</Option>
                    <Option value="B+">B+</Option>
                    <Option value="B">B</Option>
                    <Option value="C+">C+</Option>
                    <Option value="C">C</Option>
                    <Option value="D">D</Option>
                    <Option value="F">F</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Score Range */}
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="scoreRange" label="Score Range">
                  <Slider
                    range
                    min={0}
                    max={100}
                    defaultValue={[0, 100]}
                    marks={{
                      0: '0',
                      50: '50',
                      100: '100'
                    }}
                  />
                </Form.Item>
              </Col>

              {/* Graded Date Range */}
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="gradedDateRange" label="Graded Date">
                  <RangePicker
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>

              {/* Weight Range */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="weight" label="Weight (%)">
                  <Select placeholder="All Weights" allowClear>
                    <Option value="0-10">0-10%</Option>
                    <Option value="11-20">11-20%</Option>
                    <Option value="21-30">21-30%</Option>
                    <Option value="31-50">31-50%</Option>
                    <Option value="51-100">51-100%</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Additional Filters - Collapsed by default */}
            <Collapse ghost>
              <Panel header="More Filters" key="2">
                <Row gutter={16}>
                  {/* Performance Category */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="performance" label="Performance">
                      <Select placeholder="Select" allowClear>
                        <Option value="excellent">Excellent (90-100)</Option>
                        <Option value="good">Good (80-89)</Option>
                        <Option value="satisfactory">Satisfactory (70-79)</Option>
                        <Option value="needs-improvement">Needs Improvement (60-69)</Option>
                        <Option value="failing">Failing (&lt;60)</Option>
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

                  {/* Modified Recently */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="recentlyModified" label="Modified">
                      <Select placeholder="All" allowClear>
                        <Option value="today">Today</Option>
                        <Option value="week">This Week</Option>
                        <Option value="month">This Month</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Pass/Fail */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="passFail" label="Pass/Fail">
                      <Select placeholder="All" allowClear>
                        <Option value="pass">Pass (≥60)</Option>
                        <Option value="fail">Fail (&lt;60)</Option>
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

export default GradeFilter;
