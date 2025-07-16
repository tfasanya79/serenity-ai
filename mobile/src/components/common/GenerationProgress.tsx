import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Text,
  ProgressBar,
  Card,
  Avatar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface GenerationProgressProps {
  type: 'music' | 'art';
  progress: number;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  message?: string;
  estimatedTime?: number;
}

const GenerationProgress: React.FC<GenerationProgressProps> = ({
  type,
  progress,
  status,
  message,
  estimatedTime,
}) => {
  const theme = useTheme();
  const [pulseAnimation] = React.useState(new Animated.Value(1));

  React.useEffect(() => {
    if (status === 'processing') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 0.8,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [status, pulseAnimation]);

  const getStatusColor = () => {
    switch (status) {
      case 'queued':
        return theme.colors.outline;
      case 'processing':
        return theme.colors.primary;
      case 'completed':
        return theme.colors.primary;
      case 'failed':
        return theme.colors.error;
      default:
        return theme.colors.outline;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'queued':
        return 'clock-outline';
      case 'processing':
        return type === 'music' ? 'music' : 'palette';
      case 'completed':
        return 'check-circle';
      case 'failed':
        return 'alert-circle';
      default:
        return 'clock-outline';
    }
  };

  const getStatusMessage = () => {
    if (message) return message;
    
    switch (status) {
      case 'queued':
        return 'Queued for generation...';
      case 'processing':
        return `Creating your ${type}...`;
      case 'completed':
        return `${type === 'music' ? 'Music' : 'Art'} ready!`;
      case 'failed':
        return 'Generation failed. Please try again.';
      default:
        return 'Processing...';
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  return (
    <LinearGradient
      colors={[theme.colors.surface, theme.colors.background]}
      style={styles.container}
    >
      <Card style={styles.progressCard}>
        <Card.Content style={styles.cardContent}>
          <Animated.View
            style={[
              styles.iconContainer,
              { transform: [{ scale: pulseAnimation }] },
            ]}
          >
            <Avatar.Icon
              size={80}
              icon={getStatusIcon()}
              style={[
                styles.progressIcon,
                { backgroundColor: getStatusColor() },
              ]}
            />
          </Animated.View>

          <Text variant="headlineSmall" style={styles.title}>
            {getStatusMessage()}
          </Text>

          <View style={styles.progressContainer}>
            <ProgressBar
              progress={progress / 100}
              color={getStatusColor()}
              style={styles.progressBar}
            />
            <Text variant="bodySmall" style={styles.progressText}>
              {Math.round(progress)}%
            </Text>
          </View>

          {estimatedTime && estimatedTime > 0 && (
            <Text variant="bodySmall" style={styles.estimatedTime}>
              Estimated time remaining: {formatTime(estimatedTime)}
            </Text>
          )}

          <View style={styles.tipsContainer}>
            <Text variant="bodySmall" style={styles.tipsTitle}>
              💡 Did you know?
            </Text>
            <Text variant="bodySmall" style={styles.tipsText}>
              {type === 'music' 
                ? 'Your music is being crafted using AI algorithms that understand therapeutic sound patterns.'
                : 'Your art is being created using advanced AI models trained on thousands of artistic styles.'
              }
            </Text>
          </View>
        </Card.Content>
      </Card>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  progressCard: {
    width: '100%',
    maxWidth: 400,
    elevation: 8,
  },
  cardContent: {
    alignItems: 'center',
    padding: 30,
  },
  iconContainer: {
    marginBottom: 20,
  },
  progressIcon: {
    marginBottom: 0,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressText: {
    fontWeight: 'bold',
  },
  estimatedTime: {
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  tipsContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
    marginTop: 8,
  },
  tipsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipsText: {
    lineHeight: 18,
    opacity: 0.9,
  },
});

export default GenerationProgress;
