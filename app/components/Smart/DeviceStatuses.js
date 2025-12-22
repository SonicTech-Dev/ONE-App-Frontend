import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import styled from 'styled-components/native';
import OnlineStatus from './OnlineStatus';
import { INITIAL_DEVICE_CATEGORIES } from '../Smart/SmartScreenSections/SmartScreen.constants';
import { useRoute } from '@react-navigation/native';
const DeviceStatuses = () => {
  const route = useRoute();
  const { selectedOption, lanAuthToken } = route.params || {}; // Fetch params

  console.log('lan auth token in DeviceStatuses:', lanAuthToken);
  console.log('selectedOption in DeviceStatuses:', selectedOption);
  return (
    <ScrollViewWrapper>
        
      {/* Render each category */}  
      {INITIAL_DEVICE_CATEGORIES.map((category, categoryIndex) => (
        <CategoryContainer key={categoryIndex}>
          {/* Category Name */}
          <CategoryHeader>{category.category}</CategoryHeader>
          
          {/* Render devices under the category */}
          {category.items.map((device, deviceIndex) => (
            <DeviceRow key={deviceIndex}>
              <DeviceInfo>
                <DeviceName>{device.title}</DeviceName>
                <DeviceLocation>{device.location}</DeviceLocation>
              </DeviceInfo>
              
              {/* Online/Offline Status */}
              <OnlineStatus
                selectedOption={selectedOption}
                lanAuthToken={lanAuthToken}
                deviceId={
                  selectedOption === 'LAN'
                    ? device.lan.device_id
                    : device.wan.device_id
                }
              />
            </DeviceRow>
          ))}
        </CategoryContainer>
      ))}
    </ScrollViewWrapper>
  );
};

export default DeviceStatuses;

// Styled Components
const ScrollViewWrapper = styled.ScrollView`
  flex: 1;
  background-color: #f9f9f9;
`;

const CategoryContainer = styled.View`
  margin-bottom: 80px;
  padding: 0 16px;
`;

const CategoryHeader = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 12px;
`;

const DeviceRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;

const DeviceInfo = styled.View`
  flex: 1;
`;

const DeviceName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #2d3748;
`;

const DeviceLocation = styled.Text`
  font-size: 14px;
  color: #777;
`;
