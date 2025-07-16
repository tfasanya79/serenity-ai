import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import {
  Text,
  Banner,
  Button,
  IconButton,
} from 'react-native-paper';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

interface NetworkStatusProps {
  onRetry?: () => void;
  isConnected?: boolean;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ onRetry, isConnected = true }) => {
  const theme = useTheme();
  const [slideAnimation] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (!isConnected) {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isConnected, slideAnimation]);

  const getConnectionIcon = () => {
    return isConnected ? 'wifi' : 'wifi-off';
  };

  const getConnectionMessage = () => {
    if (!isConnected) {
      return 'No internet connection. Some features may not work properly.';
    }
    
    return 'Connected to internet';
  };

  if (isConnected) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnimation }],
          backgroundColor: theme.colors.errorContainer,
        },
      ]}
    >
      <Banner
        visible={true}
        icon={getConnectionIcon()}
        style={[
          styles.banner,
          { backgroundColor: theme.colors.errorContainer },
        ]}
        contentStyle={styles.bannerContent}
        actions={[
          {
            label: 'Retry',
            onPress: onRetry || (() => {}),
          },
        ]}
      >
        <Text variant="bodyMedium" style={styles.message}>
          {getConnectionMessage()}
        </Text>
      </Banner>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 1000,
  },
  banner: {
    margin: 0,
    borderRadius: 0,
  },
  bannerContent: {
    paddingVertical: 8,
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
});

export default NetworkStatus;
