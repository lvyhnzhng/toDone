# toDone

**A modern, real-time collaborative kanban board for task management**

## 🚀 Features

- **Real-time Collaboration**: Instant updates across all users with WebSocket
- **Drag & Drop Interface**: Intuitive task management with smooth interactions
- **Modern UI**: Built with Next.js, Tailwind CSS, and ShadCN UI
- **High Performance**: Golang backend with MongoDB for scalability
- **Real-time Sync**: No refresh needed, changes appear instantly

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **State Management**: Zustand + TanStack Query
- **Real-time**: Socket.io-client
- **Drag & Drop**: @dnd-kit/core

### Backend
- **Language**: Golang
- **Framework**: Fiber
- **Database**: MongoDB
- **Real-time**: WebSocket
- **Authentication**: JWT

### DevOps
- **Containerization**: Docker + Docker Compose
- **Frontend Deployment**: Vercel
- **Backend Deployment**: Render
- **CI/CD**: GitHub Actions

## 🚀 Quick Start

### Prerequisites
- Go 1.21+
- Node.js 18+
- MongoDB 6+
- Docker (optional)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd toDone
   ```

2. **Backend Setup**
   ```bash
   cd backend
   go mod tidy
   cp .env.example .env
   # Edit .env with your MongoDB connection string
   go run main.go
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

## 📋 Project Structure

```
toDone/
├── backend/          # Golang + Fiber API
├── frontend/         # Next.js application
├── docs/            # Documentation
├── docker/          # Docker configurations
└── scripts/         # Build and deployment scripts
```

## 🎯 Roadmap

- [x] Project initialization
- [ ] Backend API development
- [ ] Frontend UI components
- [ ] Real-time WebSocket integration
- [ ] Drag & drop functionality
- [ ] User authentication
- [ ] Deployment & CI/CD

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 