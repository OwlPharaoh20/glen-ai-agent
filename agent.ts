/**
 * Glen AI Agent - LangChain Agent Setup
 * Handles AI agent initialization, LLM configuration, and tool management
 */

import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { PromptTemplate } from '@langchain/core/prompts';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { systemPrompt } from './system_prompt';
import { logger } from './utils/logger';
import { dbConnection } from './db/connection';

export class GlenAgent {
  private llm: ChatOpenAI;
  private tools: DynamicStructuredTool[];
  private agent: AgentExecutor;

  constructor() {
    this.tools = [];
  }

  async initialize(): Promise<void> {
    try {
      logger.info('Initializing Glen AI Agent...');
      
      // Initialize database connection
      await dbConnection.connect();
      
      this.initializeLLM();
      await this.initializeTools();
      await this.createAgent();
      logger.info('Glen AI Agent initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Glen AI Agent:', error);
      throw error;
    }
  }

  private initializeLLM(): void {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }

    this.llm = new ChatOpenAI({
      openAIApiKey: apiKey,
      modelName: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
    });
  }

  private async initializeTools(): Promise<void> {
    // TODO: Initialize email sender and lead manager tools
    logger.info('Tools initialization placeholder');
  }

  private async createAgent(): Promise<void> {
    const prompt = PromptTemplate.fromTemplate(systemPrompt);
    
    const agent = await createOpenAIFunctionsAgent({
      llm: this.llm,
      tools: this.tools,
      prompt: prompt,
    });

    this.agent = new AgentExecutor({
      agent,
      tools: this.tools,
      verbose: process.env.NODE_ENV === 'development',
      maxIterations: 10,
    });
  }

  async executeTask(task: string): Promise<string> {
    try {
      const result = await this.agent.invoke({ input: task });
      return result.output;
    } catch (error) {
      logger.error('Task execution failed:', error);
      throw error;
    }
  }
} 