import React, { useState, useCallback } from 'react';
import styled from 'styled-components/native';
import { useRoute } from '@react-navigation/native';
import { INITIAL_DEVICE_CATEGORIES } from '../Smart/SmartScreenSections/SmartScreen.constants';
import DeviceListOnlineStatus from './online_status_list';

const DeviceStatuses = () => {
  const route = useRoute();
  const { selectedOption = 'LAN' } = route.params || {};

  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(false);

  const handleStatuses = useCallback((map) => {
    setStatusMap(map || {});
  }, []);
  const handleLoadingChange = useCallback((val) => {
    setLoading(!!val);
  }, []);

  return (
    <>
      {/* Single bulk fetch for all statuses by device_id */}
      <DeviceListOnlineStatus
        selectedOption={selectedOption}
        pollingInterval={30000}
        onStatuses={handleStatuses}
        onLoadingChange={handleLoadingChange}
      />

      <ScrollViewWrapper>
        <HeaderTitle>Device Status</HeaderTitle>
        {INITIAL_DEVICE_CATEGORIES.map((category, categoryIndex) => (
          <CategoryContainer key={categoryIndex}>
            <CategoryHeader>{category.category}</CategoryHeader>
            <DeviceGroup>
              {category.items.map((device, deviceIndex) => {
                const deviceId =
                  selectedOption === 'WAN'
                    ? device?.wan?.device_id
                    : device?.lan?.device_id;

                const hasStatus = typeof statusMap[deviceId] === 'boolean';
                const isOnline = hasStatus ? statusMap[deviceId] : false;
                const isLast = deviceIndex === category.items.length - 1;

                return (
                  <DeviceRow key={deviceIndex} isLast={isLast}>
                    <DeviceInfo>
                      <DeviceName>{device.title}</DeviceName>
                      <DeviceLocation>{device.location}</DeviceLocation>
                    </DeviceInfo>

                    {loading && !hasStatus ? (
                      <StatusPill color="#4a5568">
                        <StatusInnerDot color="#a0aec0" />
                        <PillText>Checking</PillText>
                      </StatusPill>
                    ) : (
                      <StatusPill color={isOnline ? 'rgba(52, 199, 89, 0.15)' : 'rgba(255, 59, 48, 0.15)'}>
                        <StatusInnerDot color={isOnline ? '#34c759' : '#ff3b30'} />
                        <PillText color={isOnline ? '#248a3d' : '#bd2a22'}>
                          {isOnline ? 'Online' : 'Offline'}
                        </PillText>
                      </StatusPill>
                    )}
                  </DeviceRow>
                );
              })}
            </DeviceGroup>
          </CategoryContainer>
        ))}
      </ScrollViewWrapper>
    </>
  );
};

export default DeviceStatuses;

// Styled Components
const ScrollViewWrapper = styled.ScrollView`
  flex: 1;
  background-color: #f2f2f7; /* iOS System Gray 6 */
`;

const HeaderTitle = styled.Text`
  font-size: 34px;
  font-weight: 800;
  color: #000;
  margin: 20px 20px 10px 20px;
`;

const CategoryContainer = styled.View`
  margin-bottom: 24px;
  padding: 0 16px;
`;

const CategoryHeader = styled.Text`
  font-size: 15px;
  font-weight: 600;
  color: #8e8e93;
  text-transform: uppercase;
  margin-bottom: 8px;
  margin-left: 16px;
  letter-spacing: 0.5px;
`;

const DeviceGroup = styled.View`
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
`;

const DeviceRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #ffffff;
  border-bottom-width: ${(props) => (props.isLast ? '0px' : '0.5px')};
  border-bottom-color: #c6c6c8;
`;

const DeviceInfo = styled.View`
  flex: 1;
`;

const DeviceName = styled.Text`
  font-size: 17px;
  font-weight: 600;
  color: #000;
  margin-bottom: 2px;
`;

const DeviceLocation = styled.Text`
  font-size: 13px;
  color: #8e8e93;
  font-weight: 500;
`;

const StatusPill = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${(props) => props.color};
  padding: 6px 12px;
  border-radius: 14px;
`;

const StatusInnerDot = styled.View`
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background-color: ${(props) => props.color};
  margin-right: 6px;
`;

const PillText = styled.Text`
  font-size: 13px;
  font-weight: 700;
  color: ${(props) => props.color || '#fff'};
`;