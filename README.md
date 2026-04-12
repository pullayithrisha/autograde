# AutoGrade: AI-Powered Answer Sheet Evaluator

AutoGrade is a modern, high-performance SaaS application designed for faculty to automate the evaluation of handwritten answer sheets. It leverages advanced AI models for Optical Character Recognition (OCR) and semantic similarity scoring to provide accurate and efficient grading.

---

## 🌟 Key Features

- **Automated Grading**: Rapidly evaluate handwritten assignments against a master answer key.
- **Handwritten text Extraction**: Uses Google Gemini 2.0 Flash for superior OCR capabilities.
- **Semantic Scoring**: Employs Sentence-BERT (SBERT) to compare student answers with the master key based on meaning, not just keywords.
- **Faculty Dashboard**: A premium, mobile-responsive management interface for tracking student evaluations across different years and semesters.
- **Evaluation History**: Securely store and retrieve past evaluations from a persistent database.
- **Secure Architecture**: JWT-based authentication ensures academic data remains confidential.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide-React
- **API Client**: Axios

### Backend (Node.js)
- **Framework**: Express.js
- **Middleware**: Multer (File Handling), JWT (Authentication)
- **Database**: MongoDB (assumed based on implementation)

### AI Service (Python)
- **Framework**: FastAPI
- **OCR Engine**: Google Gemini API
- **Embeddings**: Sentence-Transformers (all-mpnet-base-v2)

---

## 🚀 Getting Started

### Prerequisites
- Node.js & npm
- Python 3.9+
- Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/pullayithrisha/AutoGrade.git
   cd AutoGrade
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file with your PORT, MONGO_URI, and JWT_SECRET
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

4. **Setup AI Service**:
   ```bash
   cd ../ai_service
   pip install -r requirements.txt
   # Create a .env file with your GEMINI_API_KEY
   python -m uvicorn main:app --reload
   ```

---

## 🔒 Security Note
This project uses `.env` files to manage sensitive API keys and database credentials. **Never** commit your `.env` files to the repository. A root `.gitignore` is provided to keep your environment safe.

---

## 📝 License
[Add your license information here]