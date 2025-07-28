/**
 * Glen AI Agent - Lead Model
 * Mongoose model for managing leads and subscribers
 */

import mongoose, { Document, Schema } from 'mongoose';

// Lead status enum
export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  CONVERTED = 'converted',
  UNSUBSCRIBED = 'unsubscribed',
  BOUNCED = 'bounced'
}

// Lead interface
export interface ILead extends Document {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  tags: string[];
  source?: string;
  status: LeadStatus;
  notes?: string;
  metadata: Record<string, any>;
  emailSent: number;
  emailOpened: number;
  emailClicked: number;
  lastEmailSent?: Date;
  lastEmailOpened?: Date;
  lastEmailClicked?: Date;
  createdAt: Date;
  updatedAt: Date;
  unsubscribedAt?: Date;
  bouncedAt?: Date;
}

// Lead schema
const LeadSchema = new Schema<ILead>({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      message: 'Please provide a valid email address'
    }
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: 50
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags: string[]) {
        return tags.every(tag => tag.length <= 50);
      },
      message: 'Tag length must be 50 characters or less'
    }
  },
  source: {
    type: String,
    trim: true,
    maxlength: 100,
    default: 'manual'
  },
  status: {
    type: String,
    enum: Object.values(LeadStatus),
    default: LeadStatus.NEW
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  emailSent: {
    type: Number,
    default: 0,
    min: 0
  },
  emailOpened: {
    type: Number,
    default: 0,
    min: 0
  },
  emailClicked: {
    type: Number,
    default: 0,
    min: 0
  },
  lastEmailSent: {
    type: Date
  },
  lastEmailOpened: {
    type: Date
  },
  lastEmailClicked: {
    type: Date
  },
  unsubscribedAt: {
    type: Date
  },
  bouncedAt: {
    type: Date
  }
}, {
  timestamps: true,
  collection: 'leads'
});

// Indexes for better query performance
LeadSchema.index({ email: 1 });
LeadSchema.index({ status: 1 });
LeadSchema.index({ tags: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ company: 1 });
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ updatedAt: -1 });

// Compound indexes for common queries
LeadSchema.index({ status: 1, tags: 1 });
LeadSchema.index({ status: 1, source: 1 });
LeadSchema.index({ tags: 1, source: 1 });

// Virtual for full name
LeadSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || '';
});

// Virtual for engagement rate
LeadSchema.virtual('engagementRate').get(function() {
  if (this.emailSent === 0) return 0;
  return Math.round((this.emailOpened / this.emailSent) * 100);
});

// Virtual for click rate
LeadSchema.virtual('clickRate').get(function() {
  if (this.emailSent === 0) return 0;
  return Math.round((this.emailClicked / this.emailSent) * 100);
});

// Pre-save middleware
LeadSchema.pre('save', function(next) {
  // Update timestamps
  this.updatedAt = new Date();
  
  // Validate email format
  if (this.isModified('email')) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      return next(new Error('Invalid email format'));
    }
  }
  
  next();
});

// Static methods
LeadSchema.statics = {
  // Find leads by status
  findByStatus: function(status: LeadStatus) {
    return this.find({ status });
  },
  
  // Find leads by tags
  findByTags: function(tags: string[]) {
    return this.find({ tags: { $in: tags } });
  },
  
  // Find leads by source
  findBySource: function(source: string) {
    return this.find({ source });
  },
  
  // Get lead statistics
  getStats: function() {
    return this.aggregate([
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
          },
          totalEmailsSent: { $sum: '$emailSent' },
          totalEmailsOpened: { $sum: '$emailOpened' },
          totalEmailsClicked: { $sum: '$emailClicked' }
        }
      }
    ]);
  }
};

// Instance methods
LeadSchema.methods = {
  // Add tags
  addTags: function(tags: string[]) {
    const uniqueTags = [...new Set([...this.tags, ...tags])];
    this.tags = uniqueTags;
    return this.save();
  },
  
  // Remove tags
  removeTags: function(tags: string[]) {
    this.tags = this.tags.filter(tag => !tags.includes(tag));
    return this.save();
  },
  
  // Update status
  updateStatus: function(status: LeadStatus) {
    this.status = status;
    
    if (status === LeadStatus.UNSUBSCRIBED) {
      this.unsubscribedAt = new Date();
    } else if (status === LeadStatus.BOUNCED) {
      this.bouncedAt = new Date();
    }
    
    return this.save();
  },
  
  // Record email sent
  recordEmailSent: function() {
    this.emailSent += 1;
    this.lastEmailSent = new Date();
    return this.save();
  },
  
  // Record email opened
  recordEmailOpened: function() {
    this.emailOpened += 1;
    this.lastEmailOpened = new Date();
    return this.save();
  },
  
  // Record email clicked
  recordEmailClicked: function() {
    this.emailClicked += 1;
    this.lastEmailClicked = new Date();
    return this.save();
  }
};

// Create and export the model
export const Lead = mongoose.model<ILead>('Lead', LeadSchema);

// Export types
export type { ILead };
export { LeadStatus }; 