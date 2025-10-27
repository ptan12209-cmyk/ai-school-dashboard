/**
 * SkeletonLoaders Component
 * =========================
 * Reusable skeleton loading components for better UX
 */

import React from 'react';
import {
  Card,
  Skeleton,
  Table,
  List,
  Row,
  Col,
  Space
} from 'antd';
import './SkeletonLoaders.scss';

/**
 * Skeleton for Table Component
 */
export const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  const tableColumns = Array.from({ length: columns }, (_, i) => ({
    title: <Skeleton.Input active size="small" style={{ width: 100 }} />,
    dataIndex: `col${i}`,
    key: `col${i}`,
    render: () => <Skeleton.Input active size="small" style={{ width: '100%' }} />
  }));

  const tableData = Array.from({ length: rows }, (_, i) => ({
    key: i,
    ...Object.fromEntries(
      Array.from({ length: columns }, (_, j) => [`col${j}`, `Loading...`])
    )
  }));

  return (
    <Table
      columns={tableColumns}
      dataSource={tableData}
      pagination={false}
      className="skeleton-table"
    />
  );
};

/**
 * Skeleton for Statistics Card
 */
export const StatCardSkeleton = () => (
  <Card className="skeleton-stat-card">
    <Space direction="vertical" style={{ width: '100%' }}>
      <Skeleton.Button active size="small" style={{ width: 60 }} />
      <Skeleton.Input active size="large" style={{ width: 120 }} />
      <Skeleton.Input active size="small" style={{ width: 100 }} />
    </Space>
  </Card>
);

/**
 * Skeleton for Dashboard Statistics Row
 */
export const StatsRowSkeleton = ({ count = 4 }) => (
  <Row gutter={[16, 16]} className="skeleton-stats-row">
    {Array.from({ length: count }, (_, i) => (
      <Col xs={24} sm={12} md={6} key={i}>
        <StatCardSkeleton />
      </Col>
    ))}
  </Row>
);

/**
 * Skeleton for List Component
 */
export const ListSkeleton = ({ rows = 5 }) => (
  <List
    className="skeleton-list"
    dataSource={Array.from({ length: rows })}
    renderItem={() => (
      <List.Item>
        <Skeleton active avatar paragraph={{ rows: 2 }} />
      </List.Item>
    )}
  />
);

/**
 * Skeleton for Form Component
 */
export const FormSkeleton = ({ fields = 6 }) => (
  <Card className="skeleton-form">
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {Array.from({ length: fields }, (_, i) => (
        <div key={i}>
          <Skeleton.Input active size="small" style={{ width: 100, marginBottom: 8 }} />
          <Skeleton.Input active size="default" block />
        </div>
      ))}
      <Space>
        <Skeleton.Button active />
        <Skeleton.Button active />
      </Space>
    </Space>
  </Card>
);

/**
 * Skeleton for Profile Page
 */
export const ProfileSkeleton = () => (
  <Card className="skeleton-profile">
    <Row gutter={[24, 24]}>
      <Col xs={24} md={8} style={{ textAlign: 'center' }}>
        <Skeleton.Avatar active size={120} />
        <Skeleton.Input active block style={{ marginTop: 16 }} />
        <Skeleton.Input active block style={{ marginTop: 8 }} />
      </Col>
      <Col xs={24} md={16}>
        <FormSkeleton fields={8} />
      </Col>
    </Row>
  </Card>
);

/**
 * Skeleton for Detail Page
 */
export const DetailPageSkeleton = () => (
  <div className="skeleton-detail-page">
    {/* Header */}
    <Card style={{ marginBottom: 16 }}>
      <Row align="middle" gutter={16}>
        <Col>
          <Skeleton.Avatar active size={64} />
        </Col>
        <Col flex="auto">
          <Skeleton.Input active style={{ width: 200, marginBottom: 8 }} />
          <Skeleton.Input active size="small" style={{ width: 150 }} />
        </Col>
        <Col>
          <Space>
            <Skeleton.Button active />
            <Skeleton.Button active />
          </Space>
        </Col>
      </Row>
    </Card>

    {/* Stats Row */}
    <StatsRowSkeleton count={4} />

    {/* Content Tabs */}
    <Card style={{ marginTop: 16 }}>
      <Space style={{ marginBottom: 16 }}>
        <Skeleton.Button active />
        <Skeleton.Button active />
        <Skeleton.Button active />
      </Space>
      <TableSkeleton rows={5} columns={4} />
    </Card>
  </div>
);

