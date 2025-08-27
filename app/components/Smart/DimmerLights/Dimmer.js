import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import Slider from '@react-native-community/slider';

export default function DimmerLightModal({
  visible,
  onClose,
  device,
  deviceStatus,
  onTurnOn,
  onTurnOff,
  onSetBrightness,
}) {
  const [lightState, setLightState] = useState("unknown");
  const [brightness, setBrightness] = useState(100); // Default to max if not present
  const [online, setOnline] = useState(null);
  const [deviceImage, setDeviceImage] = useState(null);
  const [productName, setProductName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [sliderEnabled, setSliderEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  // Extract state from deviceStatus
  useEffect(() => {
    if (deviceStatus && (deviceStatus.result || deviceStatus.abilities)) {
      setLoading(false);
      const result = deviceStatus.result || deviceStatus;
      const abilities = result.abilities || [];
      // Find the ability related to this device (works for both LAN/WAN)
      // Try to match by ability_type "light" and either ability_name that matches the device, or just first light ability
      let lightAbility =
        abilities.find(a =>
          a.ability_type === "light" &&
          (
            // Exact match by device_name (for LAN)
            a.ability_name &&
            device &&
            (a.ability_name === device.device_name || a.ability_name === device.title)
          )
        ) ||
        // If not found, just use the first light ability
        abilities.find(a => a.ability_type === "light");

      // State: on/off
      setLightState(lightAbility && typeof lightAbility.state !== "undefined"
        ? lightAbility.state
        : "unknown"
      );

      // Brightness: handle both WAN (attribute.brightness), LAN (attribute.brightness_pct)
      let b = null;
      if (
        lightAbility &&
        lightAbility.attribute &&
        typeof lightAbility.attribute.brightness !== "undefined"
      ) {
        b = Number(lightAbility.attribute.brightness);
      } else if (
        lightAbility &&
        lightAbility.attribute &&
        typeof lightAbility.attribute.brightness_pct !== "undefined"
      ) {
        b = Number(lightAbility.attribute.brightness_pct);
      }
      if (b !== null && !isNaN(b)) {
        setBrightness(b);
        setSliderEnabled(true);
      } else {
        setBrightness(100);
        setSliderEnabled(false);
      }

      setDeviceImage(result.device_picture_url || null);
      setOnline(result.online);
      setDeviceType(result.device_type || "");
      setProductName(result.product_name || result.device_name || "");
    } else {
      setLoading(true);
      setLightState("unknown");
      setBrightness(100);
      setSliderEnabled(false);
      setOnline(null);
      setDeviceImage(null);
      setDeviceType("");
      setProductName("");
    }
  }, [deviceStatus, device]);

  // Slider handlers
  const handleSliderChange = (val) => setBrightness(val);
  const handleSlidingComplete = (val) => {
    if (onSetBrightness) onSetBrightness(Math.round(val));
  };

  const deviceLabel =
    device?.title || productName || deviceType || "Dimmer Light";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </TouchableOpacity>

          {/* Title & Image */}
          <Text style={styles.title}>{deviceLabel}</Text>
          {deviceImage && (
            <Image source={{ uri: deviceImage }} style={styles.deviceImage} />
          )}

          {/* Status display */}
          {loading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#32d2d6" />
            </View>
          ) : (
            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Online Status:</Text>
                <Text style={[
                  styles.value,
                  online === true ? styles.online : styles.offline
                ]}>
                  {online === true ? "Online" : online === false ? "Offline" : "Unknown"}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Light State:</Text>
                <Text style={[
                  styles.value,
                  lightState === "on" ? styles.on : lightState === "off" ? styles.off : styles.unknown
                ]}>
                  {lightState === "on" ? "ON" : lightState === "off" ? "OFF" : String(lightState)}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Brightness:</Text>
                <Text style={styles.value}>
                  {sliderEnabled ? `${brightness}%` : "N/A"}
                </Text>
              </View>
            </View>
          )}

          {/* Controls */}
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[
                styles.controlButton,
                (lightState === "on" || !visible || loading) && styles.disabledButton
              ]}
              onPress={onTurnOn}
              disabled={lightState === "on" || !visible || loading}
            >
              <Text style={styles.controlButtonText}>Turn On</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.controlButton,
                (lightState === "off" || !visible || loading) && styles.disabledButton
              ]}
              onPress={onTurnOff}
              disabled={lightState === "off" || !visible || loading}
            >
              <Text style={styles.controlButtonText}>Turn Off</Text>
            </TouchableOpacity>
          </View>

          {/* Brightness Slider */}
          {sliderEnabled && (
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Adjust Brightness:</Text>
              <Slider
                style={{ width: 220, height: 40 }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={brightness}
                minimumTrackTintColor="#32d2d6"
                maximumTrackTintColor="#bbb"
                thumbTintColor="#32d2d6"
                onValueChange={handleSliderChange}
                onSlidingComplete={handleSlidingComplete}
                disabled={lightState !== "on"}
              />
              <Text style={styles.sliderValue}>{brightness}%</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 2,
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  deviceImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'space-between',
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#7a7b7c',
    flex: 1,
    textAlign: 'left',
    fontWeight: '500',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    flex: 1,
    textAlign: 'right',
  },
  on: {
    color: 'green',
  },
  off: {
    color: 'red',
  },
  unknown: {
    color: '#888',
  },
  online: {
    color: 'green',
  },
  offline: {
    color: 'red',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 18,
    width: '100%',
  },
  controlButton: {
    backgroundColor: '#32d2d6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 8,
  },
  controlButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#b0e4e6',
  },
  sliderContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    marginBottom: 6,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#32d2d6',
    marginTop: 2,
  },
});