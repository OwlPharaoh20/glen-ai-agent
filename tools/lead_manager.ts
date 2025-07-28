/**
 * Glen AI Agent - Lead Manager Tool
 * Handles lead management operations with MongoDB
 */

import { Lead, ILead } from '../db/Leadmodel';
import { logger } from '../utils/logger';

export interface LeadData {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  tags?: string[];
  source?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'unsubscribed';
  notes?: string;
  metadata?: Record<string, any>;
}

export interface LeadUpdateData {
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  tags?: string[];
  source?: string;
  status?: 'new' | 'contacted' | 'qualified' | 'converted' | 'unsubscribed';
  notes?: string;
  metadata?: Record<string, any>;
}

export interface LeadFilter {
  tags?: string[];
  status?: string;
  source?: string;
  company?: string;
  limit?: number;
  skip?: number;
}

export class LeadManager {
  /**
   * Initialize the lead manager
   */
  async initialize(): Promise<void> {
    try {
      // Test database connection by performing a simple query
      await Lead.countDocuments();
      logger.info('Lead manager initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize lead manager:', error);
      throw error;
    }
  }

  /**
   * Add a new lead to the database
   */
  async addLead(leadData: LeadData): Promise<ILead> {
    try {
      logger.info('Adding new lead:', { email: leadData.email });

      // Check if lead already exists
      const existingLead = await Lead.findOne({ email: leadData.email });
      if (existingLead) {
        logger.warn('Lead already exists:', { email: leadData.email });
        throw new Error('Lead with this email already exists');
      }

      // Create new lead
      const newLead = new Lead({
        ...leadData,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: leadData.status || 'new',
        tags: leadData.tags || [],
        metadata: leadData.metadata || {}
      });

      const savedLead = await newLead.save();
      logger.info('Lead added successfully:', { id: savedLead._id, email: savedLead.email });

      return savedLead;
    } catch (error) {
      logger.error('Failed to add lead:', error);
      throw error;
    }
  }

