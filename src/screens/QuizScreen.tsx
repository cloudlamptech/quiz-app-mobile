// screens/QuizScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { mathQuizData } from "../data/quizData";
import globalStyles from "../styles/globalStyles";
import Icon from "react-native-vector-icons/MaterialIcons";

const QuizScreen = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);

  const questions = mathQuizData.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  useEffect(() => {
    loadQuizHistory();
  }, []);

  const loadQuizHistory = async () => {
    try {
      const history = await AsyncStorage.getItem("quizHistory");
      if (history) {
        // You can use this to show previous quiz results if needed
        console.log("Previous quiz history:", JSON.parse(history));
      }
    } catch (error) {
      console.error("Error loading quiz history:", error);
    }
  };

  const handleAnswerSelect = (answerIndex, answerValue) => {
    if (showFeedback) return; // Prevent changing answer after feedback is shown

    setSelectedAnswer(answerIndex);

    // Check if answer is correct
    let correct = false;
    if (currentQuestion.type === "multiple_choice") {
      correct = answerIndex === currentQuestion.correctAnswer;
    } else if (currentQuestion.type === "true_false") {
      correct = answerValue === currentQuestion.correctAnswer;
    }

    setIsAnswerCorrect(correct);
    setShowFeedback(true);

    // Update user answers array
    const newAnswer = {
      questionId: currentQuestion.id,
      questionText: currentQuestion.question,
      userAnswer:
        currentQuestion.type === "multiple_choice"
          ? currentQuestion.options[answerIndex]
          : answerValue.toString(),
      correctAnswer:
        currentQuestion.type === "multiple_choice"
          ? currentQuestion.options[currentQuestion.correctAnswer]
          : currentQuestion.correctAnswer.toString(),
      isCorrect: correct,
      explanation: currentQuestion.explanation,
    };

    setUserAnswers((prev) => [...prev, newAnswer]);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < totalQuestions) {
      // Move to next question
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz completed
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setLoading(true);

    const quizResult = {
      date: new Date().toISOString(),
      score: score,
      totalQuestions: totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      answers: userAnswers,
    };

    try {
      // Save quiz result to AsyncStorage
      const existingHistory = await AsyncStorage.getItem("quizHistory");
      let history = existingHistory ? JSON.parse(existingHistory) : [];
      history.push(quizResult);

      // Keep only last 10 quiz results
      if (history.length > 10) {
        history = history.slice(-10);
      }

      await AsyncStorage.setItem("quizHistory", JSON.stringify(history));
      await AsyncStorage.setItem("lastQuizResult", JSON.stringify(quizResult));

      setQuizCompleted(true);
    } catch (error) {
      console.error("Error saving quiz result:", error);
      Alert.alert("Error", "Failed to save quiz result");
    } finally {
      setLoading(false);
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsAnswerCorrect(false);
    setQuizCompleted(false);
    setScore(0);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressContent}>
        <View style={styles.progressHeader}>
          <View style={styles.titleWithBack}>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.progressTitle}>Math Quiz</Text>
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1}/{totalQuestions}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>
    </View>
  );

  const renderMultipleChoiceQuestion = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>

      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          let buttonStyle = [styles.optionButton];
          let textStyle = [styles.optionText];

          if (showFeedback) {
            if (index === currentQuestion.correctAnswer) {
              buttonStyle.push(styles.correctOption);
              textStyle.push(styles.correctOptionText);
            } else if (index === selectedAnswer && !isAnswerCorrect) {
              buttonStyle.push(styles.wrongOption);
              textStyle.push(styles.wrongOptionText);
            }
          } else if (selectedAnswer === index) {
            buttonStyle.push(styles.selectedOption);
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => handleAnswerSelect(index, option)}
              disabled={showFeedback}
            >
              <Text style={textStyle}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderTrueFalseQuestion = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>

      <View style={styles.trueFalseContainer}>
        {[true, false].map((value, index) => {
          let buttonStyle = [styles.trueFalseButton];
          let textStyle = [styles.trueFalseText];

          if (showFeedback) {
            if (value === currentQuestion.correctAnswer) {
              buttonStyle.push(styles.correctOption);
              textStyle.push(styles.correctOptionText);
            } else if (selectedAnswer === index && !isAnswerCorrect) {
              buttonStyle.push(styles.wrongOption);
              textStyle.push(styles.wrongOptionText);
            }
          } else if (selectedAnswer === index) {
            buttonStyle.push(styles.selectedOption);
          }

          return (
            <TouchableOpacity
              key={index}
              style={buttonStyle}
              onPress={() => handleAnswerSelect(index, value)}
              disabled={showFeedback}
            >
              <Icon
                name={value ? "check-circle" : "cancel"}
                size={24}
                color={textStyle[0].color || "#333"}
              />
              <Text style={textStyle}>{value ? "True" : "False"}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderFeedback = () => {
    if (!showFeedback) return null;

    return (
      <View style={styles.feedbackContainer}>
        <View
          style={[
            styles.feedbackHeader,
            isAnswerCorrect ? styles.correctFeedback : styles.wrongFeedback,
          ]}
        >
          <Icon
            name={isAnswerCorrect ? "check-circle" : "cancel"}
            size={24}
            color="#fff"
          />
          <Text style={styles.feedbackHeaderText}>
            {isAnswerCorrect ? "Correct!" : "Oops! Wrong answer"}
          </Text>
        </View>

        <Text style={styles.explanationText}>
          {currentQuestion.explanation}
        </Text>

        <TouchableOpacity
          style={[globalStyles.button, styles.nextButton]}
          onPress={handleNextQuestion}
        >
          <Text style={globalStyles.buttonText}>
            {currentQuestionIndex + 1 < totalQuestions
              ? "Next Question"
              : "Finish Quiz"}
          </Text>
          <Icon name="arrow-forward" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderQuizResults = () => (
    <ScrollView style={styles.resultsContainer}>
      <View style={styles.scoreContainer}>
        <Text style={styles.congratsText}>Quiz Completed! 🎉</Text>
        <Text style={styles.scoreText}>
          Your Score: {score} out of {totalQuestions}
        </Text>
        <Text style={styles.percentageText}>
          {Math.round((score / totalQuestions) * 100)}%
        </Text>

        <View style={styles.scoreCircle}>
          <Text style={styles.scoreCircleText}>
            {Math.round((score / totalQuestions) * 100)}%
          </Text>
        </View>
      </View>

      <View style={styles.reviewContainer}>
        <Text style={styles.reviewTitle}>Review Your Answers:</Text>

        {userAnswers.map((answer, index) => (
          <View key={index} style={styles.reviewItem}>
            <Text style={styles.reviewQuestionNumber}>Q{index + 1}:</Text>
            <Text style={styles.reviewQuestion}>{answer.questionText}</Text>

            <View style={styles.answerComparison}>
              <View style={styles.answerRow}>
                <Text style={styles.answerLabel}>Your Answer:</Text>
                <Text
                  style={[
                    styles.answerValue,
                    answer.isCorrect
                      ? styles.correctAnswer
                      : styles.wrongAnswer,
                  ]}
                >
                  {answer.userAnswer}
                </Text>
              </View>

              {!answer.isCorrect && (
                <View style={styles.answerRow}>
                  <Text style={styles.answerLabel}>Correct Answer:</Text>
                  <Text style={[styles.answerValue, styles.correctAnswer]}>
                    {answer.correctAnswer}
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.reviewExplanation}>{answer.explanation}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[globalStyles.button, styles.retakeButton]}
          onPress={retakeQuiz}
        >
          <Text style={globalStyles.buttonText}>Retake Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.backButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={[globalStyles.container]}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Saving your results...</Text>
      </View>
    );
  }

  if (quizCompleted) {
    return (
      <SafeAreaView
        style={[globalStyles.container, { justifyContent: "flex-start" }]}
      >
        {renderQuizResults()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[globalStyles.container, { justifyContent: "flex-start" }]}
    >
      {renderProgressBar()}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentQuestion.type === "multiple_choice"
          ? renderMultipleChoiceQuestion()
          : renderTrueFalseQuestion()}

        {renderFeedback()}
      </ScrollView>
    </SafeAreaView>
  );
};

// ========== STYLES ==========
// Add these styles at the bottom of QuizScreen.js file
const styles = {
  header: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  titleWithBack: {
    flexDirection: "row",
    alignItems: "center",
  },
  backIcon: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  progressContainer: {
    width: "100%",
    backgroundColor: "#fff",
    paddingBottom: 15,
    paddingTop: 15, // Add top padding since header is removed
  },
  progressContent: {
    paddingHorizontal: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  progressText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  progressBar: {
    height: 3,
    backgroundColor: "#E5E7EB",
    width: "100%",
    borderRadius: 0,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#DC2626",
    borderRadius: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    width: "100%",
  },
  questionContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    width: "100%",
    alignSelf: "stretch",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
    width: "100%",
  },
  optionButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 15,
    alignItems: "center",
    width: "100%",
    alignSelf: "stretch",
  },
  selectedOption: {
    borderColor: "#DC2626",
    backgroundColor: "#fef2f2",
  },
  correctOption: {
    borderColor: "#10B981",
    backgroundColor: "#ecfdf5",
  },
  wrongOption: {
    borderColor: "#EF4444",
    backgroundColor: "#fef2f2",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  correctOptionText: {
    color: "#10B981",
  },
  wrongOptionText: {
    color: "#EF4444",
  },
  trueFalseContainer: {
    flexDirection: "row",
    gap: 15,
    width: "100%",
  },
  trueFalseButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 20,
    gap: 8,
    minWidth: 0, // Prevents flex shrinking issues
  },
  trueFalseText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  feedbackContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 20,
    width: "100%",
    alignSelf: "stretch",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  feedbackHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10,
  },
  correctFeedback: {
    backgroundColor: "#10B981",
  },
  wrongFeedback: {
    backgroundColor: "#EF4444",
  },
  feedbackHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  explanationText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    padding: 15,
  },
  nextButton: {
    margin: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#10B981",
  },
  resultsContainer: {
    flex: 1,
  },
  scoreContainer: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  congratsText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 5,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#DC2626",
    marginVertical: 10,
  },
  scoreCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  scoreCircleText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  reviewContainer: {
    margin: 20,
    marginTop: 0,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  reviewItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  reviewQuestionNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#DC2626",
  },
  reviewQuestion: {
    fontSize: 16,
    color: "#333",
    marginVertical: 8,
  },
  answerComparison: {
    gap: 5,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  answerLabel: {
    fontSize: 14,
    color: "#666",
    width: 100,
  },
  answerValue: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  correctAnswer: {
    color: "#10B981",
  },
  wrongAnswer: {
    color: "#EF4444",
  },
  reviewExplanation: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionButtons: {
    padding: 20,
    gap: 15,
  },
  retakeButton: {
    backgroundColor: "#10B981",
  },
  backButton: {
    backgroundColor: "#6B7280",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
};

export default QuizScreen;
