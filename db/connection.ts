/**
 * Glen AI Agent - Database Connection
 * Handles MongoDB connection and connection management
 */

import mongoose from 'mongoose';
import { logger } from '../utils/logger';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private isConnected: boolean = false;
  private connectionString: string;

  private constructor() {
    this.connectionString = process.env.MONGODB_URI || '';
  }

  public static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Connect to MongoDB
   */
  async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('Database already connected');
      return;
    }

    if (!this.connectionString) {
      throw new Error('MONGODB_URI is required');
    }

    try {
      logger.info('Connecting to MongoDB...');

      // Configure mongoose options
      const options = {
        maxPoolSize: 10, // Maintain up to 10 socket connections
        serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        bufferMaxEntries: 0, // Disable mongoose buffering
        bufferCommands: false, // Disable mongoose buffering
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      // Connect to MongoDB
      await mongoose.connect(this.connectionString, options);

      this.isConnected = true;
      logger.info('Successfully connected to MongoDB');

      // Set up connection event listeners
      this.setupEventListeners();

    } catch (error) {
      logger.error('Failed to connect to MongoDB:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB
   */
  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      logger.info('Database not connected');
      return;
    }

    try {
      logger.info('Disconnecting from MongoDB...');
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('Successfully disconnected from MongoDB');
    } catch (error) {
      logger.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  /**
   * Get connection info
   */
  getConnectionInfo(): any {
    if (!this.isConnected) {
      return { connected: false };
    }

    const connection = mongoose.connection;
    return {
      connected: true,
      host: connection.host,
      port: connection.port,
      name: connection.name,
      readyState: connection.readyState
    };
  }

  /**
   * Setup connection event listeners
   */
  private setupEventListeners(): void {
    const connection = mongoose.connection;

    // Connection events
    connection.on('connected', () => {
      logger.info('Mongoose connected to MongoDB');
    });

    connection.on('error', (error) => {
      logger.error('Mongoose connection error:', error);
      this.isConnected = false;
    });

    connection.on('disconnected', () => {
      logger.warn('Mongoose disconnected from MongoDB');
      this.isConnected = false;
    });

    // Process termination events
    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, closing database connection...');
      await this.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, closing database connection...');
      await this.disconnect();
      process.exit(0);
    });
  }

  /**
   * Health check for database connection
   */
  async healthCheck(): Promise<boolean> {
    try {
      if (!this.isConnected) {
        return false;
      }

      // Ping the database
      await mongoose.connection.db.admin().ping();
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Reconnect to database
   */
  async reconnect(): Promise<void> {
    logger.info('Attempting to reconnect to database...');
    await this.disconnect();
    await this.connect();
  }
}

// Export singleton instance
export const dbConnection = DatabaseConnection.getInstance();

// Export the class for testing
export { DatabaseConnection }; 