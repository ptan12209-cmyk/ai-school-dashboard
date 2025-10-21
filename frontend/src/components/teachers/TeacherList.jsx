// TeacherList.jsx - Main component for displaying teachers list
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
  Row,
  Col,
  Card,
  Typography,
  Empty,
  Pagination,
  Rate
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
  ExportOutlined,
  BookOutlined,
  TeamOutlined,
  CalendarOutlined,
  TrophyOutlined,
  IdcardOutlined
} from '@ant-design/icons';
import {
  fetchTeachers,
  deleteTeacher,
  bulkDeleteTeachers,
  setSearchTerm,
  setCurrentPage,
  setPageSize,
  selectAllTeachers,
  selectTeachersLoading,
  selectPagination,
  clearMessages
} from '../../redux/slices/teacherSlice';
import TeacherFilter from './TeacherFilter.jsx';
import './TeacherList.scss';

const { Title, Text } = Typography;
const { Search } = Input;

const TeacherList = ({ onAdd, onEdit, onView, onAssignClass }) => {
  const dispatch = useDispatch();
  const teachers = useSelector(selectAllTeachers);
  const loading = useSelector(selectTeachersLoading);
  const pagination = useSelector(selectPagination);
  
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const loadTeachers = useCallback(() => {
    dispatch(fetchTeachers({
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      search: searchValue
    }));
  }, [dispatch, pagination.currentPage, pagination.pageSize, searchValue]);

  // Single useEffect to handle all data fetching
  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  // Handle search
  const handleSearch = (value) => {
    setSearchValue(value);
    dispatch(setSearchTerm(value));
    dispatch(setCurrentPage(1));
    dispatch(fetchTeachers({
      page: 1,
      pageSize: pagination.pageSize,
      search: value
    }));
  };

  // Handle delete single teacher
  const handleDelete = async (teacherId) => {
    try {
      await dispatch(deleteTeacher(teacherId)).unwrap();
      message.success('Teacher deleted successfully');
      loadTeachers();
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || error?.toString() || 'Failed to delete teacher';
      message.error(errorMessage);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select teachers to delete');
      return;
    }
    
    try {
      await dispatch(bulkDeleteTeachers(selectedRowKeys)).unwrap();
      message.success(`${selectedRowKeys.length} teachers deleted successfully`);
      setSelectedRowKeys([]);
      loadTeachers();
    } catch (error) {
      const errorMessage = error?.message || error?.response?.data?.message || error?.toString() || 'Failed to delete teachers';
      message.error(errorMessage);
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
  const getMoreMenuItems = (record) => [
    {
      key: 'email',
      icon: <MailOutlined />,
      label: <a href={`mailto:${record.email}`}>Send Email</a>
    },
    {
      key: 'call',
      icon: <PhoneOutlined />,
      label: <a href={`tel:${record.phone}`}>Call</a>
    },
    {
      type: 'divider'
    },
    {
      key: 'schedule',
      icon: <CalendarOutlined />,
      label: 'View Schedule'
    },
    {
      key: 'classes',
      icon: <TeamOutlined />,
      label: 'View Classes'
    },
    {
      key: 'assign',
      icon: <BookOutlined />,
      label: 'Assign Class',
      onClick: () => onAssignClass(record)
    },
    {
      type: 'divider'
    },
    {
      key: 'performance',
      icon: <TrophyOutlined />,
      label: 'Performance Report'
    },
    {
      key: 'export',
      icon: <ExportOutlined />,
      label: 'Export Data'
    }
  ];

  // Get department color
  const getDepartmentColor = (department) => {
    const colors = {
      'Mathematics': 'blue',
      'Science': 'green',
      'English': 'purple',
      'History': 'orange',
      'Computer Science': 'cyan',
      'Physical Education': 'red',
      'Arts': 'magenta',
      'Languages': 'gold'
    };
    return colors[department] || 'default';
  };

  // Get experience level
  const getExperienceLevel = (years) => {
    if (years >= 20) return { level: 'Senior Expert', color: 'gold' };
    if (years >= 10) return { level: 'Senior', color: 'blue' };
    if (years >= 5) return { level: 'Mid-level', color: 'green' };
    if (years >= 2) return { level: 'Junior', color: 'cyan' };
    return { level: 'Fresher', color: 'default' };
  };

  // Table columns definition
  const columns = [
    {
      title: 'Teacher',
      key: 'teacher',
      width: 280,
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
              <IdcardOutlined /> {record.teacherId || record.id} | {record.qualification || 'B.Ed'}
            </Text>
          </div>
        </Space>
      ),
      sorter: true
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 150,
      render: (department) => (
        <Tag color={getDepartmentColor(department)}>
          {department || 'N/A'}
        </Tag>
      ),
      filters: [
        { text: 'Mathematics', value: 'Mathematics' },
        { text: 'Science', value: 'Science' },
        { text: 'English', value: 'English' },
        { text: 'History', value: 'History' },
        { text: 'Computer Science', value: 'Computer Science' }
      ],
      sorter: true
    },
    {
      title: 'Subjects',
      dataIndex: 'subjects',
      key: 'subjects',
      width: 200,
      render: (subjects) => (
        <Space wrap>
          {subjects && subjects.length > 0 ? (
            subjects.slice(0, 2).map((subject) => (
              <Tag key={subject} color="blue">
                <BookOutlined /> {subject}
              </Tag>
            ))
          ) : (
            <Text type="secondary">No subjects assigned</Text>
          )}
          {subjects && subjects.length > 2 && (
            <Tag>+{subjects.length - 2} more</Tag>
          )}
        </Space>
      )
    },
    {
      title: 'Classes',
      dataIndex: 'classes',
      key: 'classes',
      width: 150,
      render: (classes) => {
        const classCount = classes?.length || 0;
        return (
          <Space>
            <TeamOutlined />
            <Text>{classCount} {classCount === 1 ? 'class' : 'classes'}</Text>
          </Space>
        );
      }
    },
    {
      title: 'Experience',
      dataIndex: 'experience',
      key: 'experience',
      width: 120,
      render: (years) => {
        const exp = getExperienceLevel(years || 0);
        return (
          <Tag color={exp.color}>
            {years || 0} yrs | {exp.level}
          </Tag>
        );
      },
      sorter: true
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
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
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
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
      render: (rating) => (
        <Space>
          <Rate disabled defaultValue={rating || 4} style={{ fontSize: 14 }} />
          <Text type="secondary">({rating || 4.0})</Text>
        </Space>
      ),
      sorter: true
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const color = status === 'Active' ? 'green' : 
                     status === 'On Leave' ? 'orange' :
                     status === 'Inactive' ? 'red' : 'default';
        return <Badge status={color === 'green' ? 'success' : color === 'orange' ? 'warning' : 'error'} text={status} />;
      },
      filters: [
        { text: 'Active', value: 'Active' },
        { text: 'On Leave', value: 'On Leave' },
        { text: 'Inactive', value: 'Inactive' }
      ]
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
            title="Delete Teacher"
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
          <Dropdown menu={{ items: getMoreMenuItems(record) }} trigger={['click']}>
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
    <div className="teacher-list">
      {/* Header Actions */}
      <Card className="list-header" bodyStyle={{ padding: '16px 24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space size="middle" wrap>
              <Search
                placeholder="Search by name, ID, email, subject..."
                allowClear
                enterButton={<SearchOutlined />}
                size="default"
                onSearch={handleSearch}
                style={{ width: 350 }}
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
                    title="Delete Teachers"
                    description={`Delete ${selectedRowKeys.length} selected teachers?`}
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
                  onClick={loadTeachers}
                />
              </Tooltip>
              
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'excel',
                      icon: <ExportOutlined />,
                      label: 'Export as Excel'
                    },
                    {
                      key: 'csv',
                      icon: <ExportOutlined />,
                      label: 'Export as CSV'
                    },
                    {
                      key: 'pdf',
                      icon: <ExportOutlined />,
                      label: 'Export as PDF'
                    }
                  ]
                }}
              >
                <Button icon={<DownloadOutlined />}>Export</Button>
              </Dropdown>
              
              <Button icon={<UploadOutlined />}>Import</Button>
              
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={onAdd}
              >
                Add Teacher
              </Button>
            </Space>
          </Col>
        </Row>

        {/* Filter Panel */}
        {showFilter && (
          <div style={{ marginTop: 16 }}>
            <TeacherFilter onApply={loadTeachers} />
          </div>
        )}
      </Card>

      {/* Teachers Table */}
      <Card className="list-content" bodyStyle={{ padding: 0 }}>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={Array.isArray(teachers) ? teachers : []}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 1500 }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No teachers found"
              >
                <Button type="primary" onClick={onAdd}>
                  Add First Teacher
                </Button>
              </Empty>
            )
          }}
        />
        
        {/* Custom Pagination */}
        {pagination.totalTeachers > 0 && (
          <div style={{ padding: '16px', textAlign: 'right', borderTop: '1px solid #f0f0f0' }}>
            <Pagination
              current={pagination.currentPage}
              pageSize={pagination.pageSize}
              total={pagination.totalTeachers}
              onChange={handlePaginationChange}
              showSizeChanger
              showQuickJumper
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} teachers`}
              pageSizeOptions={['10', '20', '50', '100']}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default TeacherList;
