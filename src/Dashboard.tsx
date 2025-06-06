import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
  Animated,
  Platform,
} from "react-native";
import {
  Header,
  Button,
  ButtonGroup,
  Card,
  ListItem,
  Icon,
  Badge,
  Divider,
  ThemeProvider,
} from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

import type { NavigationProp } from "@react-navigation/native";

interface DashboardScreenProps {
  navigation: NavigationProp<any>;
}

// Custom theme for consistent styling
const theme = {
  colors: {
    primary: "#DC2626",
    secondary: "#4C1D95",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#0EA5E9",
  },
  Button: {
    titleStyle: {
      fontWeight: "600",
    },
  },
  Card: {
    containerStyle: {
      borderRadius: 12,
      marginHorizontal: 0,
      marginVertical: 8,
      elevation: 3,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
  },
  ListItem: {
    containerStyle: {
      borderBottomWidth: 0,
      paddingVertical: 12,
    },
  },
};

const Dashboard = ({ navigation }: DashboardScreenProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width));
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  // Menu items with RNE icons
  const menuItems = [
    {
      title: "Dashboard",
      iconName: "dashboard",
      iconType: "material",
      screen: "Dashboard",
    },
    {
      title: "Settings",
      iconName: "settings",
      iconType: "material",
      screen: "Settings",
    },
    {
      title: "Feedback",
      iconName: "feedback",
      iconType: "material",
      screen: "Feedback",
    },
    {
      title: "Profile",
      iconName: "person",
      iconType: "material",
      screen: "Profile",
    },
    {
      title: "Help & Support",
      iconName: "help",
      iconType: "material",
      screen: "Help",
    },
    { title: "About", iconName: "info", iconType: "material", screen: "About" },
    {
      title: "Logout",
      iconName: "exit-to-app",
      iconType: "material",
      screen: "Logout",
      isDestructive: true,
    },
  ];

  // Quiz data
  const newlyAddedTopics = [
    { category: "Natural science", topic: "Astronomy", color: "success" },
    { category: "Finance", topic: "Corporate finance", color: "info" },
    { category: "Finance", topic: "Gap financing", color: "info" },
  ];

  const trendingTopics = [
    { category: "Technology", topic: "Augmented reality", color: "warning" },
    { category: "Health", topic: "Covid-19", color: "error" },
  ];

  const quizzesTaken = [
    { name: "Quiz name #2", category: "Financial tools", color: "error" },
    {
      name: "Quiz name #5",
      category: "foreign direct investment",
      color: "error",
    },
    { name: "Quiz name #1", category: "financial modeling", color: "error" },
  ];

  // Tab buttons
  const tabButtons = ["Topics", "Quizzes", "Trending"];

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
    if (screen === "Logout") {
      console.log("Logout pressed");
    } else {
      navigation.navigate(screen);
    }
  };

  const renderQuizCard = () => (
    <Card containerStyle={styles.quizCard}>
      <Text style={styles.quizCardTitle}>Take a Quiz</Text>
      <Text style={styles.quizCardSubtitle}>from Newly Added</Text>

      <View style={styles.quizOptions}>
        <TouchableOpacity
          style={styles.quizOptionButton}
          onPress={() => navigation.navigate("Quiz", { category: "finance" })}
          activeOpacity={0.8}
        >
          <View style={styles.quizOptionContent}>
            <Text style={styles.quizNumber}>1</Text>
            <Text style={styles.quizText}>in</Text>
            <Text style={styles.quizCategory}>Finance &{"\n"}Economics</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.quizOptionButton}
          onPress={() => navigation.navigate("Quiz", { category: "science" })}
          activeOpacity={0.8}
        >
          <View style={styles.quizOptionContent}>
            <Text style={styles.quizNumber}>3</Text>
            <Text style={styles.quizText}>in</Text>
            <Text style={styles.quizCategory}>Science &{"\n"}Technology</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Card>
  );

  const renderTopicSection = (
    title: string,
    topics: any[],
    showButton = false
  ) => (
    <Card>
      <Card.Title style={styles.sectionTitle}>{title}</Card.Title>
      <Divider style={styles.divider} />

      {topics.map((item, index) => (
        <ListItem
          key={index}
          onPress={() => navigation.navigate("TopicDetail", { topic: item })}
        >
          <ListItem.Content>
            <View style={styles.topicContent}>
              <Text style={styles.topicCategory}>{item.category} → </Text>
              <Text style={styles.topicName}>{item.topic}</Text>
              <Badge
                value=""
                badgeStyle={[
                  styles.colorBadge,
                  { backgroundColor: theme.colors[item.color] || item.color },
                ]}
              />
            </View>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}

      {showButton && (
        <Button
          title="See other topics"
          type="outline"
          buttonStyle={styles.actionButton}
          titleStyle={styles.actionButtonText}
          onPress={() => navigation.navigate("AllTopics")}
        />
      )}
    </Card>
  );

  const renderQuizzesSection = () => (
    <Card>
      <Card.Title style={styles.sectionTitle}>Quizzes taken</Card.Title>
      <Divider style={styles.divider} />

      {quizzesTaken.map((item, index) => (
        <ListItem
          key={index}
          onPress={() => navigation.navigate("QuizDetail", { quiz: item })}
        >
          <ListItem.Content>
            <ListItem.Title
              style={[styles.quizName, { color: theme.colors[item.color] }]}
            >
              {item.name}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.quizCategory}>
              from {item.category}
            </ListItem.Subtitle>
          </ListItem.Content>
          <Badge
            value="Completed"
            status="success"
            badgeStyle={styles.completedBadge}
          />
          <ListItem.Chevron />
        </ListItem>
      ))}

      <Button
        title="Other quizzes"
        type="outline"
        buttonStyle={styles.actionButton}
        titleStyle={styles.actionButtonText}
        onPress={() => navigation.navigate("AllQuizzes")}
      />
    </Card>
  );

  const renderHamburgerMenu = () => (
    <Modal
      visible={menuVisible}
      transparent={true}
      animationType="none"
      onRequestClose={closeMenu}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={closeMenu}
          activeOpacity={1}
        />

        <Animated.View
          style={[
            styles.menuContainer,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          {/* Menu Header */}
          <Header
            centerComponent={{
              text: "Menu",
              style: { color: "#333", fontSize: 20, fontWeight: "bold" },
            }}
            rightComponent={
              <Icon
                name="close"
                type="material"
                color="#666"
                onPress={closeMenu}
              />
            }
            backgroundColor="#F9FAFB"
            containerStyle={styles.menuHeaderStyle}
          />

          {/* Menu Items */}
          <ScrollView style={styles.menuContent}>
            {menuItems.map((item, index) => (
              <ListItem
                key={index}
                onPress={() => handleMenuItemPress(item.screen)}
                containerStyle={[
                  styles.menuListItem,
                  item.isDestructive && styles.destructiveMenuItem,
                ]}
              >
                <Icon
                  name={item.iconName}
                  type={item.iconType}
                  color={item.isDestructive ? theme.colors.error : "#666"}
                />
                <ListItem.Content>
                  <ListItem.Title
                    style={[
                      styles.menuItemText,
                      item.isDestructive && { color: theme.colors.error },
                    ]}
                  >
                    {item.title}
                  </ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Take a Quiz Card */}
          {renderQuizCard()}

          {/* Tab Navigation */}
          <ButtonGroup
            buttons={tabButtons}
            selectedIndex={selectedTabIndex}
            onPress={setSelectedTabIndex}
            containerStyle={styles.tabContainer}
            selectedButtonStyle={{ backgroundColor: theme.colors.primary }}
            textStyle={styles.tabText}
            selectedTextStyle={styles.activeTabText}
            innerBorderStyle={{ width: 0 }}
          />

          {/* Content based on selected tab */}
          {selectedTabIndex === 0 && (
            <>
              {renderTopicSection(
                "Newly added topics/subtopics",
                newlyAddedTopics
              )}
              {renderTopicSection("Topics in Trending", trendingTopics, true)}
            </>
          )}

          {selectedTabIndex === 1 && renderQuizzesSection()}

          {selectedTabIndex === 2 &&
            renderTopicSection(
              "Trending Topics",
              [...trendingTopics, ...newlyAddedTopics],
              true
            )}
        </ScrollView>

        {/* Hamburger Menu Modal */}
        {renderHamburgerMenu()}
      </SafeAreaView>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? 0 : 20,
    fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Quiz Card Styles
  quizCard: {
    backgroundColor: "#4C1D95",
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 0,
  },
  quizCardTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "left",
  },
  quizCardSubtitle: {
    color: "#E0E7FF",
    fontSize: 16,
    marginBottom: 24,
  },
  quizOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  quizOptionButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    width: "47%",
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
  },
  quizOptionLeft: {
    // Remove margin as we're using gap now
  },
  quizOptionRight: {
    // Remove margin as we're using gap now
  },
  quizOptionContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  quizNumber: {
    color: "#FDE047",
    fontSize: 36,
    fontWeight: "bold",
  },
  quizText: {
    color: "#E0E7FF",
    fontSize: 14,
    marginVertical: 4,
  },
  quizCategory: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "500",
  },

  // Tab Styles
  tabContainer: {
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 0,
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },

  // Section Styles
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "left",
  },
  divider: {
    marginVertical: 10,
  },
  topicContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  topicCategory: {
    fontSize: 16,
    color: "#666",
  },
  topicName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  colorBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },

  // Quiz Item Styles
  quizName: {
    fontSize: 16,
    fontWeight: "500",
  },
  // quizCategory: {
  //   fontSize: 14,
  //   color: '#666',
  //   marginTop: 2,
  // },
  completedBadge: {
    backgroundColor: "#10B981",
  },

  // Action Button Styles
  actionButton: {
    marginTop: 10,
    borderColor: "#0EA5E9",
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#0EA5E9",
    fontSize: 14,
    fontWeight: "500",
  },

  // Modal and Menu Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackground: {
    flex: 1,
  },
  menuContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.8,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuHeaderStyle: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingTop: 50,
  },
  menuContent: {
    flex: 1,
    paddingTop: 20,
  },
  menuListItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  destructiveMenuItem: {
    backgroundColor: "#FEF2F2",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Dashboard;
