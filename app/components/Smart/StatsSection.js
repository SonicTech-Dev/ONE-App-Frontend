import React from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';
import OnlineStatus from './OnlineStatus';
import { useNavigation } from '@react-navigation/native';

const stats = [
  { icon: 'sunny', value: '75%', label: 'motion' },
  { icon: 'flash', value: '60kwh', label: 'energy' },
  { icon: 'thermometer', value: '24°C', label: 'temp' },
];

const StatsSection = ({ selectedOption, setSelectedOption, lanHeaders }) => {
  // Legacy: parent may have headers, but OnlineStatus now generates fresh ones per request.
  const lanAuthToken = lanHeaders?.Authorization ?? lanHeaders?.token ?? null;
  const navigation = useNavigation();
  return (
    <>
      <StatsContainer>
        {stats.map((stat, index) => (
          <Stat key={index}>
            <Ionicons name={stat.icon} size={24} color="#7d8da6" />
            <StatValue>{stat.value}</StatValue>
            <StatLabel>{stat.label}</StatLabel>
          </Stat>
        ))}
      </StatsContainer>

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