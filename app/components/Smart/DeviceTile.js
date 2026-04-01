import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
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

  // Create a stunning translucent gradient backing by combining dark surface with a subtle colored aura
  const glassStyle = {
    backgroundColor: '#7c59e6',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
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
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>{title}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>

      <View style={styles.footer}>
        {!isSensor ? <Text style={styles.status}>{status}</Text> : <View />}
        
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
    padding: 20,
    borderRadius: 28, // Extreme Apple-like rounding
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  content: {
    alignItems: 'flex-start',
    marginBottom: 20,
    width: '100%',
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  location: {
    fontSize: 13,
    color: '#8e8e93',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  status: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
    marginBottom: 4,
  },
  
  // Power Button Styles
  powerButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  powerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  powerButtonActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  powerButtonInactive: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'transparent',
  },
  powerIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  indicatorActive: {
    backgroundColor: '#966afd',
    shadowColor: '#966afd',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  indicatorInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  powerText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  powerTextActive: {
    color: '#6f4bd8', // Dark text on light pill
  },
  powerTextInactive: {
    color: 'rgba(255, 255, 255, 0.6)',
  },

  // Sensor Badge Styles
  sensorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
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
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  }
});