import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image, ScrollView } from 'react-native';

export default function AirQualityMonitorModal({ visible, onClose, device, deviceStatus }) {
  // Default values
  let temperature = "unknown";
  let humidity = "unknown";
  let illuminance = "unknown";
  let carbonDioxide = "unknown";
  let pm1 = "unknown";
  let pm25 = "unknown";
  let pm10 = "unknown";
  let formaldehyde = "unknown";
  let tvoc = "unknown";
  let online = null;
  let deviceImage = null;
  let deviceType = "";
  let productName = "";

  if (deviceStatus && deviceStatus.result) {
    const abilities = deviceStatus.result.abilities || [];

    // Find sensor values by ability_name
    const findAbility = (name) =>
      abilities.find(
        (a) => a.ability_name && a.ability_name.toLowerCase() === name.toLowerCase()
      );

    const getState = (ability) =>
      ability && ability.state !== undefined ? ability.state : "unknown";

    temperature = getState(findAbility("temperature"));
    humidity = getState(findAbility("humidity"));
    illuminance = getState(findAbility("illuminance"));
    carbonDioxide = getState(findAbility("carbon_dioxide"));
    pm1 = getState(findAbility("pm1"));
    pm25 = getState(findAbility("pm25"));
    pm10 = getState(findAbility("pm10"));
    formaldehyde = getState(findAbility("formaldehyde"));
    tvoc = getState(findAbility("TVOC"));

    deviceImage = deviceStatus.result.device_picture_url || null;
    online = deviceStatus.result.online;
    deviceType = deviceStatus.result.device_type || "";
    productName = deviceStatus.result.product_name || deviceStatus.result.device_name || "";
  }

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
            <ScrollView style={{ width: "100%" }} contentContainerStyle={styles.statusContainer}>
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
              <View style={styles.statusRow}>
                <Text style={styles.label}>Illuminance:</Text>
                <Text style={styles.value}>
                  {illuminance !== "unknown" ? `${illuminance} lux` : "unknown"}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>CO₂:</Text>
                <Text style={styles.value}>
                  {carbonDioxide !== "unknown" ? `${carbonDioxide} ppm` : "unknown"}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>PM1:</Text>
                <Text style={styles.value}>
                  {pm1 !== "unknown" ? `${pm1} µg/m³` : "unknown"}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>PM2.5:</Text>
                <Text style={styles.value}>
                  {pm25 !== "unknown" ? `${pm25} µg/m³` : "unknown"}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>PM10:</Text>
                <Text style={styles.value}>
                  {pm10 !== "unknown" ? `${pm10} µg/m³` : "unknown"}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Formaldehyde:</Text>
                <Text style={styles.value}>
                  {formaldehyde !== "unknown" ? `${formaldehyde} mg/m³` : "unknown"}
                </Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.label}>TVOC:</Text>
                <Text style={styles.value}>
                  {tvoc !== "unknown" ? `${tvoc} mg/m³` : "unknown"}
                </Text>
              </View>
            </ScrollView>
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
    width: '92%',
    height: '88%',
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
    marginBottom: 18,
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
  },
  statusContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 48,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
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
  online: {
    color: 'green',
  },
  offline: {
    color: 'red',
  },
});