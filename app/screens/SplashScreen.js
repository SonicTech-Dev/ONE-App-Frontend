import React,{useEffect} from 'react';
import {View, StyleSheet,Image,Animated} from 'react-native';

function SplashScreen(props) {

    return(
    <View style={styles.splashContainer}>
        <Image
          source={require('../assets/one_splash.png')} // Use your splash image here
          style={styles.splashImage}
        />
      </View>
    );
}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Adjust as needed
  },
  splashScreen: {
    width: 200, // Adjust width/height as needed
    height: 200,
    backgroundColor: 'white', // Example background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Match the background color from app.config.js
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Or 'cover' if you prefer it to fill the screen
  },
});

export default SplashScreen;