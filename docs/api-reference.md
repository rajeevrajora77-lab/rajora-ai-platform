# 📚 API Reference

## Base URL

```
Production: https://api.rajora.ai
Development: http://localhost:8000
```

## Authentication

All API requests require authentication using JWT tokens or API keys.

### Get Access Token

```bash
POST /api/auth/login

Content-Type: application/x-www-form-urlencoded

username=your_username&password=your_password
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Using Token

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Using API Key

```bash
X-API-Key: raj_your_api_key_here
```

---

## Endpoints

### Authentication

#### Register User

```bash
POST /api/auth/register
```

**Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "is_admin": false,
  "api_key": "raj_abc123..."
}
```

#### Get Current User

```bash
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Chat

#### Create Completion

```bash
POST /api/chat/completions
Authorization: Bearer <token>
```

**Request:**
```json
{
  "messages": [
    {"role": "user", "content": "Explain quantum computing"}
  ],
  "model": "llama-3.1-70b",
  "temperature": 0.7,
  "max_tokens": 2048,
  "conversation_id": null
}
```

**Response:**
```json
{
  "content": "Quantum computing is a type of computation...",
  "model": "llama-3.1-70b",
  "tokens_used": 450,
  "latency_ms": 1234,
  "conversation_id": 42
}
```

#### Streaming Completion

```bash
POST /api/chat/stream
Authorization: Bearer <token>
```

**Request:** Same as above

**Response (Server-Sent Events):**
```
data: {"content": "Quantum", "done": false}
data: {"content": " computing", "done": false}
data: {"content": " is", "done": false}
data: {"content": "", "done": true}
```

#### Get Conversations

```bash
GET /api/chat/conversations
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 42,
    "title": "Quantum Computing Discussion",
    "model_name": "llama-3.1-70b",
    "created_at": "2026-02-05T15:30:00Z",
    "updated_at": "2026-02-05T16:45:00Z"
  }
]
```

---

### Models

#### List Models

```bash
GET /api/models/list
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": "llama-3.1-70b",
    "name": "Llama 3.1 70B",
    "description": "Meta's flagship model",
    "context_length": 128000,
    "cost_per_1k_tokens": 0.0008,
    "latency_p50_ms": 45,
    "latency_p99_ms": 156,
    "available": true,
    "provider": "vllm"
  }
]
```

#### Get Model Info

```bash
GET /api/models/{model_id}
Authorization: Bearer <token>
```

#### Get Benchmarks

```bash
GET /api/models/{model_id}/benchmarks
Authorization: Bearer <token>
```

**Response:**
```json
{
  "model_id": "llama-3.1-70b",
  "benchmarks": {
    "mmlu": 0.87,
    "hellaswag": 0.92,
    "truthfulqa": 0.78
  },
  "performance": {
    "avg_latency_ms": 45,
    "tokens_per_second": 120
  }
}
```

---

### Admin (Requires Admin Role)

#### Get System Stats

```bash
GET /api/admin/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "users": {
    "total": 1523,
    "active": 1420,
    "admins": 5
  },
  "api": {
    "total_calls": 125430,
    "calls_today": 3421,
    "total_tokens": 45_230_000
  },
  "models": {
    "active": 4,
    "total_requests": 125430
  }
}
```

#### Update Config

```bash
POST /api/admin/config
Authorization: Bearer <admin_token>
```

**Request:**
```json
{
  "feature_flags": {
    "chat_enabled": true,
    "streaming_enabled": true
  },
  "default_model": "llama-3.1-70b",
  "rate_limits": {
    "requests_per_minute": 60
  },
  "maintenance_mode": false
}
```

---

## Rate Limits

| Tier | Requests/min | Tokens/day |
|------|-------------|------------|
| Free | 20 | 10,000 |
| Pro | 60 | 100,000 |
| Enterprise | Custom | Custom |

**Rate limit headers:**
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1675612800
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Maintenance mode |

**Error Response:**
```json
{
  "detail": "Invalid credentials",
  "status_code": 401
}
```

## SDKs

### Python

```python
from rajora import Client

client = Client(api_key="raj_your_key")

response = client.chat.completions.create(
    messages=[{"role": "user", "content": "Hello!"}],
    model="llama-3.1-70b"
)

print(response.content)
```

### Node.js

```javascript
import { RajoraClient } from '@rajora/sdk';

const client = new RajoraClient({
  apiKey: 'raj_your_key'
});

const response = await client.chat.completions.create({
  messages: [{ role: 'user', content: 'Hello!' }],
  model: 'llama-3.1-70b'
});

console.log(response.content);
```

---

## WebSocket (Real-time)

```javascript
const ws = new WebSocket('wss://api.rajora.ai/ws/chat');

ws.onopen = () => {
  ws.send(JSON.stringify({
    token: 'your_jwt_token',
    message: 'Hello!',
    model: 'llama-3.1-70b'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.content);
};
```