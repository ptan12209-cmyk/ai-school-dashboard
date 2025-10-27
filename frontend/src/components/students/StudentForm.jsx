// StudentForm.jsx - Form for creating and editing students
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Space,
  Row,
  Col,
  Card,
  Upload,
  Avatar,
  Divider,
  Switch,
  message,
  Spin,
  Typography
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  IdcardOutlined,
  TeamOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  CameraOutlined
} from '@ant-design/icons';
import moment from 'moment';
import {
  createStudent,
  updateStudent,
  selectOperationLoading
} from '../../redux/slices/studentSlice';
import './StudentForm.scss';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const StudentForm = ({ student, onSuccess, onCancel, classes = [] }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const loading = useSelector(selectOperationLoading);
  
  const [avatarUrl, setAvatarUrl] = useState(student?.avatar || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (student) {
      form.setFieldsValue({
        ...student,
        firstName: student.first_name || student.firstName,
        lastName: student.last_name || student.lastName,
        dateOfBirth: student.date_of_birth || student.dateOfBirth ? moment(student.date_of_birth || student.dateOfBirth) : null,
        enrollmentDate: student.enrollmentDate ? moment(student.enrollmentDate) : null,
        classId: student.class_id || student.classId,
        parentName: student.parent_name || student.parentName,
        parentPhone: student.parent_phone || student.parentPhone,
        parentEmail: student.parent_email || student.parentEmail,
        status: student.status || 'Active'
      });
      setAvatarUrl(student.avatar || '');
    } else {
      // Set default values for new student
      form.setFieldsValue({
        status: 'Active',
        gender: 'M',
        enrollmentDate: moment()
      });
    }
  }, [student, form]);

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      // Format dates
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        enrollmentDate: values.enrollmentDate ? values.enrollmentDate.format('YYYY-MM-DD') : null,
        avatar: avatarUrl
      };

      let result;
      if (student) {
        // Update existing student
        result = await dispatch(updateStudent({
          studentId: student.id,
          studentData: formattedValues
        })).unwrap();
        message.success('Student updated successfully');
      } else {
        // Create new student
        result = await dispatch(createStudent(formattedValues)).unwrap();
        message.success('Student created successfully');
      }

      form.resetFields();
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || error?.toString() || 'Operation failed';
      message.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = (info) => {
    if (info.file.status === 'done') {
      // Get the uploaded image URL from response
      setAvatarUrl(info.file.response?.url || '');
      message.success('Avatar uploaded successfully');
    } else if (info.file.status === 'error') {
      message.error('Avatar upload failed');
    }
  };

  // Before upload check
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
    }
    return isImage && isLt2M;
  };

  // Validate email
  const validateEmail = (_, value) => {
    if (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Vui lòng nhập địa chỉ email hợp lệ'));
  };

  const validatePhone = (_, value) => {
    if (!value || /^[0-9]{10,15}$/.test(value.replace(/\D/g, ''))) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Vui lòng nhập số điện thoại hợp lệ'));
  };

  return (
    <Card className="student-form-card">
      <Spin spinning={loading || isSubmitting}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Title level={4}>
            {student ? 'Sửa Học Sinh' : 'Thêm Học Sinh Mới'}
          </Title>

          <Divider>Thông Tin Cá Nhân</Divider>

          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="Ảnh Đại Diện">
                <Space align="start">
                  <Avatar
                    size={100}
                    src={avatarUrl}
                    icon={<UserOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                  <Upload
                    name="avatar"
                    showUploadList={false}
                    action="/api/upload/avatar"
                    beforeUpload={beforeUpload}
                    onChange={handleAvatarUpload}
                  >
                    <Button icon={<CameraOutlined />}>
                      Đổi Ảnh
                    </Button>
                  </Upload>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Student ID */}
            <Col xs={24} md={12}>
              <Form.Item
                name="studentId"
                label="Student ID"
                rules={[
                  { required: true, message: 'Please enter student ID' },
                  { min: 5, message: 'Student ID must be at least 5 characters' }
                ]}
              >
                <Input
                  prefix={<IdcardOutlined />}
                  placeholder="e.g., STU001"
                  disabled={!!student}
                />
              </Form.Item>
            </Col>

            {/* First Name */}
            <Col xs={24} md={12}>
              <Form.Item
                name="firstName"
                label="First Name"
                rules={[
                  { required: true, message: 'Please enter first name' },
                  { min: 1, message: 'First name must be at least 1 character' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter first name"
                />
              </Form.Item>
            </Col>

            {/* Last Name */}
            <Col xs={24} md={12}>
              <Form.Item
                name="lastName"
                label="Last Name"
                rules={[
                  { required: true, message: 'Please enter last name' },
                  { min: 1, message: 'Last name must be at least 1 character' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter last name"
                />
              </Form.Item>
            </Col>

            {/* Email */}
            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: 'Please enter email' },
                  { validator: validateEmail }
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="student@example.com"
                  type="email"
                />
              </Form.Item>
            </Col>

            {/* Password - only for new students */}
            {!student && (
              <Col xs={24} md={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please enter password' },
                    { min: 8, message: 'Password must be at least 8 characters' },
                    { pattern: /[A-Z]/, message: 'Password must contain at least one uppercase letter' },
                    { pattern: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
                    { pattern: /[0-9]/, message: 'Password must contain at least one number' }
                  ]}
                >
                  <Input.Password
                    placeholder="Enter password"
                  />
                </Form.Item>
              </Col>
            )}

            {/* Phone */}
            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: 'Please enter phone number' },
                  { validator: validatePhone }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Enter phone number"
                />
              </Form.Item>
            </Col>

            {/* Date of Birth */}
            <Col xs={24} md={12}>
              <Form.Item
                name="dateOfBirth"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please select date of birth' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  disabledDate={(current) => current && current > moment()}
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>

            {/* Gender */}
            <Col xs={24} md={12}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: 'Please select gender' }]}
              >
                <Select placeholder="Select gender">
                  <Option value="M">Male</Option>
                  <Option value="F">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Address */}
            <Col span={24}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: 'Please enter address' }]}
              >
                <TextArea
                  prefix={<HomeOutlined />}
                  placeholder="Enter full address"
                  rows={2}
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Academic Information</Divider>

          <Row gutter={16}>
            {/* Class */}
            <Col xs={24} md={12}>
              <Form.Item
                name="classId"
                label="Class"
                rules={[{ required: true, message: 'Please select class' }]}
              >
                <Select
                  placeholder="Select class"
                  showSearch
                  optionFilterProp="children"
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

            {/* Enrollment Date */}
            <Col xs={24} md={12}>
              <Form.Item
                name="enrollmentDate"
                label="Enrollment Date"
                rules={[{ required: true, message: 'Please select enrollment date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>

            {/* Status */}
            <Col xs={24} md={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status">
                  <Option value="Active">Active</Option>
                  <Option value="Inactive">Inactive</Option>
                  <Option value="Graduated">Graduated</Option>
                  <Option value="Suspended">Suspended</Option>
                  <Option value="Transferred">Transferred</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>Parent/Guardian Information</Divider>

          <Row gutter={16}>
            {/* Parent Name */}
            <Col xs={24} md={12}>
              <Form.Item
                name="parentName"
                label="Parent/Guardian Name"
                rules={[{ required: true, message: 'Please enter parent name' }]}
              >
                <Input
                  prefix={<TeamOutlined />}
                  placeholder="Enter parent name"
                />
              </Form.Item>
            </Col>

            {/* Parent Phone */}
            <Col xs={24} md={12}>
              <Form.Item
                name="parentPhone"
                label="Parent Phone"
                rules={[
                  { required: true, message: 'Please enter parent phone' },
                  { validator: validatePhone }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Enter parent phone"
                />
              </Form.Item>
            </Col>

            {/* Parent Email */}
            <Col xs={24} md={12}>
              <Form.Item
                name="parentEmail"
                label="Parent Email"
                rules={[{ validator: validateEmail }]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="parent@example.com"
                  type="email"
                />
              </Form.Item>
            </Col>

            {/* Relationship */}
            <Col xs={24} md={12}>
              <Form.Item
                name="relationship"
                label="Relationship"
                rules={[{ required: true, message: 'Please select relationship' }]}
              >
                <Select placeholder="Select relationship">
                  <Option value="Father">Father</Option>
                  <Option value="Mother">Mother</Option>
                  <Option value="Guardian">Guardian</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider>Additional Information</Divider>

          <Row gutter={16}>
            {/* Notes */}
            <Col span={24}>
              <Form.Item
                name="notes"
                label="Notes"
              >
                <TextArea
                  placeholder="Any additional notes or information"
                  rows={3}
                />
              </Form.Item>
            </Col>

            {/* Emergency Contact */}
            <Col xs={24} md={12}>
              <Form.Item
                name="emergencyContact"
                label="Emergency Contact"
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Emergency contact number"
                />
              </Form.Item>
            </Col>

            {/* Medical Info */}
            <Col xs={24} md={12}>
              <Form.Item
                name="medicalInfo"
                label="Medical Information"
              >
                <Input
                  placeholder="Allergies, conditions, etc."
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Form Actions */}
          <Divider />
          
          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                icon={<SaveOutlined />}
                size="large"
              >
                {student ? 'Update Student' : 'Add Student'}
              </Button>
              <Button
                onClick={onCancel}
                icon={<CloseOutlined />}
                size="large"
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Spin>
    </Card>
  );
};

export default StudentForm;
