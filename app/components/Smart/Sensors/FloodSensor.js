import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';

export default function FloodSensorModal({ visible, onClose, device, deviceStatus }) {
  // Support both LAN (your last JSON) and WAN (original API) data structures

  // Default values
  let floodState = "unknown";
  let battery = undefined;
  let online = null;
  let deviceImage = null;
  let deviceType = "";
  let productName = "";

  // Try both structures for compatibility
  const result = deviceStatus?.result || deviceStatus;
  const abilities = result?.abilities || [];

  // 1. Flood state: try to find ability by name ("Moisture" or "Flood" or "Flood Alarm")
  const floodAbility = abilities.find(a =>
    a.ability_name &&
    (
      a.ability_name.toLowerCase().includes("moisture") ||
      a.ability_name.toLowerCase().includes("flood") ||
      a.ability_name.toLowerCase().includes("alarm")
    )
  );
  floodState =
    floodAbility && floodAbility.state !== undefined
      ? floodAbility.state
      : "unknown";

  // 2. Battery: by ability_name "Battery Level" or "battery"
  const batteryAbility = abilities.find(a =>
    a.ability_name &&
    (
      a.ability_name.toLowerCase() === "battery" ||
      a.ability_name.toLowerCase() === "battery level"
    )
  );
  if (batteryAbility && batteryAbility.state !== undefined) {
    battery = batteryAbility.state;
  }

  // 3. Device image, type, and name
  deviceImage = result?.device_picture_url || device?.device_picture_url || null;
  online = result?.online;
  deviceType = result?.device_type || device?.device_type || "";
  productName = result?.product_name || result?.device_name || device?.device_name || "";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {}}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{device?.device_name || productName || deviceType}</Text>
          {deviceImage ? (
            <Image source={{ uri: deviceImage }} style={styles.deviceImage} />
          ) : null}

          {!deviceStatus ? (
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
                <Text style={styles.label}>Flood Alarm:</Text>
                <Text style={[
                  styles.value,
                  floodState === "on" ? styles.on : floodState === "off" ? styles.off : styles.unknown
                ]}>
                  {floodState === "on" ? "FLOOD DETECTED" : floodState === "off" ? "No Flood" : String(floodState)}
                </Text>
              </View>
              {/* Only render the Battery row if battery is defined */}
              {battery !== undefined && (
                <View style={styles.statusRow}>
                  <Text style={styles.label}>Battery:</Text>
                  <Text style={styles.value}>
                    {battery !== "unknown" ? `${battery}%` : "unknown"}
                  </Text>
                </View>
              )}
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
    height: '50%',
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
    color: 'red',
  },
  off: {
    color: 'green',
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
});