import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';

export default function FourGangSwitchSingleModal({
  visible,
  onClose,
  device,
  deviceStatus,
  switchDeviceName, // e.g. "4 Gang Switch 1" (use exactly as in device.abilities)
  onToggleSwitch,   // (deviceName: string, newState: "on" | "off") => void
  switchLoading = false
}) {
  // Find the correct switch by device name (ability_name)
  const ability = deviceStatus?.result?.abilities?.find(
    a => a.ability_name === switchDeviceName
  );

  // Get state: "on", "off", or "unknown"
  const state = ability
    ? ability.state === "on"
      ? "on"
      : ability.state === "off"
      ? "off"
      : "unknown"
    : "unknown";

  const online = deviceStatus?.result?.online;
  const deviceImage = deviceStatus?.result?.device_picture_url || null;

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

          <Text style={styles.title}>{device?.device_name}</Text>
          {deviceImage && (
            <Image source={{ uri: deviceImage }} style={styles.deviceImage} />
          )}

          <Text style={styles.switchLabel}>{switchDeviceName}</Text>

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
              <Text style={styles.label}>Status:</Text>
              <Text style={[
                styles.value,
                state === "on" ? styles.on :
                state === "off" ? styles.off : styles.unknown
              ]}>
                {state === "on" ? "ON" : state === "off" ? "OFF" : "Unknown"}
              </Text>
            </View>
          </View>

          <View style={styles.switchControlRow}>
            <TouchableOpacity
              style={[
                styles.switchControlButton,
                state === "on" && styles.disabledButton
              ]}
              disabled={state === "on" || switchLoading}
              onPress={() => onToggleSwitch(switchDeviceName, "on")}
            >
              {switchLoading && state !== "on" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.switchControlButtonText}>ON</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.switchControlButton,
                state === "off" && styles.disabledButton
              ]}
              disabled={state === "off" || switchLoading}
              onPress={() => onToggleSwitch(switchDeviceName, "off")}
            >
              {switchLoading && state !== "off" ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.switchControlButtonText}>OFF</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '52%',
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
    marginBottom: 10,
    textAlign: 'center',
  },
  deviceImage: {
    width: 90,
    height: 90,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  switchLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 16,
    color: '#32d2d6',
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
    width: '90%',
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
  switchControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
    width: '75%',
  },
  switchControlButton: {
    flex: 1,
    backgroundColor: '#32d2d6',
    paddingVertical: 14,
    marginHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchControlButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.45,
  }
});