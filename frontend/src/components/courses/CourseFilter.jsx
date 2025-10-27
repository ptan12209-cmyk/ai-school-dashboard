// CourseFilter.jsx - Filter component for courses list
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
import './CourseFilter.scss';

const { Option } = Select;
const { Panel } = Collapse;

const CourseFilter = ({ onApply, onReset }) => {
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
    <Card className="course-filter-card">
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
              {/* Subject Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="subject" label="Subject">
                  <Select
                    placeholder="All Subjects"
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="Mathematics">Mathematics</Option>
                    <Option value="Physics">Physics</Option>
                    <Option value="Chemistry">Chemistry</Option>
                    <Option value="Biology">Biology</Option>
                    <Option value="English">English</Option>
                    <Option value="Literature">Literature</Option>
                    <Option value="History">History</Option>
                    <Option value="Geography">Geography</Option>
                    <Option value="Computer Science">Computer Science</Option>
                    <Option value="Physical Education">Physical Education</Option>
                    <Option value="Art">Art</Option>
                    <Option value="Music">Music</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Department Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="department" label="Department">
                  <Select placeholder="All Departments" allowClear>
                    <Option value="Science">Science</Option>
                    <Option value="Mathematics">Mathematics</Option>
                    <Option value="Languages">Languages</Option>
                    <Option value="Social Studies">Social Studies</Option>
                    <Option value="Arts">Arts</Option>
                    <Option value="Physical Education">Physical Education</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Status Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="status" label="Status">
                  <Select placeholder="All Status" allowClear>
                    <Option value="Active">Active</Option>
                    <Option value="Inactive">Inactive</Option>
                    <Option value="Archived">Archived</Option>
                    <Option value="Planned">Planned</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Credits Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="credits" label="Credits">
                  <Select placeholder="All" allowClear>
                    <Option value="1">1 Credit</Option>
                    <Option value="2">2 Credits</Option>
                    <Option value="3">3 Credits</Option>
                    <Option value="4">4 Credits</Option>
                    <Option value="5+">5+ Credits</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Semester Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="semester" label="Semester">
                  <Select
                    placeholder="All Semesters"
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="1">Semester 1</Option>
                    <Option value="2">Semester 2</Option>
                    <Option value="Summer">Summer</Option>
                    <Option value="Year-round">Year-round</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Difficulty Level */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="difficulty" label="Difficulty">
                  <Select placeholder="All Levels" allowClear>
                    <Option value="Beginner">Beginner</Option>
                    <Option value="Intermediate">Intermediate</Option>
                    <Option value="Advanced">Advanced</Option>
                    <Option value="Honors">Honors</Option>
                    <Option value="AP">AP/Advanced Placement</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Grade Level */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="gradeLevel" label="Grade Level">
                  <Select
                    placeholder="All Grades"
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="9">Grade 9</Option>
                    <Option value="10">Grade 10</Option>
                    <Option value="11">Grade 11</Option>
                    <Option value="12">Grade 12</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Enrollment Count */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="enrollmentRange" label="Enrollment">
                  <Select placeholder="All" allowClear>
                    <Option value="0-10">1-10 students</Option>
                    <Option value="11-20">11-20 students</Option>
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
                  {/* Has Teacher Assigned */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="hasTeacher" label="Teacher">
                      <Select placeholder="All" allowClear>
                        <Option value="yes">Teacher Assigned</Option>
                        <Option value="no">No Teacher</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Prerequisites */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="hasPrerequisites" label="Prerequisites">
                      <Select placeholder="All" allowClear>
                        <Option value="yes">Has Prerequisites</Option>
                        <Option value="no">No Prerequisites</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Lab/Practical Component */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="hasLab" label="Lab Component">
                      <Select placeholder="All" allowClear>
                        <Option value="yes">Has Lab</Option>
                        <Option value="no">No Lab</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Online/In-person */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="deliveryMode" label="Delivery Mode">
                      <Select placeholder="All" allowClear>
                        <Option value="in-person">In-Person</Option>
                        <Option value="online">Online</Option>
                        <Option value="hybrid">Hybrid</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Elective/Required */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="courseType" label="Course Type">
                      <Select placeholder="All" allowClear>
                        <Option value="required">Required/Core</Option>
                        <Option value="elective">Elective</Option>
                        <Option value="honors">Honors</Option>
                        <Option value="remedial">Remedial</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Average Grade */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="averageGrade" label="Avg Grade">
                      <Select placeholder="All" allowClear>
                        <Option value="A">A (90-100)</Option>
                        <Option value="B">B (80-89)</Option>
                        <Option value="C">C (70-79)</Option>
                        <Option value="D">D (60-69)</Option>
                        <Option value="F">F (&lt;60)</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Pass Rate */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="passRate" label="Pass Rate">
                      <Select placeholder="All" allowClear>
                        <Option value="excellent">Excellent (95%+)</Option>
                        <Option value="good">Good (85-94%)</Option>
                        <Option value="fair">Fair (75-84%)</Option>
                        <Option value="poor">Poor (&lt;75%)</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Textbook Required */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="hasTextbook" label="Textbook">
                      <Select placeholder="All" allowClear>
                        <Option value="yes">Required</Option>
                        <Option value="optional">Optional</Option>
                        <Option value="no">Not Required</Option>
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

export default CourseFilter;
