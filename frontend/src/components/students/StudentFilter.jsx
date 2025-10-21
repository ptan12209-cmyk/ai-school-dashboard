// StudentFilter.jsx - Filter component for student list
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Collapse
} from 'antd';
import {
  SearchOutlined,
  ClearOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { setFilters, resetFilters, fetchStudents } from '../../redux/slices/studentSlice';
import './StudentFilter.scss';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

const StudentFilter = ({ onApply, onReset }) => {
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
    dispatch(fetchStudents({ filters }));

    if (onApply) {
      onApply(filters);
    }
  };

  // Handle filter reset
  const handleReset = () => {
    form.resetFields();
    setActiveFilters(0);
    dispatch(resetFilters());
    dispatch(fetchStudents({}));
    
    if (onReset) {
      onReset();
    }
  };

  return (
    <Card className="student-filter-card">
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
              {/* Class Filter */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="classId" label="Class">
                  <Select
                    placeholder="All Classes"
                    allowClear
                    mode="multiple"
                    maxTagCount={2}
                  >
                    <Option value="1">Class 10A</Option>
                    <Option value="2">Class 10B</Option>
                    <Option value="3">Class 11A</Option>
                    <Option value="4">Class 11B</Option>
                    <Option value="5">Class 12A</Option>
                    <Option value="6">Class 12B</Option>
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
                    <Option value="Inactive">Inactive</Option>
                    <Option value="Graduated">Graduated</Option>
                    <Option value="Suspended">Suspended</Option>
                    <Option value="Transferred">Transferred</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Grade Range */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="gradeRange" label="Grade Average">
                  <Space>
                    <InputNumber
                      min={0}
                      max={10}
                      step={0.5}
                      placeholder="Min"
                      style={{ width: 80 }}
                    />
                    <span>-</span>
                    <InputNumber
                      min={0}
                      max={10}
                      step={0.5}
                      placeholder="Max"
                      style={{ width: 80 }}
                    />
                  </Space>
                </Form.Item>
              </Col>

              {/* Age Range */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="ageRange" label="Age">
                  <Space>
                    <InputNumber
                      min={5}
                      max={25}
                      placeholder="Min"
                      style={{ width: 80 }}
                    />
                    <span>-</span>
                    <InputNumber
                      min={5}
                      max={25}
                      placeholder="Max"
                      style={{ width: 80 }}
                    />
                  </Space>
                </Form.Item>
              </Col>

              {/* Enrollment Date Range */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="enrollmentDateRange" label="Enrollment Date">
                  <RangePicker 
                    style={{ width: '100%' }}
                    format="YYYY-MM-DD"
                  />
                </Form.Item>
              </Col>

              {/* Attendance Rate */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="attendanceRate" label="Attendance Rate (%)">
                  <Select placeholder="Select range" allowClear>
                    <Option value="excellent">90-100% (Excellent)</Option>
                    <Option value="good">75-89% (Good)</Option>
                    <Option value="fair">60-74% (Fair)</Option>
                    <Option value="poor">&lt;60% (Poor)</Option>
                  </Select>
                </Form.Item>
              </Col>

              {/* Has Parent Email */}
              <Col xs={24} sm={12} md={6}>
                <Form.Item name="hasParentContact" label="Parent Contact">
                  <Select placeholder="All" allowClear>
                    <Option value="yes">Has Contact</Option>
                    <Option value="no">No Contact</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Additional Filters - Collapsed by default */}
            <Collapse ghost>
              <Panel header="More Filters" key="2">
                <Row gutter={16}>
                  {/* Academic Performance */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="performance" label="Academic Performance">
                      <Select placeholder="Select" allowClear>
                        <Option value="excellent">Excellent (8.5+)</Option>
                        <Option value="good">Good (7.0-8.5)</Option>
                        <Option value="average">Average (5.0-7.0)</Option>
                        <Option value="poor">Poor (&lt;5.0)</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Has Medical Info */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="hasMedicalInfo" label="Medical Info">
                      <Select placeholder="All" allowClear>
                        <Option value="yes">Has Medical Info</Option>
                        <Option value="no">No Medical Info</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Scholarship */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="hasScholarship" label="Scholarship">
                      <Select placeholder="All" allowClear>
                        <Option value="yes">Has Scholarship</Option>
                        <Option value="no">No Scholarship</Option>
                      </Select>
                    </Form.Item>
                  </Col>

                  {/* Disciplinary Status */}
                  <Col xs={24} sm={12} md={6}>
                    <Form.Item name="disciplinaryStatus" label="Disciplinary">
                      <Select placeholder="All" allowClear>
                        <Option value="clean">Clean Record</Option>
                        <Option value="warning">Has Warning</Option>
                        <Option value="probation">On Probation</Option>
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

export default StudentFilter;
