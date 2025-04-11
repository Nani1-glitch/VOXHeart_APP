from flask import Flask, render_template, request, send_file
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import os
import pandas as pd
import time
import joblib
from health_advice import generate_health_advice
from dotenv import load_dotenv
from openai import OpenAI
from voice_input import collect_user_voice_input
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader

# Load API key
load_dotenv()
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)

# Memory for PDF export
last_session = {}

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def predict_from_input(input_data):
    data = np.load("models/lr_weights.npz")
    W = data['W']
    b = data['b']
    A = sigmoid(np.dot(input_data, W) + b)
    return int((A >= 0.5).astype(int)[0][0])

def generate_natural_explanation(user_data):
    prompt = f"""
You are a medical assistant. Based on the following user inputs, write a simple 3-line explanation of their heart disease risk:

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

Explain in 3 lines what this means for the person’s heart health.
"""
    try:
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful, concise medical assistant."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150,
            temperature=0.7
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"⚠️ Unable to generate explanation: {e}"

def process_user_input(user_data):
    features = [[
        user_data['age'], user_data['gender'], user_data['height'], user_data['weight'],
        user_data['ap_hi'], user_data['ap_lo'], user_data['cholesterol'], user_data['gluc'],
        user_data['smoke'], user_data['alco'], user_data['active']
    ]]
    scaler = joblib.load("models/scaler.pkl")
    X_scaled = scaler.transform(features)
    prediction = predict_from_input(X_scaled)

    bmi = user_data['weight'] / ((user_data['height'] / 100) ** 2)
    bmi_category = "Underweight" if bmi < 18.5 else "Normal" if bmi < 25 else "Overweight" if bmi < 30 else "Obese"
    timestamp = str(int(time.time()))

    # BMI Chart
    plt.figure(figsize=(6, 2))
    plt.axhline(1, xmin=0, xmax=4, color='gray', linewidth=12)
    color = 'green' if bmi < 25 else 'orange' if bmi < 30 else 'red'
    plt.plot([bmi], [1], 'o', color=color, markersize=18)
    plt.yticks([])
    plt.xticks([15, 18.5, 25, 30, 40], ['15', '18.5', '25', '30', '40'])
    plt.title(f"BMI: {bmi:.1f} ({bmi_category})")
    plt.tight_layout()
    bmi_path = f"app/static/plots/bmi_plot_{timestamp}.png"
    plt.savefig(bmi_path)
    plot_bmi = f"plots/bmi_plot_{timestamp}.png"
    plt.close()

    # BP Chart
    plt.figure(figsize=(5, 3))
    plt.bar(["Systolic", "Diastolic"], [user_data['ap_hi'], user_data['ap_lo']], color=['skyblue', 'lightgreen'])
    plt.axhline(120, color='blue', linestyle='--', label='Normal Systolic')
    plt.axhline(80, color='green', linestyle='--', label='Normal Diastolic')
    plt.title("Your Blood Pressure")
    plt.legend()
    plt.tight_layout()
    bp_path = f"app/static/plots/bp_plot_{timestamp}.png"
    plt.savefig(bp_path)
    plot_bp = f"plots/bp_plot_{timestamp}.png"
    plt.close()

    explanation = generate_natural_explanation(user_data)
    advice_left, advice_right = generate_health_advice({ **user_data, "bmi": bmi })

    user_data["prediction"] = prediction
    df = pd.DataFrame([user_data])
    csv_path = "data/retrieved/predictions.csv"
    if os.path.exists(csv_path):
        df.to_csv(csv_path, mode='a', header=False, index=False)
    else:
        df.to_csv(csv_path, index=False)

    # Store session
    last_session.update({
        "user_data": user_data,
        "explanation": explanation,
        "plot_bmi": bmi_path,
        "plot_bp": bp_path,
        "advice_left": advice_left,
        "advice_right": advice_right
    })

    return prediction, plot_bmi, plot_bp, advice_left, advice_right, explanation

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        user_data = {
            "age": float(request.form.get("age")),
            "gender": float(request.form.get("gender")),
            "height": float(request.form.get("height")),
            "weight": float(request.form.get("weight")),
            "ap_hi": float(request.form.get("ap_hi")),
            "ap_lo": float(request.form.get("ap_lo")),
            "cholesterol": float(request.form.get("cholesterol")),
            "gluc": float(request.form.get("gluc")),
            "smoke": float(request.form.get("smoke")),
            "alco": float(request.form.get("alco")),
            "active": float(request.form.get("active")),
        }
        prediction, plot_bmi, plot_bp, advice_left, advice_right, explanation = process_user_input(user_data)
        return render_template("index.html",
                               prediction=prediction,
                               plot_bmi=plot_bmi,
                               plot_bp=plot_bp,
                               advice_left=advice_left,
                               advice_right=advice_right,
                               explanation=explanation)
    return render_template("index.html")

