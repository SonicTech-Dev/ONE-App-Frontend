import React, { useRef, useState, useEffect } from 'react';
import { Animated, Alert } from 'react-native';
import Header from '../components/Smart/Header';
import StatsSection from '../components/Smart/StatsSection';
import Tabs from '../components/Smart/Tabs';
import Screen from '../components/Screen';
import useColors from '../hooks/useColors';
import DevicModal from '../components/Modal';
import CallbackServer from '../components/Services/Server';
import { INITIAL_DEVICE_CATEGORIES } from '../components/Smart/SmartScreenSections/SmartScreen.constants';
import { controlDevice, deviceStatus } from '../components/Smart/SmartScreenSections/api';
import styles from '../components/Smart/SmartScreenSections/SmartScreen.styles';
import DeviceGrid from '../components/Smart/SmartScreenSections/DeviceGrid';
import { buildLanHeaders } from '../components/Smart/SmartScreenSections/auth';
import CallbackRegistration from '../components/Services/CallbackRegister';

export default function SmartScreen({ navigation }) {
  const [selectedOption, setSelectedOption] = useState('LAN');
  const [deviceCategories, setDeviceCategories] = useState(INITIAL_DEVICE_CATEGORIES);
  const scrollY = useRef(new Animated.Value(0)).current;
  const colors = useColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedDeviceStatus, setSelectedDeviceStatus] = useState(null);
  const [lanHeaders, setLanHeaders] = useState(null);
  const [callbackRegistered, setCallbackRegistered] = useState(false);

  useEffect(() => {
    console.log('[SmartScreen] selectedOption:', selectedOption);
    console.log('[SmartScreen] lanHeaders:', lanHeaders);
    console.log('[SmartScreen] callbackRegistered:', callbackRegistered);
  }, [selectedOption, lanHeaders, callbackRegistered]);

  useEffect(() => {
    if (selectedOption === 'LAN') {
      if (!lanHeaders) {
        async function fetchHeaders() {
          try {
            const headers = await buildLanHeaders();
            console.log('[SmartScreen] buildLanHeaders result:', headers);
            setLanHeaders(headers);
          } catch (e) {
            Alert.alert('Token Error', 'Failed to fetch access token.');
          }
        }
        fetchHeaders();
      }
    } else {
      setLanHeaders(null);
      setCallbackRegistered(false); // reset registration if leaving LAN
    }
  }, [selectedOption]);

  useEffect(() => {
    if (
      selectedOption === 'LAN' &&
      lanHeaders &&
      lanHeaders.token &&
      !callbackRegistered
    ) {
      console.log('[SmartScreen] Ready to register callback!');
    }
  }, [selectedOption, lanHeaders, callbackRegistered]);

  // This function updates device state based on callback payload
  const handleRequest = (req, payload) => {
    console.log('Callback API received:', { req, payload });

    // Check payload structure (e.g., event_type, device data)
    if (
      payload?.event_type === 'device' &&
      payload?.data?.payload?.device_id &&
      Array.isArray(payload?.data?.payload?.abilities)
    ) {
      payload.data.payload.abilities.forEach((ability) => {
        const deviceId = payload.data.payload.device_id;
        const state = ability.state; // "on" or "off"
        // Update deviceCategories state for LAN devices
        setDeviceCategories((prevCats) =>
          prevCats.map((cat) => ({
            ...cat,
            items: cat.items.map((d) =>
              d.lan?.device_id === deviceId
                ? { ...d, isOn: state === "on", status: state === "on" ? "On" : "Off" }
                : d
            ),
          }))
        );
      });
    }
  };

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
    if (modalVisible && selectedDevice && lanHeaders) {
      const mode = selectedOption.toLowerCase();
      const dev = selectedDevice[mode];
      if (!dev) {
        setSelectedDeviceStatus(null);
        return;
      }
      deviceStatus(dev.device_id, selectedOption, setSelectedDeviceStatus, lanHeaders);
    } else {
      setSelectedDeviceStatus(null);
    }
  }, [modalVisible, selectedDevice, selectedOption, lanHeaders]);

  const handleToggle = async (device, newControl) => {
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
    const headers = lanHeaders;
    controlDevice(dev.device_id, dev.ability_id, command, null, selectedOption);
    deviceStatus(dev.device_id, selectedOption, setSelectedDeviceStatus, headers);
  };

  const handleSetPosition = async (device, position) => {
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
    const headers = lanHeaders || (await buildLanHeaders());
    controlDevice(dev.device_id, dev.ability_id, command, attribute, selectedOption, headers);
  };

  const handleSetTemperature = async (device, temperature) => {
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
    const headers = lanHeaders || (await buildLanHeaders());
    controlDevice(dev.device_id, dev.ability_id, command, attribute, selectedOption, headers);
  };

  const handleSetHVACMode = async (device, HVACmode, temperature) => {
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
    const headers = lanHeaders || (await buildLanHeaders());
    controlDevice(dev.device_id, dev.ability_id, command, attribute, selectedOption, headers);
  };

  const handleSetFanSpeed = async (device, speed, temperature) => {
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
    const headers = lanHeaders || (await buildLanHeaders());
    controlDevice(dev.device_id, dev.ability_id, command, attribute, selectedOption, headers);
  };

  const handleSetBrightness = async (device, Brightness) => {
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
    const headers = lanHeaders || (await buildLanHeaders());
    controlDevice(dev.device_id, dev.ability_id, command, attribute, selectedOption, headers);
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

      {/* LAN Server for API */}
      <CallbackServer port={8080} onRequest={handleRequest} />

      {/* Callback Registration: only run after token is available */}
      {selectedOption === 'LAN' && !!lanHeaders?.token && !callbackRegistered && (
        <CallbackRegistration
          deviceCallbackUrl="http://192.168.1.125/api/v1.0/callback"
          callbackUrl="http://192.168.1.150:8080/"
          token={lanHeaders?.Authorization?.replace('Bearer ', '')}
          callbackId="c45e846ca23ab42c9ae469d988ae32a96"
          listenList={['device']}
          run={selectedOption === 'LAN' && !!lanHeaders?.Authorization && !callbackRegistered}
          onStatus={(status, res) => {
            if (status === 'success') setCallbackRegistered(true);
            if (status === 'error') Alert.alert('Callback Registration Error', res);
          }}
        />
      )}

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