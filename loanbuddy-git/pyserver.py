from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score

app = Flask(__name__)
CORS(app)

# Load dataset and train the model ONCE when server starts
file_path = "loanpredection.csv"
if not os.path.exists(file_path):
    raise FileNotFoundError("Dataset file not found: loanpredection.csv")

# Load dataset
df = pd.read_csv(file_path)
imputer = SimpleImputer(strategy="most_frequent")
df = pd.DataFrame(imputer.fit_transform(df), columns=df.columns)

# Encode categorical values
label_encoders = {}
for col in df.select_dtypes(include=['object']).columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le

# Ensure required columns exist
if "loan_status" not in df.columns or "loan_id" not in df.columns:
    raise ValueError("Dataset is missing required columns: 'loan_status' or 'loan_id'.")

# Split data
X = df.drop(columns=["loan_status", "loan_id"])
y = df["loan_status"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)
y_pred = rf_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\nModel Accuracy: {accuracy * 100:.2f}%")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON request"}), 400

        # Check if all required fields exist
        missing_fields = [col for col in X.columns if col not in data]
        if missing_fields:
            return jsonify({"error": f"Missing values for: {', '.join(missing_fields)}"}), 400

        applicant_data = []
        for col in X.columns:
            value = data[col]

            # Encode categorical values
            if col in label_encoders:
                if value in label_encoders[col].classes_:
                    value = label_encoders[col].transform([value])[0]
                else:
                    print(f"Warning: '{value}' not seen in training. Defaulting to first category.")
                    value = 0
            else:
                try:
                    value = float(value)
                except ValueError:
                    return jsonify({"error": f"Invalid value for '{col}'"}), 400

            applicant_data.append(value)

        applicant_data = np.array(applicant_data).reshape(1, -1)

        # Predict loan eligibility
        probability = rf_model.predict_proba(applicant_data)[0][1] * 100
        print(f"\nLoan Eligibility: {probability:.2f}%")

        return jsonify({"result": f"{probability:.2f}%"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, host='0.0.0.0', debug=True)
