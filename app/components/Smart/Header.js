import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ name }) => {
  const displayName = (name || '').trim() || 'there';

  return(
  <View style={styles.headerContainer}>
    <View style={styles.textBlock}>
    <Text style={styles.greeting}>
      Hey, <Text style={styles.boldText}>{displayName}</Text>
    </Text>
    <Text style={styles.subtitle}>Your home is ready</Text>
    </View>
  </View>
)};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textBlock: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 21,
    color: '#2f2360',
    flex: 1,
    letterSpacing: 0.2,
  },
  boldText: {
    fontWeight: '800',
  },
  subtitle: {
    marginTop: 2,
    color: '#8d79c8',
    fontSize: 13,
    fontWeight: '600',
  },
});
