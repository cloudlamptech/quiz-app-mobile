import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  StyleSheet,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header, Icon, Image, ListItem } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
const { width } = Dimensions.get("window");

const AppHeader = () => {
  const navigation = useNavigation();
  const { isAuthenticated, user, logout } = useAuth();
  const [menuVisible, setMenuVisible] = useState(false);
  const [slideAnim] = useState(new Animated.Value(-width));

  // Get menu items based on authentication status
  const getMenuItems = () => {
    if (isAuthenticated) {
      return [
        { title: "Dashboard", icon: "dashboard", screen: "Dashboard" },
        { title: "Profile", icon: "person", screen: "Profile" },
        { title: "Settings", icon: "settings", screen: "Settings" },
        { title: "Feedback", icon: "feedback", screen: "Feedback" },
        { title: "About", icon: "info", screen: "About" },
        { title: "Help & Support", icon: "help", screen: "Help" },
        {
          title: "Logout",
          icon: "exit-to-app",
          action: "logout",
          isDestructive: true,
        },
      ];
    } else {
      return [
        { title: "Login", icon: "login", screen: "Login" },
        { title: "About", icon: "info", screen: "About" },
        { title: "Help & Support", icon: "help", screen: "Help" },
      ];
    }
  };

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

  const handleMenuItemPress = async (item) => {
    closeMenu();

    if (item.action === "logout") {
      Alert.alert("Logout", "Are you sure you want to logout?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
          },
        },
      ]);
    } else if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  const renderMenuHeader = () => (
    <View style={styles.menuHeader}>
      <View style={styles.menuHeaderContent}>
        {isAuthenticated && user ? (
          <>
            <Text style={styles.welcomeText}>Welcome back!</Text>
            <Text style={styles.userNameText}>{user.name}</Text>
            <Text style={styles.userEmailText}>{user.email}</Text>
          </>
        ) : (
          <>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <Text style={styles.guestText}>Please login to continue</Text>
          </>
        )}
      </View>
      <TouchableOpacity onPress={closeMenu} style={styles.closeButton}>
        <Icon name="close" type="material" size={24} color="#666" />
      </TouchableOpacity>
    </View>
  );

  const renderMenuItems = () => (
    <ScrollView style={styles.menuContent}>
      {getMenuItems().map((item, index) => (
        <ListItem
          key={index}
          onPress={() => handleMenuItemPress(item)}
          containerStyle={[
            styles.menuListItem,
            item.isDestructive && styles.destructiveMenuItem,
          ]}
        >
          <Icon
            name={item.icon}
            type="material"
            color={item.isDestructive ? "#EF4444" : "#666"}
            size={24}
          />
          <ListItem.Content>
            <ListItem.Title
              style={[
                styles.menuItemText,
                item.isDestructive && styles.destructiveText,
              ]}
            >
              {item.title}
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      ))}

      {/* Auth Status Indicator */}
      <View style={styles.authStatusContainer}>
        <View
          style={[
            styles.authStatusIndicator,
            { backgroundColor: isAuthenticated ? "#10B981" : "#9CA3AF" },
          ]}
        >
          <Text style={styles.authStatusText}>
            {isAuthenticated ? "Logged In" : "Not Logged In"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <>
      <SafeAreaView edges={["top"]}>
        <Header
          containerStyle={styles.statusBar}
          leftComponent={
            <Image
              source={require("../media/logo-vd.png")}
              style={styles.logo}
            />
          }
          rightComponent={
            <Icon
              name="menu"
              type="material"
              onPress={openMenu}
              size={28}
              color="#333"
            />
          }
        />
      </SafeAreaView>

      {/* Hamburger Menu Modal */}
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
            {renderMenuHeader()}
            {renderMenuItems()}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
  logo: {
    width: 120, // Try increasing the size
    height: 60,
    borderRadius: 1,
    resizeMode: "contain",
  },
  // Header Styles
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 10,
  },
  headerTitleRed: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#DC2626",
  },
  headerTitleBlack: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },

  // Menu Styles
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
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingTop: 50,
    backgroundColor: "#F9FAFB",
  },
  menuHeaderContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  userEmailText: {
    fontSize: 14,
    color: "#666",
  },
  guestText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  closeButton: {
    padding: 8,
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
  destructiveText: {
    color: "#EF4444",
  },
  authStatusContainer: {
    padding: 20,
    alignItems: "center",
  },
  authStatusIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  authStatusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default AppHeader;
