import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const DeviceTile = ({
  selectedOption,
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
    ? { onPress, activeOpacity: 0.85, disabled }
    : {};

  // Don't show interactive power controls if device is a sensor or panel
  const isSensor = title.toLowerCase().includes("sensor") || 
                   title.toLowerCase().includes("detector");
  const isPanel = title.toLowerCase().includes("hypanel");
  const hideStatusForPanel =
    title.toLowerCase().includes('hypanel supreme') ||
    title.toLowerCase().includes('hypanel lux');

  // Keep tile surface consistent with the Smart page's purple-white visual language.
  const glassStyle = {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8dbff',
  };

  return (
    <Wrapper style={[styles.tileContainer, glassStyle, style]} {...wrapperProps}>
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: color }]}>
          {iconName && library === 'Ionicons' && <Ionicons name={iconName} size={28} color="#ffffff" />}
          {iconName && library === 'MaterialCommunityIcons' && <MaterialCommunityIcons name={iconName} size={28} color="#ffffff" />}
          {iconName && library === 'FontAwesome6' && <FontAwesome6 name={iconName} size={26} color="#ffffff" />}
          {iconName && library === 'MaterialIcons' && <MaterialIcons name={iconName} size={30} color="#ffffff" />}
        </View>
        
        {/* Sensor Status Indicator */}
        {isSensor && (
          <View style={[styles.sensorBadge, isOn ? styles.sensorActive : styles.sensorInactive]}>
            <View style={[styles.pulseDot, isOn ? styles.dotActive : styles.dotInactive]} />
            <Text style={styles.sensorText}>{status || (isOn ? 'Triggered' : 'Normal')}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>

      <View style={styles.footer}>
        {!isSensor && !hideStatusForPanel ? <Text style={styles.status}>{status}</Text> : <View />}
        
        {/* Realistic Power Pill Button */}
        {onToggle && !isSensor && !isPanel && (
          <TouchableOpacity
            style={[styles.powerButton, isOn ? styles.powerButtonActive : styles.powerButtonInactive]}
            onPress={handleToggle}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <View style={styles.powerContent}>
              <View style={[styles.powerIndicator, isOn ? styles.indicatorActive : styles.indicatorInactive]} />
              <Text style={[styles.powerText, isOn ? styles.powerTextActive : styles.powerTextInactive]}>
                {isOn ? 'ON' : 'OFF'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </Wrapper>
  );
};

export default DeviceTile;

const styles = StyleSheet.create({
  tileContainer: {
    flex: 1,
    padding: 18,
    borderRadius: 22,
    marginRight: 16,
    shadowColor: '#7f58e2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6f4bd8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  content: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minHeight: 58,
    marginBottom: 20,
    width: '100%',
  },
  title: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '800',
    color: '#2f2853',
    letterSpacing: 0.1,
    marginBottom: 4,
  },
  location: {
    fontSize: 13,
    color: '#8a7cae',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  status: {
    fontSize: 14,
    color: '#6a4ab8',
    fontWeight: '700',
    marginBottom: 2,
  },
  
  // Power Button Styles
  powerButton: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  powerButtonActive: {
    backgroundColor: '#6f4bd8',
    borderColor: '#6f4bd8',
    shadowColor: '#6f4bd8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  powerButtonInactive: {
    backgroundColor: '#f4eeff',
    borderColor: '#e8dbff',
  },
  powerIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  indicatorActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  indicatorInactive: {
    backgroundColor: '#b9a7e7',
  },
  powerText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  powerTextActive: {
    color: '#ffffff',
  },
  powerTextInactive: {
    color: '#6d52b2',
  },

  // Sensor Badge Styles
  sensorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f1eaff',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  dotActive: {
    backgroundColor: '#ff3b30', // Alert Red
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  dotInactive: {
    backgroundColor: '#34c759', // Safe Green
    shadowColor: '#34c759',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  sensorText: {
    color: '#5d46a2',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  }
});