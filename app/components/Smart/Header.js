import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import useColors from '../../hooks/useColors';

const Header = ({ name }) => {

  const colors=useColors()

  return(
  <View style={styles.headerContainer}>
    <View style={{flexDirection:'column', flex:1, justifyContent:'center'}}>
    <Text style={styles.title}>Manage Home</Text>
    <Text style={styles.greeting}>
      Hey, <Text style={styles.boldText}>{name}</Text>
    </Text>
    </View>
  </View>
)};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    color: '#7d8da6',
  },
  greeting: {
    fontSize: 20,
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
