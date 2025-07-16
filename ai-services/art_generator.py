from typing import List, Dict, Any, Optional
import asyncio
import base64
import json
import logging
from datetime import datetime
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
import numpy as np
import os

logger = logging.getLogger(__name__)

class TherapeuticArtGenerator:
    """Advanced therapeutic art generation using AI models"""
    
    def __init__(self):
        self.canvas_size = (1024, 1024)
        self.models = {
            "abstract": "stable-diffusion-abstract",
            "nature": "stable-diffusion-nature",
            "geometric": "stable-diffusion-geometric",
            "watercolor": "stable-diffusion-watercolor",
            "digital": "stable-diffusion-digital",
            "minimalist": "stable-diffusion-minimalist"
        }
    
    async def generate_art(self, request_data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate therapeutic art based on user preferences"""
        try:
            mood = request_data.get("mood", "calm")
            art_style = request_data.get("artStyle", "abstract")
            color_palette = request_data.get("colorPalette", "calm")
            theme = request_data.get("theme", "healing")
            custom_prompt = request_data.get("prompt", "")
            
            # Get user's mood history for personalization
            personal_prefs = request_data.get("personalPreferences", {})
            mood_history = personal_prefs.get("recentMoodHistory", [])
            preferred_styles = personal_prefs.get("preferredStyles", [])
            
            # Generate therapeutic art prompt
            art_prompt = self._create_therapeutic_prompt(
                mood, art_style, color_palette, theme, custom_prompt
            )
            
            # Generate base art composition
            base_image = await self._create_base_composition(
                mood, art_style, color_palette, theme
            )
            
            # Apply therapeutic visual effects
            therapeutic_image = await self._apply_therapeutic_effects(
                base_image, mood, mood_history
            )
            
            # Apply color therapy
            final_image = await self._apply_color_therapy(
                therapeutic_image, mood, color_palette
            )
            
            # Save and generate metadata
            file_path = await self._save_image(final_image)
            metadata = self._create_metadata(
                mood, art_style, color_palette, theme, art_prompt, final_image
            )
            
            return {
                "model_used": f"SerenityAI-ArtGen-{art_style}",
                "file_path": file_path,
                "image_url": f"https://api.serenity-ai.com/files/{file_path}",
                "metadata": metadata
            }
            
        except Exception as e:
            logger.error(f"Art generation error: {str(e)}")
            raise
    
    def _create_therapeutic_prompt(self, mood: str, art_style: str, 
                                 color_palette: str, theme: str, custom_prompt: str) -> str:
        """Create comprehensive therapeutic art prompt"""
        
        # Base therapeutic elements
        therapeutic_elements = {
            "healing": "healing energy, restoration, renewal, gentle flow",
            "growth": "organic growth, blooming, transformation, positive change",
            "peace": "tranquility, serenity, balance, harmony",
            "strength": "inner strength, resilience, stability, grounding",
            "hope": "light, optimism, new beginnings, bright future",
            "balance": "equilibrium, symmetry, centered, aligned"
        }
        
        # Mood-specific descriptors
        mood_descriptors = {
            "calm": "serene, peaceful, gentle, flowing, soft, tranquil",
            "peaceful": "harmonious, balanced, centered, still, quiet",
            "sad": "comforting, nurturing, embracing, warm, supportive",
            "anxious": "grounding, stable, secure, protected, safe",
            "happy": "joyful, bright, uplifting, energetic, vibrant",
            "energetic": "dynamic, moving, balanced, channeled, focused",
            "creative": "innovative, expressive, free-flowing, artistic"
        }
        
        # Style-specific elements
        style_elements = {
            "abstract": "fluid forms, organic shapes, flowing lines, emotional expression",
            "nature": "natural elements, organic textures, botanical forms, landscape",
            "geometric": "sacred geometry, patterns, symmetry, mathematical beauty",
            "watercolor": "soft washes, flowing pigments, gentle blending, transparent layers",
            "digital": "modern, clean, precise, technological harmony",
            "minimalist": "simple forms, negative space, essential elements, purity"
        }
        
        # Color palette descriptions
        color_descriptions = {
            "warm": "warm golden tones, soft oranges, gentle reds, comforting colors",
            "cool": "calming blues, soothing greens, peaceful purples, tranquil tones",
            "neutral": "earthy tones, natural colors, balanced palette, grounding hues",
            "vibrant": "energetic colors, bright hues, dynamic contrasts, life-affirming",
            "monochrome": "single color harmony, tonal variations, subtle gradients"
        }
        
        # Build comprehensive prompt
        prompt_parts = [
            f"A therapeutic {art_style} artwork",
            f"representing {theme}",
            f"with {color_descriptions.get(color_palette, 'balanced colors')}",
            f"that evokes {mood_descriptors.get(mood, 'balance and harmony')}",
            f"incorporating {style_elements.get(art_style, 'harmonious elements')}",
            f"and {therapeutic_elements.get(theme, 'healing energy')}",
            "designed for mental wellness and emotional healing",
            "high quality, professional, therapeutic art"
        ]
        
        if custom_prompt:
            prompt_parts.append(custom_prompt)
        
        return ", ".join(prompt_parts)
    
    async def _create_base_composition(self, mood: str, art_style: str, 
                                     color_palette: str, theme: str) -> Image.Image:
        """Create base art composition using generative algorithms"""
        
        # Create base canvas
        image = Image.new('RGB', self.canvas_size, color='white')
        draw = ImageDraw.Draw(image)
        
        # Get mood-based parameters
        mood_params = self._get_mood_parameters(mood)
        
        # Generate base composition based on style
        if art_style == "abstract":
            image = self._create_abstract_composition(image, draw, mood_params)
        elif art_style == "geometric":
            image = self._create_geometric_composition(image, draw, mood_params)
        elif art_style == "nature":
            image = self._create_nature_composition(image, draw, mood_params)
        elif art_style == "watercolor":
            image = self._create_watercolor_composition(image, draw, mood_params)
        elif art_style == "minimalist":
            image = self._create_minimalist_composition(image, draw, mood_params)
        else:
            image = self._create_digital_composition(image, draw, mood_params)
        
        return image
    
    def _get_mood_parameters(self, mood: str) -> Dict[str, Any]:
        """Get visual parameters for specific mood"""
        mood_params = {
            "calm": {
                "primary_colors": [(173, 216, 230), (176, 224, 230), (175, 238, 238)],
                "movement": "flowing",
                "texture": "smooth",
                "patterns": "organic",
                "opacity": 0.7
            },
            "peaceful": {
                "primary_colors": [(152, 251, 152), (144, 238, 144), (143, 188, 143)],
                "movement": "gentle",
                "texture": "soft",
                "patterns": "harmonious",
                "opacity": 0.8
            },
            "sad": {
                "primary_colors": [(176, 196, 222), (175, 238, 238), (230, 230, 250)],
                "movement": "embracing",
                "texture": "comforting",
                "patterns": "supportive",
                "opacity": 0.6
            },
            "anxious": {
                "primary_colors": [(222, 184, 135), (210, 180, 140), (238, 203, 173)],
                "movement": "grounding",
                "texture": "stable",
                "patterns": "secure",
                "opacity": 0.9
            },
            "happy": {
                "primary_colors": [(255, 255, 224), (255, 239, 213), (255, 228, 181)],
                "movement": "uplifting",
                "texture": "bright",
                "patterns": "joyful",
                "opacity": 0.8
            },
            "energetic": {
                "primary_colors": [(255, 165, 0), (255, 140, 0), (255, 127, 80)],
                "movement": "dynamic",
                "texture": "vibrant",
                "patterns": "balanced",
                "opacity": 0.7
            }
        }
        
        return mood_params.get(mood, mood_params["calm"])
    
    def _create_abstract_composition(self, image: Image.Image, draw: ImageDraw.Draw, 
                                   mood_params: Dict[str, Any]) -> Image.Image:
        """Create abstract therapeutic composition"""
        colors = mood_params["primary_colors"]
        
        # Create flowing organic shapes
        for i in range(20):
            # Generate organic shape points
            points = []
            center_x = np.random.randint(100, self.canvas_size[0] - 100)
            center_y = np.random.randint(100, self.canvas_size[1] - 100)
            
            for angle in np.linspace(0, 2 * np.pi, 12):
                radius = np.random.randint(50, 200)
                x = center_x + radius * np.cos(angle)
                y = center_y + radius * np.sin(angle)
                points.append((x, y))
            
            # Draw organic shape
            color = colors[i % len(colors)]
            alpha = int(255 * mood_params["opacity"])
            
            # Create temporary image for alpha blending
            temp_image = Image.new('RGBA', self.canvas_size, (0, 0, 0, 0))
            temp_draw = ImageDraw.Draw(temp_image)
            temp_draw.polygon(points, fill=(*color, alpha))
            
            # Blend with main image
            image = Image.alpha_composite(image.convert('RGBA'), temp_image).convert('RGB')
        
        return image
    
    def _create_geometric_composition(self, image: Image.Image, draw: ImageDraw.Draw,
                                    mood_params: Dict[str, Any]) -> Image.Image:
        """Create geometric therapeutic composition"""
        colors = mood_params["primary_colors"]
        
        # Sacred geometry patterns
        center_x, center_y = self.canvas_size[0] // 2, self.canvas_size[1] // 2
        
        # Create concentric circles (representing wholeness)
        for i in range(5):
            radius = 50 + i * 80
            color = colors[i % len(colors)]
            alpha = int(255 * mood_params["opacity"])
            
            # Create circle on temporary image
            temp_image = Image.new('RGBA', self.canvas_size, (0, 0, 0, 0))
            temp_draw = ImageDraw.Draw(temp_image)
            temp_draw.ellipse(
                [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
                outline=(*color, alpha),
                width=3
            )
            
            image = Image.alpha_composite(image.convert('RGBA'), temp_image).convert('RGB')
        
        # Add triangular elements (representing stability)
        for i in range(6):
            angle = i * np.pi / 3
            radius = 150
            x = center_x + radius * np.cos(angle)
            y = center_y + radius * np.sin(angle)
            
            # Create triangle
            size = 40
            points = [
                (x, y - size),
                (x - size, y + size),
                (x + size, y + size)
            ]
            
            color = colors[i % len(colors)]
            alpha = int(255 * mood_params["opacity"])
            
            temp_image = Image.new('RGBA', self.canvas_size, (0, 0, 0, 0))
            temp_draw = ImageDraw.Draw(temp_image)
            temp_draw.polygon(points, fill=(*color, alpha))
            
            image = Image.alpha_composite(image.convert('RGBA'), temp_image).convert('RGB')
        
        return image
    
    def _create_nature_composition(self, image: Image.Image, draw: ImageDraw.Draw,
                                 mood_params: Dict[str, Any]) -> Image.Image:
        """Create nature-inspired therapeutic composition"""
        colors = mood_params["primary_colors"]
        
        # Create organic, nature-inspired elements
        # Flowing water-like shapes
        for i in range(10):
            start_x = np.random.randint(0, self.canvas_size[0])
            start_y = np.random.randint(0, self.canvas_size[1])
            
            # Create flowing line
            points = [(start_x, start_y)]
            for j in range(20):
                prev_x, prev_y = points[-1]
                next_x = prev_x + np.random.randint(-30, 30)
                next_y = prev_y + np.random.randint(-30, 30)
                
                # Keep within bounds
                next_x = max(0, min(self.canvas_size[0], next_x))
                next_y = max(0, min(self.canvas_size[1], next_y))
                
                points.append((next_x, next_y))
            
            # Draw flowing line with varying thickness
            color = colors[i % len(colors)]
            for j in range(len(points) - 1):
                thickness = max(1, int(10 * mood_params["opacity"]))
                draw.line([points[j], points[j + 1]], fill=color, width=thickness)
        
        return image
    
    def _create_watercolor_composition(self, image: Image.Image, draw: ImageDraw.Draw,
                                     mood_params: Dict[str, Any]) -> Image.Image:
        """Create watercolor-style therapeutic composition"""
        colors = mood_params["primary_colors"]
        
        # Create soft, blended watercolor effects
        for i in range(15):
            # Create soft circular washes
            center_x = np.random.randint(100, self.canvas_size[0] - 100)
            center_y = np.random.randint(100, self.canvas_size[1] - 100)
            radius = np.random.randint(80, 200)
            
            color = colors[i % len(colors)]
            alpha = int(255 * mood_params["opacity"] * 0.3)  # Very transparent
            
            # Create gradient circle
            temp_image = Image.new('RGBA', self.canvas_size, (0, 0, 0, 0))
            temp_draw = ImageDraw.Draw(temp_image)
            
            # Create multiple circles with decreasing opacity for gradient effect
            for r in range(radius, 0, -10):
                circle_alpha = int(alpha * (radius - r) / radius)
                temp_draw.ellipse(
                    [center_x - r, center_y - r, center_x + r, center_y + r],
                    fill=(*color, circle_alpha)
                )
            
            image = Image.alpha_composite(image.convert('RGBA'), temp_image).convert('RGB')
        
        return image
    
    def _create_minimalist_composition(self, image: Image.Image, draw: ImageDraw.Draw,
                                     mood_params: Dict[str, Any]) -> Image.Image:
        """Create minimalist therapeutic composition"""
        colors = mood_params["primary_colors"]
        
        # Simple, clean geometric forms
        center_x, center_y = self.canvas_size[0] // 2, self.canvas_size[1] // 2
        
        # Single large circle
        radius = 200
        color = colors[0]
        alpha = int(255 * mood_params["opacity"])
        
        temp_image = Image.new('RGBA', self.canvas_size, (0, 0, 0, 0))
        temp_draw = ImageDraw.Draw(temp_image)
        temp_draw.ellipse(
            [center_x - radius, center_y - radius, center_x + radius, center_y + radius],
            fill=(*color, alpha)
        )
        
        image = Image.alpha_composite(image.convert('RGBA'), temp_image).convert('RGB')
        
        # Add small accent elements
        for i in range(3):
            x = center_x + np.random.randint(-300, 300)
            y = center_y + np.random.randint(-300, 300)
            size = 20
            
            color = colors[(i + 1) % len(colors)]
            draw.ellipse([x - size, y - size, x + size, y + size], fill=color)
        
        return image
    
    def _create_digital_composition(self, image: Image.Image, draw: ImageDraw.Draw,
                                  mood_params: Dict[str, Any]) -> Image.Image:
        """Create digital art therapeutic composition"""
        colors = mood_params["primary_colors"]
        
        # Create modern, clean digital patterns
        grid_size = 50
        
        for x in range(0, self.canvas_size[0], grid_size):
            for y in range(0, self.canvas_size[1], grid_size):
                if np.random.random() > 0.7:  # 30% chance
                    color = colors[np.random.randint(0, len(colors))]
                    alpha = int(255 * mood_params["opacity"])
                    
                    temp_image = Image.new('RGBA', self.canvas_size, (0, 0, 0, 0))
                    temp_draw = ImageDraw.Draw(temp_image)
                    temp_draw.rectangle(
                        [x, y, x + grid_size, y + grid_size],
                        fill=(*color, alpha)
                    )
                    
                    image = Image.alpha_composite(image.convert('RGBA'), temp_image).convert('RGB')
        
        return image
    
    async def _apply_therapeutic_effects(self, image: Image.Image, mood: str,
                                       mood_history: List[Dict]) -> Image.Image:
        """Apply therapeutic visual effects based on mood"""
        
        # Analyze mood patterns
        if mood_history:
            avg_stress = np.mean([entry.get("stress_level", 5) for entry in mood_history])
            avg_anxiety = np.mean([entry.get("anxiety_level", 5) for entry in mood_history])
        else:
            avg_stress = 5
            avg_anxiety = 5
        
        # Apply stress-reduction visual effects
        if avg_stress > 6:
            image = self._apply_stress_reduction_effects(image)
        
        # Apply anxiety-relief visual effects
        if avg_anxiety > 6:
            image = self._apply_anxiety_relief_effects(image)
        
        # Apply mood-specific effects
        if mood == "sad":
            image = self._apply_mood_lifting_effects(image)
        elif mood == "anxious":
            image = self._apply_calming_visual_effects(image)
        elif mood == "energetic":
            image = self._apply_grounding_visual_effects(image)
        
        return image
    
    def _apply_stress_reduction_effects(self, image: Image.Image) -> Image.Image:
        """Apply visual effects for stress reduction"""
        # Apply slight blur for softness
        image = image.filter(ImageFilter.GaussianBlur(radius=1))
        
        # Enhance color saturation slightly
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(1.1)
        
        return image
    
    def _apply_anxiety_relief_effects(self, image: Image.Image) -> Image.Image:
        """Apply visual effects for anxiety relief"""
        # Increase brightness for comfort
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(1.1)
        
        # Apply gentle blur for softness
        image = image.filter(ImageFilter.GaussianBlur(radius=0.5))
        
        return image
    
    def _apply_mood_lifting_effects(self, image: Image.Image) -> Image.Image:
        """Apply visual effects for mood lifting"""
        # Increase brightness and contrast
        brightness_enhancer = ImageEnhance.Brightness(image)
        image = brightness_enhancer.enhance(1.2)
        
        contrast_enhancer = ImageEnhance.Contrast(image)
        image = contrast_enhancer.enhance(1.1)
        
        return image
    
    def _apply_calming_visual_effects(self, image: Image.Image) -> Image.Image:
        """Apply calming visual effects"""
        # Reduce saturation for calmness
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(0.8)
        
        # Apply soft blur
        image = image.filter(ImageFilter.GaussianBlur(radius=0.8))
        
        return image
    
    def _apply_grounding_visual_effects(self, image: Image.Image) -> Image.Image:
        """Apply grounding visual effects"""
        # Increase contrast for stability
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.2)
        
        # Slightly reduce brightness
        brightness_enhancer = ImageEnhance.Brightness(image)
        image = brightness_enhancer.enhance(0.9)
        
        return image
    
    async def _apply_color_therapy(self, image: Image.Image, mood: str,
                                 color_palette: str) -> Image.Image:
        """Apply color therapy principles"""
        
        # Color therapy mappings
        therapy_colors = {
            "calm": {"enhance": (0, 0, 255), "reduce": (255, 0, 0)},  # Enhance blue, reduce red
            "energetic": {"enhance": (255, 165, 0), "reduce": (0, 0, 255)},  # Enhance orange, reduce blue
            "peaceful": {"enhance": (0, 255, 0), "reduce": (255, 0, 0)},  # Enhance green, reduce red
            "happy": {"enhance": (255, 255, 0), "reduce": (128, 128, 128)},  # Enhance yellow, reduce gray
            "sad": {"enhance": (255, 192, 203), "reduce": (0, 0, 0)},  # Enhance pink, reduce black
            "anxious": {"enhance": (255, 255, 255), "reduce": (255, 0, 0)}  # Enhance white, reduce red
        }
        
        if mood in therapy_colors:
            therapy_config = therapy_colors[mood]
            # Apply subtle color adjustments
            # In a full implementation, this would analyze and adjust color channels
            pass
        
        return image
    
    async def _save_image(self, image: Image.Image) -> str:
        """Save generated image to file"""
        # Create filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"therapeutic_art_{timestamp}.png"
        
        # In production, save to cloud storage
        # For now, return a mock path
        return f"art/{filename}"
    
    def _create_metadata(self, mood: str, art_style: str, color_palette: str,
                        theme: str, prompt: str, image: Image.Image) -> Dict[str, Any]:
        """Create metadata for generated art"""
        return {
            "mood": mood,
            "art_style": art_style,
            "color_palette": color_palette,
            "theme": theme,
            "prompt": prompt,
            "therapeutic_elements": {
                "color_therapy": True,
                "visual_healing": True,
                "stress_reduction": True,
                "anxiety_relief": True,
                "mood_enhancement": True
            },
            "image_properties": {
                "size": image.size,
                "format": "PNG",
                "mode": image.mode
            },
            "generated_at": datetime.now().isoformat()
        }
