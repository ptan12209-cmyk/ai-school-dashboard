/**
 * ClassForm.jsx - Class Form Component
 * ===================================
 * Form for creating and editing class information
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
  TimePicker,
  Checkbox,
  message 
} from 'antd';
import { SaveOutlined, ClearOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const ClassForm = ({ 
  onSubmit, 
  initialValues = {}, 
  teachers = [], 
  subjects = [],
  rooms = [],
  mode = 'create' // 'create' or 'edit'
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Mock data if none provided
  const mockTeachers = [
    { id: 1, name: 'Dr. Sarah Miller', subject: 'Mathematics' },
    { id: 2, name: 'Prof. John Anderson', subject: 'Physics' },
    { id: 3, name: 'Ms. Emily Taylor', subject: 'English' },
  ];

  const mockSubjects = [
    { id: 1, name: 'Mathematics', code: 'MATH' },
    { id: 2, name: 'Physics', code: 'PHY' },
    { id: 3, name: 'English', code: 'ENG' },
    { id: 4, name: 'Chemistry', code: 'CHEM' },
    { id: 5, name: 'Biology', code: 'BIO' },
  ];

  const mockRooms = [
    { id: 1, name: 'Room 101', capacity: 35, type: 'classroom' },
    { id: 2, name: 'Room 102', capacity: 30, type: 'classroom' },
    { id: 3, name: 'Lab A', capacity: 25, type: 'laboratory' },
    { id: 4, name: 'Room 201', capacity: 40, type: 'classroom' },
  ];

  const teacherData = teachers.length > 0 ? teachers : mockTeachers;
  const subjectData = subjects.length > 0 ? subjects : mockSubjects;
  const roomData = rooms.length > 0 ? rooms : mockRooms;

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Format the schedule days
      const scheduleDays = values.scheduleDays ? values.scheduleDays.join(', ') : '';
      const scheduleTime = values.scheduleTime ? values.scheduleTime.format('HH:mm') : '';
      
      const formattedValues = {
        ...values,
        schedule: `${scheduleDays} - ${scheduleTime}`,
        name: `Class ${values.grade}${values.section}`
      };

      if (onSubmit) {
        await onSubmit(formattedValues);
        message.success(`Class ${mode === 'create' ? 'created' : 'updated'} successfully!`);
        if (mode === 'create') {
          form.resetFields();
        }
      } else {
        console.log('Class data:', formattedValues);
        message.success(`Class ${mode === 'create' ? 'created' : 'updated'} successfully!`);
      }
    } catch (error) {
      message.error(`Failed to ${mode} class`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
  };

  const weekDays = [
    { label: 'Monday', value: 'Mon' },
    { label: 'Tuesday', value: 'Tue' },
    { label: 'Wednesday', value: 'Wed' },
    { label: 'Thursday', value: 'Thu' },
    { label: 'Friday', value: 'Fri' },
    { label: 'Saturday', value: 'Sat' },
  ];

  return (
    <Card title={`${mode === 'create' ? 'Create New' : 'Edit'} Class`} style={{ maxWidth: 800, margin: '0 auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues}
      >
        <Row gutter={16}>
          <Col xs={24} md={8}>
            <Form.Item
              name="grade"
              label="Grade"
              rules={[{ required: true, message: 'Please select a grade' }]}
            >
              <Select placeholder="Select grade">
                {[...Array(12)].map((_, i) => (
                  <Option key={i + 1} value={(i + 1).toString()}>
                    Grade {i + 1}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="section"
              label="Section"
              rules={[{ required: true, message: 'Please enter a section' }]}
            >
              <Select placeholder="Select section">
                {['A', 'B', 'C', 'D', 'E'].map(section => (
                  <Option key={section} value={section}>
                    Section {section}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              name="capacity"
              label="Capacity"
              rules={[
                { required: true, message: 'Please enter capacity' },
                { type: 'number', min: 1, max: 50, message: 'Capacity must be between 1 and 50' }
              ]}
            >
              <InputNumber
                min={1}
                max={50}
                style={{ width: '100%' }}
                placeholder="Enter capacity"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="subjectId"
              label="Subject"
              rules={[{ required: true, message: 'Please select a subject' }]}
            >
              <Select placeholder="Select subject">
                {subjectData.map(subject => (
                  <Option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="teacherId"
              label="Class Teacher"
              rules={[{ required: true, message: 'Please select a teacher' }]}
            >
              <Select
                placeholder="Select teacher"
                showSearch
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {teacherData.map(teacher => (
                  <Option key={teacher.id} value={teacher.id}>
                    {teacher.name} - {teacher.subject}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="roomId"
              label="Room"
              rules={[{ required: true, message: 'Please select a room' }]}
            >
              <Select placeholder="Select room">
                {roomData.map(room => (
                  <Option key={room.id} value={room.id}>
                    {room.name} (Capacity: {room.capacity}) - {room.type}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="scheduleTime"
              label="Class Time"
              rules={[{ required: true, message: 'Please select class time' }]}
            >
              <TimePicker
                format="HH:mm"
                style={{ width: '100%' }}
                placeholder="Select time"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="scheduleDays"
          label="Schedule Days"
          rules={[{ required: true, message: 'Please select at least one day' }]}
        >
          <Checkbox.Group>
            <Row>
              {weekDays.map(day => (
                <Col span={8} key={day.value}>
                  <Checkbox value={day.value}>{day.label}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea
            rows={3}
            placeholder="Optional description about the class..."
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
            <Option value="pending">Pending</Option>
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
                {mode === 'create' ? 'Create Class' : 'Update Class'}
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

export default ClassForm;
