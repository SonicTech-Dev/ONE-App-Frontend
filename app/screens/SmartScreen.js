import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Animated, Alert } from 'react-native';
import Header from '../components/Smart/Header';
import StatsSection from '../components/Smart/StatsSection';
import Tabs from '../components/Smart/Tabs';
import Screen from '../components/Screen';
import useColors from '../hooks/useColors';
import DevicModal from '../components/Modal';

import { INITIAL_DEVICE_CATEGORIES, LAN_HEADERS } from '../components/Smart/SmartScreenSections/SmartScreen.constants';
import { controlDevice, deviceStatus } from '../components/Smart/SmartScreenSections/api';
import styles from '../components/Smart/SmartScreenSections/SmartScreen.styles';
import DeviceGrid from '../components/Smart/SmartScreenSections/DeviceGrid';

export default function SmartScreen({ navigation }) {
  const [selectedOption, setSelectedOption] = useState('WAN');
  const [deviceCategories, setDeviceCategories] = useState(INITIAL_DEVICE_CATEGORIES);
  const scrollY = useRef(new Animated.Value(0)).current;
  const colors = useColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedDeviceStatus, setSelectedDeviceStatus] = useState(null);

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -250],
    extrapolate: 'clamp',
  });

  const tabsTranslateY = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [200, 0],
    extrapolate: 'clamp',
  });

  const [activeTab, setActiveTab] = useState('All Devices');
  const allDevices = deviceCategories.flatMap((category) => category.items);
  const categories = [{ category: 'All Devices', items: allDevices }, ...deviceCategories];
  const filteredDevices = categories.find((c) => c.category === activeTab)?.items || [];

  const handleTabChange = (tab) => setActiveTab(tab);

  useEffect(() => {
    if (modalVisible && selectedDevice) {
      const mode = selectedOption.toLowerCase();
      const dev = selectedDevice[mode];
      if (!dev) {
        setSelectedDeviceStatus(null);
        return;
      }
      deviceStatus(dev.device_id, selectedOption, setSelectedDeviceStatus, LAN_HEADERS);
    } else {
      setSelectedDeviceStatus(null);
    }
  }, [modalVisible, selectedDevice, selectedOption]);

  // Device control handlers
  const handleToggle = (device, newControl) => {
    const mode = selectedOption.toLowerCase();
    const dev = device[mode];
    if (!dev || !dev.commandPair) {
      Alert.alert('Not supported', `This device cannot be controlled via ${selectedOption}.`);
      return;
    }
    const newIsOn = newControl === 'on';
    setDeviceCategories((prevCats) =>
      prevCats.map((cat) => ({
        ...cat,
        items: cat.items.map((d) =>
          d.title === device.title && d.location === device.location
            ? { ...d, isOn: newIsOn, status: newIsOn ? 'On' : 'Off' }
            : d
        ),
      }))
    );
    const command = dev.commandPair[newControl];
    controlDevice(dev.device_id, dev.ability_id, command, null, selectedOption, LAN_HEADERS);
    deviceStatus(dev.device_id, selectedOption, setSelectedDeviceStatus, LAN_HEADERS);
  };

  const handleSetPosition = (device, position) => {
    const mode = selectedOption.toLowerCase();
    const dev = device[mode];
    if (!dev || !dev.commandPair) {
      Alert.alert('Not supported', `This device cannot be controlled via ${selectedOption}.`);
      return;
    }
    const command = dev.commandPair['on'];
    const attribute = mode === 'lan'
      ? { position }
      : { position_percent: position };
    controlDevice(dev.device_id, dev.ability_id, command, attribute, selectedOption, LAN_HEADERS);
  };

  const handleSetTemperature = (device, temperature) => {
    const mode = selectedOption.toLowerCase();
    const dev = device[mode];
    if (!dev || !dev.commandPair) {
      Alert.alert('Not supported', `This device cannot be controlled via ${selectedOption}.`);
      return;
    }
    const attribute = mode === 'lan'
      ? { target_temperature: temperature }
      : { preset_temperature: temperature };
    const command = dev.commandPair['on'];
    controlDevice(dev.device_id, dev.ability_id, command, attribute, selectedOption, LAN_HEADERS);
  };

  const handleSetHVACMode = (device, HVACmode, temperature) => {
    const mode = selectedOption.toLowerCase();
    const dev = device[mode];
    if (!dev || !dev.commandPair) {
      Alert.alert('Not supported', `This device cannot be controlled via ${selectedOption}.`);
      return;
    }
    const attribute = mode === 'lan'
      ? { target_temperature: temperature }
      : { hvac_mode: HVACmode };
    const command = dev.commandPair['on'];
    controlDevice(dev.device_id, dev.ability_id, command, attribute, selectedOption, LAN_HEADERS);
  };

  const handleSetFanSpeed = (device, speed, temperature) => {
    const mode = selectedOption.toLowerCase();
    const dev = device[mode];
    if (!dev || !dev.commandPair) {
      Alert.alert('Not supported', `This device cannot be controlled via ${selectedOption}.`);
      return;
    }
    const attribute = mode === 'lan'
      ? { target_temperature: temperature }
      : { fan_mode: speed };
    const command = dev.commandPair['on'];
    controlDevice(dev.device_id, dev.ability_id, command, attribute, selectedOption, LAN_HEADERS);
  };

  const handleSetBrightness = (device, Brightness) => {
    const mode = selectedOption.toLowerCase();
    const dev = device[mode];
    if (!dev || !dev.commandPair) {
      Alert.alert('Not supported', `This device cannot be controlled via ${selectedOption}.`);
      return;
    }
    const attribute = mode === 'lan'
      ? { brightness_pct: Brightness }
      : { brightness: Brightness };
    const command = dev.commandPair['on'];
    controlDevice(dev.device_id, dev.ability_id, command, attribute, selectedOption, LAN_HEADERS);
  };

  return (
    <Screen>
      <Animated.View style={[styles.headerContainer, { transform: [{ translateY: headerTranslateY }] }]}>
        <Header />
        <StatsSection selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      </Animated.View>
      <Animated.View style={[styles.tabsContainer, { transform: [{ translateY: tabsTranslateY }] }]}>
        <Tabs tabs={categories.map((c) => c.category)} onTabChange={handleTabChange} activeTab={activeTab} />
      </Animated.View>
      <DeviceGrid
        filteredDevices={filteredDevices}
        handleToggle={handleToggle}
        navigation={navigation}
        setSelectedDevice={setSelectedDevice}
        setModalVisible={setModalVisible}
        selectedOption={selectedOption}
      />
      <DevicModal
        selectedDevice={selectedDevice}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handleToggle={handleToggle}
        handleSetPosition={handleSetPosition}
        handleSetTemperature={handleSetTemperature}
        handleSetHVACMode={handleSetHVACMode}
        handleSetFanSpeed={handleSetFanSpeed}
        handleSetBrightness={handleSetBrightness}
        deviceStatus={selectedDeviceStatus}
      />
    </Screen>
  );
}