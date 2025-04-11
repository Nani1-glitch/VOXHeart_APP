def generate_health_advice(user_input):
    advice_left = []
    advice_right = []

    age = user_input.get("age", 0)
    bmi = user_input.get("bmi", 0)
    cholesterol = user_input.get("cholesterol", 1)
    glucose = user_input.get("gluc", 1)
    smoke = user_input.get("smoke", 0)
    alco = user_input.get("alco", 0)
    active = user_input.get("active", 1)

    # LEFT side suggestions (Medical focus)
    if cholesterol == 2:
        advice_left.append("Your cholesterol is slightly elevated. Reduce red meat and fried food.")
    elif cholesterol == 3:
        advice_left.append("High cholesterol detected. Include more greens and oats in your meals.")

    if glucose == 2:
        advice_left.append("Watch your sugar intake — glucose is above normal.")
    elif glucose == 3:
        advice_left.append("High glucose levels detected. Monitor for potential pre-diabetes symptoms.")

    if bmi >= 30:
        advice_left.append("Your BMI suggests obesity. A weight loss plan is strongly recommended.")

    # RIGHT side suggestions (Lifestyle focus)
    if smoke == 1:
        advice_right.append("Smoking increases heart risk. Consider quitting to protect your health.")
    if alco == 1:
        advice_right.append("Limit alcohol to improve liver and heart health.")
    if active == 0:
        advice_right.append("Try 30 mins of walking daily. Movement is medicine.")

    if age >= 50:
        advice_right.append("Regular check-ups after 50 are essential. Stay proactive.")

    return advice_left, advice_right
