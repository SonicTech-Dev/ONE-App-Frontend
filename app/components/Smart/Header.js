import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Header = ({ name }) => {
  return(
  <View style={styles.headerContainer}>
    <View style={{flexDirection:'column', flex:1, justifyContent:'center'}}>
    <Text style={styles.greeting}>
      Hey, <Text style={styles.boldText}>{name}</Text>
    </Text>
    </View>
  </View>
)};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 18,
    color: '#2d3748',
    flex: 1,
  },
  boldText: {
    fontWeight: 'bold',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});
