import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';

export default function HyPanelSupremeModal({ visible, onClose, device, deviceStatus }) {
  // Support both WAN and LAN response shapes
  const result = deviceStatus?.result || deviceStatus;

  const abilities = result?.abilities || [];
  const online = result?.online;
  const deviceImage = result?.device_picture_url || device?.device_picture_url || null;
  const deviceType = result?.device_type || device?.device_type || '';
  const productName =
    result?.product_name ||
    result?.device_name ||
    device?.device_name ||
    'HyPanel Supreme';
  const spaceName =
    result?.space?.space_name ||
    result?.space?.spaceName ||
    '';

  // Helpers
  const findAbility = (predicate) => abilities.find(predicate);

  const displaySensorValue = (ability, defaultUnit = '') => {
    if (!ability || ability.state === undefined || ability.state === null) return 'unknown';
    const state = String(ability.state);
    if (state === '--' || state.toLowerCase() === 'unknown') return 'unknown';
    const unit = ability.attribute?.unit || defaultUnit;
    return unit ? `${state} ${unit}` : state;
  };

  // Parse abilities (WAN may have "--", LAN has numeric + unit)
  const tempAbility = findAbility(a => a.ability_name?.toLowerCase() === 'temperature');
  const humidityAbility = findAbility(a => a.ability_name?.toLowerCase() === 'humidity');
  const motionAbility = findAbility(a => a.ability_name?.toLowerCase() === 'motion');
  const luxAbility = findAbility(a => (a.ability_name || '').toLowerCase().includes('illuminance'));

  const temperature = displaySensorValue(tempAbility, '°C');
  const humidity = displaySensorValue(humidityAbility, '%');
  const illuminance = displaySensorValue(luxAbility, 'lx');

  const motionState = motionAbility?.state; // "on" | "off" | "--" | undefined

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

          <Text style={styles.title}>{productName || deviceType}</Text>

          {deviceImage ? (
            <Image source={{ uri: deviceImage }} style={styles.deviceImage} />
          ) : null}

          {!deviceStatus ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#32d2d6" />
            </View>
          ) : (
            <View style={styles.statusContainer}>
              {/* Online */}
              <View style={styles.statusRow}>
                <Text style={styles.label}>Online Status:</Text>
                <Text style={[
                  styles.value,
                  online === true ? styles.online : styles.offline
                ]}>
                  {online === true ? 'Online' : online === false ? 'Offline' : 'Unknown'}
                </Text>
              </View>

              {/* Space */}
              {spaceName ? (
                <View style={styles.statusRow}>
                  <Text style={styles.label}>Space:</Text>
                  <Text style={styles.value}>{spaceName}</Text>
                </View>
              ) : null}

              {/* Device Type */}
              {deviceType ? (
                <View style={styles.statusRow}>
                  <Text style={styles.label}>Type:</Text>
                  <Text style={styles.value}>{deviceType}</Text>
                </View>
              ) : null}

              {/* Temperature */}
              <View style={styles.statusRow}>
                <Text style={styles.label}>Temperature:</Text>
                <Text style={[
                  styles.value,
                  temperature === 'unknown' ? styles.unknown : styles.normal
                ]}>
                  {temperature}
                </Text>
              </View>

              {/* Humidity */}
              <View style={styles.statusRow}>
                <Text style={styles.label}>Humidity:</Text>
                <Text style={[
                  styles.value,
                  humidity === 'unknown' ? styles.unknown : styles.normal
                ]}>
                  {humidity}
                </Text>
              </View>

              {/* Motion */}
              {motionAbility ? (
                <View style={styles.statusRow}>
                  <Text style={styles.label}>Motion:</Text>
                  <Text style={[
                    styles.value,
                    motionState === 'on' ? styles.on : motionState === 'off' ? styles.off : styles.unknown
                  ]}>
                    {motionState === 'on'
                      ? 'MOTION DETECTED'
                      : motionState === 'off'
                      ? 'No Motion'
                      : String(motionState || 'unknown')}
                  </Text>
                </View>
              ) : null}

              {/* Illuminance */}
              {luxAbility ? (
                <View style={styles.statusRow}>
                  <Text style={styles.label}>Illuminance:</Text>
                  <Text style={[
                    styles.value,
                    illuminance === 'unknown' ? styles.unknown : styles.normal
                  ]}>
                    {illuminance}
                  </Text>
                </View>
              ) : null}
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
    minHeight: '45%',
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
    marginBottom: 18,
    justifyContent: 'space-between',
    width: '85%',
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
  normal: {
    color: '#222',
  },
  online: {
    color: 'green',
  },
  offline: {
    color: 'red',
  },
});