
const path = require('path');

// Mock Notification Model
const mockCreate = jest.fn();
const mockBulkCreate = jest.fn();

jest.mock('../../models/Notification', () => {
  return {
    create: mockCreate,
    bulkCreate: mockBulkCreate,
    // Add other methods if needed by service initialization
    markEmailSent: jest.fn(),
  };
});

// Mock Email Service
jest.mock('../../services/emailService', () => ({
  sendNotificationEmail: jest.fn(),
}));

// Mock Notification instance methods
const mockNotificationInstance = {
  markEmailSent: jest.fn(),
  markAsRead: jest.fn(),
  // Add properties needed
  id: 'mock-id',
  created_at: new Date(),
};

const notificationService = require('../../services/notificationService');

describe('Notification Service Performance', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mock implementations with delays
    mockCreate.mockImplementation(async (data) => {
      await new Promise(resolve => setTimeout(resolve, 5)); // 5ms delay per insert
      return {
        ...data,
        ...mockNotificationInstance,
        id: `id-${Date.now()}-${Math.random()}`
      };
    });

    mockBulkCreate.mockImplementation(async (dataArray) => {
      await new Promise(resolve => setTimeout(resolve, 20)); // 20ms fixed delay for bulk
      return dataArray.map(data => ({
        ...data,
        ...mockNotificationInstance,
        id: `id-${Date.now()}-${Math.random()}`
      }));
    });
  });

  test('Benchmark createBulkNotifications', async () => {
    const userIds = Array.from({ length: 100 }, (_, i) => `user-${i}`);
    const data = {
      title: 'Benchmark Notification',
      message: 'Testing performance',
      type: 'system'
    };
    const options = {
      sendEmail: false
    };

    console.log(`Starting benchmark for ${userIds.length} notifications...`);
    const start = process.hrtime();

    await notificationService.createBulkNotifications(userIds, data, options);

    const end = process.hrtime(start);
    const timeInMs = (end[0] * 1000 + end[1] / 1e6).toFixed(2);

    console.log(`Time taken: ${timeInMs}ms`);

    // If it's the old implementation (N+1), it should be around 100 * 5ms = 500ms
    // If it's the new implementation (Bulk), it should be around 20ms
  });
});
