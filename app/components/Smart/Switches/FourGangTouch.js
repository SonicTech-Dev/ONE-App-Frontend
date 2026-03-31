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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1c1c1e',
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
  deviceImage: {
    width: 90,
    height: 90,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: 'contain',
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
  switchControlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 18,
    width: '100%',
  },
  switchControlButton: {
    backgroundColor: '#32d2d6',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    shadowColor: '#32d2d6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  switchControlButtonText: {
    color: '#1c1c1e',
    fontWeight: '800',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    shadowOpacity: 0,
  }
});