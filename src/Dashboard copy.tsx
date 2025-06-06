import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Button, ThemeProvider} from '@rneui/themed';

const {width} = Dimensions.get('window');

import type {NavigationProp} from '@react-navigation/native';

interface DashboardScreenProps {
  navigation: NavigationProp<any>;
}

const Dashboard = ({navigation}: DashboardScreenProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width));

  // Menu items
  const menuItems = [
    {title: 'Dashboard', icon: 'dashboard', screen: 'Dashboard'},
    {title: 'Settings', icon: 'settings', screen: 'Settings'},
    {title: 'Feedback', icon: 'feedback', screen: 'Feedback'},
    {title: 'Profile', icon: 'person', screen: 'Profile'},
    {title: 'Help & Support', icon: 'help', screen: 'Help'},
    {title: 'About', icon: 'info', screen: 'About'},
    {title: 'Logout', icon: 'exit-to-app', screen: 'Logout'},
  ];

  // Quiz data
  const newlyAddedTopics = [
    {category: 'Natural science', topic: 'Astronomy', color: '#10B981'},
    {category: 'Finance', topic: 'Corporate finance', color: '#3B82F6'},
    {category: 'Finance', topic: 'Gap financing', color: '#3B82F6'},
  ];

  const trendingTopics = [
    {category: 'Technology', topic: 'Augmented reality', color: '#8B5CF6'},
    {category: 'Health', topic: 'Covid-19', color: '#EF4444'},
  ];

  const quizzesTaken = [
    {name: 'Quiz name #2', category: 'Financial tools', color: '#EF4444'},
    {
      name: 'Quiz name #5',
      category: 'foreign direct investment',
      color: '#EF4444',
    },
    {name: 'Quiz name #1', category: 'financial modeling', color: '#EF4444'},
  ];

  // Menu animation functions
  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  const handleMenuItemPress = (screen: string) => {
    closeMenu();
    if (screen === 'Logout') {
      // Handle logout logic
      console.log('Logout pressed');
    } else {
      // Navigate to screen
      navigation.navigate(screen);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>
          <Text style={styles.headerTitleRed}>Vijay</Text>
          {'\n'}
          <Text style={styles.headerTitleBlack}>Quizzes</Text>
        </Text>
        <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
          <Icon name="menu" size={28} color="#333" />
        </TouchableOpacity>
      </View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Take a Quiz Card */}
        <View style={styles.quizCard}>
          <Text style={styles.quizCardTitle}>Take a Quiz</Text>
          <Text style={styles.quizCardSubtitle}>from Newly Added</Text>

          <View style={styles.quizOptions}>
            <TouchableOpacity
              style={[styles.quizOption, styles.quizOptionLeft]}>
              <Text style={styles.quizNumber}>1</Text>
              <Text style={styles.quizText}>in</Text>
              <Text style={styles.quizCategory}>Finance &{'\n'}Economics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.quizOption, styles.quizOptionRight]}>
              <Text style={styles.quizNumber}>3</Text>
              <Text style={styles.quizText}>in</Text>
              <Text style={styles.quizCategory}>Science &{'\n'}Technology</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            {/* <Text style={[styles.tabText, styles.activeTabText]}>Topics</Text> */}
            <ThemeProvider>
              <Button
                title="Topics"
                type="solid"
                buttonStyle={{backgroundColor: '#DC2626', borderRadius: 8}}
                onPress={() => navigation.navigate('Quiz')}
              />
            </ThemeProvider>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Quizzes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Trending</Text>
          </TouchableOpacity>
        </View>

        {/* Newly Added Topics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Newly added topics/subtopics</Text>
          {newlyAddedTopics.map((item, index) => (
            <TouchableOpacity key={index} style={styles.topicItem}>
              <View style={styles.topicContent}>
                <Text style={styles.topicCategory}>{item.category} → </Text>
                <Text style={[styles.topicName, {color: item.color}]}>
                  {item.topic}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Topics in Trending */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Topics in Trending</Text>
          {trendingTopics.map((item, index) => (
            <TouchableOpacity key={index} style={styles.topicItem}>
              <View style={styles.topicContent}>
                <Text style={styles.topicCategory}>{item.category} → </Text>
                <Text style={[styles.topicName, {color: item.color}]}>
                  {item.topic}
                </Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>See other topics</Text>
          </TouchableOpacity>
        </View>

        {/* Quizzes Taken */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quizzes taken</Text>
          {quizzesTaken.map((item, index) => (
            <TouchableOpacity key={index} style={styles.quizItem}>
              <View style={styles.quizContent}>
                <Text style={[styles.quizName, {color: item.color}]}>
                  {item.name}
                </Text>
                <Text style={styles.quizCategory}> from {item.category}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.otherQuizzesButton}>
            <Text style={styles.otherQuizzesText}>Other quizzes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Hamburger Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeMenu}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={closeMenu}
            activeOpacity={1}
          />

          <Animated.View
            style={[
              styles.menuContainer,
              {transform: [{translateX: slideAnim}]},
            ]}>
            {/* Menu Header */}
            <View style={styles.menuHeader}>
              <Text style={styles.menuHeaderTitle}>Menu</Text>
              <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Menu Items */}
            <ScrollView style={styles.menuContent}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.screen)}>
                  <Icon name={item.icon} size={24} color="#666" />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <Icon name="chevron-right" size={20} color="#ccc" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    fontFamily: 'Inter',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitleRed: {
    color: '#DC2626',
  },
  headerTitleBlack: {
    color: '#333',
  },
  menuButton: {
    padding: 8,
    marginTop: -8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quizCard: {
    backgroundColor: '#4C1D95',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  quizCardTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quizCardSubtitle: {
    color: '#E0E7FF',
    fontSize: 16,
    marginBottom: 24,
  },
  quizOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    width: '47%',
    alignItems: 'center',
  },
  quizOptionLeft: {
    marginRight: 8,
  },
  quizOptionRight: {
    marginLeft: 8,
  },
  quizNumber: {
    color: '#FDE047',
    fontSize: 36,
    fontWeight: 'bold',
  },
  quizText: {
    color: '#E0E7FF',
    fontSize: 14,
    marginVertical: 4,
  },
  quizCategory: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#DC2626',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  topicItem: {
    marginBottom: 8,
  },
  topicContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topicCategory: {
    fontSize: 16,
    color: '#666',
  },
  topicName: {
    fontSize: 16,
    fontWeight: '500',
  },
  quizItem: {
    marginBottom: 8,
  },
  quizContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quizName: {
    fontSize: 16,
    fontWeight: '500',
  },
  seeMoreButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  seeMoreText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  otherQuizzesButton: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  otherQuizzesText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  // Modal and Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackground: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 0},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 50, // Account for status bar
  },
  menuHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  menuContent: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 16,
  },
});

export default Dashboard;
