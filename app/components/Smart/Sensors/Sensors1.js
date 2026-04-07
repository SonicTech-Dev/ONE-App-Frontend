import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

export default function SensorModal({ visible, onClose, device, deviceStatus }) {
  let temperature = "unknown";
  let humidity = "unknown";
  let alarmState = "unknown";
  let battery = undefined; // Set to undefined if not present
  let online = null;
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(111,75,216,0.28)',
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
  on: { color: '#34c759' },
  off: { color: '#ff3b30' },
  unknown: { color: '#888' },
  online: { color: '#34c759' },
  offline: { color: '#ff3b30' },
});