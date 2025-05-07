# VOXHEART - Advanced Heart Health Analysis

VOXHEART is a modern, AI-powered heart disease prediction application that provides instant insights about your heart health using advanced machine learning algorithms.

## Features

- 🤖 AI-powered heart disease risk prediction
- 📊 Interactive health metrics visualization
- 🎙️ Voice input support for easy data entry
- 📱 Modern, responsive user interface
- 📄 Detailed PDF report generation
- 💡 Personalized health advice and lifestyle tips
- 🔒 Secure data handling

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/voxheart.git
cd voxheart
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file in the root directory and add your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Usage

1. Start the application:
```bash
python app/app.py
```

2. Open your browser and navigate to `http://localhost:5000`

3. Enter your health data or use voice input to get instant heart health analysis

## Technology Stack

- **Backend**: Python, Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Machine Learning**: scikit-learn, NumPy, Pandas
- **Data Visualization**: Matplotlib
- **AI Integration**: OpenAI GPT-3.5
- **PDF Generation**: ReportLab

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Heart Disease Dataset from UCI Machine Learning Repository
- OpenAI for AI-powered explanations
- All contributors and users of VOXHEART
