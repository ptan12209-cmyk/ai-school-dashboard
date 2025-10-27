/**
 * Notification Scheduler Service
 * ===============================
 * Handles scheduled notifications for deadlines and reminders
 */

const cron = require('node-cron');
const { Op } = require('sequelize');
const { Assignment, Grade, Student, User, Course } = require('../models');
const notificationService = require('./notificationService');
const emailService = require('./emailService');

class NotificationScheduler {
  constructor() {
    this.jobs = [];
  }

  /**
   * Initialize all scheduled jobs
   */
  initializeScheduler() {
    console.log('🔔 Initializing Notification Scheduler...');

    // Check for assignment deadlines every day at 8 AM
    this.scheduleAssignmentDeadlineReminders();

    // Check for upcoming tests/exams every day at 8 AM
    this.scheduleExamReminders();

    // Send weekly summary emails every Monday at 9 AM
    this.scheduleWeeklySummary();

    console.log('✅ Notification Scheduler initialized');
  }

  /**
   * Schedule assignment deadline reminders
   * Runs daily at 8:00 AM
   */
  scheduleAssignmentDeadlineReminders() {
    const job = cron.schedule('0 8 * * *', async () => {
      console.log('🔔 Checking assignment deadlines...');
      await this.checkAssignmentDeadlines();
    });

    this.jobs.push({ name: 'Assignment Deadline Reminders', job });
  }

