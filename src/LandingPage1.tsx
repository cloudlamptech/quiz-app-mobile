import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native'; // Import useNavigation

const LandingPage: React.FC = () => {
  const navigation = useNavigation(); // Initialize navigation

  const handleTakeQuizBtnClick = () => {
    navigation.navigate('Quiz'); // Navigate to the Quiz component
  };

  return (
    <ScrollView
      style={styles.container}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}>
      <View style={styles.quizSection}>
        <Text style={styles.quizSectionTitle}>Take a Quiz</Text>
        <Text style={styles.quizSectionSubtitle}>from Newly Added</Text>
        <View style={styles.quizCards}>
          <TouchableOpacity
            style={styles.quizCard}
            onPress={handleTakeQuizBtnClick}>
            <Text style={styles.quizNumber}>1 in</Text>
            <Text style={styles.quizCategory}>Finance & Economics</Text>
          </TouchableOpacity>
          <View style={styles.quizCard}>
            <Text style={styles.quizNumber}>3 in</Text>
            <Text style={styles.quizCategory}>Science & Technology</Text>
          </View>
        </View>
      </View>
      <View style={styles.topicsSection}>
        <View style={styles.topicsTabs}>
          <TouchableOpacity style={[styles.tab, styles.activeTab]}>
            <Text style={styles.tabText}>Topics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Quizzes</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Trending</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.topicsContent}>
          <Text style={styles.topicsTitle}>Newly added topics/subtopics</Text>
          <Text style={styles.topicItem}>
            • Natural science → <Text style={styles.link}>Astronomy</Text>
          </Text>
          <Text style={styles.topicItem}>
            • Finance → <Text style={styles.link}>Corporate finance</Text>
          </Text>
          <Text style={styles.topicItem}>
            • Finance → <Text style={styles.link}>Gap financing</Text>
          </Text>
          <Text style={styles.topicsTitle}>Topics in Trending</Text>
          <Text style={styles.topicItem}>
            • Technology → <Text style={styles.link}>Augmented reality</Text>
          </Text>
          <Text style={styles.topicItem}>
            • Health → <Text style={styles.link}>Covid-19</Text>
          </Text>
          <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreButtonText}>See other topics</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.quizzesTakenSection}>
        <Text style={styles.quizzesTakenTitle}>Quizzes taken</Text>
        <TouchableOpacity
          style={styles.quizItemButton}
          onPress={() => handleTakeQuizBtnClick()}>
          <Text style={styles.quizItem}>
            <Text style={styles.link}>Take Quiz</Text> from Maths
          </Text>
        </TouchableOpacity>
        <Text style={styles.quizItem}>
          <Text style={styles.link}>Quiz name #3</Text> from foreign direct
          investment
        </Text>
        <Text style={styles.quizItem}>
          <Text style={styles.link}>Quiz name #1</Text> in financial modeling
        </Text>
        <TouchableOpacity style={styles.otherQuizzesButton}>
          <Text style={styles.otherQuizzesButtonText}>Other quizzes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    color: '#8b0000',
  },
  subtitle: {
    fontSize: 18,
    color: '#000',
  },
  menuButton: {
    padding: 10,
  },
  menuButtonText: {
    fontSize: 24,
  },
  quizSection: {
    backgroundColor: '#2c1a5b',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  quizSectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quizSectionSubtitle: {
    color: '#fff',
    fontSize: 14,
  },
  quizCards: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  quizCard: {
    backgroundColor: '#4b3b8f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  quizNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  quizCategory: {
    fontSize: 14,
    color: '#fff',
  },
  topicsSection: {
    backgroundColor: '#eaeaea',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  topicsTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tab: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#8b0000',
  },
  tabText: {
    color: '#fff',
  },
  topicsContent: {
    marginTop: 10,
  },
  topicsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  topicItem: {
    marginBottom: 5,
  },
  link: {
    color: '#007bff',
  },
  seeMoreButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  seeMoreButtonText: {
    color: '#fff',
  },
  quizzesTakenSection: {
    marginTop: 20,
  },
  quizzesTakenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quizItem: {
    marginBottom: 5,
  },
  quizItemButton: {
    backgroundColor: '#eaeaea',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  otherQuizzesButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  otherQuizzesButtonText: {
    color: '#fff',
  },
});

export default LandingPage;
