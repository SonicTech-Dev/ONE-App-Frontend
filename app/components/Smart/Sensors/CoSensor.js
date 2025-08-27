import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';

export default function CoSensorModal({ visible, onClose, device, deviceStatus }) {
  // Handles both WAN and LAN style responses and different ability names/orderings

  // Default values
  let coState = "unknown";
  let battery = undefined;
  let online = null;
  let deviceImage = null;

  // Support both WAN and LAN-style response
  const result = deviceStatus?.result || deviceStatus;
  const abilities = result?.abilities || [];

  // WAN format: CO alarm is "Alarm State" with attribute.type === "co"
  // LAN format: ability_name is "Carbon_monoxide", "carbon monoxide", or "co"
  const coAbility = abilities.find(a =>
    (
      // WAN: "Alarm State" with attribute.type === "co"
      (a.ability_name && a.ability_name.toLowerCase() === "alarm state" && a.attribute && a.attribute.type === "co")
      ||
      // LAN: ability_name like "carbon_monoxide", "carbon monoxide", or "co"
      (a.ability_name && (
        a.ability_name.toLowerCase() === "carbon_monoxide"
        || a.ability_name.toLowerCase() === "carbon monoxide"
        || a.ability_name.toLowerCase() === "co"
      ))
    )
  );
  coState =
    coAbility && coAbility.state !== undefined
      ? coAbility.state
      : "unknown";

  // Battery Level (handle both "Battery Level" and "battery" and attribute.type === "battery")
  const batteryAbility = abilities.find(a =>
    (
      a.ability_name &&
      (
        a.ability_name.toLowerCase() === "battery"
        || a.ability_name.toLowerCase() === "battery level"
      )
    )
    ||
    (
      a.attribute && a.attribute.type === "battery"
    )
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

          <Text style={styles.title}>{device?.device_name || result?.device_name || result?.product_name}</Text>
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
                <Text style={styles.label}>CO Alarm:</Text>
                <Text style={[
                  styles.value,
                  coState === "on" ? styles.on : coState === "off" ? styles.off : styles.unknown
                ]}>
                  {coState === "on" ? "CO DETECTED" : coState === "off" ? "No CO" : String(coState)}
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