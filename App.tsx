import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import {Header, Icon, Image} from '@rneui/themed';
import Navigation from './src/Navigation';

const App = () => {
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
        <Navigation />
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
