from fpdf import FPDF
import os
from datetime import datetime

class VOXHeartPDF(FPDF):
    def header(self):
        if os.path.exists("app/static/logo.png"):
            self.image("app/static/logo.png", 10, 8, 33)
        self.set_font("Helvetica", "B", 16)
        self.cell(0, 10, "VOXHEART - Heart Health Report", ln=True, align="C")
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(169, 169, 169)
        self.cell(0, 10, f"Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  |  Page {self.page_no()}", align="C")

    def add_user_info(self, user_data, prediction, explanation):
        self.set_font("Helvetica", "", 12)
        self.cell(0, 10, "Patient Information", ln=True, align="L")
        self.set_font("Helvetica", "", 11)

        info = [
            f"Age: {user_data['age']} years",
            f"Gender: {'Male' if user_data['gender'] == 2 else 'Female'}",
            f"Height: {user_data['height']} cm",
            f"Weight: {user_data['weight']} kg",
            f"Systolic BP: {user_data['ap_hi']} mmHg",
            f"Diastolic BP: {user_data['ap_lo']} mmHg",
            f"Cholesterol Level: {user_data['cholesterol']}",
            f"Glucose Level: {user_data['gluc']}",
            f"Smoker: {'Yes' if user_data['smoke'] else 'No'}",
            f"Alcohol Intake: {'Yes' if user_data['alco'] else 'No'}",
            f"Physical Activity: {'Yes' if user_data['active'] else 'No'}",
            f"Prediction: {'At Risk of Heart Disease' if prediction == 1 else 'No Risk Detected'}"
        ]

        for line in info:
            self.cell(0, 8, line, ln=True)

        self.ln(5)
        self.set_font("Helvetica", "B", 12)
        self.cell(0, 10, "AI Explanation", ln=True)
        self.set_font("Helvetica", "", 11)
        for line in explanation.split("\n"):
            self.multi_cell(0, 8, line)
        self.ln(5)

    def add_images(self, bmi_path, bp_path):
        self.set_font("Helvetica", "B", 12)
        self.cell(0, 10, "Visual Reports", ln=True)
        if os.path.exists(bmi_path):
            self.image(bmi_path, x=15, w=180)
        self.ln(10)
        if os.path.exists(bp_path):
            self.image(bp_path, x=15, w=180)
        self.ln(10)

    def add_advice(self, advice_left, advice_right):
        self.set_font("Helvetica", "B", 12)
        self.cell(0, 10, "Personalized Health Suggestions", ln=True)

        self.set_font("Helvetica", "", 11)
        self.cell(0, 8, "Medical Advice:", ln=True)
        for item in advice_left:
            self.multi_cell(0, 8, f"• {item}")
        self.ln(4)

        self.set_font("Helvetica", "", 11)
        self.cell(0, 8, "Lifestyle Advice:", ln=True)
        for item in advice_right:
            self.multi_cell(0, 8, f"• {item}")

def generate_pdf_report(user_data, prediction, explanation, bmi_path, bp_path, advice_left, advice_right, output_path):
    pdf = VOXHeartPDF()
    pdf.add_page()
    pdf.add_user_info(user_data, prediction, explanation)
    pdf.add_images(bmi_path, bp_path)
    pdf.add_advice(advice_left, advice_right)
    pdf.output(output_path)
    return output_path
