import numpy as np


def cosine_similarity(vec1, vec2):
    a = np.array(vec1)
    b = np.array(vec2)

    denom = np.linalg.norm(a) * np.linalg.norm(b)

    # Avoid division by zero
    if denom == 0:
        return 0.0

    return np.dot(a, b) / denom
