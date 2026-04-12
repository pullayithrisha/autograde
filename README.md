# AutoGrade 🚀

**AutoGrade** is a premium, AI-powered Answer Sheet Evaluator designed for academic institutions. It leverages the power of Large Language Models (LLMs) and Semantic Textual Similarity (STS) to automate the grading of handwritten student submissions against a master answer key.

---

## 🌟 Overview
AutoGrade streamlines the grading process by combining automated OCR (Optical Character Recognition) with intelligent semantic analysis. It doesn't just look for keywords; it understands the *logic* behind a student's answer, providing a fair and accurate score based on human-defined master keys.

### 🎥 Project Highlights
- **Intelligent Semantic Grading**: Uses Sentence-BERT (SBERT) to compare student answers with master answers.
- **Advanced OCR**: Utilizes Google Gemini to extract handwritten text with high precision.
- **Premium UI/UX**: A state-of-the-art dashboard built with Framer Motion and TailwindCSS.
- **Archive System**: Automatically saves and manages evaluation history for future reference.

---

## ✨ Key Features
- **Faculty Management**: Secure login and configuration for specific teaching years and subjects.
- **Master Key System**: Upload structured `.txt` files defining questions, max marks, and reference answers.
- **Multi-Format Support**: Evaluate student submissions in Image (JPG/PNG) or PDF formats.
- **Real-time Progress**: Visual feedback during the analysis of logic and handwriting.
- **Grade Reports**: Detailed breakdown of awarded marks vs. maximum marks, similarity scores, and extracted text for every question.
- **History Tracking**: Sidebar navigation to revisit past evaluations.

---

## 🛠️ Tech Stack

### Frontend
- **React.js**: Core framework.
- **TailwindCSS**: Modern styling.
- **Framer Motion**: Smooth animations and transitions.
- **Lucide-React**: Premium iconography.
- **Axios**: API communication.

### Backend
- **Node.js & Express**: API gateway and business logic.
- **Multer**: Handling multi-part file uploads.
- **MongoDB**: (Required) Database for storing faculty data and evaluation history.

### AI Engine (Python)
- **FastAPI**: High-performance AI service.
- **Google GenAI (Gemini)**: State-of-the-art vision and language processing for OCR.
- **Sentence-Transformers**: `all-mpnet-base-v2` for calculating semantic similarity scores.

---

## 📂 Project Structure
```text
AutoGrade/
├── ai_service/      # Python FastAPI service for OCR and Similarity
├── backend/         # Node.js/Express server (Business Logic & Database)
└── frontend/        # React application (UI/UX)
```

---

## 🚀 Installation & Setup

### 1. AI Service (Python)
```bash
cd ai_service
# Create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
# Install dependencies
pip install fastapi uvicorn google-generativeai sentence-transformers python-dotenv
# Run the service
uvicorn main:app --reload --port 8000
```
*Note: Ensure you have a `.env` file with `GEMINI_API_KEY`.*

### 2. Backend (Node.js)
```bash
cd backend
npm install
# Run the server
npm start
```
*Note: Ensure you have a `.env` file with `PORT`, `MONGO_URI`, and `JWT_SECRET`.*

### 3. Frontend (React)
```bash
cd frontend
npm install
npm start
```

---

## 🛡️ Security
AutoGrade is designed with security in mind:
- **Environment Variables**: Sensitive keys (API keys, DB URIs) are kept in `.env` files and excluded from the repository.
- **Authentication**: JWT-based authentication for faculty access.

---

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.