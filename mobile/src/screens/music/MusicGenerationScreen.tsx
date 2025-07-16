import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
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
import { generateMusic } from '../../store/slices/musicSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

interface MoodOption {
  id: string;
  label: string;
  color: string;
  icon: string;
}

interface GenreOption {
  id: string;
  label: string;
  description: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { id: 'calm', label: 'Calm', color: '#4A90E2', icon: 'leaf' },
  { id: 'energetic', label: 'Energetic', color: '#F5A623', icon: 'lightning-bolt' },
  { id: 'meditative', label: 'Meditative', color: '#9013FE', icon: 'meditation' },
  { id: 'uplifting', label: 'Uplifting', color: '#50E3C2', icon: 'arrow-up' },
  { id: 'melancholic', label: 'Melancholic', color: '#BD10E0', icon: 'weather-rainy' },
  { id: 'peaceful', label: 'Peaceful', color: '#7ED321', icon: 'peace' },
];

const GENRE_OPTIONS: GenreOption[] = [
  { id: 'ambient', label: 'Ambient', description: 'Ethereal soundscapes for relaxation' },
  { id: 'classical', label: 'Classical', description: 'Orchestral compositions for focus' },
  { id: 'nature', label: 'Nature Sounds', description: 'Natural environments for grounding' },
  { id: 'jazz', label: 'Jazz', description: 'Smooth improvisation for creativity' },
  { id: 'electronic', label: 'Electronic', description: 'Synthesized beats for energy' },
  { id: 'acoustic', label: 'Acoustic', description: 'Organic instruments for warmth' },
];

const DURATION_OPTIONS = [
  { value: 300, label: '5 minutes' },
  { value: 600, label: '10 minutes' },
  { value: 900, label: '15 minutes' },
  { value: 1200, label: '20 minutes' },
  { value: 1800, label: '30 minutes' },
];

const MusicGenerationScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { isGenerating, currentTrack, error } = useSelector(
    (state: RootState) => state.music
  );

  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(600);

  const handleGenerate = async () => {
    if (!selectedMood || !selectedGenre) {
      Alert.alert('Missing Selection', 'Please select both mood and genre');
      return;
    }

    try {
      await dispatch(generateMusic({
        mood: selectedMood,
        genre: selectedGenre,
        duration: selectedDuration,
      })).unwrap();
    } catch (error) {
      Alert.alert('Generation Failed', 'Unable to generate music. Please try again.');
    }
  };

  const renderMoodSelection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          How are you feeling?
        </Text>
        <Text variant="bodyMedium" style={styles.sectionDescription}>
          Select your current mood to personalize your music
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

  const renderGenreSelection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Choose your style
        </Text>
        <Text variant="bodyMedium" style={styles.sectionDescription}>
          Select a musical genre that resonates with you
        </Text>
        <View style={styles.genreList}>
          {GENRE_OPTIONS.map((genre) => (
            <Surface
              key={genre.id}
              style={[
                styles.genreOption,
                selectedGenre === genre.id && {
                  backgroundColor: theme.colors.primary + '20',
                  borderColor: theme.colors.primary,
                  borderWidth: 2,
                },
              ]}
              onTouchEnd={() => setSelectedGenre(genre.id)}
            >
              <Text variant="titleSmall" style={styles.genreLabel}>
                {genre.label}
              </Text>
              <Text variant="bodySmall" style={styles.genreDescription}>
                {genre.description}
              </Text>
            </Surface>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderDurationSelection = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Duration
        </Text>
        <Text variant="bodyMedium" style={styles.sectionDescription}>
          How long would you like your music to be?
        </Text>
        <View style={styles.durationChips}>
          {DURATION_OPTIONS.map((duration) => (
            <Chip
              key={duration.value}
              selected={selectedDuration === duration.value}
              onPress={() => setSelectedDuration(duration.value)}
              style={styles.durationChip}
            >
              {duration.label}
            </Chip>
          ))}
        </View>
      </Card.Content>
    </Card>
  );

  const renderCurrentTrack = () => {
    if (!currentTrack) return null;

    return (
      <Card style={styles.currentTrackCard}>
        <Card.Content>
          <View style={styles.trackInfo}>
            <Avatar.Icon
              size={60}
              icon="music"
              style={{ backgroundColor: theme.colors.primary }}
            />
            <View style={styles.trackDetails}>
              <Text variant="titleMedium">{currentTrack.title}</Text>
              <Text variant="bodyMedium" style={styles.trackMetadata}>
                {currentTrack.genre} • {currentTrack.mood}
              </Text>
              <Text variant="bodySmall" style={styles.trackDuration}>
                {Math.floor(currentTrack.duration / 60)}m {currentTrack.duration % 60}s
              </Text>
            </View>
            <IconButton
              icon="play"
              size={24}
              onPress={() => {
                // TODO: Implement play functionality
                Alert.alert('Play', 'Music playback will be implemented');
              }}
            />
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
            Create Your Music
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Let AI compose therapeutic music tailored to your mood
          </Text>
        </View>

        {renderCurrentTrack()}
        {renderMoodSelection()}
        {renderGenreSelection()}
        {renderDurationSelection()}

        {isGenerating && (
          <Card style={styles.progressCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.progressTitle}>
                Generating your music...
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
          disabled={!selectedMood || !selectedGenre || isGenerating}
          style={styles.generateButton}
          contentStyle={styles.generateButtonContent}
        >
          {isGenerating ? 'Generating...' : 'Generate Music'}
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
  genreList: {
    gap: 12,
  },
  genreOption: {
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  genreLabel: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  genreDescription: {
    opacity: 0.8,
  },
  durationChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationChip: {
    marginBottom: 8,
  },
  currentTrackCard: {
    margin: 16,
    elevation: 4,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  trackDetails: {
    flex: 1,
  },
  trackMetadata: {
    opacity: 0.8,
    marginTop: 4,
  },
  trackDuration: {
    opacity: 0.6,
    marginTop: 2,
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

export default MusicGenerationScreen;
