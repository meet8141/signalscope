# Setup Guide

## 🚀 How to Run the Backend

To spin up the FastAPI backend locally, open your terminal and run the following commands:

```bash
# Navigate to the backend directory
cd backend

# Install dependencies (if you haven't already)
pip install -r ../requirements.txt

# Start the FastAPI server using Uvicorn
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.
You can access the interactive Swagger documentation at `http://localhost:8000/docs`.

## 💻 How to Run the Frontend

To run the React + Vite frontend locally:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will typically be available at `http://localhost:5173`.
