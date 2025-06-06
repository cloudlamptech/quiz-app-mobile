/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import {Header, Icon, Image, CheckBox, Text} from '@rneui/themed';
// import Logo from './src/media/logo-vd.png'; // Local asset

const questions = [
  {
    question: "What's the capital of France?",
    options: ['Berlin', 'Madrid', 'Paris', 'Lisbon'],
    answer: 'Paris',
  },
  {
    question: "What's 2 + 2?",
    options: ['3', '4', '5', '6'],
    answer: '4',
  },
  {
    question: "What's the boiling point of water?",
    options: ['90°C', '100°C', '80°C', '120°C'],
    answer: '100°C',
  },
];

const App = () => {
  const [currentQuestionIndex] = useState(0);
  const {question, options} = questions[currentQuestionIndex];
  const [checked, setChecked] = React.useState(true);
  const toggleCheckbox = () => setChecked(!checked);

  const handleMenuPress = () => {
    console.log('Menu clicked!');
  };

  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <SafeAreaView>
          <Header
            containerStyle={styles.statusBar}
            leftComponent={
              <Image
                source={require('./src/media/logo-vd.png')}
                style={styles.logo}
              />
            }
            rightComponent={
              <Icon name="menu" type="feather" onPress={handleMenuPress} />
            }
          />
        </SafeAreaView>
        <View style={styles.quizcontainer}>
          <Text style={styles.question}>{question}</Text>
          {options.map((option, index) => (
            <CheckBox
              checked={checked}
              key={index}
              title={option}
              iconType="material-community"
              checkedIcon="checkbox-marked"
              uncheckedIcon="checkbox-blank-outline"
              checkedColor="green"
              onPress={toggleCheckbox}
              //onPress={() => handleAnswer(option)}
            />
          ))}
        </View>
      </SafeAreaProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  logo: {
    width: 120, // Try increasing the size
    height: 60,
    borderRadius: 1,
    resizeMode: 'contain',
  },
  quizcontainer: {
    marginTop: 16,
    flex: 1,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
    lineHeight: 24,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  question: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default App;
