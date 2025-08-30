import React from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DeviceTile = ({
  title,
  location,
  status,
  color,
  isOn,
  iconName,
  library,
  onToggle,
  commandPair,
  onPress,
  disabled,
  style,
}) => {
  const handleToggle = () => {
    if (onToggle) {
      const newControl = isOn ? 'off' : 'on';
      onToggle(newControl);
    }
  };

  const Wrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress
    ? { onPress, activeOpacity: 0.8, disabled }
    : {};

  // Don't show toggle if device is a sensor
  const isSensor = title.toLowerCase().includes("sensor") || title.toLowerCase().includes("detector");

  return (
    <Wrapper style={[styles.tileContainer, style, { backgroundColor: color }]} {...wrapperProps}>
      <View style={styles.iconContainer}>
        {iconName && library === 'Ionicons' && (
          <Ionicons name={iconName} size={32} color="#ffffff" />
        )}
        {iconName && library === 'MaterialCommunityIcons' && (
          <MaterialCommunityIcons name={iconName} size={32} color="#ffffff" />
        )}
        {iconName && library === 'FontAwesome6' && (
          <FontAwesome6 name={iconName} size={32} color="#ffffff" />
        )}
        {iconName && library === 'MaterialIcons' && (
          <MaterialIcons name={iconName} size={32} color="#ffffff" />
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>
      <View style={styles.footer}>
        <Text style={styles.status}>{status}</Text>
        {onToggle && !isSensor && (
          <Switch
            trackColor={{ false: '#d1d5db', true: '#ffffff' }}
            thumbColor={isOn ? '#32d2d6' : '#ffffff'}
            value={isOn}
            onValueChange={handleToggle}
            disabled={disabled}
          />
        )}
      </View>
    </Wrapper>
  );
};

export default DeviceTile;

const styles = StyleSheet.create({
  tileContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  location: {
    fontSize: 14,
    color: '#ffffff',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  status: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
});