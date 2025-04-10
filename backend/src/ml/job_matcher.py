import os
import pickle
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class JobMatcher:
    def __init__(self, model_path="ml/model.pkl"):
        if not os.path.exists(model_path):
            raise FileNotFoundError("Model not found. Please train and save it first.")
        with open(model_path, "rb") as f:
            self.vectorizer = pickle.load(f)

    def match(self, resume_text, job_descriptions, top_k=3):
        """
        :param resume_text: str - Text of the candidate resume
        :param job_descriptions: list of str - List of job description texts
        :param top_k: int - Number of top matches to return
        :return: list of tuples [(index, similarity_score), ...]
        """
        all_texts = [resume_text] + job_descriptions
        vectors = self.vectorizer.transform(all_texts)

        resume_vector = vectors[0]
        job_vectors = vectors[1:]

        similarities = cosine_similarity(resume_vector, job_vectors).flatten()
        top_indices = np.argsort(similarities)[::-1][:top_k]

        return [(i, similarities[i]) for i in top_indices]
