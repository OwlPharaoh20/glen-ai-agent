/**
 * Glen AI Agent - Simplified Version for Testing
 * Handles AI agent initialization without database connection
 */

import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { systemPrompt } from './system_prompt';
import { logger } from './utils/logger';

export class GlenAgentSimple {
  private llm: ChatOpenAI;
  private tools: DynamicStructuredTool[];
  private agent: AgentExecutor;

  constructor() {
    this.tools = [];
  }

  async initialize(): Promise<void> {
    try {
      logger.info('Initializing Glen AI Agent (Simple Mode)...');
      
      // Skip database connection for now
      logger.info('Skipping database connection for testing...');
      
      this.initializeLLM();
      await this.initializeTools();
      await this.createAgent();
      logger.info('Glen AI Agent initialized successfully (Simple Mode)');
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
    
    logger.info('OpenAI LLM initialized successfully');
  }

  private async initializeTools(): Promise<void> {
    // TODO: Initialize email sender and lead manager tools
    logger.info('Tools initialization placeholder');
  }

  private async createAgent(): Promise<void> {
    const prompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(systemPrompt),
      HumanMessagePromptTemplate.fromTemplate("{input}\n\n{agent_scratchpad}")
    ]);
    
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
    
    logger.info('Agent created successfully');
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