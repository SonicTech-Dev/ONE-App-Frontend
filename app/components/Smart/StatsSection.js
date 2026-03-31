import React from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { TouchableOpacity, View, Text } from 'react-native';
import OnlineStatus from './OnlineStatus';
import { useNavigation } from '@react-navigation/native';
import styles from './SmartScreenSections/SmartScreen.styles';

const StatsSection = ({ selectedOption, setSelectedOption, lanHeaders }) => {
  // Legacy: parent may have headers, but OnlineStatus now generates fresh ones per request.
  const lanAuthToken = lanHeaders?.Authorization ?? lanHeaders?.token ?? null;
  const navigation = useNavigation();
  return (
    <>
      <View style={[styles.actionDockContainer, { marginTop: 16 }]}>
        {/* Contacts */}
        <TouchableOpacity 
          style={styles.actionButtonWrapper} 
          onPress={() => navigation.navigate('SdkTest')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionButtonIcon, { backgroundColor: 'rgba(207, 216, 139, 0.2)' }]}>
            <MaterialIcons name="contact-page" size={26} color="#cfd88bff" />
          </View>
          <Text style={styles.actionButtonLabel}>Contacts</Text>
        </TouchableOpacity>

        {/* Smart Lock */}
        <TouchableOpacity 
          style={styles.actionButtonWrapper} 
          onPress={() => navigation.navigate('SmartLockScreen')}
          activeOpacity={0.7}
        >
          <View style={[styles.actionButtonIcon, { backgroundColor: 'rgba(98, 154, 138, 0.2)' }]}>
            <MaterialIcons name="door-sliding" size={26} color="#629a8aff" />
          </View>
          <Text style={styles.actionButtonLabel}>Locks</Text>
        </TouchableOpacity>

        {/* Intercom */}
        <TouchableOpacity 
          style={styles.actionButtonWrapper} 
          onPress={() => navigation.navigate('IntercomScreen', {
            selectedOption,
            deviceId: '0C11052C6E92',
            lanRtspUrl: 'rtsp://admin:Sonic123@192.168.2.114:',
            wanRtspUrl: 'rtsp://user:J19IE753w25867v6@35.156.199.213:554/0C11052C6E92',
            LAN_HEADERS: lanHeaders
          })}
          activeOpacity={0.7}
        >
          <View style={[styles.actionButtonIcon, { backgroundColor: 'rgba(123, 136, 143, 0.2)' }]}>
            <MaterialIcons name="sensor-door" size={26} color="#7b888fff" />
          </View>
          <Text style={styles.actionButtonLabel}>Intercom</Text>
        </TouchableOpacity>

        {/* IP Camera */}
        <TouchableOpacity 
          style={styles.actionButtonWrapper} 
          onPress={() => navigation.navigate('IPCameraScreen', { selectedOption })}
          activeOpacity={0.7}
        >
          <View style={[styles.actionButtonIcon, { backgroundColor: 'rgba(123, 136, 143, 0.2)' }]}>
            <MaterialCommunityIcons name="cctv" size={26} color="#7b888fff" />
          </View>
          <Text style={styles.actionButtonLabel}>Cameras</Text>
        </TouchableOpacity>
      </View>

      <RadioRow>
        <RadioContainer>
          <RadioOption onPress={() => setSelectedOption('LAN')}>
            <RadioCircle selected={selectedOption === 'LAN'} />
            <RadioText>LAN</RadioText>
          </RadioOption>

          <RadioOption onPress={() => setSelectedOption('WAN')}>
            <RadioCircle selected={selectedOption === 'WAN'} />
            <RadioText>WAN</RadioText>
          </RadioOption>
        </RadioContainer>
        <NavigateButton
          onPress={() => navigation.navigate('DeviceStatuses', { selectedOption, lanAuthToken })}
        >
          <NavigateText>All Devices Status</NavigateText>
        </NavigateButton>
        <OnlineStatus selectedOption={selectedOption} />
      </RadioRow>
    </>
  );
};

export default StatsSection;

// Styled Components unchanged...
const StatsContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: 16px;
  background-color: #ffffff;
  margin: 16px;
  border-radius: 12px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 5;
`;

const Stat = styled.View`
  align-items: center;
`;

const StatValue = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #2d3748;
`;

const StatLabel = styled.Text`
  font-size: 12px;
  color: #7d8da6;
`;

const RadioRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
`;

const RadioContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const RadioOption = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  margin: 0 12px;
`;

const RadioCircle = styled.View`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 2px solid #007bff;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => (props.selected ? '#007bff' : 'transparent')};
`;

const RadioText = styled.Text`
  margin-left: 8px;
  font-size: 16px;
  color: #333;
`;

const NavigateButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
`;

const NavigateText = styled.Text`
  font-size: 12px;
  color: #0073ffff;
  margin-left: 8px;
`;