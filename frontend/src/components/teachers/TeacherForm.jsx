// TeacherForm.jsx - Form for creating and editing teachers
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
  Typography,
  InputNumber,
  TimePicker,
  Checkbox
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  IdcardOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  CameraOutlined,
  BookOutlined,
  BankOutlined,
  DollarOutlined,
  SafetyOutlined,
  TrophyOutlined,
  FileTextOutlined,
  LinkedinOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import moment from 'moment';
import {
  createTeacher,
  updateTeacher,
  selectOperationLoading,
  selectDepartments,
  selectSubjects
} from '../../redux/slices/teacherSlice';
import './TeacherForm.scss';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;
const { RangePicker } = DatePicker;

const TeacherForm = ({ teacher, onSuccess, onCancel }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const loading = useSelector(selectOperationLoading);
  const departments = useSelector(selectDepartments);
  const subjects = useSelector(selectSubjects);
  
  const [avatarUrl, setAvatarUrl] = useState(teacher?.avatar || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined lists
  const qualifications = [
    'B.Ed (Bachelor of Education)',
    'M.Ed (Master of Education)',
    'B.A (Bachelor of Arts)',
    'M.A (Master of Arts)',
    'B.Sc (Bachelor of Science)',
    'M.Sc (Master of Science)',
    'PhD (Doctor of Philosophy)',
    'D.Ed (Doctorate in Education)',
    'B.Tech',
    'M.Tech',
    'MBA',
    'Other'
  ];

  const departmentsList = departments.length > 0 ? departments : [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Physical Education',
    'Arts',
    'Music',
    'Languages',
    'Social Studies',
    'Economics',
    'Commerce'
  ];

  const subjectsList = subjects.length > 0 ? subjects : [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English Literature',
    'English Language',
    'History',
    'Geography',
    'Computer Science',
    'Physical Education',
    'Art & Design',
    'Music',
    'French',
    'Spanish',
    'Economics',
    'Business Studies',
    'Psychology',
    'Sociology'
  ];

  const specializations = [
    'Classroom Teaching',
    'Special Education',
    'Educational Technology',
    'Curriculum Development',
    'Student Counseling',
    'Educational Leadership',
    'STEM Education',
    'Language Teaching',
    'Sports Coaching',
    'Arts Education'
  ];

  // Populate form when editing
  useEffect(() => {
    if (teacher) {
      form.setFieldsValue({
        ...teacher,
        firstName: teacher.first_name || teacher.firstName,
        lastName: teacher.last_name || teacher.lastName,
        dateOfBirth: teacher.date_of_birth || teacher.dateOfBirth ? moment(teacher.date_of_birth || teacher.dateOfBirth) : null,
        joiningDate: teacher.hire_date || teacher.joiningDate ? moment(teacher.hire_date || teacher.joiningDate) : null,
        hireDate: teacher.hire_date || teacher.hireDate ? moment(teacher.hire_date || teacher.hireDate) : null,
        status: teacher.status || 'Active',
        subjects: teacher.subjects || [],
        qualifications: teacher.qualifications || []
      });
      setAvatarUrl(teacher.avatar || '');
    } else {
      // Set default values for new teacher
      form.setFieldsValue({
        status: 'Active',
        gender: 'M',
        joiningDate: moment(),
        hireDate: moment(),
        experience: 0,
        employmentType: 'Full-time'
      });
    }
  }, [teacher, form]);

  // Handle form submission
  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      // Format dates
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : null,
        joiningDate: values.joiningDate ? values.joiningDate.format('YYYY-MM-DD') : null,
        avatar: avatarUrl
      };

      let result;
      if (teacher) {
        // Update existing teacher
        result = await dispatch(updateTeacher({
          teacherId: teacher.id,
          teacherData: formattedValues
        })).unwrap();
        message.success('Teacher updated successfully');
      } else {
        // Create new teacher
        result = await dispatch(createTeacher(formattedValues)).unwrap();
        message.success('Teacher created successfully');
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
    return Promise.reject(new Error('Please enter a valid email address'));
  };

  // Validate phone number
  const validatePhone = (_, value) => {
    if (!value || /^[0-9]{10,15}$/.test(value.replace(/\D/g, ''))) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Please enter a valid phone number'));
  };

  return (
    <Card className="teacher-form-card">
      <Spin spinning={loading || isSubmitting}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Title level={4}>
            {teacher ? 'Edit Teacher' : 'Add New Teacher'}
          </Title>
          
          <Divider>Personal Information</Divider>

          {/* Avatar Upload */}
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item label="Profile Photo">
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
                      Change Photo
                    </Button>
                  </Upload>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            {/* Teacher ID */}
            <Col xs={24} md={12}>
              <Form.Item
                name="teacherId"
                label="Teacher ID"
                rules={[
                  { required: true, message: 'Please enter teacher ID' },
                  { min: 5, message: 'Teacher ID must be at least 5 characters' }
                ]}
              >
                <Input
                  prefix={<IdcardOutlined />}
                  placeholder="e.g., TCH001"
                  disabled={!!teacher}
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
                  placeholder="teacher@example.com"
                  type="email"
                />
              </Form.Item>
            </Col>

            {/* Password - only for new teachers */}
            {!teacher && (
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

          <Divider>Professional Information</Divider>

          <Row gutter={16}>
            {/* Department */}
            <Col xs={24} md={12}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Please select department' }]}
              >
                <Select
                  placeholder="Select department"
                  showSearch
                  optionFilterProp="children"
                  prefix={<BankOutlined />}
                >
                  {departmentsList.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Qualifications */}
            <Col xs={24} md={12}>
              <Form.Item
                name="qualifications"
                label="Qualifications"
                rules={[{ required: true, message: 'Please select qualifications' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select qualifications"
                  maxTagCount={2}
                >
                  {qualifications.map(qual => (
                    <Option key={qual} value={qual}>{qual}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Subjects Teaching */}
            <Col xs={24} md={12}>
              <Form.Item
                name="subjects"
                label="Subjects Teaching"
                rules={[{ required: true, message: 'Please select subjects' }]}
              >
                <Select
                  mode="multiple"
                  placeholder="Select subjects"
                  maxTagCount={3}
                  prefix={<BookOutlined />}
                >
                  {subjectsList.map(subject => (
                    <Option key={subject} value={subject}>{subject}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Specialization */}
            <Col xs={24} md={12}>
              <Form.Item
                name="specialization"
                label="Specialization"
              >
                <Select
                  placeholder="Select specialization"
                  prefix={<TrophyOutlined />}
                >
                  {specializations.map(spec => (
                    <Option key={spec} value={spec}>{spec}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            {/* Experience Years */}
            <Col xs={24} md={12}>
              <Form.Item
                name="experience"
                label="Years of Experience"
                rules={[{ required: true, message: 'Please enter experience' }]}
              >
                <InputNumber
                  min={0}
                  max={50}
                  placeholder="Years"
                  style={{ width: '100%' }}
                  addonAfter="years"
                />
              </Form.Item>
            </Col>

            {/* Previous School */}
            <Col xs={24} md={12}>
              <Form.Item
                name="previousSchool"
                label="Previous School/Institution"
              >
                <Input
                  placeholder="Enter previous school name"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Employment Details</Divider>

          <Row gutter={16}>
            {/* Joining Date */}
            <Col xs={24} md={12}>
              <Form.Item
                name="joiningDate"
                label="Joining Date"
                rules={[{ required: true, message: 'Please select joining date' }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  suffixIcon={<CalendarOutlined />}
                />
              </Form.Item>
            </Col>

            {/* Employment Type */}
            <Col xs={24} md={12}>
              <Form.Item
                name="employmentType"
                label="Employment Type"
                rules={[{ required: true, message: 'Please select employment type' }]}
              >
                <Select placeholder="Select type">
                  <Option value="Full-time">Full-time</Option>
                  <Option value="Part-time">Part-time</Option>
                  <Option value="Contract">Contract</Option>
                  <Option value="Substitute">Substitute</Option>
                  <Option value="Volunteer">Volunteer</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Salary */}
            <Col xs={24} md={12}>
              <Form.Item
                name="salary"
                label="Monthly Salary"
              >
                <InputNumber
                  min={0}
                  placeholder="Enter salary"
                  style={{ width: '100%' }}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                  prefix={<DollarOutlined />}
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
                  <Option value="On Leave">On Leave</Option>
                  <Option value="Inactive">Inactive</Option>
                  <Option value="Retired">Retired</Option>
                </Select>
              </Form.Item>
            </Col>

            {/* Working Hours */}
            <Col xs={24} md={12}>
              <Form.Item
                name="workingHours"
                label="Working Hours"
              >
                <RangePicker
                  format="HH:mm"
                  picker="time"
                  style={{ width: '100%' }}
                  placeholder={['Start Time', 'End Time']}
                />
              </Form.Item>
            </Col>

            {/* Office Room */}
            <Col xs={24} md={12}>
              <Form.Item
                name="officeRoom"
                label="Office/Staff Room"
              >
                <Input
                  placeholder="e.g., Room 201"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider>Additional Information</Divider>

          <Row gutter={16}>
            {/* Emergency Contact */}
            <Col xs={24} md={12}>
              <Form.Item
                name="emergencyContact"
                label="Emergency Contact"
              >
                <Input
                  prefix={<SafetyOutlined />}
                  placeholder="Emergency contact number"
                />
              </Form.Item>
            </Col>

            {/* Emergency Contact Name */}
            <Col xs={24} md={12}>
              <Form.Item
                name="emergencyContactName"
                label="Emergency Contact Name"
              >
                <Input
                  placeholder="Contact person name"
                />
              </Form.Item>
            </Col>

            {/* LinkedIn Profile */}
            <Col xs={24} md={12}>
              <Form.Item
                name="linkedIn"
                label="LinkedIn Profile"
              >
                <Input
                  prefix={<LinkedinOutlined />}
                  placeholder="LinkedIn URL"
                />
              </Form.Item>
            </Col>

            {/* Personal Website */}
            <Col xs={24} md={12}>
              <Form.Item
                name="website"
                label="Personal Website/Portfolio"
              >
                <Input
                  prefix={<GlobalOutlined />}
                  placeholder="Website URL"
                />
              </Form.Item>
            </Col>

            {/* Certifications */}
            <Col span={24}>
              <Form.Item
                name="certifications"
                label="Additional Certifications"
              >
                <TextArea
                  placeholder="List any additional certifications or training"
                  rows={2}
                />
              </Form.Item>
            </Col>

            {/* Bio */}
            <Col span={24}>
              <Form.Item
                name="bio"
                label="Professional Bio"
              >
                <TextArea
                  placeholder="Brief professional biography or teaching philosophy"
                  rows={3}
                />
              </Form.Item>
            </Col>

            {/* Skills */}
            <Col span={24}>
              <Form.Item
                name="skills"
                label="Special Skills"
              >
                <Checkbox.Group>
                  <Row>
                    <Col span={8}><Checkbox value="Computer Skills">Computer Skills</Checkbox></Col>
                    <Col span={8}><Checkbox value="Language Skills">Multiple Languages</Checkbox></Col>
                    <Col span={8}><Checkbox value="Sports Coaching">Sports Coaching</Checkbox></Col>
                    <Col span={8}><Checkbox value="Music">Music/Arts</Checkbox></Col>
                    <Col span={8}><Checkbox value="Counseling">Student Counseling</Checkbox></Col>
                    <Col span={8}><Checkbox value="Leadership">Leadership</Checkbox></Col>
                  </Row>
                </Checkbox.Group>
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
                {teacher ? 'Update Teacher' : 'Add Teacher'}
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

export default TeacherForm;
