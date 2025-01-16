# NutriAI Assistant

An AI-powered nutrition assistant helping underserved communities in Andover, Massachusetts achieve better health through personalized nutrition plans.

## Features

- User authentication
- Personalized nutrition advice
- Meal planning
- Budget-conscious recommendations
- Local food availability consideration
- Cultural preferences support

## Tech Stack

- Frontend:
  - Next.js
  - React
  - ShadcnUI
  - TypeScript
  - TailwindCSS

- Backend:
  - FastAPI
  - Ollama (for RAG capabilities)
  - JWT Authentication
  - Python 3.8+

## Prerequisites

- Node.js 16+
- Python 3.8+
- Ollama installed locally
- pnpm (for package management)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd nutriai-assistant
```

2. Install frontend dependencies:
```bash
pnpm install
```

3. Install backend dependencies:
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory:
```
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

Create a `.env` file in the backend directory:
```
SECRET_KEY=your-backend-secret-key
```

5. Install and start Ollama:
```bash
# Follow Ollama installation instructions at https://ollama.ai/
ollama pull mistral
```

## Running the Application

1. Start the backend server:
```bash
cd backend
uvicorn app.main:app --reload
```

2. Start the frontend development server:
```bash
pnpm dev
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development

### Project Structure

```
.
├── app/                 # Next.js pages and components
├── components/         # Reusable React components
├── lib/               # Utility functions and configurations
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── main.py
│   │   ├── routers/
│   │   ├── models/
│   │   └── services/
│   └── requirements.txt
└── public/            # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to the Andover community for their support
- Ollama team for providing the RAG capabilities
- All contributors and supporters of the project
