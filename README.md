# 🧠 MindMentor AI

MindMentor AI is an intelligent productivity and learning management platform designed to help learners and professionals plan smarter, stay focused, and improve performance using AI-driven insights, personalized schedules, and real-time analytics.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- JWT-based Login & Signup
- Role-based access (User / Admin)
- Secure password encryption

### 📚 Smart Learning Planner
- Create goals with subjects & deadlines
- AI-generated personalized daily study plans
- Task tracking with completion status & time spent

### 🤖 AI-Powered Recommendations
- Personalized study plans
- Productivity & focus insights
- Motivational feedback messages using AI

### 📊 Performance Analytics
- Track time spent & consistency streaks
- Weekly & monthly progress visualization
- AI-based performance trend analysis

### 🔔 Smart Reminders
- Automated email reminders
- Missed task notifications
- Consistency encouragement alerts

### 🧾 Reports
- Downloadable monthly performance reports (PDF)
- Progress summaries & improvement insights

### ⚙️ Admin Dashboard
- User management
- Analytics trend monitoring
- Platform insights

---

## 🧱 Tech Stack

### 🖥 Backend
- Java 17+
- Spring Boot 3+
- Spring Security (JWT)
- Spring Data JPA (Hibernate)
- PostgreSQL
- Redis (Caching)
- Apache Kafka (Async processing)
- Elasticsearch (Fast search)
- Swagger / OpenAPI

### 🤖 AI Integration
- OpenAI API / Gemini API
- Personalized plans & recommendations

### 💅 Frontend
- React (TypeScript)
- Tailwind CSS
- REST APIs + WebSockets
- Analytics dashboards

### ☁️ DevOps & Deployment
- Docker & Docker Compose
- CI/CD ready
- Backend: AWS EC2 / Render / Railway
- Frontend: Vercel
- Database: Neon (PostgreSQL Cloud)

---

## 🧮 Database Design (Simplified)

**Users**
- id, name, email, password, role

**Goals**
- id, user_id, subject, deadline, status

**Tasks**
- id, goal_id, topic, completed, time_spent, ai_suggestion

**Analytics**
- id, user_id, consistency_score, performance_trend

**Feedback**
- id, user_id, message, sentiment

## 🔌 API Example

### Generate AI Study Plan
**POST** `/api/ai/generatePlan`

```json
{
  "subject": "Data Structures",
  "deadline": "2025-12-01",
  "dailyHours": 3
} 
```
**Response**
```json
{
  "plan": [
    { "day": 1, "topic": "Arrays & Strings", "duration": "3h" },
    { "day": 2, "topic": "Linked List & Stack", "duration": "3h" }
  ],
  "motivation": "Consistency beats speed. Keep going!"
}
```
## 🐳 Run Locally (Docker)
docker-compose up --build

## 🧪 API Documentation
Swagger UI: http://localhost:8080/swagger-ui.html

## 🔮 Future Enhancements

- Mobile app (React Native)

- Voice-based AI assistant

- Gamification & leaderboards

- Advanced behavioral analytics

## 👩‍💻 Author

Built as a real-world, portfolio-grade project to demonstrate backend engineering, system design, AI integration, and scalable architecture.

⭐ If you like this project, don’t forget to star the repo!