  /**
   * Update an existing lead
   */
  async updateLead(email: string, updates: LeadUpdateData): Promise<ILead | null> {
    try {
      logger.info('Updating lead:', { email, updates });

      const updatedLead = await Lead.findOneAndUpdate(
        { email },
        {
          ...updates,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!updatedLead) {
        logger.warn('Lead not found for update:', { email });
        return null;
      }

      logger.info('Lead updated successfully:', { id: updatedLead._id, email: updatedLead.email });
      return updatedLead;
    } catch (error) {
      logger.error('Failed to update lead:', error);
      throw error;
    }
  }

  /**
   * Delete a lead
   */
  async deleteLead(email: string): Promise<boolean> {
    try {
      logger.info('Deleting lead:', { email });

      const result = await Lead.findOneAndDelete({ email });
      
      if (!result) {
        logger.warn('Lead not found for deletion:', { email });
        return false;
      }

      logger.info('Lead deleted successfully:', { email });
      return true;
    } catch (error) {
      logger.error('Failed to delete lead:', error);
      throw error;
    }
  }

  /**
   * Get leads with optional filtering
   */
  async getLeads(filter: LeadFilter = {}): Promise<ILead[]> {
    try {
      logger.info('Getting leads with filter:', filter);

      const query: any = {};

      // Apply filters
      if (filter.tags && filter.tags.length > 0) {
        query.tags = { $in: filter.tags };
      }

      if (filter.status) {
        query.status = filter.status;
      }

      if (filter.source) {
        query.source = filter.source;
      }

      if (filter.company) {
        query.company = { $regex: filter.company, $options: 'i' };
      }

      const options: any = {
        sort: { createdAt: -1 }
      };

      if (filter.limit) {
        options.limit = filter.limit;
      }

      if (filter.skip) {
        options.skip = filter.skip;
      }

      const leads = await Lead.find(query, null, options);
      logger.info(`Retrieved ${leads.length} leads`);

      return leads;
    } catch (error) {
      logger.error('Failed to get leads:', error);
      throw error;
    }
  }

  /**
   * Get a single lead by email
   */
  async getLeadByEmail(email: string): Promise<ILead | null> {
    try {
      logger.info('Getting lead by email:', { email });

      const lead = await Lead.findOne({ email });
      
      if (!lead) {
        logger.warn('Lead not found:', { email });
        return null;
      }

      return lead;
    } catch (error) {
      logger.error('Failed to get lead by email:', error);
      throw error;
    }
  }

  /**
   * Add tags to a lead
   */
  async addTags(email: string, tags: string[]): Promise<ILead | null> {
    try {
      logger.info('Adding tags to lead:', { email, tags });

      const lead = await Lead.findOneAndUpdate(
        { email },
        {
          $addToSet: { tags: { $each: tags } },
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!lead) {
        logger.warn('Lead not found for tag addition:', { email });
        return null;
      }

      logger.info('Tags added successfully:', { email, tags: lead.tags });
      return lead;
    } catch (error) {
      logger.error('Failed to add tags:', error);
      throw error;
    }
  }

  /**
   * Remove tags from a lead
   */
  async removeTags(email: string, tags: string[]): Promise<ILead | null> {
    try {
      logger.info('Removing tags from lead:', { email, tags });

      const lead = await Lead.findOneAndUpdate(
        { email },
        {
          $pull: { tags: { $in: tags } },
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!lead) {
        logger.warn('Lead not found for tag removal:', { email });
        return null;
      }

      logger.info('Tags removed successfully:', { email, tags: lead.tags });
      return lead;
    } catch (error) {
      logger.error('Failed to remove tags:', error);
      throw error;
    }
  }

  /**
   * Update lead status
   */
  async updateStatus(email: string, status: string): Promise<ILead | null> {
    try {
      logger.info('Updating lead status:', { email, status });

      const lead = await Lead.findOneAndUpdate(
        { email },
        {
          status,
          updatedAt: new Date()
        },
        { new: true }
      );

      if (!lead) {
        logger.warn('Lead not found for status update:', { email });
        return null;
      }

      logger.info('Status updated successfully:', { email, status: lead.status });
      return lead;
    } catch (error) {
      logger.error('Failed to update status:', error);
      throw error;
    }
  }

  /**
   * Get lead statistics
   */
  async getStats(): Promise<any> {
    try {
      logger.info('Getting lead statistics');

      const stats = await Lead.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            byStatus: {
              $push: {
                status: '$status',
                count: 1
              }
            },
            bySource: {
              $push: {
                source: '$source',
                count: 1
              }
            }
          }
        }
      ]);

      const result = {
        total: stats[0]?.total || 0,
        byStatus: {},
        bySource: {}
      };

      // Process status stats
      if (stats[0]?.byStatus) {
        stats[0].byStatus.forEach((item: any) => {
          result.byStatus[item.status] = (result.byStatus[item.status] || 0) + item.count;
        });
      }

      // Process source stats
      if (stats[0]?.bySource) {
        stats[0].bySource.forEach((item: any) => {
          result.bySource[item.source] = (result.bySource[item.source] || 0) + item.count;
        });
      }

      logger.info('Lead statistics retrieved:', result);
      return result;
    } catch (error) {
      logger.error('Failed to get lead statistics:', error);
      throw error;
    }
  }

  /**
   * Search leads by text
   */
  async searchLeads(searchTerm: string, limit: number = 50): Promise<ILead[]> {
    try {
      logger.info('Searching leads:', { searchTerm, limit });

      const leads = await Lead.find({
        $or: [
          { email: { $regex: searchTerm, $options: 'i' } },
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { lastName: { $regex: searchTerm, $options: 'i' } },
          { company: { $regex: searchTerm, $options: 'i' } },
          { notes: { $regex: searchTerm, $options: 'i' } }
        ]
      })
      .limit(limit)
      .sort({ createdAt: -1 });

      logger.info(`Search returned ${leads.length} leads`);
      return leads;
    } catch (error) {
      logger.error('Failed to search leads:', error);
      throw error;
    }
  }
} 