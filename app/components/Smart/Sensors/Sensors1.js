import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';

export default function SensorModal({ visible, onClose, device, deviceStatus }) {
  let temperature = "unknown";
  let humidity = "unknown";
  let alarmState = "unknown";
  let battery = undefined; // Set to undefined if not present
  let online = null;
  let deviceImage = null;
  let deviceType = "";
  let productName = "";

  if (deviceStatus && deviceStatus.result) {
    const abilities = deviceStatus.result.abilities || [];

    // Try to find temperature ability
    const tempAbility = abilities.find(a =>
      a.ability_name &&
      a.ability_name.toLowerCase().includes("temperature")
    );
    // Try to find humidity ability (accept typo)
    const humidityAbility = abilities.find(a =>
      a.ability_name &&
      (
        a.ability_name.toLowerCase().includes("humidity") ||
        a.ability_name.toLowerCase().includes("humdity")
      )
    );
    // Try to find alarm state (cloud) or moisture/smoke (LAN)
    const alarmAbility = abilities.find(a =>
      a.ability_name &&
      (
        a.ability_name.toLowerCase().includes("alarm state") ||
        a.ability_name.toLowerCase().includes("moisture") ||
        a.ability_name.toLowerCase().includes("smoke")
      )
    );
    // Battery can be "Battery Level" (cloud) or "battery" (LAN)
    const batteryAbility = abilities.find(a =>
      a.ability_name &&
      (a.ability_name === "Battery Level" || a.ability_name.toLowerCase() === "battery")
    );

    temperature =
      tempAbility && tempAbility.state !== undefined
        ? tempAbility.state
        : "unknown";
    humidity =
      humidityAbility && humidityAbility.state !== undefined
        ? humidityAbility.state
        : "unknown";
    alarmState =
      alarmAbility && alarmAbility.state !== undefined
        ? alarmAbility.state
        : "unknown";
    // Only set battery if batteryAbility is found and state is not undefined
    if (batteryAbility && batteryAbility.state !== undefined) {
      battery = batteryAbility.state;
    }

    deviceImage = deviceStatus.result.device_picture_url || null; // LAN API: always null/undefined
    online = deviceStatus.result.online;
    deviceType = deviceStatus.result.device_type || "";
    // Prefer product_name, fall back to device_name (LAN)
    productName = deviceStatus.result.product_name || deviceStatus.result.device_name || "";
  }

  // Show temp/humidity only if present in deviceType or productName
  const isTempHumiditySensor =
    deviceType.toLowerCase().includes("temperature") ||
    productName.toLowerCase().includes("temperature");

  // Show alarmState if this ability is present and not unknown
  const showAlarm = alarmState !== "unknown";

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

          <Text style={styles.title}>{device?.title || productName || deviceType}</Text>
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
              {isTempHumiditySensor && (
                <>
                  <View style={styles.statusRow}>
                    <Text style={styles.label}>Temperature:</Text>
                    <Text style={styles.value}>
                      {temperature !== "unknown" ? `${temperature}°C` : "unknown"}
                    </Text>
                  </View>
                  <View style={styles.statusRow}>
                    <Text style={styles.label}>Humidity:</Text>
                    <Text style={styles.value}>
                      {humidity !== "unknown" ? `${humidity}%` : "unknown"}
                    </Text>
                  </View>
                </>
              )}
              {showAlarm && (
                <View style={styles.statusRow}>
                  <Text style={styles.label}>Alarm State:</Text>
                  <Text style={[
                    styles.value,
                    alarmState === "on" ? styles.on : alarmState === "off" ? styles.off : styles.unknown
                  ]}>
                    {alarmState === "on" ? "ON" : alarmState === "off" ? "OFF" : String(alarmState)}
                  </Text>
                </View>
              )}
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
    height: '90%',
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
    width: 200,
    height: 200,
    marginBottom: 32,
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 16,
    flex: 1,
    justifyContent: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    justifyContent: 'space-between',
    width: '80%',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  label: {
    fontSize: 18,
    color: '#7a7b7c',
    flex: 1,
    textAlign: 'left',
    fontWeight: '500',
  },
  value: {
    fontSize: 20,
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
});