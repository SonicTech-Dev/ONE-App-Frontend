import React, {useRef, useCallback, useState} from 'react';
import { ScrollView, View, SafeAreaView, StyleSheet, Animated } from 'react-native';
import Tile from '../components/Discover/Tile'
import Screen from '../components/Screen'
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useColors from '../hooks/useColors';

export default function ShopScreen() {
  const colors=useColors();
  
  const shopCategories = [
    // Food & Beverages
    {
      id: 1,
      name: 'Restaurants',
      description: 'Order delicious meals from top restaurants.',
      Icon: <MaterialCommunityIcons name="silverware-fork-knife" size={80} color={colors.primary} />,
      color: '#dc143c', // Crimson for dining
      type: 'Food',
    },
    {
      id: 2,
      name: 'Supermarket',
      description: 'Shop for groceries, fresh produce, and essentials.',
      Icon: <MaterialCommunityIcons name="cart" size={80} color={colors.primary} />,
      color: '#f1c40f', // Yellow for supermarket
      type: 'Grocery',
    },
    {
      id: 3,
      name: 'Cafes & Bakeries',
      description: 'Get your favorite coffee, pastries, and snacks.',
      Icon: <MaterialCommunityIcons name="coffee" size={80} color={colors.primary} />,
      color: '#8e44ad', // Purple for cafes
      type: 'Food',
    },
  
    // Health & Beauty
    {
      id: 4,
      name: 'Pharmacy',
      description: 'Order medicines and health essentials.',
      Icon: <MaterialCommunityIcons name="pill" size={80} color={colors.primary} />,
      color: '#e74c3c', // Red for pharmacy
      type: 'Health',
    },
    {
      id: 5,
      name: 'Beauty & Personal Care',
      description: 'Shop for skincare, cosmetics, and grooming essentials.',
      Icon: <MaterialCommunityIcons name="lipstick" size={80} color={colors.primary} />,
      color: '#ff69b4', // Pink for beauty
      type: 'Beauty',
    },
  
    // Home Essentials
    {
      id: 6,
      name: 'Home & Kitchen',
      description: 'Buy home appliances, decor, and kitchen essentials.',
      Icon: <MaterialCommunityIcons name="home" size={80} color={colors.primary} />,
      color: '#3498db', // Blue for home items
      type: 'Home',
    },
    {
      id: 7,
      name: 'Electronics',
      description: 'Get the latest gadgets and accessories.',
      Icon: <MaterialCommunityIcons name="cellphone" size={80} color={colors.primary} />,
      color: '#2ecc71', // Green for electronics
      type: 'Tech',
    },
  
    // Fashion & Lifestyle
    {
      id: 8,
      name: 'Fashion & Accessories',
      description: 'Shop for clothing, shoes, and accessories.',
      Icon: <MaterialCommunityIcons name="tshirt-crew" size={80} color={colors.primary} />,
      color: '#ff8c00', // Orange for fashion
      type: 'Fashion',
    },
    {
      id: 9,
      name: 'Watches & Jewelry',
      description: 'Discover luxury watches and stylish jewelry.',
      Icon: <MaterialCommunityIcons name="watch" size={80} color={colors.primary} />,
      color: '#d4af37', // Gold for jewelry
      type: 'Fashion',
    },
  
    // Miscellaneous
    {
      id: 10,
      name: 'Flowers & Gifts',
      description: 'Send flowers and gifts for special occasions.',
      Icon: <MaterialCommunityIcons name="gift" size={80} color={colors.primary} />,
      color: '#ff6347', // Coral for gifts
      type: 'Gifts',
    },
    {
      id: 11,
      name: 'Pet Supplies',
      description: 'Order pet food, accessories, and care products.',
      Icon: <MaterialCommunityIcons name="dog" size={80} color={colors.primary} />,
      color: '#a0522d', // Brown for pet supplies
      type: 'Pets',
    },
  ];  
    
  return (
    <Screen>
      <ScrollView
      contentContainerStyle={styles.scrollContainer}
      scrollEventThrottle={16}
    >
      {/* Group devices into rows of two */}
      {shopCategories.reduce((result, device, index) => {
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