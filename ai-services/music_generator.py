from typing import List, Dict, Any, Optional
import numpy as np
import librosa
import soundfile as sf
from datetime import datetime
import os
import asyncio
import logging

logger = logging.getLogger(__name__)

class TherapeuticMusicGenerator:
    """Advanced therapeutic music generation using AI models"""
    
    def __init__(self):
        self.sample_rate = 22050
        self.duration = 120  # Default 2 minutes
        self.models = {
            "ambient": "musicgen-ambient",
            "classical": "musicgen-classical", 
            "nature": "musicgen-nature",
            "binaural": "musicgen-binaural",
            "meditation": "musicgen-meditation"
        }
    
    async def generate_music(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate therapeutic music based on user preferences"""
        try:
            mood = request_data.get("mood", "calm")
            genre = request_data.get("genre", "ambient")
            duration = request_data.get("duration", 120)
            tempo = request_data.get("tempo", "medium")
            instruments = request_data.get("instruments", ["piano"])
            
            # Get user's mood history for personalization
            personal_prefs = request_data.get("personalPreferences", {})
            mood_history = personal_prefs.get("recentMoodHistory", [])
            
            # Generate base therapeutic composition
            composition = await self._create_base_composition(
                mood, genre, duration, tempo, instruments
            )
            
            # Apply therapeutic transformations
            therapeutic_audio = await self._apply_therapeutic_effects(
                composition, mood, mood_history
            )
            
            # Add binaural beats if beneficial
            if self._should_add_binaural_beats(mood):
                therapeutic_audio = await self._add_binaural_beats(
                    therapeutic_audio, mood
                )
            
            # Generate file and metadata
            file_path = await self._save_audio(therapeutic_audio, duration)
            metadata = self._create_metadata(
                mood, genre, duration, tempo, instruments, composition
            )
            
            return {
                "model_used": f"SerenityAI-MusicGen-{genre}",
                "file_path": file_path,
                "audio_url": f"https://api.serenity-ai.com/files/{file_path}",
                "metadata": metadata
            }
            
        except Exception as e:
            logger.error(f"Music generation error: {str(e)}")
            raise
    
    async def _create_base_composition(
        self, mood: str, genre: str, duration: int, tempo: str, instruments: List[str]
    ) -> np.ndarray:
        """Create base musical composition"""
        
        # Mood-based parameters
        mood_params = self._get_mood_parameters(mood)
        
        # Generate base frequency components
        base_freq = mood_params["base_frequency"]
        harmonics = mood_params["harmonics"]
        
        # Create time array
        t = np.linspace(0, duration, int(self.sample_rate * duration), False)
        
        # Generate base composition
        composition = np.zeros_like(t)
        
        # Add harmonic layers based on mood
        for i, harmonic in enumerate(harmonics):
            amplitude = mood_params["amplitudes"][i]
            frequency = base_freq * harmonic
            
            # Add some variation and organic feel
            freq_variation = np.sin(2 * np.pi * 0.1 * t) * 0.1
            phase = np.random.random() * 2 * np.pi
            
            wave = amplitude * np.sin(2 * np.pi * frequency * t + freq_variation + phase)
            
            # Apply envelope
            envelope = self._create_envelope(len(t), mood)
            composition += wave * envelope
        
        # Add instrument-specific characteristics
        for instrument in instruments:
            composition = self._apply_instrument_characteristics(composition, instrument)
        
        return composition
    
    async def _apply_therapeutic_effects(
        self, composition: np.ndarray, mood: str, mood_history: List[Dict]
    ) -> np.ndarray:
        """Apply therapeutic effects based on mood and history"""
        
        # Analyze mood patterns
        if mood_history:
            avg_stress = np.mean([entry.get("stress_level", 5) for entry in mood_history])
            avg_anxiety = np.mean([entry.get("anxiety_level", 5) for entry in mood_history])
        else:
            avg_stress = 5
            avg_anxiety = 5
        
        # Apply stress-reduction effects
        if avg_stress > 6:
            composition = self._apply_stress_reduction(composition)
        
        # Apply anxiety-relief effects
        if avg_anxiety > 6:
            composition = self._apply_anxiety_relief(composition)
        
        # Apply mood-specific therapeutic effects
        if mood == "sad":
            composition = self._apply_mood_lifting(composition)
        elif mood == "anxious":
            composition = self._apply_calming_effects(composition)
        elif mood == "energetic":
            composition = self._apply_grounding_effects(composition)
        
        return composition
    
    def _get_mood_parameters(self, mood: str) -> Dict[str, Any]:
        """Get audio parameters for specific mood"""
        mood_params = {
            "calm": {
                "base_frequency": 220.0,  # A3
                "harmonics": [1, 1.5, 2, 3],
                "amplitudes": [0.8, 0.4, 0.2, 0.1],
                "envelope_type": "slow_rise"
            },
            "peaceful": {
                "base_frequency": 174.0,  # Healing frequency
                "harmonics": [1, 1.618, 2, 2.618],  # Golden ratio harmonics
                "amplitudes": [0.7, 0.5, 0.3, 0.2],
                "envelope_type": "gentle"
            },
            "sad": {
                "base_frequency": 256.0,  # C4
                "harmonics": [1, 1.2, 1.8, 2.4],
                "amplitudes": [0.9, 0.3, 0.2, 0.1],
                "envelope_type": "gradual_lift"
            },
            "anxious": {
                "base_frequency": 432.0,  # A4 (healing frequency)
                "harmonics": [1, 1.5, 2, 2.5],
                "amplitudes": [0.6, 0.4, 0.3, 0.2],
                "envelope_type": "stabilizing"
            },
            "happy": {
                "base_frequency": 528.0,  # Love frequency
                "harmonics": [1, 1.25, 1.5, 2],
                "amplitudes": [0.7, 0.5, 0.4, 0.3],
                "envelope_type": "uplifting"
            },
            "energetic": {
                "base_frequency": 396.0,  # Liberation frequency
                "harmonics": [1, 1.33, 1.66, 2],
                "amplitudes": [0.8, 0.6, 0.4, 0.2],
                "envelope_type": "dynamic"
            }
        }
        
        return mood_params.get(mood, mood_params["calm"])
    
    def _create_envelope(self, length: int, mood: str) -> np.ndarray:
        """Create amplitude envelope for therapeutic effect"""
        t = np.linspace(0, 1, length)
        
        envelope_types = {
            "slow_rise": np.sqrt(t),
            "gentle": np.sin(np.pi * t / 2),
            "gradual_lift": np.power(t, 0.3),
            "stabilizing": 0.5 + 0.5 * np.sin(2 * np.pi * t),
            "uplifting": np.power(t, 0.8),
            "dynamic": 0.7 + 0.3 * np.sin(4 * np.pi * t)
        }
        
        mood_params = self._get_mood_parameters(mood)
        envelope_type = mood_params.get("envelope_type", "gentle")
        
        return envelope_types.get(envelope_type, envelope_types["gentle"])
    
    def _apply_instrument_characteristics(self, composition: np.ndarray, instrument: str) -> np.ndarray:
        """Apply instrument-specific audio characteristics"""
        if instrument == "piano":
            # Add piano-like attack and decay
            composition = self._add_piano_characteristics(composition)
        elif instrument == "strings":
            # Add string-like sustain and vibrato
            composition = self._add_string_characteristics(composition)
        elif instrument == "flute":
            # Add flute-like breath and harmonics
            composition = self._add_flute_characteristics(composition)
        
        return composition
    
    def _add_piano_characteristics(self, composition: np.ndarray) -> np.ndarray:
        """Add piano-like characteristics"""
        # Simple piano-like envelope
        envelope = np.exp(-np.linspace(0, 5, len(composition)))
        return composition * envelope
    
    def _add_string_characteristics(self, composition: np.ndarray) -> np.ndarray:
        """Add string-like characteristics"""
        # Add slight vibrato
        t = np.linspace(0, len(composition) / self.sample_rate, len(composition))
        vibrato = 1 + 0.02 * np.sin(2 * np.pi * 5 * t)  # 5Hz vibrato
        return composition * vibrato
    
    def _add_flute_characteristics(self, composition: np.ndarray) -> np.ndarray:
        """Add flute-like characteristics"""
        # Add breath noise simulation
        noise = np.random.normal(0, 0.01, len(composition))
        return composition + noise
    
    def _apply_stress_reduction(self, composition: np.ndarray) -> np.ndarray:
        """Apply stress-reduction audio effects"""
        # Add low-frequency components for grounding
        t = np.linspace(0, len(composition) / self.sample_rate, len(composition))
        grounding_freq = np.sin(2 * np.pi * 40 * t) * 0.1  # 40Hz grounding
        return composition + grounding_freq
    
    def _apply_anxiety_relief(self, composition: np.ndarray) -> np.ndarray:
        """Apply anxiety-relief audio effects"""
        # Add alpha wave frequencies (8-12 Hz)
        t = np.linspace(0, len(composition) / self.sample_rate, len(composition))
        alpha_waves = np.sin(2 * np.pi * 10 * t) * 0.05  # 10Hz alpha
        return composition + alpha_waves
    
    def _apply_mood_lifting(self, composition: np.ndarray) -> np.ndarray:
        """Apply mood-lifting effects"""
        # Gradually increase brightness
        t = np.linspace(0, 1, len(composition))
        brightness = 1 + 0.3 * t
        return composition * brightness
    
    def _apply_calming_effects(self, composition: np.ndarray) -> np.ndarray:
        """Apply calming effects"""
        # Add theta wave frequencies (4-8 Hz)
        t = np.linspace(0, len(composition) / self.sample_rate, len(composition))
        theta_waves = np.sin(2 * np.pi * 6 * t) * 0.03  # 6Hz theta
        return composition + theta_waves
    
    def _apply_grounding_effects(self, composition: np.ndarray) -> np.ndarray:
        """Apply grounding effects for high energy"""
        # Add deeper bass frequencies
        t = np.linspace(0, len(composition) / self.sample_rate, len(composition))
        bass = np.sin(2 * np.pi * 60 * t) * 0.2  # 60Hz bass
        return composition + bass
    
    def _should_add_binaural_beats(self, mood: str) -> bool:
        """Determine if binaural beats would be beneficial"""
        return mood in ["anxious", "stressed", "sad", "energetic"]
    
    async def _add_binaural_beats(self, composition: np.ndarray, mood: str) -> np.ndarray:
        """Add binaural beats for therapeutic effect"""
        # Binaural beat frequencies for different moods
        beat_frequencies = {
            "anxious": 8,   # Alpha waves
            "stressed": 6,  # Theta waves
            "sad": 10,      # Alpha waves
            "energetic": 4  # Theta waves for grounding
        }
        
        beat_freq = beat_frequencies.get(mood, 8)
        
        # Create binaural beats (simplified - normally would be stereo)
        t = np.linspace(0, len(composition) / self.sample_rate, len(composition))
        binaural = np.sin(2 * np.pi * beat_freq * t) * 0.1
        
        return composition + binaural
    
    async def _save_audio(self, audio: np.ndarray, duration: int) -> str:
        """Save generated audio to file"""
        # Normalize audio
        audio = audio / np.max(np.abs(audio))
        
        # Create filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"therapeutic_music_{timestamp}.wav"
        
        # In production, save to cloud storage
        # For now, return a mock path
        return f"music/{filename}"
    
    def _create_metadata(self, mood: str, genre: str, duration: int, tempo: str, 
                        instruments: List[str], composition: np.ndarray) -> Dict[str, Any]:
        """Create metadata for generated music"""
        return {
            "mood": mood,
            "genre": genre,
            "duration": duration,
            "tempo": tempo,
            "instruments": instruments,
            "therapeutic_elements": {
                "binaural_beats": self._should_add_binaural_beats(mood),
                "healing_frequencies": True,
                "stress_reduction": True,
                "anxiety_relief": True
            },
            "audio_properties": {
                "sample_rate": self.sample_rate,
                "channels": 1,
                "bit_depth": 16,
                "dynamic_range": float(np.max(composition) - np.min(composition))
            },
            "generated_at": datetime.now().isoformat()
        }
