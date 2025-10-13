import React from 'react';
import { ScrollView, View } from 'react-native';
import DeviceTile from '../DeviceTile'
import styles from './SmartScreen.styles';

export default function DeviceGrid({
  filteredDevices,
  handleToggle,
  navigation,
  setSelectedDevice,
  setModalVisible,
  selectedOption,
}) {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} scrollEventThrottle={16}>
      {/* SDK Test Tile */}
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
              const mode = selectedOption.toLowerCase();
              const deviceKey = `${device.title}-${device.location}-${index}`;
              const canControl = !!device[mode] && !!device[mode].commandPair;
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
                  onToggle={canControl ? (newControl) => handleToggle(device, newControl) : undefined}
                  disabled={!canControl}
                  commandPair={device[mode]?.commandPair}
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