// SettingsPage.jsx - Application Settings Page
import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Breadcrumb,
  Row,
  Col,
  Form,
  Input,
  Switch,
  Select,
  Divider,
  Avatar,
  Upload,
  message,
  Tabs,
  List,
  Tag,
  Modal
} from 'antd';
import {
  SettingOutlined,
  HomeOutlined,
  UserOutlined,
  BellOutlined,
  SecurityScanOutlined,
  DatabaseOutlined,
  GlobalOutlined,
  UploadOutlined,
  SaveOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { confirm } = Modal;

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);
  const [profileForm] = Form.useForm();
  const [systemForm] = Form.useForm();
  const [notificationForm] = Form.useForm();

  // Mock user data
  const [userProfile, setUserProfile] = useState({
    name: 'Admin User',
    email: 'admin@school.com',
    role: 'Administrator',
    avatar: null,
    phone: '+1 234 567 8900',
    department: 'Administration'
  });

  const [systemSettings, setSystemSettings] = useState({
    schoolName: 'AI School Dashboard',
    timezone: 'UTC-5',
    language: 'en',
    theme: 'light',
    autoBackup: true,
    maintenanceMode: false
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    systemAlerts: true
  });

  const handleProfileSave = (values) => {
    setLoading(true);
    setTimeout(() => {
      setUserProfile({ ...userProfile, ...values });
      message.success('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  const handleSystemSave = (values) => {
    setLoading(true);
    setTimeout(() => {
      setSystemSettings({ ...systemSettings, ...values });
      message.success('System settings updated successfully!');
      setLoading(false);
    }, 1000);
  };

  const handleNotificationSave = (values) => {
    setLoading(true);
    setTimeout(() => {
      setNotifications({ ...notifications, ...values });
      message.success('Notification preferences updated successfully!');
      setLoading(false);
    }, 1000);
  };

  const handleResetSettings = () => {
    confirm({
      title: 'Reset All Settings',
      icon: <ExclamationCircleOutlined />,
      content: 'Are you sure you want to reset all settings to default? This action cannot be undone.',
      okText: 'Yes, Reset',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        message.success('Settings reset to default values');
      }
    });
  };

  const handleAvatarUpload = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      message.success('Avatar updated successfully!');
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      {/* Breadcrumb */}
      <Breadcrumb style={{ marginBottom: 16 }}>
        <Breadcrumb.Item>
          <Link to="/dashboard">
            <HomeOutlined /> Home
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <SettingOutlined /> Settings
        </Breadcrumb.Item>
      </Breadcrumb>

      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2}>
              <SettingOutlined /> Settings
            </Title>
          </Col>
          <Col>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={handleResetSettings} danger>
                Reset to Default
              </Button>
              <Button type="primary" icon={<SaveOutlined />}>
                Save All Changes
              </Button>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Settings Content */}
      <Card>
        <Tabs defaultActiveKey="profile" type="card">
          {/* Profile Settings */}
          <TabPane tab={<span><UserOutlined />Profile</span>} key="profile">
            <Row gutter={24}>
              <Col span={8}>
                <Card title="Profile Picture" size="small">
                  <div style={{ textAlign: 'center' }}>
                    <Avatar size={120} src={userProfile.avatar} icon={<UserOutlined />} />
                    <br /><br />
                    <Upload
                      name="avatar"
                      listType="picture"
                      showUploadList={false}
                      beforeUpload={() => false}
                      onChange={handleAvatarUpload}
                    >
                      <Button icon={<UploadOutlined />}>Change Avatar</Button>
                    </Upload>
                  </div>
                </Card>
              </Col>
              <Col span={16}>
                <Form
                  form={profileForm}
                  layout="vertical"
                  initialValues={userProfile}
                  onFinish={handleProfileSave}
                >
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        name="name"
                        label="Full Name"
                        rules={[{ required: true, message: 'Please enter your name' }]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        name="email"
                        label="Email Address"
                        rules={[
                          { required: true, message: 'Please enter your email' },
                          { type: 'email', message: 'Please enter a valid email' }
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item name="phone" label="Phone Number">
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item name="department" label="Department">
                        <Select>
                          <Option value="Administration">Administration</Option>
                          <Option value="Academic">Academic</Option>
                          <Option value="Finance">Finance</Option>
                          <Option value="IT">IT</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                      Update Profile
                    </Button>
                  </Form.Item>
                </Form>
              </Col>
            </Row>
          </TabPane>

          {/* System Settings */}
          <TabPane tab={<span><DatabaseOutlined />System</span>} key="system">
            <Form
              form={systemForm}
              layout="vertical"
              initialValues={systemSettings}
              onFinish={handleSystemSave}
            >
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    name="schoolName"
                    label="School Name"
                    rules={[{ required: true, message: 'Please enter school name' }]}
                  >
                    <Input />
                  </Form.Item>
                  
                  <Form.Item name="timezone" label="Timezone">
                    <Select>
                      <Option value="UTC-8">Pacific Time (UTC-8)</Option>
                      <Option value="UTC-7">Mountain Time (UTC-7)</Option>
                      <Option value="UTC-6">Central Time (UTC-6)</Option>
                      <Option value="UTC-5">Eastern Time (UTC-5)</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item name="language" label="Language">
                    <Select>
                      <Option value="en">English</Option>
                      <Option value="es">Spanish</Option>
                      <Option value="fr">French</Option>
                      <Option value="de">German</Option>
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item name="theme" label="Theme">
                    <Select>
                      <Option value="light">Light</Option>
                      <Option value="dark">Dark</Option>
                      <Option value="auto">Auto</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item name="autoBackup" label="Auto Backup" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                  
                  <Form.Item name="maintenanceMode" label="Maintenance Mode" valuePropName="checked">
                    <Switch />
                  </Form.Item>
                </Col>
              </Row>
              
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save System Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Notification Settings */}
          <TabPane tab={<span><BellOutlined />Notifications</span>} key="notifications">
            <Form
              form={notificationForm}
              layout="vertical"
              initialValues={notifications}
              onFinish={handleNotificationSave}
            >
              <Card title="Notification Preferences" size="small">
                <List
                  dataSource={[
                    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                    { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                    { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
                    { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summary reports' },
                    { key: 'systemAlerts', label: 'System Alerts', desc: 'Receive system maintenance alerts' }
                  ]}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Form.Item name={item.key} valuePropName="checked" style={{ margin: 0 }}>
                          <Switch />
                        </Form.Item>
                      ]}
                    >
                      <List.Item.Meta
                        title={item.label}
                        description={item.desc}
                      />
                    </List.Item>
                  )}
                />
              </Card>
              
              <br />
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Notification Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Security Settings */}
          <TabPane tab={<span><SecurityScanOutlined />Security</span>} key="security">
            <Row gutter={24}>
              <Col span={12}>
                <Card title="Change Password" size="small">
                  <Form layout="vertical">
                    <Form.Item
                      name="currentPassword"
                      label="Current Password"
                      rules={[{ required: true, message: 'Please enter current password' }]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      name="newPassword"
                      label="New Password"
                      rules={[{ required: true, message: 'Please enter new password' }]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item
                      name="confirmPassword"
                      label="Confirm Password"
                      rules={[{ required: true, message: 'Please confirm password' }]}
                    >
                      <Input.Password />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary">Change Password</Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="Security Options" size="small">
                  <List
                    dataSource={[
                      { label: 'Two-Factor Authentication', enabled: false },
                      { label: 'Login Notifications', enabled: true },
                      { label: 'Session Timeout', enabled: true },
                      { label: 'IP Restrictions', enabled: false }
                    ]}
                    renderItem={item => (
                      <List.Item
                        actions={[
                          <Switch checked={item.enabled} />
                        ]}
                      >
                        <Text>{item.label}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsPage;