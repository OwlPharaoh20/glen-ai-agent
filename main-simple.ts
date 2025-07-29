#!/usr/bin/env node

/**
 * Glen AI Agent - Simplified Main for Testing
 * CLI interface without database connection
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import { Command } from 'commander';
import { GlenAgentSimple } from './agent-simple';
import { logger } from './utils/logger';

// Initialize the program
const program = new Command();

// Configure the CLI
program
  .name('glen')
  .description('AI Email Marketing Assistant')
  .version('1.0.0');

// Main menu function
async function showMainMenu(): Promise<void> {
  console.clear();
  console.log(chalk.blue.bold('🤖 Glen AI Agent - Email Marketing Assistant'));
  console.log(chalk.gray('Your intelligent email marketing companion (Simple Mode)\n'));

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        {
          name: '📧 Send Email Campaign',
          value: 'send_campaign'
        },
        {
          name: '👥 Manage Leads',
          value: 'manage_leads'
        },
        {
          name: '✍️ Generate Email Copy',
          value: 'generate_copy'
        },
        {
          name: '📊 View Campaign Analytics',
          value: 'analytics'
        },
        {
          name: '⚙️ Settings',
          value: 'settings'
        },
        {
          name: '❌ Exit',
          value: 'exit'
        }
      ]
    }
  ]);

  await handleMenuSelection(action);
}

// Handle menu selection
async function handleMenuSelection(action: string): Promise<void> {
  const spinner = ora('Processing...').start();
  
  try {
    switch (action) {
      case 'send_campaign':
        spinner.text = 'Preparing email campaign...';
        await handleSendCampaign();
        break;
        
      case 'manage_leads':
        spinner.text = 'Loading lead management...';
        await handleManageLeads();
        break;
        
      case 'generate_copy':
        spinner.text = 'Generating email copy...';
        await handleGenerateCopy();
        break;
        
      case 'analytics':
        spinner.text = 'Loading analytics...';
        await handleAnalytics();
        break;
        
      case 'settings':
        spinner.text = 'Loading settings...';
        await handleSettings();
        break;
        
      case 'exit':
        spinner.succeed('Goodbye! 👋');
        process.exit(0);
        
      default:
        spinner.fail('Invalid option selected');
    }
  } catch (error) {
    spinner.fail('An error occurred');
    logger.error('Menu selection error:', error);
    console.error(chalk.red('Error:'), error);
  }
  
  // Return to main menu
  setTimeout(() => {
    showMainMenu();
  }, 2000);
}

// Handle send campaign
async function handleSendCampaign(): Promise<void> {
  console.log(chalk.yellow('📧 Campaign sending feature coming soon...'));
  console.log(chalk.gray('(Database connection required for full functionality)'));
}

// Handle lead management
async function handleManageLeads(): Promise<void> {
  console.log(chalk.yellow('👥 Lead management feature coming soon...'));
  console.log(chalk.gray('(Database connection required for full functionality)'));
}

// Handle copy generation
async function handleGenerateCopy(): Promise<void> {
  console.log(chalk.yellow('✍️ Email copy generation feature coming soon...'));
  console.log(chalk.gray('(AI tools need to be implemented)'));
}

// Handle analytics
async function handleAnalytics(): Promise<void> {
  console.log(chalk.yellow('📊 Analytics feature coming soon...'));
  console.log(chalk.gray('(Database connection required for full functionality)'));
}

// Handle settings
async function handleSettings(): Promise<void> {
  console.log(chalk.yellow('⚙️ Settings feature coming soon...'));
}

// Main function
async function main(): Promise<void> {
  try {
    // Load environment variables
    require('dotenv').config();
    
    // Check for required environment variables
    const requiredEnvVars = ['OPENAI_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(chalk.red('❌ Missing required environment variables:'));
      missingVars.forEach(varName => {
        console.error(chalk.red(`   - ${varName}`));
      });
      console.log(chalk.yellow('\nPlease add them to your .env file'));
      process.exit(1);
    }
    
    console.log(chalk.green('✅ Environment variables loaded successfully'));
    
    // Initialize Glen Agent (Simple Mode)
    const glenAgent = new GlenAgentSimple();
    await glenAgent.initialize();
    
    console.log(chalk.green('✅ Glen AI Agent initialized successfully!'));
    
    // Show main menu
    await showMainMenu();
    
  } catch (error) {
    logger.error('Application startup error:', error);
    console.error(chalk.red('Failed to start Glen AI Agent:'), error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\nShutting down gracefully...'));
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log(chalk.yellow('\n\nShutting down gracefully...'));
  process.exit(0);
});

// Start the application
if (require.main === module) {
  main().catch((error) => {
    logger.error('Unhandled error:', error);
    console.error(chalk.red('Unhandled error:'), error);
    process.exit(1);
  });
}

export { main, showMainMenu }; 