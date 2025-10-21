/**
 * GradeTable.jsx - Grade Table Component
 * =====================================
 * Displays grades in a sortable, filterable table
 */

import React, { useState } from 'react';
import { 
  Table, 
  Card, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Space,
  Tooltip,
  Popconfirm 
} from 'antd';
import { 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined,
  FilterOutlined 
} from '@ant-design/icons';

const { Option } = Select;

const GradeTable = ({ 
  grades = [], 
  loading = false, 
  onEdit, 
  onDelete, 
  onRefresh 
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedGradeType, setSelectedGradeType] = useState('');

  // Mock data if none provided
  const mockGrades = [
    {
      id: 1,
      studentName: 'Alice Johnson',
      studentId: 'ST001',
      subject: 'Mathematics',
      gradeType: 'midterm',
      grade: 95.5,
      maxGrade: 100,
      date: '2024-01-15',
      comments: 'Excellent work'
    },
    {
      id: 2,
      studentName: 'Bob Smith',
      studentId: 'ST002',
      subject: 'Science',
      gradeType: 'quiz',
      grade: 87.0,
      maxGrade: 100,
      date: '2024-01-14',
      comments: 'Good understanding'
    },
    {
      id: 3,
      studentName: 'Carol Davis',
      studentId: 'ST003',
      subject: 'English',
      gradeType: 'assignment',
      grade: 92.5,
      maxGrade: 100,
      date: '2024-01-13',
      comments: 'Well written'
    }
  ];

  const gradeData = grades.length > 0 ? grades : mockGrades;

  const getGradeColor = (grade, maxGrade = 100) => {
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 90) return 'green';
    if (percentage >= 80) return 'blue';
    if (percentage >= 70) return 'orange';
    if (percentage >= 60) return 'gold';
    return 'red';
  };

  const getGradeTypeTag = (type) => {
    const colors = {
      quiz: 'blue',
      assignment: 'green',
      midterm: 'orange',
      final: 'red',
      project: 'purple'
    };
    return (
      <Tag color={colors[type] || 'default'}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Student',
      dataIndex: 'studentName',
      key: 'studentName',
      sorter: (a, b) => a.studentName.localeCompare(b.studentName),
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value, record) =>
        record.studentName.toLowerCase().includes(value.toLowerCase()) ||
        record.studentId.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.studentId}</div>
        </div>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
      sorter: (a, b) => a.subject.localeCompare(b.subject),
      filteredValue: selectedSubject ? [selectedSubject] : null,
      onFilter: (value, record) => record.subject === value,
    },
    {
      title: 'Type',
      dataIndex: 'gradeType',
      key: 'gradeType',
      filteredValue: selectedGradeType ? [selectedGradeType] : null,
      onFilter: (value, record) => record.gradeType === value,
      render: (type) => getGradeTypeTag(type),
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      sorter: (a, b) => a.grade - b.grade,
      render: (grade, record) => (
        <Tag color={getGradeColor(grade, record.maxGrade)} style={{ fontSize: '14px' }}>
          {grade}/{record.maxGrade || 100}
        </Tag>
      ),
    },
    {
      title: 'Percentage',
      key: 'percentage',
      sorter: (a, b) => (a.grade / (a.maxGrade || 100)) - (b.grade / (b.maxGrade || 100)),
      render: (_, record) => {
        const percentage = ((record.grade / (record.maxGrade || 100)) * 100).toFixed(1);
        return `${percentage}%`;
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Comments',
      dataIndex: 'comments',
      key: 'comments',
      ellipsis: true,
      render: (comments) => (
        comments ? (
          <Tooltip title={comments}>
            <span>{comments.length > 30 ? `${comments.substring(0, 30)}...` : comments}</span>
          </Tooltip>
        ) : '-'
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit && onEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure you want to delete this grade?"
              onConfirm={() => onDelete && onDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Get unique subjects and grade types for filters
  const subjects = [...new Set(gradeData.map(grade => grade.subject))];
  const gradeTypes = [...new Set(gradeData.map(grade => grade.gradeType))];

  return (
    <Card 
      title="Grade Records"
      extra={
        <Button onClick={onRefresh} loading={loading}>
          Refresh
        </Button>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Input
            placeholder="Search by student name or ID"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by subject"
            value={selectedSubject}
            onChange={setSelectedSubject}
            style={{ width: 150 }}
            allowClear
          >
            {subjects.map(subject => (
              <Option key={subject} value={subject}>{subject}</Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by type"
            value={selectedGradeType}
            onChange={setSelectedGradeType}
            style={{ width: 150 }}
            allowClear
          >
            {gradeTypes.map(type => (
              <Option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Option>
            ))}
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={gradeData}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} grades`,
        }}
        scroll={{ x: 800 }}
      />
    </Card>
  );
};

export default GradeTable;
