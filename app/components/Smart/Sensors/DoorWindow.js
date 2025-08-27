import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';

export default function DoorWindowSensorModal({ visible, onClose, device, deviceStatus }) {
  // Handles both WAN and LAN style responses

  // Default values
  let doorState = "unknown";
  let tamperState = "unknown";
  let battery = undefined;
  let online = null;
  let deviceImage = null;

  // Support both LAN and WAN-style response
  const result = deviceStatus?.result || deviceStatus;
  const abilities = result?.abilities || [];

  // 1. Door/Window State
  // WAN: "Alarm State" with attribute.type === "door"
  // LAN: ability_name "Door" or "Window" (case-insensitive)
  const doorAbility = abilities.find(a =>
    (a.ability_name && a.ability_name.toLowerCase() === "alarm state" && a.attribute && a.attribute.type === "door")
    ||
    (a.ability_name && (
      a.ability_name.toLowerCase() === "door" ||
      a.ability_name.toLowerCase() === "window"
    ))
  );
  doorState =
    doorAbility && doorAbility.state !== undefined
      ? doorAbility.state
      : "unknown";

  // 2. Tamper Alarm
  // WAN: "Tamper Alarm" with attribute.type === "tamper"
  // LAN: ability_name "Tamper" (case-insensitive)
  const tamperAbility = abilities.find(a =>
    (a.ability_name && a.ability_name.toLowerCase() === "tamper alarm" && a.attribute && a.attribute.type === "tamper")
    ||
    (a.ability_name && a.ability_name.toLowerCase() === "tamper")
  );
  tamperState =
    tamperAbility && tamperAbility.state !== undefined
      ? tamperAbility.state
      : "unknown";

  // 3. Battery Level (handle both "Battery Level" and "battery" and attribute.type === "battery")
  const batteryAbility = abilities.find(a =>
    (a.ability_name && (a.ability_name.toLowerCase() === "battery" || a.ability_name.toLowerCase() === "battery level"))
    ||
    (a.attribute && a.attribute.type === "battery")
  );
  if (batteryAbility && batteryAbility.state !== undefined) {
    battery = batteryAbility.state;
  }

  deviceImage = result?.device_picture_url || device?.device_picture_url || null;
  online = result?.online;

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

          <Text style={styles.title}>{device?.device_name || result?.device_name}</Text>
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
                <Text style={styles.label}>Door/Window:</Text>
                <Text style={[
                  styles.value,
                  doorState === "on" ? styles.on : doorState === "off" ? styles.off : styles.unknown
                ]}>
                  {doorState === "on" ? "OPEN" : doorState === "off" ? "CLOSED" : String(doorState)}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Tamper Alarm:</Text>
                <Text style={[
                  styles.value,
                  tamperState === "on" ? styles.on : tamperState === "off" ? styles.off : styles.unknown
                ]}>
                  {tamperState === "on" ? "TAMPERED" : tamperState === "off" ? "OK" : String(tamperState)}
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
    height: '55%',
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