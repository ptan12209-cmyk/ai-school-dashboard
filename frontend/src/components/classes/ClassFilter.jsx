// ClassFilter.jsx - Filter component for classes list
import React, { useState } from 'react';
import {
  Form,
  Select,
  Button,
  Space,
  Row,
  Col,
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
import './ClassFilter.scss';

const { Option } = Select;
const { Panel } = Collapse;

const ClassFilter = ({ onApply, onReset }) => {
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
    <Card className="class-filter-card">
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
              {/* Grade Level Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="gradeLevel" label="Grade Level">
                  <Select
                    placeholder="All Grades"
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="1">Grade 1</Option>
                    <Option value="2">Grade 2</Option>
                    <Option value="3">Grade 3</Option>
                    <Option value="4">Grade 4</Option>
                    <Option value="5">Grade 5</Option>
                    <Option value="6">Grade 6</Option>
                    <Option value="7">Grade 7</Option>
                    <Option value="8">Grade 8</Option>
                    <Option value="9">Grade 9</Option>
                    <Option value="10">Grade 10</Option>
                    <Option value="11">Grade 11</Option>
                    <Option value="12">Grade 12</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* School Year Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="schoolYear" label="School Year">
                  <Select placeholder="All Years" allowClear>
                    <Option value="2024-2025">2024-2025</Option>
                    <Option value="2023-2024">2023-2024</Option>
                    <Option value="2022-2023">2022-2023</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Status Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="isActive" label="Status">
                  <Select placeholder="All Status" allowClear>
                    <Option value="true">Active</Option>
                    <Option value="false">Inactive</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Building/Floor Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="building" label="Building/Floor">
                  <Select placeholder="All Buildings" allowClear>
                    <Option value="A">Building A</Option>
                    <Option value="B">Building B</Option>
                    <Option value="C">Building C</Option>
                    <Option value="1">1st Floor</Option>
                    <Option value="2">2nd Floor</Option>
                    <Option value="3">3rd Floor</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Student Count Range */}
              <Col xs={24} sm={12} md={8}>
                <Form.Item name="studentCountRange" label="Student Count">
                  <Slider
                    range
                    min={0}
                    max={50}
                    defaultValue={[0, 50]}
                    marks={{
                      0: '0',
                      25: '25',
                      50: '50'
                    }}
                  />
                </Form.Item>
              </Col>

              {/* Capacity Utilization */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="capacityUtilization" label="Capacity">
                  <Select placeholder="All" allowClear>
                    <Option value="under">Under-capacity (&lt;80%)</Option>
                    <Option value="optimal">Optimal (80-95%)</Option>
                    <Option value="full">Full (95-100%)</Option>
                    <Option value="over">Over-capacity (&gt;100%)</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Max Students */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="maxStudents" label="Max Capacity">
                  <Select placeholder="All" allowClear>
                    <Option value="1-20">1-20 students</Option>
                    <Option value="21-30">21-30 students</Option>
                    <Option value="31-40">31-40 students</Option>
                    <Option value="40+">40+ students</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Additional Filters - Collapsed by default */}
            <Collapse ghost>
              <Panel header="More Filters" key="2">
                <Row gutter={16}>
                  {/* Has Homeroom Teacher */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="hasTeacher" label="Homeroom Teacher">
                      <Select placeholder="All" allowClear>
                        <Option value="yes">Assigned</Option>
                        <Option value="no">Not Assigned</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Performance */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="performance" label="Class Performance">
                      <Select placeholder="All" allowClear>
                        <Option value="excellent">Excellent (Avg 8.5+)</Option>
                        <Option value="good">Good (Avg 7.0-8.5)</Option>
                        <Option value="average">Average (Avg 6.0-7.0)</Option>
                        <Option value="needs-improvement">Needs Improvement (&lt;6.0)</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Attendance Rate */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="attendanceRate" label="Attendance Rate">
                      <Select placeholder="All" allowClear>
                        <Option value="excellent">Excellent (95%+)</Option>
                        <Option value="good">Good (90-94%)</Option>
                        <Option value="fair">Fair (85-89%)</Option>
                        <Option value="poor">Poor (&lt;85%)</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Shift/Time */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="shift" label="Shift">
                      <Select placeholder="All" allowClear>
                        <Option value="morning">Morning</Option>
                        <Option value="afternoon">Afternoon</Option>
                        <Option value="evening">Evening</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Special Programs */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="specialProgram" label="Special Program">
                      <Select placeholder="All" allowClear>
                        <Option value="honors">Honors</Option>
                        <Option value="advanced">Advanced Placement</Option>
                        <Option value="bilingual">Bilingual</Option>
                        <Option value="stem">STEM</Option>
                        <Option value="arts">Arts</Option>
                        <Option value="regular">Regular</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Gender Composition */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="genderComposition" label="Gender Mix">
                      <Select placeholder="All" allowClear>
                        <Option value="mixed">Mixed</Option>
                        <Option value="male-majority">Male Majority (60%+)</Option>
                        <Option value="female-majority">Female Majority (60%+)</Option>
                        <Option value="balanced">Balanced (40-60%)</Option>
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

export default ClassFilter;
