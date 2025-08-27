import React, {useRef, useCallback, useState} from 'react';
import { ScrollView, View, SafeAreaView, StyleSheet, Animated } from 'react-native';
import Tile from '../components/Discover/Tile'
import Screen from '../components/Screen'
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import useColors from '../hooks/useColors';

export default function AmenitiesScreen() {
  const colors = useColors();

  const discoverCategories = [
    // Amenities Section
    {
      id: 1,
      name: 'Fitness Center',
      description: 'Access our state-of-the-art gym and fitness classes.',
      iconName: 'fitness',
      color: '#32d2d6', // Teal for fitness
      type: 'Amenity',
    },
    {
      id: 2,
      name: 'Swimming Pool',
      description: 'Enjoy a relaxing swim in our well-maintained pool.',
      // iconName: 'pool',
      color: '#1e90ff', // Blue for pool
      type: 'Amenity',
      Icon: <MaterialIcons name="pool" size={80} color={colors.primary} />, // Explicitly provide an icon JSX element
    },
    {
      id: 3,
      name: 'Library',
      description: 'Borrow books or enjoy a quiet space to study.',
      iconName: 'book',
      color: '#ffa500', // Orange for library
      type: 'Amenity',
    },
    {
      id: 4,
      name: 'Lounge Area',
      description: 'Relax or socialize in our comfortable lounge.',
      color: '#8e44ad', // Purple for lounge
      type: 'Amenity',
      Icon: <MaterialCommunityIcons name="sofa" size={80} color={colors.primary} />, // Explicitly provide an icon JSX element
    },
    // Events Section
    {
      id: 5,
      name: 'Community Events',
      description: 'Discover social gatherings, fitness classes, and more.',
      iconName: 'calendar',
      color: '#ff6347', // Coral for events
      type: 'Event',
    },
    {
      id: 6,
      name: 'Workshops',
      description: 'Join skill-building workshops and learn something new.',
      iconName: 'hammer',
      color: '#f39c12', // Yellow for workshops
      type: 'Event',
    },
    {
      id: 7,
      name: 'Movie Nights',
      description: 'Watch movies with friends and neighbors in our screening room.',
      iconName: 'film',
      color: '#34495e', // Grey-blue for movies
      type: 'Event',
    },
    {
      id: 8,
      name: 'Holiday Celebrations',
      description: 'Celebrate holidays with festive community events.',
      iconName: 'gift',
      color: '#e74c3c', // Red for holidays
      type: 'Event',
    },
    // Resources Section
    {
      id: 9,
      name: 'Resident Handbook',
      description: 'Access guidelines and important information for residents.',
      Icon: <MaterialCommunityIcons name="file" size={80} color={colors.primary} />, // Explicitly provide an icon JSX element
      color: '#3498db', // Blue for handbook
      type: 'Resource',
    },
    {
      id: 10,
      name: 'Emergency Contacts',
      description: 'Quickly access emergency numbers and contacts.',
      Icon: <MaterialCommunityIcons name="car-emergency" size={80} color={colors.primary} />, // Explicitly provide an icon JSX element
      color: '#e74c3c', // Red for emergencies
      type: 'Resource',
    },
    // Nearby Attractions
    {
      id: 11,
      name: 'Parks & Trails',
      description: 'Explore nearby parks and walking trails.',
      Icon: <MaterialCommunityIcons name="tree" size={80} color={colors.primary} />, // Explicitly provide an icon JSX element
      color: '#228b22', // Forest green for nature
      type: 'Attraction',
    },
    {
      id: 12,
      name: 'Restaurants & Cafes',
      description: 'Find popular dining spots and cozy cafes near you.',
      iconName: 'restaurant',
      color: '#dc143c', // Crimson for dining
      type: 'Attraction',
    },
    {
      id: 13,
      name: 'Shopping Centers',
      description: 'Discover nearby malls and shopping areas.',
      Icon: <MaterialCommunityIcons name="shopping" size={80} color={colors.primary} />, // Explicitly provide an icon JSX element
      color: '#f1c40f', // Yellow for shopping
      type: 'Attraction',
    },
  ];
    
  return (
    <Screen>
      <ScrollView
      contentContainerStyle={styles.scrollContainer}
      scrollEventThrottle={16}
    >
      {/* Group devices into rows of two */}
      {discoverCategories.reduce((result, device, index) => {
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
              Icon={device.Icon}
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
    paddingTop: 20,
    paddingHorizontal:20
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});