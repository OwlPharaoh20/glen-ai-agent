/**
 * Glen AI Agent - Email Sender Tool
 * Handles email sending via Resend API
 */

import { Resend } from 'resend';
import { logger } from '../utils/logger';

export interface EmailData {
  to: string | string[];
  subject: string;
  content: string;
  from?: string;
  html?: string;
  text?: string;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class EmailSender {
  private resend: Resend;
  private defaultFrom: string;

  constructor() {
    this.defaultFrom = 'Glen AI Agent <noreply@yourdomain.com>';
  }

  /**
   * Initialize the email sender with Resend API
   */
  async initialize(): Promise<void> {
    try {
      const apiKey = process.env.RESEND_API_KEY;
      if (!apiKey) {
        throw new Error('RESEND_API_KEY is required');
      }

      this.resend = new Resend(apiKey);
      logger.info('Email sender initialized with Resend API');
    } catch (error) {
      logger.error('Failed to initialize email sender:', error);
      throw error;
    }
  }

  /**
   * Send an email using Resend API
   */
  async sendEmail(emailData: EmailData): Promise<EmailResponse> {
    try {
      logger.info('Sending email:', {
        to: emailData.to,
        subject: emailData.subject,
        from: emailData.from || this.defaultFrom
      });

      const { data, error } = await this.resend.emails.send({
        from: emailData.from || this.defaultFrom,
        to: Array.isArray(emailData.to) ? emailData.to : [emailData.to],
        subject: emailData.subject,
        html: emailData.html || emailData.content,
        text: emailData.text || this.stripHtml(emailData.content),
      });

      if (error) {
        logger.error('Email sending failed:', error);
        return {
          success: false,
          error: error.message
        };
      }

      logger.info('Email sent successfully:', data?.id);
      return {
        success: true,
        messageId: data?.id
      };
    } catch (error) {
      logger.error('Email sending error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Send a campaign to multiple recipients
   */
  async sendCampaign(
    recipients: string[],
    subject: string,
    content: string,
    from?: string
  ): Promise<EmailResponse[]> {
    try {
      logger.info(`Sending campaign to ${recipients.length} recipients`);

      const results: EmailResponse[] = [];
      
      // Send emails in batches to avoid rate limits
      const batchSize = 10;
      for (let i = 0; i < recipients.length; i += batchSize) {
        const batch = recipients.slice(i, i + batchSize);
        
        const promises = batch.map(recipient =>
          this.sendEmail({
            to: recipient,
            subject,
            content,
            from
          })
        );

        const batchResults = await Promise.all(promises);
        results.push(...batchResults);

        // Add delay between batches to respect rate limits
        if (i + batchSize < recipients.length) {
          await this.delay(1000); // 1 second delay
        }
      }

      const successCount = results.filter(r => r.success).length;
      logger.info(`Campaign completed: ${successCount}/${recipients.length} emails sent successfully`);

      return results;
    } catch (error) {
      logger.error('Campaign sending failed:', error);
      throw error;
    }
  }

  /**
   * Send a template email
   */
  async sendTemplate(
    to: string | string[],
    templateId: string,
    templateData: Record<string, any>,
    subject?: string,
    from?: string
  ): Promise<EmailResponse> {
    try {
      logger.info('Sending template email:', { templateId, to });

      const { data, error } = await this.resend.emails.send({
        from: from || this.defaultFrom,
        to: Array.isArray(to) ? to : [to],
        subject: subject || 'Message from Glen AI Agent',
        react: this.getTemplateComponent(templateId, templateData),
      });

      if (error) {
        logger.error('Template email sending failed:', error);
        return {
          success: false,
          error: error.message
        };
      }

      logger.info('Template email sent successfully:', data?.id);
      return {
        success: true,
        messageId: data?.id
      };
    } catch (error) {
      logger.error('Template email sending error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validate email address format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Strip HTML tags from content for plain text version
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
  }

  /**
   * Get template component (placeholder for React templates)
   */
  private getTemplateComponent(templateId: string, data: Record<string, any>) {
    // TODO: Implement React template components
    return `<div>Template ${templateId} with data: ${JSON.stringify(data)}</div>`;
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get email sending statistics
   */
  async getStats(): Promise<any> {
    try {
      // TODO: Implement Resend API stats retrieval
      logger.info('Email stats requested');
      return {
        totalSent: 0,
        successRate: 0,
        lastSent: null
      };
    } catch (error) {
      logger.error('Failed to get email stats:', error);
      throw error;
    }
  }
} 