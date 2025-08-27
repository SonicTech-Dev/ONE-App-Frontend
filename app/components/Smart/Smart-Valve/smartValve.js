import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';

export default function SmartValveModal({
  visible,
  onClose,
  device,
  deviceStatus,
  onOpenValve,
  onCloseValve,
}) {
  // State for valve and device status
  const [valveState, setValveState] = useState("unknown");
  const [online, setOnline] = useState(null);
  const [deviceImage, setDeviceImage] = useState(null);
  const [productName, setProductName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Accept both LAN and WAN responses
    const result = deviceStatus?.result || deviceStatus;
    if (result && result.abilities) {
      setLoading(false);
      const abilities = result.abilities || [];

      // Find the switch ability (LAN: ability_name like "Switch1", WAN: ability_name might be "Smart Valve", etc.)
      const switchAbility =
        abilities.find(a =>
          a.ability_type === "switch" &&
          (
            (a.ability_name && a.ability_name.toLowerCase().includes("switch"))
            ||
            (a.ability_name && a.ability_name.toLowerCase().includes("valve"))
            ||
            (a.ability_name && a.ability_name.toLowerCase().includes("smart"))
          )
        )
        ||
        // fallback: any switch
        abilities.find(a => a.ability_type === "switch");

      setValveState(
        switchAbility && typeof switchAbility.state !== "undefined"
          ? switchAbility.state
          : "unknown"
      );
      setDeviceImage(result.device_picture_url || null);
      setOnline(result.online);
      setDeviceType(result.device_type || "");
      setProductName(result.product_name || result.device_name || "");
    } else {
      setLoading(true);
      setValveState("unknown");
      setOnline(null);
      setDeviceImage(null);
      setDeviceType("");
      setProductName("");
    }
  }, [deviceStatus]);

  const deviceLabel =
    device?.title || productName || deviceType || "Smart Valve";

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
                <Text style={styles.label}>Valve State:</Text>
                <Text style={[
                  styles.value,
                  valveState === "on" ? styles.on : valveState === "off" ? styles.off : styles.unknown
                ]}>
                  {valveState === "on" ? "OPEN" : valveState === "off" ? "CLOSED" : String(valveState)}
                </Text>
              </View>
            </View>
          )}

          {/* Controls */}
          <View style={styles.controlRow}>
            <TouchableOpacity
              style={[
                styles.controlButton,
                (valveState === "on" || !visible || loading) && styles.disabledButton
              ]}
              onPress={onOpenValve}
              disabled={valveState === "on" || !visible || loading}
            >
              <Text style={styles.controlButtonText}>Open</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.controlButton,
                (valveState === "off" || !visible || loading) && styles.disabledButton
              ]}
              onPress={onCloseValve}
              disabled={valveState === "off" || !visible || loading}
            >
              <Text style={styles.controlButtonText}>Close</Text>
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
});