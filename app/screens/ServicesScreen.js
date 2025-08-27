import React, {useRef, useCallback, useState} from 'react';
import { ScrollView, View, SafeAreaView, StyleSheet, Animated } from 'react-native';
import Header from '../components/Smart/Header';
import StatsSection from '../components/Smart/StatsSection';
import Tabs from '../components/Services/Tabs';
import Tile from '../components/Services/Tile';
import Screen from '../components/Screen'

export default function ServicesScreen() {

    // State to track the active tab
    const [activeTab, setActiveTab] = useState('Services');

    // Dataset for devices
    const serviceCategories = [
      {
        category: 'Services',
        items: [
          {
            id: 1,
            name: 'Plumbing',
            description: 'Fix leaking pipes, clogged drains, and other plumbing issues.',
            iconName: 'water',
            color: '#32a852', // Green for plumbing
          },
          {
            id: 2,
            name: 'Electrical',
            description: 'Repair electrical faults, install new wiring, or replace fixtures.',
            iconName: 'flash',
            color: '#f4b400', // Yellow for electrical
          },
          {
            id: 3,
            name: 'Air Conditioning',
            description: 'Service and repair air conditioning units.',
            iconName: 'snow',
            color: '#4ac0ff', // Blue for cooling
          },
          {
            id: 4,
            name: 'Heating',
            description: 'Repair or maintain heating systems, including boilers and radiators.',
            iconName: 'flame',
            color: '#e63946', // Red for heating
          },
          {
            id: 5,
            name: 'Pest Control',
            description: 'Eliminate pests like rodents, insects, and termites.',
            iconName: 'bug',
            color: '#ff4500', // Orange for pest control
          },
          {
            id: 6,
            name: 'Cleaning',
            description: 'General cleaning services for common areas and apartments.',
            iconName: 'bed',
            color: '#6a5acd', // Purple for cleaning
          },
          {
            id: 7,
            name: 'Security',
            description: 'Provide security personnel and systems, including CCTV.',
            iconName: 'shield',
            color: '#1e90ff', // Blue for security
          },
          {
            id: 8,
            name: 'Gardening',
            description: 'Maintain gardens, lawns, and outdoor spaces.',
            iconName: 'leaf',
            color: '#32d2d6', // Teal for gardening
          },
          {
            id: 9,
            name: 'Waste Management',
            description: 'Handle waste collection and recycling services.',
            iconName: 'trash',
            color: '#7f8c8d', // Grey for waste management
          },
        ],
      },
      {
        category: 'Open',
        items: [
          {
            id: 2,
            name: 'Electrical',
            description: 'Repair electrical faults, install new wiring, or replace fixtures.',
            iconName: 'flash',
            color: '#f4b400', // Yellow for electrical
          },        
        ],
      },
      {
        category: 'History',
        items: [],
      }
    ];    
  
  
    const categories = [
      ...serviceCategories,
    ];
  
    // Filter devices based on the active tab
    const filteredDevices = categories.find((c) => c.category === activeTab)?.items || [];
  
    // Handle tab selection
    const handleTabChange = (tab) => {
      setActiveTab(tab);
    };

  return (
    <Screen>
        <Tabs 
          tabs={categories.map((c) => c.category)} 
          onTabChange={handleTabChange} 
          activeTab={activeTab} // Pass the active tab to the Tabs component
        />

      <ScrollView
      contentContainerStyle={styles.scrollContainer}
      scrollEventThrottle={16}
    >
      {/* Group devices into rows of two */}
      {filteredDevices.reduce((result, device, index) => {
        if (index % 2 === 0) {
          result.push([device]); // Start a new row
        } else {
          result[result.length - 1].push(device); // Add to the last row
        }
        return result;
      }, []).map((row, rowIndex) => (
        <View key={rowIndex} style={styles.deviceRow}>
          {row.map((device, deviceIndex) => (
            <Tile
              key={deviceIndex}
              title={device.name}
              location={device.location}
              status={device.status}
              color={device.color}
              isOn={device.isOn}
              iconName={device.iconName}
            />
          ))}
        </View>
      ))}
    </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
    backgroundColor: '#f8f9fc',
    height: 200,
  },
  tabsContainer: {
    // position: 'absolute',
    // top: 200,
    width: '100%',
    zIndex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    // paddingTop: 200,
    paddingHorizontal:20
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});