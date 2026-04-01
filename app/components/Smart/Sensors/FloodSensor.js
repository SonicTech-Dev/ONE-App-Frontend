import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export default function FloodSensorModal({ visible, onClose, device, deviceStatus }) {
  // Support both LAN (your last JSON) and WAN (original API) data structures

  // Default values
  let floodState = "unknown";
  let battery = undefined;
  let online = null;
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

  // 3. Device type and name
  online = result?.online;
  deviceType = result?.device_type || device?.device_type || "";
  productName = result?.product_name || result?.device_name || device?.device_name || "";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={{ fontSize: 22 }}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{device?.device_name || productName || deviceType}</Text>

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
    backgroundColor: 'rgba(111,75,216,0.28)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#6f4bd8',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 16,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    paddingBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#8e8e93',
    flex: 1,
    textAlign: 'left',
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 12,
    flex: 1,
    textAlign: 'right',
    color: '#ffffff',
  },
  on: { color: '#ff3b30' },
  off: { color: '#34c759' },
  unknown: { color: '#888' },
  online: { color: '#34c759' },
  offline: { color: '#ff3b30' },
});