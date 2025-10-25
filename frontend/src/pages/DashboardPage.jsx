/**
 * DashboardPage.jsx - Main Dashboard Page
 * ========================================
 * Dashboard page component with integrated Ant Design components
 */

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Typography, Button, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

// Dashboard Components
import StatisticsCards from '../components/dashboard/StatisticsCards';
import LineChart from '../components/dashboard/LineChart';
import BarChart from '../components/dashboard/BarChart';
import PieChart from '../components/dashboard/PieChart';
import RecentActivities from '../components/dashboard/RecentActivities';
import QuickActions from '../components/dashboard/QuickActions';
import TopPerformers from '../components/dashboard/TopPerformers';

// Redux actions
import { fetchDashboardData } from '../redux/slices/dashboardSlice';

const { Title } = Typography;

/**
 * Dashboard Page Component
 */
const DashboardPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { stats, charts, recentActivities, loading } = useSelector(state => state.dashboard);

  const [refreshing, setRefreshing] = useState(false);

  // Fetch dashboard data on mount
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  /**
   * Handle refresh
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDashboardData());
    setRefreshing(false);
  };

  /**
   * Handle quick actions
   */
  const handleQuickAction = (actionKey) => {
    const routeMap = {
      'add-student': '/students',
      'add-teacher': '/teachers',
      'create-course': '/courses',
      'mark-attendance': '/attendance',
      'enter-grades': '/grades',
      'generate-report': '/reports'
    };

    const route = routeMap[actionKey];
    if (route) {
      navigate(route);
    } else {
      console.log(`Quick action: ${actionKey}`);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div className="animate-fade-in-down" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Tổng Quan</Title>
        <Button
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          loading={refreshing}
          className="hover-grow btn-press"
        >
          Làm Mới
        </Button>
      </div>

      {/* Welcome Message */}
      <div className="animate-fade-in-up" style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <Title level={4} style={{ margin: 0 }}>
          Chào mừng trở lại, {user?.firstName || 'User'}!
        </Title>
        <Typography.Text type="secondary">
          Hôm nay là {new Date().toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Typography.Text>
      </div>

      {/* Statistics Cards */}
      <div style={{ marginBottom: '24px' }}>
        <StatisticsCards stats={stats} />
      </div>

      {/* Charts and Analytics */}
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={12}>
          <LineChart
            title="Xu Hướng Thành Tích"
            data={charts?.performanceData}
          />
        </Col>
        <Col xs={24} lg={12}>
          <BarChart
            title="Thành Tích Theo Môn Học"
            data={charts?.subjectData}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col xs={24} lg={8}>
          <PieChart
            title="Phân Bố Điểm Số"
            data={charts?.gradeDistribution}
          />
        </Col>
        <Col xs={24} lg={8}>
          <QuickActions onAction={handleQuickAction} />
        </Col>
        <Col xs={24} lg={8}>
          <TopPerformers 
            students={stats?.topStudents} 
            teachers={stats?.topTeachers} 
          />
        </Col>
      </Row>

      {/* Recent Activities */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <RecentActivities activities={recentActivities} />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardPage;