# AuraCast Developer API Documentation (v2.50)

The **AuraCast Developer API** allows developers and enterprise engineering teams to programmatically interact with the AuraCast marketing engine. You can fetch system metrics, generate AI content packages, manage scheduled posts, trigger webhooks, and query brand blueprints.

---

## 📑 Table of Contents
1. [Base URL & Protocol](#base-url--protocol)
2. [Authentication](#authentication)
3. [Core REST API Endpoints](#core-rest-api-endpoints)
   - [Health & System Status](#1-health--system-status)
   - [Data Store Management](#2-data-store-management)
   - [AI Strategy & Content Generation](#3-ai-strategy--content-generation)
   - [Social Inbox & Engagement](#4-social-inbox--engagement)
   - [Analytics & Export](#5-analytics--export)
4. [Webhooks & Events](#webhooks--events)
5. [Rate Limits & Error Handling](#rate-limits--error-handling)

---

## Base URL & Protocol

All API requests should be sent via `HTTPS` to your deployed AuraCast server domain:

```
https://your-auracast-domain.app/api
```

---

## Authentication

Requests to protected endpoints require an `X-API-Key` header or Firebase Auth Bearer token:

```http
Authorization: Bearer <FIREBASE_ID_TOKEN>
X-API-Key: ac_live_8f92a0d17e34b92c
Content-Type: application/json
```

---

## Core REST API Endpoints

### 1. Health & System Status

#### `GET /api/health`
Verifies that the Express server and database connections are operational.

**Response `200 OK`**:
```json
{
  "status": "ok",
  "version": "2.50.0",
  "timestamp": "2026-08-11T01:00:00Z",
  "services": {
    "database": "connected",
    "ai_engine": "online"
  }
}
```

---

### 2. Data Store Management

#### `GET /api/store`
Retrieves the entire active workspace data model (blueprint, topics, scheduled posts, inbox, analytics, and team configuration).

**Response `200 OK`**:
```json
{
  "blueprint": {
    "title": "Christian Motivational & Growth Page for Young Nigerians",
    "frequency": "5 Days / Week",
    "goals": ["Brand Awareness", "Community Engagement", "Leads & Growth"],
    "weeks": [...]
  },
  "topics": [...],
  "inbox": {
    "messages": [...],
    "unreadCount": 3
  },
  "analytics": {...}
}
```

#### `POST /api/store`
Updates the workspace data model atomically.

**Request Body**:
```json
{
  "data": { ... }
}
```

**Response `200 OK`**:
```json
{
  "success": true,
  "updatedAt": "2026-08-11T01:00:00Z"
}
```

---

### 3. AI Strategy & Content Generation

#### `POST /api/generate-topic`
Generates a multi-channel social post package from a raw topic or concept using server-side Gemini AI.

**Request Body**:
```json
{
  "topic": "3 Daily Prayers & Habits for Morning Clarity",
  "channels": ["instagram", "facebook", "whatsapp"],
  "toneGoal": "Inspirational & Actionable"
}
```

**Response `200 OK`**:
```json
{
  "id": "topic_1782136900",
  "text": "3 Daily Prayers & Habits for Morning Clarity",
  "status": "Scheduled",
  "channels": ["instagram", "facebook", "whatsapp"],
  "scheduledFor": "Tomorrow at 8:00 AM",
  "cardDesign": {
    "title": "Unshakable Clarity",
    "subtitle": "3 Daily Morning Habits",
    "bgPreset": "gradient-amber",
    "quote": "Commit your work to the Lord, and your plans will be established."
  },
  "channelCaptions": {
    "instagram": "Start your day centered in purpose! Here are 3 habits to ground your morning...",
    "facebook": "Morning clarity sets the tone for your entire week...",
    "whatsapp": "Broadcast Note: 3 morning prayers for unshakable peace today."
  }
}
```

---

### 4. Social Inbox & Engagement

#### `GET /api/inbox/messages`
Retrieves all incoming social media messages and customer comments.

**Query Parameters**:
- `status`: `unread` | `all`
- `platform`: `instagram` | `twitter` | `facebook` | `linkedin`

**Response `200 OK`**:
```json
{
  "messages": [
    {
      "id": "msg_001",
      "author": "Chioma K.",
      "platform": "instagram",
      "content": "This morning prayer note was exactly what I needed today! Thank you!",
      "timestamp": "10m ago",
      "sentiment": "positive",
      "read": false
    }
  ]
}
```

#### `POST /api/inbox/reply`
Sends a reply to a specific social message.

**Request Body**:
```json
{
  "messageId": "msg_001",
  "replyText": "You are so welcome, Chioma! Stay blessed and keep growing!"
}
```

---

### 5. Analytics & Export

#### `GET /api/analytics/export-csv`
Downloads a formatted CSV string containing 7-day multi-platform comment and engagement statistics.

**Response Headers**:
```http
Content-Type: text/csv
Content-Disposition: attachment; filename="auracast-analytics-export.csv"
```

---

## Webhooks & Events

AuraCast supports webhooks for real-time dispatch events:
- `post.published`: Fired when a scheduled post is successfully dispatched to social platforms.
- `inbox.message_received`: Fired when a new customer comment or direct message arrives.
- `ab_test.winner_declared`: Fired when an A/B split test completes and a winner is chosen.

---

## Rate Limits & Error Handling

- **Standard Tier**: 120 requests / minute
- **Enterprise Tier**: 1,000 requests / minute

**Error Response Format**:
```json
{
  "error": {
    "code": "INVALID_PARAM",
    "message": "The 'topic' field is required.",
    "status": 400
  }
}
```

---

*AuraCast Developer API © 2026.*
