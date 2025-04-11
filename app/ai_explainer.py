import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_natural_explanation(user_data):
    prompt = f"""
You are a medical assistant. Based on the following user inputs, write a short natural-language explanation of their heart disease risk factors:

- Age: {user_data['age']}
- Gender: {"Male" if user_data['gender']==2 else "Female"}
- Height: {user_data['height']} cm
- Weight: {user_data['weight']} kg
- Systolic BP: {user_data['ap_hi']} mmHg
- Diastolic BP: {user_data['ap_lo']} mmHg
- Cholesterol Level: {user_data['cholesterol']}
- Glucose Level: {user_data['gluc']}
- Smoker: {"Yes" if user_data['smoke']==1 else "No"}
- Alcohol Intake: {"Yes" if user_data['alco']==1 else "No"}
- Physical Activity: {"Yes" if user_data['active']==1 else "No"}

Explain in simple terms what this means for the person’s heart health in 3 sentences.
"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # You can switch to gpt-4 if needed
            messages=[
                {"role": "system", "content": "You are a helpful, concise medical assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        return f"Sorry, I couldn't generate an explanation: {e}"
