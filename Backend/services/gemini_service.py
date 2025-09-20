import json
import google.generativeai as genai
from utils.config import settings

genai.configure(api_key=settings.GEMINI_KEY)

class GeminiService:
    @staticmethod
    def get_societal_impact_analysis(project_title: str, project_description: str) -> dict:
        """Get societal impact analysis from Gemini API"""
        try:
            model = genai.GenerativeModel("gemini-pro")
            
            prompt = f"""
            Analyze the societal impact of a project titled "{project_title}" 
            with the following description: "{project_description}".
            
            Respond ONLY in strict JSON format with the following keys:
            - "impact_analysis": string
            - "impact_score": integer (1-100)
            """

            response = model.generate_content(prompt)

            # Clean + parse JSON
            raw_text = response.text.strip()
            # Sometimes Gemini wraps JSON in ```json ... ```
            if raw_text.startswith("```"):
                raw_text = raw_text.strip("`").replace("json", "", 1).strip()

            return json.loads(raw_text)

        except Exception as e:
            print(f"Error getting societal impact analysis: {e}")
            return {"impact_analysis": "Error generating analysis", "impact_score": 0}
