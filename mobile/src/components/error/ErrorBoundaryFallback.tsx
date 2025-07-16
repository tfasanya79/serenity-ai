import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  Avatar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface ErrorBoundaryFallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
  resetError,
}) => {
  const theme = useTheme();

  return (
    <LinearGradient
      colors={[theme.colors.errorContainer, theme.colors.background]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Card style={styles.errorCard}>
          <Card.Content style={styles.cardContent}>
            <Avatar.Icon
              size={80}
              icon="alert-circle"
              style={[styles.errorIcon, { backgroundColor: theme.colors.error }]}
            />
            
            <Text variant="headlineSmall" style={styles.title}>
              Something went wrong
            </Text>
            
            <Text variant="bodyMedium" style={styles.message}>
              We're sorry, but something unexpected happened. The app will try to recover automatically.
            </Text>
            
            {__DEV__ && (
              <View style={styles.debugInfo}>
                <Text variant="titleSmall" style={styles.debugTitle}>
                  Debug Information:
                </Text>
                <Text variant="bodySmall" style={styles.debugText}>
                  {error.message}
                </Text>
                <Text variant="bodySmall" style={styles.debugText}>
                  {error.stack}
                </Text>
              </View>
            )}
            
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={resetError}
                style={styles.retryButton}
                contentStyle={styles.retryButtonContent}
              >
                Try Again
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorCard: {
    width: '100%',
    maxWidth: 400,
    elevation: 8,
  },
  cardContent: {
    alignItems: 'center',
    padding: 30,
  },
  errorIcon: {
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  debugInfo: {
    width: '100%',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  debugTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  debugText: {
    fontFamily: 'monospace',
    fontSize: 11,
    marginBottom: 4,
  },
  buttonContainer: {
    width: '100%',
  },
  retryButton: {
    marginTop: 8,
  },
  retryButtonContent: {
    paddingVertical: 8,
  },
});

export default ErrorBoundaryFallback;
