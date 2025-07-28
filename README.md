# Glen AI Agent 🤖

An intelligent AI-powered email marketing assistant that helps marketers and business owners handle campaigns and leads effectively through a command-line interface.

## ✨ Features

- **📧 Email Campaign Management**: Send cold/warm email campaigns using Resend API
- **👥 Lead Management**: Add, update, delete, and segment leads with MongoDB
- **✍️ Content Generation**: Generate compelling email copy and templates using AI
- **📊 Analytics & Insights**: Track campaign performance and lead engagement
- **🎯 Smart Segmentation**: Tag and categorize leads for targeted campaigns
- **🔒 Privacy-First**: Built with email best practices and GDPR compliance in mind

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB database
- OpenAI API key
- Resend API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd glen-ai-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your API keys:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   RESEND_API_KEY=your_resend_api_key_here
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=development
   LOG_LEVEL=info
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the application**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
glen-ai-agent/
├── main.ts                    # CLI interface using Inquirer
├── agent.ts                   # LangChain agent setup and LLM integration
├── system_prompt.ts           # AI agent behavior and context
├── .env                       # Environment variables
├── /tools/
│   ├── email_sender.ts        # Resend API integration
│   └── lead_manager.ts        # Lead management operations
├── /db/
│   ├── connection.ts          # MongoDB connection management
│   └── Leadmodel.ts           # Mongoose model and schema
├── /utils/
│   └── logger.ts              # Winston logging utility
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## 🛠️ Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run the compiled application
- `npm run dev` - Run in development mode with ts-node
- `npm run watch` - Watch for changes and recompile
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Development Setup

1. **Install development dependencies**
   ```bash
   npm install
   ```

2. **Run in development mode**
   ```bash
   npm run dev
   ```

3. **Watch for changes**
   ```bash
   npm run watch
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI functionality | Yes |
| `RESEND_API_KEY` | Resend API key for email sending | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `NODE_ENV` | Environment (development/production) | No |
| `LOG_LEVEL` | Logging level (error, warn, info, debug) | No |

### MongoDB Setup

1. Create a MongoDB database (local or cloud)
2. Get your connection string
3. Add it to your `.env` file

### Resend API Setup

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add it to your `.env` file
4. Verify your domain for sending emails

### OpenAI API Setup

1. Sign up at [openai.com](https://openai.com)
2. Get your API key from the dashboard
3. Add it to your `.env` file

## 📖 Usage

### Starting the Application

```bash
npm start
```

### Main Menu Options

1. **📧 Send Email Campaign** - Create and send email campaigns
2. **👥 Manage Leads** - Add, update, and organize leads
3. **✍️ Generate Email Copy** - AI-powered email content generation
4. **📊 View Campaign Analytics** - Track performance metrics
5. **⚙️ Settings** - Configure application settings

### Example Workflows

#### Adding a New Lead
1. Select "Manage Leads" from the main menu
2. Choose "Add New Lead"
3. Enter lead information (email, name, company, etc.)
4. Add relevant tags for segmentation

#### Sending a Campaign
1. Select "Send Email Campaign" from the main menu
2. Choose your target audience (by tags, status, etc.)
3. Write or generate email content
4. Review and send the campaign

#### Generating Email Copy
1. Select "Generate Email Copy" from the main menu
2. Describe your target audience and goals
3. Let AI generate compelling email content
4. Review and customize as needed

## 🔒 Security & Privacy

- **API Keys**: Never commit API keys to version control
- **Email Compliance**: Built-in spam prevention and best practices
- **Data Protection**: GDPR-compliant lead management
- **Secure Connections**: All external API calls use HTTPS

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Logging

The application uses Winston for comprehensive logging:

- **Console**: Colored output for development
- **Files**: Structured logs saved to `logs/` directory
- **Levels**: error, warn, info, http, debug

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions for help and ideas

## 🔮 Roadmap

- [ ] Webhook support for email events
- [ ] Advanced analytics dashboard
- [ ] Email template library
- [ ] A/B testing capabilities
- [ ] Integration with CRM systems
- [ ] Multi-language support
- [ ] Advanced segmentation rules
- [ ] Automated follow-up sequences

## 🙏 Acknowledgments

- [LangChain](https://langchain.com/) for AI agent framework
- [Resend](https://resend.com/) for email delivery
- [MongoDB](https://mongodb.com/) for database
- [OpenAI](https://openai.com/) for AI capabilities

---

**Made with ❤️ for marketers and business owners** 