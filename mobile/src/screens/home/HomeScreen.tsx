import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  Surface,
  IconButton,
  FAB,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from 'react-native-paper';
import DebugMenu from '../../components/debug/DebugMenu';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { history: musicHistory } = useSelector((state: RootState) => state.music);
  const { history: artHistory } = useSelector((state: RootState) => state.art);
  const [debugVisible, setDebugVisible] = useState(false);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const renderWelcomeCard = () => (
    <Card style={styles.welcomeCard}>
      <Card.Content>
        <View style={styles.welcomeContent}>
          <Avatar.Text
            size={60}
            label={user?.firstName?.charAt(0) || 'U'}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <View style={styles.welcomeText}>
            <Text variant="headlineSmall" style={styles.greeting}>
              {greeting()}!
            </Text>
            <Text variant="bodyLarge" style={styles.username}>
              {user?.firstName || 'User'}
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Ready to create something beautiful?
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderQuickActions = () => (
    <Card style={styles.sectionCard}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Quick Actions
        </Text>
        <View style={styles.actionsGrid}>
          <Surface
            style={styles.actionCard}
            onTouchEnd={() => navigation.navigate('Music' as never)}
          >
            <Avatar.Icon
              size={48}
              icon="music"
              style={{ backgroundColor: '#4A90E2' }}
            />
            <Text variant="titleSmall" style={styles.actionTitle}>
              Generate Music
            </Text>
            <Text variant="bodySmall" style={styles.actionDescription}>
              Create therapeutic soundscapes
            </Text>
          </Surface>
          
          <Surface
            style={styles.actionCard}
            onTouchEnd={() => navigation.navigate('Art' as never)}
          >
            <Avatar.Icon
              size={48}
              icon="palette"
              style={{ backgroundColor: '#F5A623' }}
            />
            <Text variant="titleSmall" style={styles.actionTitle}>
              Create Art
            </Text>
            <Text variant="bodySmall" style={styles.actionDescription}>
              Express your emotions visually
            </Text>
          </Surface>
        </View>
      </Card.Content>
    </Card>
  );

  const renderRecentActivity = () => {
    const recentMusic = musicHistory.slice(0, 3);
    const recentArt = artHistory.slice(0, 3);

    if (recentMusic.length === 0 && recentArt.length === 0) {
      return (
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Recent Activity
            </Text>
            <View style={styles.emptyState}>
              <Avatar.Icon
                size={60}
                icon="creation"
                style={{ backgroundColor: theme.colors.outline }}
              />
              <Text variant="bodyLarge" style={styles.emptyStateText}>
                No creations yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptyStateDescription}>
                Start creating music or art to see your recent activity here
              </Text>
            </View>
          </Card.Content>
        </Card>
      );
    }

    return (
      <Card style={styles.sectionCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Activity
          </Text>
          
          {recentMusic.length > 0 && (
            <View style={styles.recentSection}>
              <Text variant="titleSmall" style={styles.recentSectionTitle}>
                Recent Music
              </Text>
              {recentMusic.map((track) => (
                <View key={track.id} style={styles.recentItem}>
                  <Avatar.Icon
                    size={32}
                    icon="music"
                    style={{ backgroundColor: '#4A90E2' }}
                  />
                  <View style={styles.recentItemContent}>
                    <Text variant="bodyMedium" style={styles.recentItemTitle}>
                      {track.title}
                    </Text>
                    <Text variant="bodySmall" style={styles.recentItemMeta}>
                      {track.genre} • {track.mood}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {recentArt.length > 0 && (
            <View style={styles.recentSection}>
              <Text variant="titleSmall" style={styles.recentSectionTitle}>
                Recent Art
              </Text>
              {recentArt.map((art) => (
                <View key={art.id} style={styles.recentItem}>
                  <Avatar.Icon
                    size={32}
                    icon="palette"
                    style={{ backgroundColor: '#F5A623' }}
                  />
                  <View style={styles.recentItemContent}>
                    <Text variant="bodyMedium" style={styles.recentItemTitle}>
                      {art.title}
                    </Text>
                    <Text variant="bodySmall" style={styles.recentItemMeta}>
                      {art.style} • {art.mood}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
        {renderWelcomeCard()}
        {renderQuickActions()}
        {renderRecentActivity()}
      </ScrollView>

      {/* Debug Menu FAB */}
      <FAB
        icon="bug"
        size="small"
        style={styles.debugFab}
        onPress={() => setDebugVisible(true)}
      />

      <DebugMenu
        visible={debugVisible}
        onClose={() => setDebugVisible(false)}
      />
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
  welcomeCard: {
    margin: 16,
    marginTop: 40,
    elevation: 4,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  welcomeText: {
    flex: 1,
  },
  greeting: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.8,
  },
  sectionCard: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
  },
  actionTitle: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    opacity: 0.8,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  emptyStateDescription: {
    textAlign: 'center',
    opacity: 0.8,
  },
  recentSection: {
    marginBottom: 16,
  },
  recentSectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    opacity: 0.8,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  recentItemContent: {
    flex: 1,
  },
  recentItemTitle: {
    fontWeight: '500',
    marginBottom: 2,
  },
  recentItemMeta: {
    opacity: 0.8,
  },
  debugFab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#ff6b6b',
  },
});

export default HomeScreen;
