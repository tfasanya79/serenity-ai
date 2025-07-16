import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Chip,
  ProgressBar,
  Surface,
  IconButton,
  Avatar,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { generateArt } from '../../store/slices/artSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

interface MoodOption {
  id: string;
  label: string;
  color: string;
  icon: string;
}

interface StyleOption {
  id: string;
  label: string;
  description: string;
  preview: string;
}

interface ColorOption {
  id: string;
  label: string;
  colors: string[];
}

const MOOD_OPTIONS: MoodOption[] = [
  { id: 'serene', label: 'Serene', color: '#4A90E2', icon: 'water' },
  { id: 'vibrant', label: 'Vibrant', color: '#F5A623', icon: 'fire' },
  { id: 'mystical', label: 'Mystical', color: '#9013FE', icon: 'eye' },
  { id: 'grounded', label: 'Grounded', color: '#7ED321', icon: 'earth' },
  { id: 'ethereal', label: 'Ethereal', color: '#50E3C2', icon: 'cloud' },
  { id: 'dramatic', label: 'Dramatic', color: '#BD10E0', icon: 'lightning-bolt' },
];

const STYLE_OPTIONS: StyleOption[] = [
  { id: 'abstract', label: 'Abstract', description: 'Flowing forms and colors', preview: '🎨' },
  { id: 'impressionist', label: 'Impressionist', description: 'Soft brushstrokes and light', preview: '🌅' },
  { id: 'minimalist', label: 'Minimalist', description: 'Clean lines and simplicity', preview: '⚪' },
  { id: 'surreal', label: 'Surreal', description: 'Dreamlike and imaginative', preview: '🌙' },
  { id: 'nature', label: 'Nature', description: 'Organic forms and landscapes', preview: '🌿' },
  { id: 'geometric', label: 'Geometric', description: 'Patterns and symmetry', preview: '🔷' },
];

const COLOR_OPTIONS: ColorOption[] = [
  { id: 'cool', label: 'Cool Tones', colors: ['#4A90E2', '#50E3C2', '#9013FE'] },
  { id: 'warm', label: 'Warm Tones', colors: ['#F5A623', '#E94B3C', '#BD10E0'] },
  { id: 'earth', label: 'Earth Tones', colors: ['#7ED321', '#B8860B', '#8B4513'] },
  { id: 'monochrome', label: 'Monochrome', colors: ['#000000', '#808080', '#FFFFFF'] },
  { id: 'pastel', label: 'Pastel', colors: ['#FFB6C1', '#E0E6FF', '#F0FFF0'] },
  { id: 'vibrant', label: 'Vibrant', colors: ['#FF1493', '#00CED1', '#32CD32'] },
];

const ArtGenerationScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { isGenerating, currentArt, error } = useSelector(
    (state: RootState) => state.art
  );

  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedColors, setSelectedColors] = useState<string>('');

  const handleGenerate = async () => {
    if (!selectedMood || !selectedStyle || !selectedColors) {
      Alert.alert('Missing Selection', 'Please select mood, style, and colors');
      return;
    }

    const colorPalette = COLOR_OPTIONS.find(c => c.id === selectedColors)?.colors || [];

    try {
      await dispatch(generateArt({
        mood: selectedMood,
        style: selectedStyle,
        colors: colorPalette,
      })).unwrap();
    } catch (error) {
      Alert.alert('Generation Failed', 'Unable to generate art. Please try again.');
    }
  };

  const renderMoodSelection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Express your mood
        </Text>
        <Text variant="bodyMedium" style={styles.sectionDescription}>
          How would you like your art to feel?
        </Text>
        <View style={styles.moodGrid}>
          {MOOD_OPTIONS.map((mood) => (
            <Surface
              key={mood.id}
              style={[
                styles.moodOption,
                selectedMood === mood.id && {
                  backgroundColor: mood.color + '20',
                  borderColor: mood.color,
                  borderWidth: 2,
                },
              ]}
              onTouchEnd={() => setSelectedMood(mood.id)}
            >
              <Avatar.Icon
                size={40}
                icon={mood.icon}
                style={{ backgroundColor: mood.color }}
              />
              <Text variant="bodySmall" style={styles.moodLabel}>
                {mood.label}
              </Text>
            </Surface>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderStyleSelection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Choose your style
        </Text>
        <Text variant="bodyMedium" style={styles.sectionDescription}>
          Select an artistic style that resonates with you
        </Text>
        <View style={styles.styleGrid}>
          {STYLE_OPTIONS.map((style) => (
            <Surface
              key={style.id}
              style={[
                styles.styleOption,
                selectedStyle === style.id && {
                  backgroundColor: theme.colors.primary + '20',
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                },
              ]}
              onTouchEnd={() => setSelectedStyle(style.id)}
            >
              <Text style={styles.stylePreview}>{style.preview}</Text>
              <Text variant="titleSmall" style={styles.styleLabel}>
                {style.label}
              </Text>
              <Text variant="bodySmall" style={styles.styleDescription}>
                {style.description}
              </Text>
            </Surface>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderColorSelection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Color palette
        </Text>
        <Text variant="bodyMedium" style={styles.sectionDescription}>
          Choose colors that speak to your soul
        </Text>
        <View style={styles.colorList}>
          {COLOR_OPTIONS.map((colorOption) => (
            <Surface
              key={colorOption.id}
              style={[
                styles.colorOption,
                selectedColors === colorOption.id && {
                  backgroundColor: theme.colors.primary + '20',
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                },
              ]}
              onTouchEnd={() => setSelectedColors(colorOption.id)}
            >
              <View style={styles.colorPreview}>
                {colorOption.colors.map((color, index) => (
                  <View
                    key={index}
                    style={[
                      styles.colorSwatch,
                      { backgroundColor: color },
                    ]}
                  />
                ))}
              </View>
              <Text variant="titleSmall" style={styles.colorLabel}>
                {colorOption.label}
              </Text>
            </Surface>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderCurrentArt = () => {
    if (!currentArt) return null;

    return (
      <Card style={styles.currentArtCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.artTitle}>
            {currentArt.title}
          </Text>
          <View style={styles.artContainer}>
            <Image
              source={{ uri: currentArt.imageUrl }}
              style={styles.artImage}
              resizeMode="cover"
            />
            <View style={styles.artOverlay}>
              <IconButton
                icon="download"
                size={24}
                iconColor="white"
                onPress={() => {
                  // TODO: Implement download functionality
                  Alert.alert('Download', 'Art download will be implemented');
                }}
              />
              <IconButton
                icon="share"
                size={24}
                iconColor="white"
                onPress={() => {
                  // TODO: Implement share functionality
                  Alert.alert('Share', 'Art sharing will be implemented');
                }}
              />
            </View>
          </View>
          <View style={styles.artInfo}>
            <Text variant="bodyMedium" style={styles.artMetadata}>
              {currentArt.style} • {currentArt.mood}
            </Text>
            <View style={styles.artColors}>
              {currentArt.colors.map((color, index) => (
                <View
                  key={index}
                  style={[
                    styles.artColorSwatch,
                    { backgroundColor: color },
                  ]}
                />
              ))}
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.background]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Create Your Art
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Let AI create therapeutic art that reflects your inner world
          </Text>
        </View>

        {renderCurrentArt()}
        {renderMoodSelection()}
        {renderStyleSelection()}
        {renderColorSelection()}

        {isGenerating && (
          <Card style={styles.progressCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.progressTitle}>
                Creating your art...
              </Text>
              <ProgressBar
                indeterminate
                style={styles.progressBar}
                color={theme.colors.primary}
              />
              <Text variant="bodySmall" style={styles.progressText}>
                This may take a few moments
              </Text>
            </Card.Content>
          </Card>
        )}

        <Button
          mode="contained"
          onPress={handleGenerate}
          disabled={!selectedMood || !selectedStyle || !selectedColors || isGenerating}
          style={styles.generateButton}
          contentStyle={styles.generateButtonContent}
        >
          {isGenerating ? 'Creating...' : 'Generate Art'}
        </Button>

        {error && (
          <Card style={[styles.errorCard, { backgroundColor: theme.colors.errorContainer }]}>
            <Card.Content>
              <Text variant="bodyMedium" style={{ color: theme.colors.onErrorContainer }}>
                {error}
              </Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  sectionCard: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    opacity: 0.8,
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: (width - 64) / 3,
    aspectRatio: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    elevation: 1,
  },
  moodLabel: {
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  styleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  styleOption: {
    width: (width - 64) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 1,
  },
  stylePreview: {
    fontSize: 32,
    marginBottom: 8,
  },
  styleLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  styleDescription: {
    opacity: 0.8,
    textAlign: 'center',
  },
  colorList: {
    gap: 12,
  },
  colorOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  colorPreview: {
    flexDirection: 'row',
    marginRight: 12,
  },
  colorSwatch: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  colorLabel: {
    fontWeight: 'bold',
  },
  currentArtCard: {
    margin: 16,
    elevation: 4,
  },
  artTitle: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  artContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  artImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  artOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
  },
  artInfo: {
    alignItems: 'center',
  },
  artMetadata: {
    opacity: 0.8,
    marginBottom: 8,
  },
  artColors: {
    flexDirection: 'row',
    gap: 4,
  },
  artColorSwatch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  progressCard: {
    margin: 16,
    elevation: 2,
  },
  progressTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressText: {
    textAlign: 'center',
    opacity: 0.8,
  },
  generateButton: {
    margin: 16,
    marginTop: 24,
  },
  generateButtonContent: {
    paddingVertical: 8,
  },
  errorCard: {
    margin: 16,
    elevation: 2,
  },
});

export default ArtGenerationScreen;
