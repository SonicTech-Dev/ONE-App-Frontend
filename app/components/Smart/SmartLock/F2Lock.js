import React, { useMemo } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from "react-native";

export default function F2LockModal({
  visible,
  onClose,
  device,
  deviceStatus,
  onToggleLock,
  lockLoading
}) {
  // Handles both LAN and WAN responses

  let lockState = "unknown";
  let battery = undefined;
  let tamperState = "unknown";
  let online = null;
  let deviceImage = null;
  let deviceType = "";
  let productName = "";

  const result = deviceStatus?.result || deviceStatus;
  const abilities = result?.abilities || [];

  // Lock State: ability_type === "lock"
  // LAN: state is "on" -> "locked", "off" -> "unlocked"
  // WAN: state may be "locked"/"unlocked"
  const lockAbility = abilities.find(a =>
    (a.ability_type && a.ability_type.toLowerCase() === "lock")
  );
  if (lockAbility && lockAbility.state !== undefined) {
    if (lockAbility.state === "on") {
      lockState = "locked";
    } else if (lockAbility.state === "off") {
      lockState = "unlocked";
    } else if (
      lockAbility.state === "locked" ||
      lockAbility.state === "unlocked"
    ) {
      lockState = lockAbility.state;
    } else {
      lockState = String(lockAbility.state);
    }
  }

  // Battery Level: ability_name === "battery"
  const batteryAbility = abilities.find(a =>
    a.ability_name && a.ability_name.toLowerCase() === "battery"
  );
  if (batteryAbility && batteryAbility.state !== undefined) {
    battery = batteryAbility.state;
  }

  // Tamper Alarm: ability_name === "tamper"
  const tamperAbility = abilities.find(a =>
    a.ability_name && a.ability_name.toLowerCase() === "tamper"
  );
  if (tamperAbility && tamperAbility.state !== undefined) {
    tamperState = tamperAbility.state;
  }

  deviceImage = result?.device_picture_url || device?.device_picture_url || null;
  online = result?.online;
  deviceType = result?.device_type || device?.device_type || "";
  productName = result?.product_name || result?.device_name || device?.product_name || device?.device_name || "";

  const isLocked = useMemo(() => lockState === "locked", [lockState]);

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
          <Text style={styles.title}>{device?.title || productName || deviceType}</Text>
          {deviceImage && (
            <Image source={{ uri: deviceImage }} style={styles.deviceImage} />
          )}
          {!deviceStatus ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
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
                <Text style={styles.label}>Lock State:</Text>
                <Text style={[
                  styles.value,
                  lockState === "locked" ? styles.on : lockState === "unlocked" ? styles.off : styles.unknown
                ]}>
                  {lockState === "locked" ? "Locked" : lockState === "unlocked" ? "Unlocked" : String(lockState)}
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
          <TouchableOpacity
            style={[
              styles.lockButton,
              isLocked ? styles.lockedButton : styles.unlockedButton,
              lockLoading && styles.disabledButton
            ]}
            onPress={onToggleLock}
            disabled={lockLoading || lockState === "unknown"}
          >
            {lockLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.lockButtonText}>
                {isLocked ? "Unlock" : "Lock"}
              </Text>
            )}
          </TouchableOpacity>
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
    height: '70%',
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
    width: 100,
    height: 100,
    marginBottom: 18,
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  statusContainer: {
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
  lockButton: {
    width: '80%',
    marginTop: 18,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedButton: {
    backgroundColor: '#fd5f43',
  },
  unlockedButton: {
    backgroundColor: '#32d2d6',
  },
  disabledButton: {
    opacity: 0.5,
  },
  lockButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});