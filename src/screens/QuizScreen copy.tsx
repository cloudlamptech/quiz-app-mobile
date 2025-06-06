import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Icon, ListItem } from "@rneui/themed";

const QuizScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vijay Quizzes</Text>
        <Icon name="menu" type="feather" style={styles.menuIcon} />
      </View>

      <View style={styles.quizHeader}>
        <Text style={styles.quizTitle}>Quiz name #2</Text>
        <Text style={styles.quizSubtitle}>Financial Software Tools</Text>
      </View>

      <View style={styles.optionHeader}>
        <Text style={styles.optionText}>Select an option</Text>
        <Icon name="help-circle" type="feather" style={styles.helpIcon} />
      </View>

      <Text style={styles.questionTitle}>Oracle Cloud Financials</Text>

      {[
        "A cloud-based software",
        "Needs on-premise implementation",
        "Needs to be installed on Desktop or Laptop",
        "None of the above",
      ].map((option, index) => (
        <ListItem key={index} bottomDivider>
          <ListItem.CheckBox
            uncheckedIcon="circle-o"
            checkedIcon="dot-circle-o"
            checked={false}
          />
          <ListItem.Content>
            <ListItem.Title>{option}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}

      <Button title="Next question" buttonStyle={styles.nextButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B0000",
  },
  subtitle: {
    fontSize: 18,
    color: "#8B0000",
  },
  menuIcon: {
    fontSize: 24,
    color: "#000",
  },
  quizHeader: {
    backgroundColor: "#8B0000",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  quizTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  quizSubtitle: {
    fontSize: 16,
    color: "#fff",
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
  helpIcon: {
    fontSize: 24,
    color: "#000",
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  nextButton: {
    backgroundColor: "#87CEEB",
    marginTop: 16,
  },
});

export default QuizScreen;
