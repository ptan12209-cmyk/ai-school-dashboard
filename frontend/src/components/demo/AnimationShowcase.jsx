import React, { useState } from 'react';
import { Card, Button, Row, Col, Typography, Space, Badge } from 'antd';
import {
  RocketOutlined,
  StarOutlined,
  ThunderboltOutlined,
  HeartOutlined,
  BellOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const AnimationShowcase = () => {
  const [showNotification, setShowNotification] = useState(false);

  const animations = [
    { name: 'Fade In Up', class: 'animate-fade-in-up' },
    { name: 'Fade In Down', class: 'animate-fade-in-down' },
    { name: 'Fade In Left', class: 'animate-fade-in-left' },
    { name: 'Fade In Right', class: 'animate-fade-in-right' },
    { name: 'Slide In Up', class: 'animate-slide-in-up' },
    { name: 'Scale In', class: 'animate-scale-in' },
    { name: 'Bounce In', class: 'animate-bounce-in' },
    { name: 'Shake', class: 'animate-shake' },
    { name: 'Wiggle', class: 'animate-wiggle' },
    { name: 'Float', class: 'animate-float' },
    { name: 'Pulse Slow', class: 'animate-pulse-slow' },
    { name: 'Spin Slow', class: 'animate-spin-slow' },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Title level={2} className="mb-6 animate-fade-in-down">
          🎨 Tailwind CSS Animation Showcase
        </Title>

        {/* Animation Grid */}
        <Row gutter={[16, 16]} className="mb-8">
          {animations.map((anim, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={anim.name}>
              <Card
                className={`text-center hover-lift ${anim.class} stagger-${(index % 5) + 1}`}
                style={{ height: '150px' }}
              >
                <StarOutlined className="text-4xl text-primary-500 mb-2" />
                <Text strong>{anim.name}</Text>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Hover Effects */}
        <Card className="mb-8 animate-fade-in-up">
          <Title level={3}>Hover Effects</Title>
          <Space wrap size="large">
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              className="hover-grow btn-press"
            >
              Hover Grow
            </Button>
            <Button
              size="large"
              icon={<ThunderboltOutlined />}
              className="hover-lift animated-button"
            >
              Hover Lift
            </Button>
            <Card className="card-hover" style={{ width: 200, display: 'inline-block' }}>
              <HeartOutlined className="text-2xl text-error-500" />
              <p>Card Hover</p>
            </Card>
          </Space>
        </Card>

        {/* Interactive Elements */}
        <Card className="mb-8 animate-fade-in-up">
          <Title level={3}>Interactive Elements</Title>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Loading Spinner */}
            <div>
              <Text strong className="mr-4">Loading Spinner:</Text>
              <div className="loading-spinner"></div>
            </div>

            {/* Progress Bar */}
            <div>
              <Text strong className="mb-2 block">Progress Bar:</Text>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: '75%' }}></div>
              </div>
            </div>

            {/* Notification Badge */}
            <div>
              <Text strong className="mr-4">Notification Badge:</Text>
              <Badge count={5} className="animate-bounce-gentle">
                <BellOutlined className="text-2xl" />
              </Badge>
            </div>

            {/* Shimmer Effect */}
            <div>
              <Text strong className="mb-2 block">Shimmer Loading:</Text>
              <div className="shimmer h-20 rounded-lg"></div>
            </div>

            {/* Skeleton Loader */}
            <div>
              <Text strong className="mb-2 block">Skeleton Loader:</Text>
              <div className="space-y-2">
                <div className="skeleton h-4 w-full"></div>
                <div className="skeleton h-4 w-3/4"></div>
                <div className="skeleton h-4 w-1/2"></div>
              </div>
            </div>
          </Space>
        </Card>

        {/* Gradient Animation */}
        <Card
          className="mb-8 animate-fade-in-up gradient-animate"
          style={{
            background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
            color: 'white',
          }}
        >
          <Title level={3} style={{ color: 'white' }}>
            Animated Gradient Background
          </Title>
          <Text style={{ color: 'white' }}>
            This card has an animated gradient background that shifts colors smoothly.
          </Text>
        </Card>

        {/* Staggered Animation */}
        <Card className="mb-8">
          <Title level={3}>Staggered Animation</Title>
          <Row gutter={[16, 16]}>
            {[1, 2, 3, 4, 5].map((num) => (
              <Col xs={24} sm={12} md={8} lg={4} key={num}>
                <Card className={`text-center animate-fade-in-up stagger-${num}`}>
                  <Title level={4}>{num}</Title>
                  <Text>Delay {num * 100}ms</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>

        {/* Notification Animation */}
        <Card className="animate-fade-in-up">
          <Title level={3}>Slide Notification</Title>
          <Button
            type="primary"
            onClick={() => {
              setShowNotification(true);
              setTimeout(() => setShowNotification(false), 3000);
            }}
          >
            Show Notification
          </Button>
          {showNotification && (
            <div
              className="fixed top-4 right-4 bg-white shadow-lg rounded-lg p-4 animate-slide-in-notification"
              style={{ zIndex: 1000, minWidth: '300px' }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BellOutlined className="text-2xl text-primary-500" />
                </div>
                <div className="ml-3">
                  <Text strong>Success!</Text>
                  <p className="text-sm text-gray-600">Your notification is working perfectly.</p>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Usage Instructions */}
        <Card className="mt-8 animate-fade-in-up" style={{ backgroundColor: '#f0f9ff' }}>
          <Title level={3}>📚 How to Use These Animations</Title>
          <div className="space-y-4">
            <div>
              <Text strong>1. Fade Animations:</Text>
              <pre className="bg-gray-100 p-3 rounded mt-2">
                {`<div className="animate-fade-in-up">Content</div>`}
              </pre>
            </div>
            <div>
              <Text strong>2. Hover Effects:</Text>
              <pre className="bg-gray-100 p-3 rounded mt-2">
                {`<button className="hover-grow">Hover Me</button>`}
              </pre>
            </div>
            <div>
              <Text strong>3. Loading Spinner:</Text>
              <pre className="bg-gray-100 p-3 rounded mt-2">
                {`<div className="loading-spinner"></div>`}
              </pre>
            </div>
            <div>
              <Text strong>4. Staggered Animations:</Text>
              <pre className="bg-gray-100 p-3 rounded mt-2">
                {`<div className="animate-fade-in-up stagger-1">Item 1</div>
<div className="animate-fade-in-up stagger-2">Item 2</div>`}
              </pre>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnimationShowcase;
