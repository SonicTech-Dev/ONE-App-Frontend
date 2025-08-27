import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import Slider from '@react-native-community/slider';

export default function ACModal({
  visible,
  onClose,
  device,
  deviceStatus,
  onTurnOn,
  onTurnOff,
  onSetTemperature,
  onSetHVACMode,
  onSetFanSpeed,
}) {
  // State for all dynamic display values
  const [temp, setTemp] = useState(24);
  const [hvacMode, setHVACMode] = useState('auto');
  const [fanSpeed, setFanSpeed] = useState('auto');
  const [isOn, setIsOn] = useState(false);
  const [deviceImage, setDeviceImage] = useState(null);
  const [online, setOnline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supportHVACModes, setSupportHVACModes] = useState([
    { label: 'Auto', value: 'auto' },
    { label: 'Cool', value: 'cool' },
    { label: 'Heat', value: 'heat' },
    { label: 'Dry', value: 'dry' },
    { label: 'Fan', value: 'fan_only' },
  ]);
  const [supportFanSpeeds, setSupportFanSpeeds] = useState([
    { label: 'Auto', value: 'auto' },
    { label: 'Low', value: 'low' },
    { label: 'Med', value: 'medium' },
    { label: 'High', value: 'high' },
  ]);
  const [buttonPressed, setButtonPressed] = useState(null); // "on" or "off" or null

  // Extracted device name
  const deviceTitle = device?.title || deviceStatus?.result?.device_name || 'AC';

  // Update display state from deviceStatus when it changes
  useEffect(() => {
    if (!deviceStatus || !deviceStatus.result) {
      setLoading(true);
      return;
    }
    setLoading(false);
    const abilities = deviceStatus.result.abilities || [];
    const climateAbility = abilities.find(a => a.ability_type === "climate" || a.ability_name === "climate");
    if (climateAbility && climateAbility.attribute) {
      setIsOn(climateAbility.state === "on");
      if (typeof climateAbility.attribute.preset_temperature !== "undefined") {
        setTemp(Number(climateAbility.attribute.preset_temperature));
      }
      if (typeof climateAbility.attribute.hvac_mode === "string") {
        setHVACMode(climateAbility.attribute.hvac_mode);
      }
      if (typeof climateAbility.attribute.fan_mode === "string") {
        setFanSpeed(climateAbility.attribute.fan_mode);
      }
      if (Array.isArray(climateAbility.attribute.support_hvac_mode)) {
        const acModes = climateAbility.attribute.support_hvac_mode.map(mode => ({
          label: mode.charAt(0).toUpperCase() + mode.slice(1),
          value: mode,
        }));
        setSupportHVACModes(acModes);
      }
      if (Array.isArray(climateAbility.attribute.support_fan_mode)) {
        const fanModes = climateAbility.attribute.support_fan_mode.map(mode => ({
          label: mode.charAt(0).toUpperCase() + mode.slice(1),
          value: mode,
        }));
        setSupportFanSpeeds(fanModes);
      }
    }
    setDeviceImage(deviceStatus.result.device_picture_url);
    setOnline(deviceStatus.result.online);
    setButtonPressed(null); // Reset pressed state when device status updates
  }, [deviceStatus]);

  // Handlers for controls
  const handleTempChange = (value) => setTemp(value);
  const handleTempComplete = (value) => {
    setTemp(value);
    if (onSetTemperature) onSetTemperature(value);
  };
  const handleMinus = () => {
    const newTemp = Math.max(16, parseFloat((temp - 0.5).toFixed(1)));
    setTemp(newTemp);
    if (onSetTemperature) onSetTemperature(newTemp);
  };
  const handlePlus = () => {
    const newTemp = Math.min(32, parseFloat((temp + 0.5).toFixed(1)));
    setTemp(newTemp);
    if (onSetTemperature) onSetTemperature(newTemp);
  };
  const handleModeChange = (value) => {
    setHVACMode(value);
    if (onSetHVACMode) onSetHVACMode(value);
  };
  const handleFanChange = (value) => {
    setFanSpeed(value);
    if (onSetFanSpeed) onSetFanSpeed(value);
  };

  // "gray" style logic for power buttons:
  // - If device is on, "Turn On" is gray, "Turn Off" is color
  // - If device is off, "Turn Off" is gray, "Turn On" is color
  // - If user just pressed a button, it stays gray until status updates

  const isTurnOnActive = (isOn && buttonPressed !== "off") || buttonPressed === "on";
  const isTurnOffActive = (!isOn && buttonPressed !== "on") || buttonPressed === "off";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{deviceTitle}</Text>
          {deviceImage ? (
            <Image source={{ uri: deviceImage }} style={styles.deviceImage} />
          ) : null}
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Online Status:</Text>
            <Text style={[
              styles.statusValue,
              online === true ? styles.online : styles.offline
            ]}>
              {online === true ? "Online" : online === false ? "Offline" : "Unknown"}
            </Text>
          </View>

          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#32d2d6" />
            </View>
          ) : (
            <>
              {/* Power Buttons */}
              <View style={styles.powerRow}>
                <TouchableOpacity
                  style={[
                    styles.powerButton,
                    isTurnOnActive ? styles.powerButtonGray : styles.powerButtonOn
                  ]}
                  onPress={() => {
                    setButtonPressed("on");
                    if (onTurnOn) onTurnOn();
                  }}
                  disabled={isTurnOnActive}
                >
                  <Text style={[
                    styles.powerText,
                    isTurnOnActive ? styles.powerTextGray : styles.powerTextOn,
                  ]}>
                    Turn On
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.powerButton,
                    isTurnOffActive ? styles.powerButtonGray : styles.powerButtonOff
                  ]}
                  onPress={() => {
                    setButtonPressed("off");
                    if (onTurnOff) onTurnOff();
                  }}
                  disabled={isTurnOffActive}
                >
                  <Text style={[
                    styles.powerText,
                    isTurnOffActive ? styles.powerTextGray : styles.powerTextOff,
                  ]}>
                    Turn Off
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Arc-shaped Temperature Controller */}
              <View style={styles.arcContainer}>
                <TouchableOpacity style={styles.tempButton} onPress={handleMinus}>
                  <Text style={styles.tempButtonText}>-</Text>
                </TouchableOpacity>
                <View style={styles.tempArc}>
                  <Text style={styles.tempValue}>{temp.toFixed(1)}°C</Text>
                </View>
                <TouchableOpacity style={styles.tempButton} onPress={handlePlus}>
                  <Text style={styles.tempButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <Slider
                style={{ width: '80%', height: 40, marginTop: 10 }}
                minimumValue={16}
                maximumValue={32}
                step={0.5}
                value={temp}
                minimumTrackTintColor="#32d2d6"
                maximumTrackTintColor="#bbb"
                thumbTintColor="#32d2d6"
                onValueChange={handleTempChange}
                onSlidingComplete={handleTempComplete}
              />

              {/* HVAC Modes */}
              <Text style={styles.sectionLabel}>HVAC Mode</Text>
              <View style={styles.optionsRow}>
                {supportHVACModes.map((mode) => (
                  <TouchableOpacity
                    key={mode.value}
                    style={[
                      styles.optionButton,
                      hvacMode === mode.value && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleModeChange(mode.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        hvacMode === mode.value && styles.optionTextSelected,
                      ]}
                    >
                      {mode.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Fan Speeds */}
              <Text style={styles.sectionLabel}>Fan Speed</Text>
              <View style={styles.optionsRow}>
                {supportFanSpeeds.map((fan) => (
                  <TouchableOpacity
                    key={fan.value}
                    style={[
                      styles.optionButton,
                      fanSpeed === fan.value && styles.optionButtonSelected,
                    ]}
                    onPress={() => handleFanChange(fan.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        fanSpeed === fan.value && styles.optionTextSelected,
                      ]}
                    >
                      {fan.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '90%', height: '90%', backgroundColor: '#fff', borderRadius: 20,
    padding: 20, alignItems: 'center', justifyContent: 'flex-start',
    position: 'relative',
  },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  deviceImage: {
    width: 120, height: 120, marginBottom: 18, borderRadius: 12, resizeMode: 'contain', backgroundColor: '#f0f0f0'
  },
  statusRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: 12, width: '80%', justifyContent: 'space-between',
  },
  statusLabel: { fontSize: 16, color: '#7a7b7c', flex: 1, fontWeight: '500' },
  statusValue: { fontSize: 17, fontWeight: 'bold', marginLeft: 12, flex: 1, textAlign: 'right' },
  online: { color: 'green' },
  offline: { color: 'red' },
  powerRow: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 25, width: '100%',
  },
  powerButton: {
    flex: 1, marginHorizontal: 4, paddingVertical: 14, borderRadius: 8, alignItems: 'center',
    borderColor: '#32d2d6',
  },
  // Gray for current state
  powerButtonGray: {
    backgroundColor: '#e0e0e0',
    borderWidth: 2,
    borderColor: '#bbb',
  },
  powerTextGray: {
    color: '#888',
  },
  // On = blue background, white text (when not current)
  powerButtonOn: {
    backgroundColor: '#32d2d6',
    borderWidth: 2,
    borderColor: '#32d2d6',
  },
  powerTextOn: {
    color: '#fff',
  },
  // Off = red background, white text (when not current)
  powerButtonOff: {
    backgroundColor: '#fd5f43',
    borderWidth: 2,
    borderColor: '#fd5f43',
  },
  powerTextOff: {
    color: '#fff',
  },
  arcContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 10, marginTop: 12,
  },
  tempArc: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#eaf6fa', alignItems: 'center', justifyContent: 'center', marginHorizontal: 18,
    borderWidth: 5, borderColor: '#32d2d6',
  },
  tempValue: { fontSize: 32, fontWeight: 'bold', color: '#32d2d6' },
  tempButton: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#f0f0f0',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#bbb',
  },
  tempButtonText: { fontSize: 30, color: '#32d2d6', fontWeight: 'bold' },
  sectionLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 20, marginBottom: 8, alignSelf: 'flex-start' },
  optionsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8, width: '100%' },
  optionButton: {
    flex: 1, marginHorizontal: 4, paddingVertical: 10, borderRadius: 8,
    backgroundColor: '#f0f0f0', alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#32d2d6',
  },
  optionText: { color: '#888', fontWeight: 'bold', fontSize: 16 },
  optionTextSelected: { color: '#fff' },
  closeButton: { position: 'absolute', top: 15, right: 15 },
});