  /**
   * Check and send notifications for upcoming assignment deadlines
   */
  async checkAssignmentDeadlines() {
    try {
      const now = new Date();
      const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Find assignments due in 1 day
      const assignmentsDueInOneDay = await Assignment.findAll({
        where: {
          due_date: {
            [Op.between]: [now, oneDayFromNow]
          },
          status: {
            [Op.ne]: 'completed'
          }
        },
        include: [
          {
            model: Course,
            include: [
              {
                model: Student,
                include: [User]
              }
            ]
          }
        ]
      });

      // Find assignments due in 3 days
      const assignmentsDueInThreeDays = await Assignment.findAll({
        where: {
          due_date: {
            [Op.between]: [new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), threeDaysFromNow]
          },
          status: {
            [Op.ne]: 'completed'
          }
        },
        include: [
          {
            model: Course,
            include: [
              {
                model: Student,
                include: [User]
              }
            ]
          }
        ]
      });

      // Send urgent notifications for assignments due in 1 day
      for (const assignment of assignmentsDueInOneDay) {
        await this.sendAssignmentDeadlineNotification(assignment, 'urgent', 1);
      }

      // Send high priority notifications for assignments due in 3 days
      for (const assignment of assignmentsDueInThreeDays) {
        await this.sendAssignmentDeadlineNotification(assignment, 'high', 3);
      }

      console.log(`✅ Sent deadline reminders for ${assignmentsDueInOneDay.length + assignmentsDueInThreeDays.length} assignments`);
    } catch (error) {
      console.error('❌ Error checking assignment deadlines:', error);
    }
  }

  /**
   * Send assignment deadline notification
   */
  async sendAssignmentDeadlineNotification(assignment, priority, daysUntilDue) {
    try {
      const course = assignment.Course;
      if (!course || !course.Students) return;

      const formattedDueDate = new Date(assignment.due_date).toLocaleDateString('vi-VN');

      for (const student of course.Students) {
        if (!student.User) continue;

        const notification = await notificationService.notifyAssignmentDue(
          student.User.id,
          {
            name: assignment.title,
            dueDate: formattedDueDate,
            course: course.name,
            assignmentId: assignment.id,
            daysUntilDue
          },
          {
            sendEmail: true,
            user: student.User
          }
        );

        // Send email
        await emailService.sendEmail({
          to: student.User.email,
          subject: `Nhắc Nhở: Bài Tập Sắp Đến Hạn - ${assignment.title}`,
          html: this.generateDeadlineEmailTemplate({
            studentName: `${student.first_name} ${student.last_name}`,
            assignmentTitle: assignment.title,
            courseName: course.name,
            dueDate: formattedDueDate,
            daysUntilDue,
            description: assignment.description || '',
            priority
          })
        });
      }
    } catch (error) {
      console.error('Error sending assignment deadline notification:', error);
    }
  }

  /**
   * Generate deadline email template
   */
  generateDeadlineEmailTemplate(data) {
    const priorityEmoji = data.priority === 'urgent' ? '🚨' : '⚠️';
    const urgencyText = data.daysUntilDue === 1
      ? 'Bài tập sẽ đến hạn vào <strong>ngày mai</strong>!'
      : `Bài tập sẽ đến hạn trong <strong>${data.daysUntilDue} ngày</strong>!`;

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Nhắc Nhở Deadline</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                ${priorityEmoji} Nhắc Nhở Deadline
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #333; margin: 0 0 15px; font-size: 20px;">
                Xin chào ${data.studentName},
              </h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                ${urgencyText}
              </p>

              <!-- Assignment Details -->
              <div style="background-color: #fff5f5; border-left: 4px solid #ff6b6b; padding: 20px; margin: 20px 0; border-radius: 4px;">
                <h3 style="color: #ff6b6b; margin: 0 0 10px; font-size: 18px;">
                  📚 ${data.assignmentTitle}
                </h3>
                <p style="color: #666; margin: 0 0 10px; font-size: 14px;">
                  <strong>Môn học:</strong> ${data.courseName}
                </p>
                <p style="color: #666; margin: 0 0 10px; font-size: 14px;">
                  <strong>Hạn nộp:</strong> ${data.dueDate}
                </p>
                ${data.description ? `
                <p style="color: #666; margin: 10px 0 0; font-size: 14px; line-height: 1.5;">
                  <strong>Mô tả:</strong> ${data.description}
                </p>
                ` : ''}
              </div>

              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Hãy hoàn thành và nộp bài đúng hạn để đảm bảo kết quả học tập tốt nhất!
              </p>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td style="padding: 0 30px 30px; text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5001'}/assignments"
                 style="display: inline-block; background-color: #ff6b6b; color: white; padding: 14px 40px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; margin-top: 10px;">
                Xem Chi Tiết Bài Tập
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 20px 30px; border-top: 1px solid #e8e8e8;">
              <p style="color: #999; font-size: 12px; margin: 0; text-align: center; line-height: 1.5;">
                Email này được gửi tự động từ AI School Dashboard.<br>
                Vui lòng không trả lời email này.<br>
                <br>
                <strong>AI School Dashboard</strong> © ${new Date().getFullYear()}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
  }

  /**
   * Schedule exam reminders
   * Runs daily at 8:00 AM
   */
  scheduleExamReminders() {
    const job = cron.schedule('0 8 * * *', async () => {
      console.log('🔔 Checking for upcoming exams...');
      // Implementation for exam reminders can be added here
    });

    this.jobs.push({ name: 'Exam Reminders', job });
  }

  /**
   * Schedule weekly summary emails
   * Runs every Monday at 9:00 AM
   */
  scheduleWeeklySummary() {
    const job = cron.schedule('0 9 * * 1', async () => {
      console.log('📊 Sending weekly summaries...');
      // Implementation for weekly summaries can be added here
    });

    this.jobs.push({ name: 'Weekly Summary', job });
  }

  /**
   * Send grade notification when grade is posted
   */
  async sendGradeNotification(grade, student, course) {
    try {
      if (!student || !student.User) {
        console.warn('Cannot send grade notification: student or user not found');
        return;
      }

      // Create in-app notification
      await notificationService.notifyGradePosted(
        student.User.id,
        {
          score: grade.score,
          subject: course.name,
          gradeId: grade.id,
          gradeType: grade.grade_type
        },
        {
          sendEmail: grade.is_published, // Only send email if grade is published
          user: student.User
        }
      );

      // Send email if grade is published
      if (grade.is_published) {
        await emailService.sendGradeNotification(
          student.User.email,
          `${student.first_name} ${student.last_name}`,
          {
            score: grade.score,
            subject: course.name,
            gradeType: grade.grade_type
          }
        );
      }

      console.log(`✅ Sent grade notification to ${student.User.email}`);
    } catch (error) {
      console.error('Error sending grade notification:', error);
    }
  }

  /**
   * Stop all scheduled jobs
   */
  stopAllJobs() {
    this.jobs.forEach(({ name, job }) => {
      job.stop();
      console.log(`⏹️ Stopped: ${name}`);
    });
    this.jobs = [];
  }

  /**
   * Get status of all jobs
   */
  getJobsStatus() {
    return this.jobs.map(({ name, job }) => ({
      name,
      running: job.running || false
    }));
  }
}

module.exports = new NotificationScheduler();
