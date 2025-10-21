// StudentList.jsx - Main component for displaying students list
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Table,
  Input,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Tooltip,
  Dropdown,
  Menu,
  Avatar,
  Badge,
  Checkbox,
  Row,
  Col,
  Card,
  Typography,
  Spin,
  Empty,
  Pagination
} from 'antd';
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownloadOutlined,
  UploadOutlined,
  FilterOutlined,
  ReloadOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
  MoreOutlined,
  ExportOutlined
} from '@ant-design/icons';
import {
  fetchStudents,
  deleteStudent,
  bulkDeleteStudents,
  setSearchTerm,
  setCurrentPage,
  setPageSize,
  selectAllStudents,
  selectStudentsLoading,
  selectPagination,
  clearMessages
} from '../../redux/slices/studentSlice';
import StudentFilter from './StudentFilter.jsx';
import './StudentList.scss';

const { Title, Text } = Typography;
const { Search } = Input;

const StudentList = ({ onAdd, onEdit, onView }) => {
  const dispatch = useDispatch();
  const students = useSelector(selectAllStudents);
  const loading = useSelector(selectStudentsLoading);
  const pagination = useSelector(selectPagination);
  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const loadStudents = useCallback(() => {
    dispatch(fetchStudents({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      search: searchValue
    }));
  }, [dispatch, pagination.currentPage, pagination.pageSize, searchValue]);

  // Single useEffect to handle all data fetching
  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
    dispatch(setSearchTerm(value));
    dispatch(setCurrentPage(1));
    dispatch(fetchStudents({
      page: 1,
      pageSize: pagination.pageSize,
      search: value
    }));
  };

  // Handle delete single student
  const handleDelete = async (studentId) => {
    try {
      await dispatch(deleteStudent(studentId)).unwrap();
      message.success('Student deleted successfully');
      loadStudents();
    } catch (error) {
      message.error(error || 'Failed to delete student');
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select students to delete');
      return;
    }
    
    try {
      await dispatch(bulkDeleteStudents(selectedRowKeys)).unwrap();
      message.success(`${selectedRowKeys.length} students deleted successfully`);
      setSelectedRowKeys([]);
      loadStudents();
    } catch (error) {
      message.error(error || 'Failed to delete students');
    }
  };

  // Handle pagination change
  const handlePaginationChange = (page, pageSize) => {
    dispatch(setCurrentPage(page));
    if (pageSize !== pagination.pageSize) {
      dispatch(setPageSize(pageSize));
    }
  };

  // More actions menu
  const getMoreMenu = (record) => (
    <Menu>
      <Menu.Item key="email" icon={<MailOutlined />}>
        <a href={`mailto:${record.email}`}>Send Email</a>
      </Menu.Item>
      <Menu.Item key="call" icon={<PhoneOutlined />}>
        <a href={`tel:${record.phone}`}>Call</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="grades">View Grades</Menu.Item>
      <Menu.Item key="attendance">View Attendance</Menu.Item>
      <Menu.Item key="parent">Contact Parent</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="export">Export Data</Menu.Item>
    </Menu>
  );

  // Table columns definition
  const columns = [
    {
      title: 'Student',
      key: 'student',
      width: 250,
      fixed: 'left',
      render: (_, record) => (
        <Space>
          <Avatar 
            size={40} 
            src={record.avatar} 
            icon={<UserOutlined />}
            style={{ backgroundColor: '#1890ff' }}
          >
            {!record.avatar && record.name?.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              ID: {record.studentId || record.id}
            </Text>
          </div>
        </Space>
      ),
      sorter: true
    },
    {
      title: 'Class',
      dataIndex: 'className',
      key: 'className',
      width: 100,
      render: (className) => (
        <Tag color="blue">{className || 'N/A'}</Tag>
      ),
      sorter: true
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 100,
      render: (gender) => (
        <Tag color={gender === 'Male' ? 'cyan' : 'pink'}>
          {gender}
        </Tag>
      ),
      filters: [
        { text: 'Male', value: 'Male' },
        { text: 'Female', value: 'Female' }
      ]
    },
    {
      title: 'Contact',
      key: 'contact',
      width: 200,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text copyable style={{ fontSize: 12 }}>
            <MailOutlined /> {record.email}
          </Text>
          <Text style={{ fontSize: 12 }}>
            <PhoneOutlined /> {record.phone}
          </Text>
        </Space>
      )
    },
    {
      title: 'Parent',
      key: 'parent',
      width: 180,
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ fontSize: 12 }}>{record.parentName || 'N/A'}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {record.parentPhone}
          </Text>
        </Space>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const color = status === 'Active' ? 'green' : 
                     status === 'Inactive' ? 'red' : 'orange';
        return <Badge status={color === 'green' ? 'success' : 'error'} text={status} />;
      },
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'Inactive', value: 'Inactive' },
        { text: 'Suspended', value: 'Suspended' }
      ]
    },
    {
      title: 'Grade Avg',
      dataIndex: 'gradeAverage',
      key: 'gradeAverage',
      width: 100,
      render: (avg) => {
        const color = avg >= 8 ? 'green' : avg >= 6.5 ? 'orange' : 'red';
        return (
          <Tag color={color}>
            {avg ? avg.toFixed(1) : 'N/A'}
          </Tag>
        );
      },
      sorter: true
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
              size="small"
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
              size="small"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Student"
            description={`Are you sure to delete ${record.name}?`}
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
          <Dropdown overlay={getMoreMenu(record)} trigger={['click']}>
            <Button type="text" icon={<MoreOutlined />} size="small" />
          </Dropdown>
        </Space>
      )
    }
  ];

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE
    ]
  };

  return (
    <div className="student-list">
      {/* Header Actions */}
      <Card className="list-header" bodyStyle={{ padding: '16px 24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space size="middle" wrap>
              <Search
                placeholder="Search by name, ID, email..."
                allowClear
                enterButton={<SearchOutlined />}
                size="default"
                onSearch={handleSearch}
                style={{ width: 300 }}
              />
              
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilter(!showFilter)}
                type={showFilter ? 'primary' : 'default'}
              >
                Filters {showFilter && `(Active)`}
              </Button>

              {selectedRowKeys.length > 0 && (
                <>
                  <Text type="secondary">
                    {selectedRowKeys.length} selected
                  </Text>
                  <Popconfirm
                    title="Delete Students"
                    description={`Delete ${selectedRowKeys.length} selected students?`}
                    onConfirm={handleBulkDelete}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ danger: true }}
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      Delete Selected
                    </Button>
                  </Popconfirm>
                </>
              )}
            </Space>
          </Col>
          
          <Col>
            <Space>
              <Tooltip title="Refresh">
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={loadStudents}
                />
              </Tooltip>
              
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="excel" icon={<ExportOutlined />}>
                      Export as Excel
                    </Menu.Item>
                    <Menu.Item key="csv" icon={<ExportOutlined />}>
                      Export as CSV
                    </Menu.Item>
                    <Menu.Item key="pdf" icon={<ExportOutlined />}>
                      Export as PDF
                    </Menu.Item>
                  </Menu>
                }
              >
                <Button icon={<DownloadOutlined />}>Export</Button>
              </Dropdown>
              
              <Button icon={<UploadOutlined />}>Import</Button>
              
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={onAdd}
              >
                Add Student
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Filter Panel */}
        {showFilter && (
          <div style={{ marginTop: 16 }}>
            <StudentFilter onApply={loadStudents} />
          </div>
        )}
      </Card>

      {/* Students Table */}
      <Card className="list-content" bodyStyle={{ padding: 0 }}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={Array.isArray(students) ? students : []}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1300 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No students found"
              >
                <Button type="primary" onClick={onAdd}>
                  Add First Student
                </Button>
              </Empty>
            )
          }}
        />
        
        {/* Custom Pagination */}
        {pagination.totalStudents > 0 && (
          <div style={{ padding: '16px', textAlign: 'right', borderTop: '1px solid #f0f0f0' }}>
            <Pagination
              current={pagination.currentPage}
              pageSize={pagination.pageSize}
              total={pagination.totalStudents}
              onChange={handlePaginationChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} students`}
              pageSizeOptions={['10', '20', '50', '100']}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default StudentList;
