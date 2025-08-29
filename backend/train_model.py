import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
from sklearn.linear_model import LogisticRegression
import pickle

# Load CSV
data = pd.read_csv("conditions.csv")

# Features and target
X = data['description'] + " " + data['condition']
y = data['condition']

# Encode target labels
encoder = LabelEncoder()
y_encoded = encoder.fit_transform(y)

# Convert text to TF-IDF features
vectorizer = TfidfVectorizer(ngram_range=(1,2), min_df=1)
X_vect = vectorizer.fit_transform(X)

# Train model (better than Naive Bayes)
model = LogisticRegression(max_iter=1000)
model.fit(X_vect, y_encoded)

# Save artifacts
with open("symptom_model.pkl", "wb") as f:
    pickle.dump(model, f)
with open("vectorizer.pkl", "wb") as f:
    pickle.dump(vectorizer, f)
with open("symptom_encoder.pkl", "wb") as f:
    pickle.dump(encoder, f)

print("Training complete. Model, vectorizer, and encoder saved.")
