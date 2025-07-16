import React, { useEffect, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import { Card } from 'react-native-paper';
import { useTheme } from 'react-native-paper';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  onPress?: () => void;
  style?: ViewStyle;
  cardStyle?: ViewStyle;
  disabled?: boolean;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  delay = 0,
  duration = 500,
  onPress,
  style,
  cardStyle,
  disabled = false,
}) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]);

    animation.start();
  }, [fadeAnim, slideAnim, scaleAnim, delay, duration]);

  const handlePressIn = () => {
    if (disabled) return;
    
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [
      {
        translateY: slideAnim,
      },
      {
        scale: scaleAnim,
      },
    ],
  };

  const cardContent = (
    <Card style={[styles.card, cardStyle]}>
      {children}
    </Card>
  );

  if (onPress && !disabled) {
    return (
      <Animated.View style={[style, animatedStyle]}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          {cardContent}
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[style, animatedStyle]}>
      {cardContent}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 4,
    borderRadius: 12,
  },
});

export default AnimatedCard;
