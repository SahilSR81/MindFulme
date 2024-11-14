from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import numpy as np

class MoodPredictor:
    def __init__(self):
        self.model = RandomForestClassifier()
        self.is_trained = False

    def train(self, X, y):
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        self.model.fit(X_train, y_train)
        self.is_trained = True
        return self.model.score(X_test, y_test)

    def predict(self, features):
        if not self.is_trained:
            raise Exception("Model is not trained yet")
        return self.model.predict(features)

mood_predictor = MoodPredictor()

# Example usage:
# X = np.array([[1, 0, 1, 0, 1], [0, 1, 1, 1, 0], ...])  # Features
# y = np.array([3, 4, ...])  # Mood scores
# accuracy = mood_predictor.train(X, y)
# prediction = mood_predictor.predict([[1, 1, 0, 1, 1]])