import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import useColors from '../../hooks/useColors';

const Tabs = ({ tabs, activeTab, onTabChange }) => {
  const colors = useColors();

  return(
  <ScrollView
    horizontal
    style={styles.buttonsContainer}
    contentContainerStyle={{
      alignItems: 'center',
      paddingHorizontal: 20,
    }}
    showsHorizontalScrollIndicator={false}
  >
    {tabs.map((tab, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.tab,
          activeTab === tab && styles.activeTab(colors), // Highlight the active tab
        ]}
        onPress={() => onTabChange(tab)}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === tab && styles.activeTabText, // Change text color for active tab
          ]}
        >
          {tab}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
)};

export default Tabs;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexGrow: 0, // Ensure the container doesn't grow vertically
    marginVertical: 10,
    height: 60,
    width: '100%',
  },
  tab: {
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f0f4f8',
    borderRadius: 16,
  },
  activeTab: (colors)=>({
    backgroundColor: colors.primary, // Highlight color for the active tab
  }),
  tabText: {
    fontSize: 14,
    color: '#2d3748',
  },
  activeTabText: {
    color: '#ffffff', // Text color for the active tab
    fontWeight: 'bold',
  },
});