@app.route("/download_pdf")
def download_pdf():
    if not last_session:
        return "❌ No prediction made yet.", 400

    data = last_session["user_data"]
    pdf_path = f"app/static/pdf/voxheart_report_{int(time.time())}.pdf"
    os.makedirs(os.path.dirname(pdf_path), exist_ok=True)

    c = canvas.Canvas(pdf_path, pagesize=A4)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, 800, "VOXHEART - Heart Disease Report")
    c.line(50, 795, 550, 795)

    y = 770
    c.setFont("Helvetica", 11)
    for key, val in data.items():
        if key != "prediction":
            c.drawString(50, y, f"{key.capitalize()}: {val}")
            y -= 18
    c.drawString(50, y, f"Prediction: {'At Risk' if data['prediction'] else 'No Risk'}")
    y -= 40

    if os.path.exists(last_session["plot_bmi"]):
        c.drawImage(ImageReader(last_session["plot_bmi"]), 50, y - 120, width=220, height=70)
        y -= 140

    if os.path.exists(last_session["plot_bp"]):
        c.drawImage(ImageReader(last_session["plot_bp"]), 300, y + 20, width=220, height=90)
        y -= 30

    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Explanation:")
    y -= 20
    c.setFont("Helvetica", 10)
    for line in last_session["explanation"].split("\n"):
        c.drawString(60, y, line)
        y -= 14

    y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Medical Advice:")
    y -= 18
    c.setFont("Helvetica", 10)
    for item in last_session["advice_left"]:
        c.drawString(60, y, "- " + item)
        y -= 14

    y -= 12
    c.setFont("Helvetica-Bold", 12)
    c.drawString(300, y, "Lifestyle Tips:")
    y -= 18
    c.setFont("Helvetica", 10)
    for item in last_session["advice_right"]:
        c.drawString(310, y, "- " + item)
        y -= 14

    c.save()
    return send_file(pdf_path, as_attachment=True)

@app.route("/voice", methods=["GET"])
def voice_input():
    user_data, transcript = collect_user_voice_input()
    if not user_data:
        return render_template("index.html", prediction=None, explanation=None,
                               advice_left=["⚠️ Voice input failed."], advice_right=[])

    user_data.setdefault("gender", 1)
    user_data.setdefault("cholesterol", 1)
    user_data.setdefault("gluc", 1)
    user_data.setdefault("smoke", 0)
    user_data.setdefault("alco", 0)
    user_data.setdefault("active", 1)

    prediction, plot_bmi, plot_bp, advice_left, advice_right, explanation = process_user_input(user_data)
    final_left = transcript["left"] + advice_left
    final_right = transcript["right"] + advice_right

    return render_template("index.html",
                           prediction=prediction,
                           plot_bmi=plot_bmi,
                           plot_bp=plot_bp,
                           advice_left=final_left,
                           advice_right=final_right,
                           explanation=explanation)

if __name__ == "__main__":
    app.run(debug=True)
