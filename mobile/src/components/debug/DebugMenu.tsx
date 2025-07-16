import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  IconButton,
  Divider,
  List,
  Switch,
} from 'react-native-paper';
import { useTheme } from 'react-native-paper';
import { mvpTestSuite } from '../../utils/mvpTestSuite';
import { e2eTestRunner } from '../../utils/e2eTestRunner';

interface DebugMenuProps {
  visible: boolean;
  onClose: () => void;
}

const DebugMenu: React.FC<DebugMenuProps> = ({ visible, onClose }) => {
  const theme = useTheme();
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleRunTests = async () => {
    setIsRunningTests(true);
    try {
      await mvpTestSuite.runAllTests();
      mvpTestSuite.showTestResults();
    } catch (error) {
      Alert.alert('Test Error', 'Failed to run tests. Check console for details.');
      console.error('Test suite error:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleRunE2ETests = async () => {
    setIsRunningTests(true);
    try {
      const results = await e2eTestRunner.runAllTests();
      const summary = results.map(suite => 
        `${suite.name}: ${suite.passedTests}/${suite.totalTests} passed`
      ).join('\n');
      
      Alert.alert('E2E Test Results', summary);
    } catch (error) {
      Alert.alert('E2E Test Error', 'Failed to run E2E tests. Check console for details.');
      console.error('E2E test error:', error);
    } finally {
      setIsRunningTests(false);
    }
  };

  const handleClearStorage = async () => {
    Alert.alert(
      'Clear Storage',
      'This will log you out and clear all stored data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              const { AuthService } = require('../services');
              await AuthService.logout();
              Alert.alert('Success', 'Storage cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear storage');
            }
          },
        },
      ]
    );
  };

  const handleShowApiInfo = () => {
    const apiClient = require('../../services/api').default;
    const baseURL = apiClient.defaults.baseURL;
    
    Alert.alert(
      'API Information',
      `Base URL: ${baseURL}\nTimeout: ${apiClient.defaults.timeout}ms\nEnvironment: ${__DEV__ ? 'Development' : 'Production'}`
    );
  };

  const handleShowStoreState = () => {
    const { store } = require('../../store/store');
    const state = store.getState();
    
    console.log('Redux Store State:', JSON.stringify(state, null, 2));
    
    Alert.alert(
      'Store State',
      `Redux state logged to console.\n\nSlices: ${Object.keys(state).join(', ')}`
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Debug Menu
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
          />
        </View>
        
        <Divider />
        
        <ScrollView style={styles.scrollView}>
          <Card style={styles.section}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Testing
              </Text>
              <Button
                mode="contained"
                onPress={handleRunTests}
                loading={isRunningTests}
                disabled={isRunningTests}
                style={styles.button}
              >
                Run MVP Test Suite
              </Button>
              <Button
                mode="outlined"
                onPress={handleRunE2ETests}
                loading={isRunningTests}
                disabled={isRunningTests}
                style={styles.button}
              >
                Run E2E Tests
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.section}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Storage & Data
              </Text>
              <Button
                mode="outlined"
                onPress={handleClearStorage}
                style={styles.button}
              >
                Clear Storage
              </Button>
              <Button
                mode="outlined"
                onPress={handleShowStoreState}
                style={styles.button}
              >
                Show Redux State
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.section}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                API & Configuration
              </Text>
              <Button
                mode="outlined"
                onPress={handleShowApiInfo}
                style={styles.button}
              >
                Show API Info
              </Button>
            </Card.Content>
          </Card>

          <Card style={styles.section}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                App Information
              </Text>
              <List.Item
                title="Version"
                description="1.0.0"
                left={() => <List.Icon icon="information" />}
              />
              <List.Item
                title="Environment"
                description={__DEV__ ? 'Development' : 'Production'}
                left={() => <List.Icon icon="cog" />}
              />
              <List.Item
                title="Platform"
                description="React Native / Expo"
                left={() => <List.Icon icon="cellphone" />}
              />
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    margin: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  button: {
    marginVertical: 4,
  },
});

export default DebugMenu;
