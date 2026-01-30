import React, { useRef, useState, useEffect } from 'react';
import { Animated, Alert, Platform, PermissionsAndroid, NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { NetworkInfo } from 'react-native-network-info';

const { Akuvox } = NativeModules;

// Reuse the same auth strings you had in Contacts screen
const WAN_SIP_TOKEN =
  'q5sa4p2gwMD6DYkkixg75l/bymQWSz8kPiFiXSNwJflACaNIDR7+4ykJfHCTkZ8tRR0AIePjUBrV+qSskC7F2AYBWO30e198FGr187+vEdDVp0Y8AghGBK6pPe2GVLi9SDMf3OQkPfqyaxTlOLKn9ydX3MDyvYiKsuodonqmKjAg3PpmfEezF76tQNBNbDBztjSHe+Nkz8Yb01jkqtln2qdX8FKQyk/Rzza1ZYAjJzS6DBgcGhLNpwPz7jrjOF1v';
const LAN_SIP_TOKEN =
  '4cUSgR92G0HEVtdqewd7AT4zS22YVQVM1/7OlVH7QnsnwtqrXdLYVtz8poL/nhWnUEVM7QTea2rWri23BdQHUxyhWOz3IuzWo9o/S3hS93c=';

// Permissions helper (Android)
async function requestPermissionsIfNeeded() {
  if (Platform.OS === 'android') {
    const camera = PermissionsAndroid.PERMISSIONS.CAMERA;
    const audio = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    const granted = await PermissionsAndroid.requestMultiple([camera, audio]);
    return (
      granted[camera] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[audio] === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
}

// IPv4 validation
const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

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

  // Local IPv4 state
  const [localIpv4, setLocalIpv4] = useState(null);

  // SIP state
  const [sipInitialized, setSipInitialized] = useState(false);
  const [lastRegisteredTransport, setLastRegisteredTransport] = useState(null); // 'lan' | 'wan' | null

  useEffect(() => {
    console.log('[SmartScreen] selectedOption:', selectedOption);
    console.log('[SmartScreen] callbackRegistered:', callbackRegistered);
  }, [selectedOption, lanHeaders, callbackRegistered]);

  // Init SDK once when we land on SmartScreen and detect device IPv4
  useEffect(() => {
    let mounted = true;
    (async () => {
      const permissionsGranted = await requestPermissionsIfNeeded();
      if (!permissionsGranted) {
        Alert.alert('Permission Denied', 'Camera and microphone permissions are required for calls.');
        return;
      }
      try {
        Akuvox?.initSdk?.();
        if (mounted) {
          setSipInitialized(true);
          console.log('[SmartScreen] SDK initialized.');
        }
      } catch (e) {
        console.warn('[SmartScreen] initSdk error:', e);
        Alert.alert('SDK Error', e?.message || 'Failed to initialize SIP SDK.');
      }

      // Detect local IPv4 address
      try {
        const ipV4 = await NetworkInfo.getIPV4Address(); // returns IPv4 string
        console.log('[SmartScreen] Local IPv4 detected:', ipV4);
        if (mounted && ipV4 && ipv4Regex.test(ipV4)) setLocalIpv4(ipV4);
        else console.warn('[SmartScreen] IPv4 not available or invalid:', ipV4);
      } catch (e) {
        console.warn('[SmartScreen] Unable to get IPv4 address:', e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Keep the old behavior: build LAN headers when LAN is selected
  useEffect(() => {
    if (selectedOption === 'LAN') {
      if (!lanHeaders) {
        async function fetchHeaders() {
          try {
            const headers = await buildLanHeaders();
            console.log('[SmartScreen] LAN headers fetched:', headers);
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
  }, [selectedOption, lanHeaders]);

  // Auto register SIP whenever selectedOption changes (LAN/WAN),
  // after SDK init
  useEffect(() => {
    const register = async () => {
      if (!sipInitialized) return;

      try {
        if (selectedOption === 'LAN') {
          if (lastRegisteredTransport !== 'lan') {
            console.log('[SmartScreen] Registering SIP via LAN...');
            const res = await Akuvox.registerSipLan(LAN_SIP_TOKEN, 'User bela');
            console.log('[SmartScreen] LAN register result:', res);
            setLastRegisteredTransport('lan');
            await AsyncStorage.setItem('registeredTransport', 'lan');
          }
        } else if (selectedOption === 'WAN') {
          if (lastRegisteredTransport !== 'wan') {
            console.log('[SmartScreen] Registering SIP via WAN...');
            const res = await Akuvox.registerSip(WAN_SIP_TOKEN, 'User bela');
            console.log('[SmartScreen] WAN register result:', res);
            setLastRegisteredTransport('wan');
            await AsyncStorage.setItem('registeredTransport', 'wan');
          }
        }
      } catch (error) {
        console.warn('[SmartScreen] SIP registration error:', error);
        Alert.alert('SIP Registration Error', error?.message || 'Failed to register SIP.');
      }
    };

    register();
  }, [sipInitialized, selectedOption, lastRegisteredTransport]);

  useEffect(() => {
    if (
      selectedOption === 'LAN' &&
      lanHeaders &&
      !callbackRegistered
    ) {
      console.log('[SmartScreen] Ready to register callback!');
    }
  }, [selectedOption, lanHeaders, callbackRegistered]);

  // This function updates device state based on callback payload
  const handleRequest = (req, payload) => {
    if (
      payload?.event_type === 'device' &&
      payload?.data?.payload?.device_id &&
      Array.isArray(payload?.data?.payload?.abilities)
    ) {
      payload.data.payload.abilities.forEach((ability) => {
        const deviceId = payload.data.payload.device_id;
        const state = ability.state; // "on" or "off"
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

  // Always rebuild LAN headers right before status requests
  useEffect(() => {
    if (modalVisible && selectedDevice) {
      const mode = selectedOption.toLowerCase();
      const dev = selectedDevice[mode];
      if (!dev) {
        setSelectedDeviceStatus(null);
        return;
      }
      (async () => {
        const headers = selectedOption === 'LAN' ? await buildLanHeaders() : null;
        deviceStatus(dev.device_id, selectedOption, setSelectedDeviceStatus, headers);
      })();
    } else {
      setSelectedDeviceStatus(null);
    }
  }, [modalVisible, selectedDevice, selectedOption]);

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
    const headers = selectedOption === 'LAN' ? await buildLanHeaders() : null;
    controlDevice(dev.device_id, dev.ability_id, command, null, selectedOption, headers);
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
    const headers = selectedOption === 'LAN' ? await buildLanHeaders() : null;
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
    const headers = selectedOption === 'LAN' ? await buildLanHeaders() : null;
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
    const headers = selectedOption === 'LAN' ? await buildLanHeaders() : null;
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
    const headers = selectedOption === 'LAN' ? await buildLanHeaders() : null;
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
    const headers = selectedOption === 'LAN' ? await buildLanHeaders() : null;
    controlDevice(dev.device_id, dev.ability_id, command, attribute, selectedOption, headers);
  };

  // Build callback URL strictly with IPv4. Fallback to prior static IPv4 if detection fails.
  const callbackHost = localIpv4 && ipv4Regex.test(localIpv4) ? localIpv4 : '192.168.2.105';
  const callbackUrl = `http://${callbackHost}:8080/`;

  return (
    <Screen>
      <Animated.View style={[styles.headerContainer, { transform: [{ translateY: headerTranslateY }] }]}>
        <Header />
        <StatsSection selectedOption={selectedOption} setSelectedOption={setSelectedOption} lanHeaders={lanHeaders}/>
      </Animated.View>
      <Animated.View style={[styles.tabsContainer, { transform: [{ translateY: tabsTranslateY }] }]}>
        <Tabs tabs={categories.map((c) => c.category)} onTabChange={handleTabChange} activeTab={activeTab} />
      </Animated.View>

      {/* LAN Server for API */}
      <CallbackServer port={8080} onRequest={handleRequest} />

      {selectedOption === 'LAN' && !callbackRegistered && (
        <CallbackRegistration
          deviceCallbackUrl="http://192.168.2.115/api/v1.0/callback"
          callbackUrl={callbackUrl}                 // Use detected IPv4 instead of static
          lanHeaders={lanHeaders}                   // Uses the prebuilt headers on LAN selection
          callbackId="c45e846ca23ab42c9ae469d988ae32a96"
          listenList={['device']}
          run={selectedOption === 'LAN' && !!lanHeaders && !callbackRegistered}
          onStatus={(status, res) => {
            if (status === 'success') setCallbackRegistered(true);
            if (status === 'error') Alert.alert('Callback Registration Error', res?.message || 'Failed to register callback.');
          }}
        />
      )}

      <DeviceGrid
        filteredDevices={filteredDevices}
        handleToggle={handleToggle}
        navigation={navigation}
        setSelectedDevice={setSelectedDevice}
        setModalVisible={setModalVisible}
        lanHeaders={lanHeaders}
        selectedOption={selectedOption}
        activeTab={activeTab}
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