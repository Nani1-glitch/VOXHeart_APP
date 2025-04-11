import re

def interpret_spoken_value(field, response):
    """Convert common spoken phrases into appropriate values."""
    text = response.strip().lower()

    if field == "gender":
        return 2 if "male" in text else 1

    if field in ("cholesterol", "gluc"):
        if "three" in text or "tree" in text or "3" in text:
            return 3
        if "two" in text or "to" in text or "2" in text:
            return 2
        return 1  # fallback to normal

    if field in ("smoke", "alco", "active"):
        return 1 if "yes" in text else 0

    # For number fields
    match = re.search(r"\d+(\.\d+)?", text)
    return float(match.group()) if match else 0.0


def collect_user_voice_input():
    """
    Collects the user's voice-based input from frontend and maps
    spoken text to structured values.
    """
    print("[Voice Input Backend] Browser handled voice input. Interpreting...")

    # Simulated voice transcript (in real setup, you would get this from the frontend or API call)
    # Replace this with actual input collection if needed
    transcript = {
        "left": [
            "🧠 Please tell your age in years.",
            "🧠 What is your height in centimeters?",
            "🧠 Tell me your weight in kilograms.",
            "🧠 What is your systolic blood pressure?",
            "🧠 Now your diastolic blood pressure?",
            "🧠 Say your gender. Male or Female?",
            "🧠 Rate your cholesterol. 1 for normal, 2 for above, 3 for well above.",
            "🧠 Rate your glucose. 1 for normal, 2 for above, 3 for well above.",
            "🧠 Do you smoke? Say yes or no.",
            "🧠 Do you consume alcohol? Say yes or no.",
            "🧠 Are you physically active? Say yes or no.",
            "🧠 All values received. Please click Predict."
        ],
        "right": [
            "61",
            "181",
            "91",
            "151",
            "120",
            "male",
            "two",
            "one",
            "no",
            "no",
            "yes"
        ]
    }

    try:
        fields = [
            "age", "height", "weight", "ap_hi", "ap_lo",
            "gender", "cholesterol", "gluc",
            "smoke", "alco", "active"
        ]
        user_data = {}

        for idx, field in enumerate(fields):
            response = transcript["right"][idx] if idx < len(transcript["right"]) else ""
            val = interpret_spoken_value(field, response)
            user_data[field] = val

        return user_data, transcript

    except Exception as e:
        print(f"[Voice Interpretation Error]: {e}")
        return None, {"left": ["Voice input failed."], "right": []}
