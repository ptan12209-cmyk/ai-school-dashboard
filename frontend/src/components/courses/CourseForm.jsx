/**
 * CourseForm.jsx - Course Form Component
 * =====================================
 * Form for creating and editing course information
 */

import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  Button, 
  Card, 
  Row, 
  Col,
  message 
} from 'antd';
import { SaveOutlined, ClearOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const CourseForm = ({ 
  onSubmit, 
  initialValues = {}, 
  teachers = [], 
  departments = [],
  mode = 'create' // 'create' or 'edit'
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock data if none provided
  const mockTeachers = [
    { id: 1, name: 'Dr. Sarah Miller', department: 'Mathematics' },
    { id: 2, name: 'Prof. John Anderson', department: 'Science' },
    { id: 3, name: 'Ms. Emily Taylor', department: 'Languages' },
  ];

  const mockDepartments = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Science' },
    { id: 3, name: 'Languages' },
    { id: 4, name: 'History' },
    { id: 5, name: 'Arts' },
  ];

  const teacherData = teachers.length > 0 ? teachers : mockTeachers;
  const departmentData = departments.length > 0 ? departments : mockDepartments;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
        message.success(`Course ${mode === 'create' ? 'created' : 'updated'} successfully!`);
        if (mode === 'create') {
          form.resetFields();
        }
      } else {
        console.log('Course data:', values);
        message.success(`Course ${mode === 'create' ? 'created' : 'updated'} successfully!`);
      }
    } catch (error) {
      message.error(`Failed to ${mode} course`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <Card title={`${mode === 'create' ? 'Create New' : 'Edit'} Course`} style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="name"
              label="Course Name"
              rules={[{ required: true, message: 'Please enter course name' }]}
            >
              <Input placeholder="e.g., Advanced Mathematics" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="code"
              label="Course Code"
              rules={[{ required: true, message: 'Please enter course code' }]}
            >
              <Input placeholder="e.g., MATH301" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: 'Please select a department' }]}
            >
              <Select placeholder="Select department">
                {departmentData.map(dept => (
                  <Option key={dept.id} value={dept.name}>
                    {dept.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="instructorId"
              label="Instructor"
              rules={[{ required: true, message: 'Please select an instructor' }]}
            >
              <Select
                placeholder="Select instructor"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {teacherData.map(teacher => (
                  <Option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.department}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="credits"
              label="Credits"
              rules={[
                { required: true, message: 'Please enter credits' },
                { type: 'number', min: 1, max: 10, message: 'Credits must be between 1 and 10' }
              ]}
            >
              <InputNumber
                min={1}
                max={10}
                style={{ width: '100%' }}
                placeholder="Enter credits"
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="level"
              label="Level"
              rules={[{ required: true, message: 'Please select a level' }]}
            >
              <Select placeholder="Select level">
                <Option value="Beginner">Beginner</Option>
                <Option value="Intermediate">Intermediate</Option>
                <Option value="Advanced">Advanced</Option>
                <Option value="Expert">Expert</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="maxStudents"
              label="Max Students"
              rules={[
                { required: true, message: 'Please enter max students' },
                { type: 'number', min: 1, max: 100, message: 'Value must be between 1 and 100' }
              ]}
            >
              <InputNumber
                min={1}
                max={100}
                style={{ width: '100%' }}
                placeholder="Enter max students"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter a description' }]}
        >
          <TextArea
            rows={4}
            placeholder="Detailed description of the course content, objectives, and prerequisites..."
          />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          initialValue="active"
        >
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
            <Option value="draft">Draft</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Row gutter={8}>
            <Col>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                {mode === 'create' ? 'Create Course' : 'Update Course'}
              </Button>
            </Col>
            <Col>
              <Button
                type="default"
                onClick={handleReset}
                icon={<ClearOutlined />}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CourseForm;
