from flask import Flask, render_template, request, jsonify
from Backend.rules import evaluate_risk, get_advice

app = Flask(__name__, template_folder='frontend/templates', static_folder='frontend/static')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    risk = evaluate_risk(data)
    advice = get_advice(risk)

    return jsonify({
        'risk_level': risk,
        'advice': advice.strip()
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True)