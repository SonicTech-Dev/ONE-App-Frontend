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
          color="#4ac0ff"
          isOn={false}
          iconName="test-tube"
          library="MaterialCommunityIcons"
          onPress={() => navigation.navigate('SdkTest')}
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