from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel

# determine if GPU is available and set device accordingly
device = "cuda" if torch.cuda.is_available() else "cpu"

# load the CLIP model and processor, and move the model to the appropriate device
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

def get_embedding(image_path):
    # Load and preprocess the image to RGB color format
    image = Image.open(image_path).convert("RGB")

    # Processor converts image into PyTorch tensors and moves them to the appropriate device
    inputs = processor(images=image, return_tensors="pt").to(device)

    outputs = model.vision_model(**inputs)
    features = outputs.pooler_output
    print(type(features))
    # Normalize for cosine similarity
    features = features / features.norm(dim=-1, keepdim=True)
    return features.detach().cpu().numpy()[0]