/**
 * Skeleton for Dashboard Page
 */
export const DashboardSkeleton = () => (
  <div className="skeleton-dashboard">
    {/* Welcome Banner */}
    <Card style={{ marginBottom: 16 }}>
      <Skeleton active paragraph={{ rows: 2 }} />
    </Card>

    {/* Stats Cards */}
    <StatsRowSkeleton count={4} />

    {/* Charts Row */}
    <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
      <Col xs={24} md={12}>
        <Card>
          <Skeleton.Input active style={{ width: 150, marginBottom: 16 }} />
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card>
          <Skeleton.Input active style={{ width: 150, marginBottom: 16 }} />
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </Col>
    </Row>

    {/* Activity List */}
    <Card style={{ marginTop: 16 }}>
      <Skeleton.Input active style={{ width: 150, marginBottom: 16 }} />
      <ListSkeleton rows={5} />
    </Card>
  </div>
);

/**
 * Skeleton for Page Header
 */
export const PageHeaderSkeleton = () => (
  <div className="skeleton-page-header">
    <Row align="middle" justify="space-between">
      <Col>
        <Skeleton.Input active size="large" style={{ width: 200, marginBottom: 8 }} />
        <Skeleton.Input active size="small" style={{ width: 300 }} />
      </Col>
      <Col>
        <Space>
          <Skeleton.Button active />
          <Skeleton.Button active />
          <Skeleton.Button active />
        </Space>
      </Col>
    </Row>
  </div>
);

/**
 * Skeleton for Data Grid/Table Page
 */
export const DataGridSkeleton = () => (
  <div className="skeleton-data-grid">
    {/* Header with filters and actions */}
    <Card style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]} align="middle">
        <Col flex="auto">
          <Space>
            <Skeleton.Input active style={{ width: 300 }} />
            <Skeleton.Button active />
          </Space>
        </Col>
        <Col>
          <Space>
            <Skeleton.Button active />
            <Skeleton.Button active />
            <Skeleton.Button active />
          </Space>
        </Col>
      </Row>
    </Card>

    {/* Data Table */}
    <Card>
      <TableSkeleton rows={10} columns={6} />
      <div style={{ textAlign: 'right', marginTop: 16 }}>
        <Space>
          <Skeleton.Button active size="small" />
          <Skeleton.Button active size="small" />
          <Skeleton.Button active size="small" />
        </Space>
      </div>
    </Card>
  </div>
);

/**
 * Skeleton for Card Grid
 */
export const CardGridSkeleton = ({ count = 6, columns = 3 }) => (
  <Row gutter={[16, 16]} className="skeleton-card-grid">
    {Array.from({ length: count }, (_, i) => (
      <Col xs={24} sm={12} md={24 / columns} key={i}>
        <Card>
          <Skeleton active avatar paragraph={{ rows: 3 }} />
        </Card>
      </Col>
    ))}
  </Row>
);

/**
 * Inline Loading Skeleton (for button/form states)
 */
export const InlineSkeleton = ({ width = 100 }) => (
  <Skeleton.Input active size="small" style={{ width }} />
);

/**
 * Full Page Loading
 */
export const FullPageLoader = ({ message = 'Loading...' }) => (
  <div className="full-page-loader">
    <Space direction="vertical" align="center" size="large">
      <Skeleton.Avatar active size={80} />
      <Skeleton.Input active style={{ width: 200 }} />
      {message && <p className="loader-message">{message}</p>}
    </Space>
  </div>
);

export default {
  TableSkeleton,
  StatCardSkeleton,
  StatsRowSkeleton,
  ListSkeleton,
  FormSkeleton,
  ProfileSkeleton,
  DetailPageSkeleton,
  DashboardSkeleton,
  PageHeaderSkeleton,
  DataGridSkeleton,
  CardGridSkeleton,
  InlineSkeleton,
  FullPageLoader
};
