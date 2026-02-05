# 🧠 Rajora AI Platform

> **World-Class Open-Source LLM Platform** — Enterprise-grade chatbot with admin CMS, multi-model support, and zero-downtime AWS deployment

[![Deploy on AWS](https://img.shields.io/badge/Deploy-AWS-FF9900?logo=amazon-aws)](./docs/deployment.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

## 🎯 What Makes Rajora AI Different

- **🔄 Zero-Downtime Deployments** — Blue-Green + Canary with AWS ECS
- **🎨 No-Code Admin Panel** — Change content, models, and features without redeploying
- **🤖 Multi-Model Architecture** — Switch between open-source LLMs instantly
- **⚡ Production-Ready** — Built for millions of users with auto-scaling
- **🔐 Enterprise Security** — WAF, secrets management, prompt injection guards
- **📊 Real-Time Analytics** — Token usage, latency, model performance

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND LAYER                          │
│  Next.js 15 + React Server Components + Tailwind + Framer  │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      AWS INFRA                               │
│  Route53 → CloudFront → ALB → ECS Fargate Cluster          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────┬──────────────────┬─────────────────────┐
│   API Service    │   LLM Service    │   Admin Service     │
│  FastAPI + Auth  │ vLLM/Ollama GPU  │  CMS + Controls     │
└──────────────────┴──────────────────┴─────────────────────┘
                            ↓
┌──────────────────┬──────────────────┬─────────────────────┐
│   PostgreSQL     │     Redis        │    Vector DB        │
│   (RDS Aurora)   │  (ElastiCache)   │   (pgvector)        │
└──────────────────┴──────────────────┴─────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- AWS CLI configured (for deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/rajeevrajora77-lab/rajora-ai-platform.git
cd rajora-ai-platform

# Install dependencies
npm install
cd backend && pip install -r requirements.txt

# Start local development stack
docker-compose up -d

# Run frontend
npm run dev

# Run backend (separate terminal)
cd backend && uvicorn main:app --reload
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 📦 Project Structure

```
rajora-ai-platform/
├── frontend/              # Next.js 15 application
│   ├── app/              # App router pages
│   ├── components/       # Reusable UI components
│   ├── lib/              # Utilities and helpers
│   └── public/           # Static assets
├── backend/              # FastAPI service
│   ├── api/              # API routes
│   ├── core/             # Business logic
│   ├── models/           # Database models
│   └── services/         # External integrations
├── llm-service/          # LLM inference layer
│   ├── models/           # Model configurations
│   ├── router/           # Model routing logic
│   └── inference/        # vLLM/Ollama integration
├── admin-panel/          # CMS and control center
│   ├── dashboard/        # Admin UI
│   └── api/              # Admin API endpoints
├── infrastructure/       # AWS deployment configs
│   ├── terraform/        # Infrastructure as Code
│   ├── kubernetes/       # K8s manifests
│   └── docker/           # Dockerfiles
├── docs/                 # Documentation
└── tests/                # Test suites
```

---

## 🎨 Pages & Features

### 1. 🏠 Landing Page
- Hero with live chat demo
- AI capabilities grid
- Industry use cases
- Real-time model badge
- Security trust bar

### 2. 🤖 AI Chat Interface
- Multi-model selector
- Streaming responses
- Code block auto-copy
- File upload support
- Temperature controls
- Conversation export
- Token usage meter

### 3. 🧩 Models Page
- Available LLMs list
- Benchmark comparisons
- Latency & cost stats
- One-click model switching

### 4. 📦 API Platform
- API key management
- Usage dashboard
- SDK downloads
- Interactive playground

### 5. 🛠️ Admin Panel
- Content management
- Model switching
- Feature flags
- Traffic routing
- Theme builder
- Analytics dashboard

### 6. 👤 User Dashboard
- Saved conversations
- API usage tracking
- Billing management
- Preferences

---

## 🧠 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **UI:** TailwindCSS + Shadcn UI + Radix
- **Animations:** Framer Motion
- **State:** Zustand + React Query
- **TypeScript:** Strict mode

### Backend
- **API:** FastAPI (Python 3.11+)
- **Database:** PostgreSQL (Aurora)
- **Cache:** Redis (ElastiCache)
- **Vector DB:** pgvector / Qdrant
- **Auth:** JWT + OAuth2

### LLM Layer
- **Inference:** vLLM / Ollama
- **Models:** Llama 3.1, Mistral, Qwen
- **Routing:** Smart fallback system
- **Streaming:** Server-Sent Events

### DevOps
- **Cloud:** AWS (ECS, RDS, ElastiCache)
- **CI/CD:** GitHub Actions
- **Monitoring:** CloudWatch + Grafana
- **Secrets:** AWS Secrets Manager

---

## ☁️ AWS Deployment

### Zero-Downtime Strategy

```
Blue Environment (Current)
    ↓ Deploy Green
Green Environment (New) ← 5% traffic
    ↓ Health checks pass
Green Environment ← 100% traffic
    ↓ Destroy Blue
```

### Deployment Steps

```bash
# 1. Configure AWS credentials
aws configure

# 2. Deploy infrastructure
cd infrastructure/terraform
terraform init
terraform apply

# 3. Build and push containers
./scripts/build-and-push.sh

# 4. Deploy with zero downtime
./scripts/deploy.sh --strategy blue-green
```

Full guide: [📖 Deployment Documentation](./docs/deployment.md)

---

## 🔐 Security Features

- ✅ WAF rules for DDoS protection
- ✅ Secrets Manager for API keys
- ✅ Rate limiting per user/IP
- ✅ Prompt injection detection
- ✅ Model output filtering
- ✅ RBAC for admin roles
- ✅ Audit logs for all actions
- ✅ HTTPS everywhere (TLS 1.3)

---

## 📈 Scalability

- **Users:** Built for 1M+ concurrent
- **Inference:** Multi-GPU autoscaling
- **Database:** Aurora read replicas
- **Cache:** Redis cluster mode
- **CDN:** CloudFront edge caching
- **Queue:** SQS for LLM load balancing

---

## 🧪 Testing

```bash
# Frontend tests
npm test
npm run test:e2e

# Backend tests
cd backend
pytest tests/
pytest tests/ --cov=api

# Load testing
k6 run tests/load/chat-stress-test.js
```

---

## 🤝 Contributing

We love contributions! Check out our [Contributing Guide](CONTRIBUTING.md).

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=rajeevrajora77-lab/rajora-ai-platform&type=Date)](https://star-history.com/#rajeevrajora77-lab/rajora-ai-platform&Date)

---

## 📞 Support

- 📧 Email: support@rajora.ai
- 💬 Discord: [Join our community](https://discord.gg/rajora-ai)
- 📖 Docs: [docs.rajora.ai](https://docs.rajora.ai)
- 🐛 Issues: [GitHub Issues](https://github.com/rajeevrajora77-lab/rajora-ai-platform/issues)

---

<p align="center">Made with ❤️ by the Rajora AI Team</p>
<p align="center">⭐ Star us on GitHub — it helps!</p>