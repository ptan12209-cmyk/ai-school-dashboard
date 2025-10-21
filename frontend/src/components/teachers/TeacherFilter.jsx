// TeacherFilter.jsx - Filter component for teacher list
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
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
  Rate,
  Slider
} from 'antd';
import {
  SearchOutlined,
  ClearOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { setFilters, resetFilters, fetchTeachers } from '../../redux/slices/teacherSlice';
import './TeacherFilter.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const TeacherFilter = ({ onApply, onReset }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
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

    // Apply filters
    dispatch(setFilters(filters));
    dispatch(fetchTeachers({ filters }));

    if (onApply) {
      onApply(filters);
    }
  };

  // Handle filter reset
  const handleReset = () => {
    form.resetFields();
    setActiveFilters(0);
    dispatch(resetFilters());
    dispatch(fetchTeachers({}));
    
    if (onReset) {
      onReset();
    }
  };

  return (
    <Card className="teacher-filter-card">
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
              {/* Department Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="department" label="Department">
                  <Select
                    placeholder="All Departments"
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="Mathematics">Mathematics</Option>
                    <Option value="Science">Science</Option>
                    <Option value="English">English</Option>
                    <Option value="History">History</Option>
                    <Option value="Geography">Geography</Option>
                    <Option value="Computer Science">Computer Science</Option>
                    <Option value="Physical Education">Physical Education</Option>
                    <Option value="Arts">Arts</Option>
                    <Option value="Music">Music</Option>
                    <Option value="Languages">Languages</Option>
                  </Select>
                </Form.Item>
              </Col>

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
                    <Option value="History">History</Option>
                    <Option value="Geography">Geography</Option>
                    <Option value="Computer Science">Computer Science</Option>
                    <Option value="Physical Education">Physical Education</Option>
                    <Option value="Art">Art</Option>
                    <Option value="Music">Music</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Gender Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="gender" label="Gender">
                  <Select placeholder="All Genders" allowClear>
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Status Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="status" label="Status">
                  <Select 
                    placeholder="All Status" 
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="Active">Active</Option>
                    <Option value="On Leave">On Leave</Option>
                    <Option value="Inactive">Inactive</Option>
                    <Option value="Retired">Retired</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Experience Range */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="experienceRange" label="Experience (Years)">
                  <Space>
                    <InputNumber
                      min={0}
                      max={50}
                      placeholder="Min"
                      style={{ width: 80 }}
                    />
                    <span>-</span>
                    <InputNumber
                      min={0}
                      max={50}
                      placeholder="Max"
                      style={{ width: 80 }}
                    />
                  </Space>
                </Form.Item>
              </Col>

              {/* Qualification Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="qualification" label="Qualification">
                  <Select
                    placeholder="All Qualifications"
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="B.Ed">B.Ed</Option>
                    <Option value="M.Ed">M.Ed</Option>
                    <Option value="B.A">B.A</Option>
                    <Option value="M.A">M.A</Option>
                    <Option value="B.Sc">B.Sc</Option>
                    <Option value="M.Sc">M.Sc</Option>
                    <Option value="PhD">PhD</Option>
                    <Option value="D.Ed">D.Ed</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Employment Type */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="employmentType" label="Employment Type">
                  <Select placeholder="All Types" allowClear>
                    <Option value="Full-time">Full-time</Option>
                    <Option value="Part-time">Part-time</Option>
                    <Option value="Contract">Contract</Option>
                    <Option value="Substitute">Substitute</Option>
                    <Option value="Volunteer">Volunteer</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Joining Date Range */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="joiningDateRange" label="Joining Date">
                  <RangePicker 
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>

              {/* Rating Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="rating" label="Minimum Rating">
                  <Rate 
                    allowClear
                    defaultValue={0}
                    style={{ fontSize: 16 }}
                  />
                </Form.Item>
              </Col>

              {/* Classes Count */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="classesRange" label="Number of Classes">
                  <Space>
                    <InputNumber
                      min={0}
                      max={10}
                      placeholder="Min"
                      style={{ width: 80 }}
                    />
                    <span>-</span>
                    <InputNumber
                      min={0}
                      max={10}
                      placeholder="Max"
                      style={{ width: 80 }}
                    />
                  </Space>
                </Form.Item>
              </Col>

              {/* Specialization */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="specialization" label="Specialization">
                  <Select placeholder="All Specializations" allowClear>
                    <Option value="Classroom Teaching">Classroom Teaching</Option>
                    <Option value="Special Education">Special Education</Option>
                    <Option value="Educational Technology">Educational Technology</Option>
                    <Option value="Curriculum Development">Curriculum Development</Option>
                    <Option value="Student Counseling">Student Counseling</Option>
                    <Option value="Educational Leadership">Educational Leadership</Option>
                    <Option value="STEM Education">STEM Education</Option>
                    <Option value="Language Teaching">Language Teaching</Option>
                    <Option value="Sports Coaching">Sports Coaching</Option>
                    <Option value="Arts Education">Arts Education</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Age Range */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="ageRange" label="Age">
                  <Space>
                    <InputNumber
                      min={20}
                      max={70}
                      placeholder="Min"
                      style={{ width: 80 }}
                    />
                    <span>-</span>
                    <InputNumber
                      min={20}
                      max={70}
                      placeholder="Max"
                      style={{ width: 80 }}
                    />
                  </Space>
                </Form.Item>
              </Col>
            </Row>

            {/* Additional Filters - Collapsed by default */}
            <Collapse ghost>
              <Panel header="More Filters" key="2">
                <Row gutter={16}>
                  {/* Salary Range */}
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name="salaryRange" label="Salary Range ($)">
                      <Slider
                        range
                        min={0}
                        max={10000}
                        step={500}
                        marks={{
                          0: '$0',
                          5000: '$5K',
                          10000: '$10K'
                        }}
                      />
                    </Form.Item>
                  </Col>

                  {/* Has LinkedIn */}
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name="hasLinkedIn" label="Professional Profile">
                      <Select placeholder="All" allowClear>
                        <Option value="yes">Has LinkedIn</Option>
                        <Option value="no">No LinkedIn</Option>
                        <Option value="website">Has Website</Option>
                        <Option value="both">Has Both</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Performance Level */}
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name="performance" label="Performance Level">
                      <Select placeholder="All Levels" allowClear>
                        <Option value="excellent">Excellent (90%+)</Option>
                        <Option value="good">Good (75-89%)</Option>
                        <Option value="average">Average (60-74%)</Option>
                        <Option value="needsImprovement">Needs Improvement (&lt;60%)</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Certifications */}
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name="hasCertifications" label="Additional Certifications">
                      <Select placeholder="All" allowClear>
                        <Option value="yes">Has Certifications</Option>
                        <Option value="no">No Certifications</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Skills */}
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name="skills" label="Special Skills">
                      <Select
                        mode="multiple"
                        placeholder="Select skills"
                        maxTagCount={2}
                      >
                        <Option value="Computer Skills">Computer Skills</Option>
                        <Option value="Language Skills">Multiple Languages</Option>
                        <Option value="Sports Coaching">Sports Coaching</Option>
                        <Option value="Music">Music/Arts</Option>
                        <Option value="Counseling">Student Counseling</Option>
                        <Option value="Leadership">Leadership</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Awards */}
                  <Col xs={24} sm={12} md={8}>
                    <Form.Item name="hasAwards" label="Awards & Recognition">
                      <Select placeholder="All" allowClear>
                        <Option value="yes">Has Awards</Option>
                        <Option value="no">No Awards</Option>
                        <Option value="recent">Recent Awards (Last 2 years)</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Panel>
            </Collapse>

            {/* Filter Actions */}
            <Row>
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

export default TeacherFilter;
