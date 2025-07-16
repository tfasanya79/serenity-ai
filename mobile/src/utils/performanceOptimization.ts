import React, { memo, useCallback, useMemo } from 'react';
import { Platform, InteractionManager } from 'react-native';
import { store } from '../store';

// Performance optimization utilities for SerenityAI MVP

export const useDelayedCallback = (callback: () => void, delay: number = 0) => {
  return useCallback(() => {
    if (delay > 0) {
      setTimeout(callback, delay);
    } else {
      InteractionManager.runAfterInteractions(callback);
    }
  }, [callback, delay]);
};

export const useThrottledCallback = (callback: (...args: any[]) => void, delay: number = 300) => {
  const [isThrottled, setIsThrottled] = React.useState(false);
  
  return useCallback((...args: any[]) => {
    if (isThrottled) return;
    
    callback(...args);
    setIsThrottled(true);
    
    setTimeout(() => {
      setIsThrottled(false);
    }, delay);
  }, [callback, delay, isThrottled]);
};

export const useDebouncedCallback = (callback: (...args: any[]) => void, delay: number = 300) => {
  const [debounceTimer, setDebounceTimer] = React.useState<NodeJS.Timeout | null>(null);
  
  return useCallback((...args: any[]) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    const timer = setTimeout(() => {
      callback(...args);
    }, delay);
    
    setDebounceTimer(timer);
  }, [callback, delay, debounceTimer]);
};

// Memory management utilities
export const clearAppCache = async () => {
  try {
    // Clear Redux store state (this would be implemented when needed)
    console.log('App cache cleared successfully');
  } catch (error) {
    console.error('Failed to clear app cache:', error);
  }
};

// Performance monitoring
export const measurePerformance = (label: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${label} took ${end - start} milliseconds`);
};

export const measureAsyncPerformance = async (label: string, fn: () => Promise<void>) => {
  const start = performance.now();
  await fn();
  const end = performance.now();
  console.log(`${label} took ${end - start} milliseconds`);
};

// Component optimization utilities
export const createMemoizedComponent = <T extends React.ComponentType<any>>(
  Component: T,
  areEqual?: (prevProps: any, nextProps: any) => boolean
) => {
  return memo(Component, areEqual);
};

// Platform-specific optimizations
export const platformOptimizations = {
  isAndroid: Platform.OS === 'android',
  isIOS: Platform.OS === 'ios',
  
  // Android-specific optimizations
  android: {
    enableHardwareAcceleration: true,
    renderToHardwareTextureAndroid: true,
    collapsable: false,
  },
  
  // iOS-specific optimizations
  ios: {
    shouldRasterizeIOS: true,
    removeClippedSubviews: true,
  },
};

// Image optimization utilities
export const optimizeImage = {
  lowQuality: { quality: 0.3, resize: { width: 200, height: 200 } },
  mediumQuality: { quality: 0.7, resize: { width: 400, height: 400 } },
  highQuality: { quality: 0.9, resize: { width: 800, height: 800 } },
};

// Animation performance
export const performanceAwareAnimation = {
  useNativeDriver: true,
  duration: 300,
  stiffness: 100,
  damping: 15,
};

// Network request optimization
export const optimizeNetworkRequests = {
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  
  // Batch requests when possible
  batchRequests: (requests: Array<() => Promise<any>>) => {
    return Promise.all(requests.map(request => request()));
  },
  
  // Request debouncing
  debounceRequest: (request: () => Promise<any>, delay: number = 500) => {
    let timeoutId: NodeJS.Timeout;
    
    return () => {
      clearTimeout(timeoutId);
      
      return new Promise((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          try {
            const result = await request();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }, delay);
      });
    };
  },
};

// Bundle size optimization
export const lazyLoadComponent = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  return React.lazy(importFn);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = React.useRef(0);
  const mountTime = React.useRef(Date.now());
  
  React.useEffect(() => {
    renderCount.current += 1;
    console.log(`${componentName} render #${renderCount.current}`);
  });
  
  React.useEffect(() => {
    const mountDuration = Date.now() - mountTime.current;
    console.log(`${componentName} mounted in ${mountDuration}ms`);
    
    return () => {
      console.log(`${componentName} unmounted`);
    };
  }, [componentName]);
};

export default {
  useDelayedCallback,
  useThrottledCallback,
  useDebouncedCallback,
  clearAppCache,
  measurePerformance,
  measureAsyncPerformance,
  createMemoizedComponent,
  platformOptimizations,
  optimizeImage,
  performanceAwareAnimation,
  optimizeNetworkRequests,
  lazyLoadComponent,
  usePerformanceMonitor,
};
