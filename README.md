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

## 🧱 Environment Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Java 17+
- Git

### Local Development
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd mindmentor-ai
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start the application:
   ```bash
   docker-compose up --build
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - H2 Console: http://localhost:8080/h2-console

## 🔒 Security & Deployment

### Environment Variables
- Never commit `.env` files to version control
- Use strong, unique JWT secrets in production
- Configure database credentials securely
- Use HTTPS in production

### Production Deployment
1. **Backend Deployment**:
   - Build the Docker image: `docker build -t mindmentor-backend ./backend`
   - Deploy to your preferred cloud platform (AWS, Google Cloud, Azure)
   - Configure production database (PostgreSQL recommended)
   - Set up SSL certificates

2. **Frontend Deployment**:
   - Build for production: `cd frontend && npm run build`
   - Deploy to Vercel, Netlify, or AWS S3
   - Configure environment variables for production API URL

3. **Database**:
   - Use managed PostgreSQL service (Neon, AWS RDS, etc.)
   - Configure connection pooling
   - Set up automated backups

### Security Best Practices
- Enable CORS for your frontend domain
- Use environment variables for all secrets
- Implement rate limiting on API endpoints
- Regular security updates for dependencies
- Monitor for suspicious activity

## 🔮 Future Enhancements

- Mobile app (React Native)

- Voice-based AI assistant

- Gamification & leaderboards

- Advanced behavioral analytics

## 👩‍💻 Author

Built as a real-world, portfolio-grade project to demonstrate backend engineering, system design, AI integration, and scalable architecture.

⭐ If you like this project, don’t forget to star the repo!
