import React from 'react';
import { ScrollView, View } from 'react-native';
import DeviceTile from '../DeviceTile';
import styles from './SmartScreen.styles';

export default function DeviceGrid({
  filteredDevices,
  handleToggle,
  navigation,
  setSelectedDevice,
  setModalVisible,
  activeTab, // Use activeTab to determine which tab is selected
}) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} scrollEventThrottle={16}>
      {/* Only show SDK Test Tiles when "All Devices" tab is active */}
      {activeTab === 'All Devices' && (
        <>
          <View style={styles.sdkTestTileRow}>
            <DeviceTile
              title="Contacts"
              location="Contact Page"
              status=""
              color="#cfd88bff"
              isOn={false}
              iconName="contact-page"
              library="MaterialIcons"
              onPress={() => navigation.navigate('SdkTest')}
              disabled={false}
            />
          </View>
          <View style={styles.sdkTestTileRow}>
            <DeviceTile
              title="Smart Lock Screen"
              location="Entrance"
              status=""
              color="#629a8aff"
              isOn={false}
              iconName="door-sliding"
              library="MaterialIcons"
              onPress={() => navigation.navigate('SmartLockScreen')}
              disabled={false}
            />
          </View>
          <View style={styles.sdkTestTileRow}>
            <DeviceTile
              title="IntercomScreen"
              location="Entrance"
              status=""
              color="#7b888fff"
              isOn={false}
              iconName="sensor-door"
              library="MaterialIcons"
              onPress={() => navigation.navigate('IntercomScreen')}
              disabled={false}
            />
          </View>
        </>
      )}
      {/* Device Tiles */}
      {filteredDevices
        .reduce((result, device, index) => {
          if (index % 2 === 0) result.push([device]);
          else result[result.length - 1].push(device);
          return result;
        }, [])
        .map((row, rowIndex) => (
          <View key={rowIndex} style={styles.deviceRow}>
            {row.map((device, index) => {
              const deviceKey = `${device.title}-${device.location}-${index}`;
              return (
                <DeviceTile
                  key={deviceKey}
                  title={device.title}
                  location={device.location}
                  status={device.status}
                  color={device.color}
                  isOn={device.isOn}
                  iconName={device.iconName}
                  library={device.library}
                  onToggle={(newControl) => handleToggle(device, newControl)}
                  disabled={!device.lan?.commandPair}
                  onPress={() => {
                    setSelectedDevice(device);
                    setModalVisible(true);
                  }}
                />
              );
            })}
          </View>
        ))}
    </ScrollView>
  );
}