from fastapi import FastAPI, HTTPException, Depends, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
import aiofiles
import os
import json
import uuid
from datetime import datetime
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="SerenityAI Services",
    description="AI-powered therapeutic music and art generation services",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verify API token"""
    token = credentials.credentials
    expected_token = os.getenv("AI_SERVICE_API_KEY", "your-ai-service-api-key")
    if token != expected_token:
        raise HTTPException(status_code=401, detail="Invalid API key")
    return token

# Pydantic models
class MusicGenerationRequest(BaseModel):
    mood: str
    genre: Optional[str] = None
    duration: int = 120
    tempo: Optional[str] = None
    instruments: Optional[List[str]] = None
    personalPreferences: Optional[Dict[str, Any]] = None

class ArtGenerationRequest(BaseModel):
    mood: str
    artStyle: Optional[str] = None
    colorPalette: Optional[str] = None
    theme: Optional[str] = None
    prompt: Optional[str] = None
    personalPreferences: Optional[Dict[str, Any]] = None

class GenerationResponse(BaseModel):
    model_used: str
    file_path: str
    audio_url: Optional[str] = None
    image_url: Optional[str] = None
    metadata: Dict[str, Any]

# Music Generation Service
@app.post("/music/generate", response_model=GenerationResponse)
async def generate_music(
    request: MusicGenerationRequest,
    token: str = Depends(verify_token)
):
    """Generate therapeutic music based on user preferences and mood"""
    try:
        logger.info(f"Generating music for mood: {request.mood}")
        
        # Simulate AI music generation process
        # In a real implementation, this would call actual AI models like:
        # - MusicGen for music generation
        # - Magenta for melody creation
        # - Custom therapeutic music models
        
        generation_id = str(uuid.uuid4())
        file_name = f"music_{generation_id}.wav"
        file_path = f"/generated/music/{file_name}"
        
        # Mock music generation metadata
        metadata = {
            "generation_id": generation_id,
            "mood": request.mood,
            "genre": request.genre or "ambient",
            "duration": request.duration,
            "tempo": request.tempo or "medium",
            "instruments": request.instruments or ["piano", "strings"],
            "bpm": get_bpm_for_mood(request.mood),
            "key": get_key_for_mood(request.mood),
            "generated_at": datetime.now().isoformat(),
            "model_parameters": {
                "temperature": 0.7,
                "top_p": 0.9,
                "guidance_scale": 7.5
            }
        }
        
        # Simulate processing time
        await asyncio.sleep(2)
        
        # In production, save the actual generated audio file
        audio_url = f"https://api.serenity-ai.com/files/music/{file_name}"
        
        logger.info(f"Music generation completed: {generation_id}")
        
        return GenerationResponse(
            model_used="SerenityAI-MusicGen-v1",
            file_path=file_path,
            audio_url=audio_url,
            metadata=metadata
        )
        
    except Exception as e:
        logger.error(f"Music generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Music generation failed: {str(e)}")

# Art Generation Service
@app.post("/art/generate", response_model=GenerationResponse)
async def generate_art(
    request: ArtGenerationRequest,
    token: str = Depends(verify_token)
):
    """Generate therapeutic art based on user preferences and mood"""
    try:
        logger.info(f"Generating art for mood: {request.mood}")
        
        # Simulate AI art generation process
        # In a real implementation, this would call actual AI models like:
        # - Stable Diffusion for image generation
        # - DALL-E for creative art
        # - Custom therapeutic art models
        
        generation_id = str(uuid.uuid4())
        file_name = f"art_{generation_id}.png"
        file_path = f"/generated/art/{file_name}"
        
        # Create therapeutic art prompt
        art_prompt = create_art_prompt(request)
        
        # Mock art generation metadata
        metadata = {
            "generation_id": generation_id,
            "mood": request.mood,
            "art_style": request.artStyle or "abstract",
            "color_palette": request.colorPalette or "calm",
            "theme": request.theme or "healing",
            "prompt": art_prompt,
            "generated_at": datetime.now().isoformat(),
            "model_parameters": {
                "steps": 50,
                "guidance_scale": 7.5,
                "seed": generation_id[:8]
            }
        }
        
        # Simulate processing time
        await asyncio.sleep(3)
        
        # In production, save the actual generated image file
        image_url = f"https://api.serenity-ai.com/files/art/{file_name}"
        
        logger.info(f"Art generation completed: {generation_id}")
        
        return GenerationResponse(
            model_used="SerenityAI-ArtGen-v1",
            file_path=file_path,
            image_url=image_url,
            metadata=metadata
        )
        
    except Exception as e:
        logger.error(f"Art generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Art generation failed: {str(e)}")

# Helper functions
def get_bpm_for_mood(mood: str) -> int:
    """Get appropriate BPM for mood"""
    mood_bpm_map = {
        "calm": 60,
        "peaceful": 65,
        "sad": 70,
        "anxious": 80,
        "happy": 120,
        "energetic": 140
    }
    return mood_bpm_map.get(mood, 90)

def get_key_for_mood(mood: str) -> str:
    """Get appropriate musical key for mood"""
    mood_key_map = {
        "calm": "C major",
        "peaceful": "F major",
        "sad": "D minor",
        "anxious": "A minor",
        "happy": "G major",
        "energetic": "E major"
    }
    return mood_key_map.get(mood, "C major")

def create_art_prompt(request: ArtGenerationRequest) -> str:
    """Create therapeutic art prompt based on request"""
    base_prompt = f"A therapeutic {request.artStyle or 'abstract'} artwork"
    
    if request.theme:
        base_prompt += f" representing {request.theme}"
    
    if request.colorPalette:
        base_prompt += f" with {request.colorPalette} colors"
    
    if request.mood:
        mood_descriptors = {
            "calm": "serene, peaceful, flowing",
            "peaceful": "tranquil, gentle, harmonious",
            "sad": "melancholic, soft, comforting",
            "anxious": "balanced, grounding, stable",
            "happy": "bright, uplifting, joyful",
            "energetic": "dynamic, vibrant, motivating"
        }
        base_prompt += f" that evokes {mood_descriptors.get(request.mood, 'balance')}"
    
    base_prompt += ", therapeutic, healing, digital art, high quality"
    
    if request.prompt:
        base_prompt += f", {request.prompt}"
    
    return base_prompt

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "serenity-ai-services"
    }

# Root endpoint
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "SerenityAI Services",
        "version": "1.0.0",
        "endpoints": {
            "music_generation": "/music/generate",
            "art_generation": "/art/generate",
            "health": "/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
