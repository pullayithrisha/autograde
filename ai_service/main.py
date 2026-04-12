from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import re
import os
from dotenv import load_dotenv
load_dotenv()
from google import genai
from sentence_transformers import SentenceTransformer, util

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading Sentence-BERT...")
sts_model = SentenceTransformer('all-mpnet-base-v2')
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY", ""))

def process_answer_key(key_text):
    pattern = r"Q(\d+)\)\s*\((\d+)[mM]?\)\s*(.*?)\n\s*A\d+\)\s*\n*(.*?)(?=\nQ\d+\)|\Z)"
    matches = re.findall(pattern, key_text, re.DOTALL)
    return [{"q_no": int(m[0]), "marks": int(m[1]), "question": m[2].strip(), "master_answer": m[3].strip()} for m in matches]

@app.post("/evaluate")
async def evaluate_submission(answer_key: UploadFile = File(...), student_sheet: UploadFile = File(...)):
    try:
        key_content = await answer_key.read()
        master_key_data = process_answer_key(key_content.decode("utf-8"))
        temp_file_path = f"temp_{student_sheet.filename}"
        with open(temp_file_path, "wb") as f:
            f.write(await student_sheet.read())
        
        gemini_file = client.files.upload(file=temp_file_path)
        prompt = """
        You are an expert grading assistant. Analyze the provided file(s) of a student's handwritten answer sheet. 
        
        Your task is to extract all the handwritten text and organize it perfectly into a single JSON object.
        
        Strict Rules:
        1. Output ONLY a valid JSON object. No markdown, no conversational text.
        2. The keys must be the question numbers (e.g., "Question_1", "Question_2", "Question_3", etc.) for EVERY question answered in the document. Extract them all.
        3. The values must be the student's complete handwritten answer.
        4. CRITICAL: Preserve the original line breaks using the explicit newline character (\\n).
        5. Ignore crossed-out words.
        """
        response = client.models.generate_content(
            model='gemini-2.5-flash', 
            contents=[prompt, gemini_file]
        )
        
        client.files.delete(name=gemini_file.name)
        os.remove(temp_file_path)
        raw_output = response.text
        cleaned_json = re.sub(r"```json\n|\n```|```", "", raw_output).strip()
        student_data = json.loads(cleaned_json)
        
        results = []
        total_earned = 0.0
        total_possible = 0
        for item in master_key_data:
            q_no = item['q_no']
            max_marks = item['marks']
            master_ans = item['master_answer']
            student_q_key = f"Question_{q_no}"
            
            total_possible += max_marks
            
            if student_q_key in student_data:
                student_ans = student_data[student_q_key]
                master_emb = sts_model.encode(master_ans, convert_to_tensor=True)
                student_emb = sts_model.encode(student_ans, convert_to_tensor=True)
                
                sim_score = max(util.cos_sim(master_emb, student_emb).item(), 0.0)
                awarded = round(sim_score * max_marks, 1)
                total_earned += awarded
                
                results.append({
                    "question": q_no,
                    "max_marks": max_marks,
                    "awarded": awarded,
                    "student_text": student_ans,
                    "similarity": round(sim_score, 2)
                })
        return {
            "total_score": round(total_earned, 1),
            "total_possible": total_possible,
            "percentage": round((total_earned / total_possible) * 100, 1) if total_possible > 0 else 0,
            "details": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
