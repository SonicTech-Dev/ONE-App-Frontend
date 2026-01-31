import React, { useMemo, useState, useCallback } from 'react';
import styled from 'styled-components/native';
import { useRoute } from '@react-navigation/native';
import { INITIAL_DEVICE_CATEGORIES } from '../Smart/SmartScreenSections/SmartScreen.constants';
import DeviceListOnlineStatus from './online_status_list';

const DeviceStatuses = () => {
  const route = useRoute();
  const { selectedOption = 'LAN', lanAuthToken } = route.params || {}; // Fetch params

  const [statusMap, setStatusMap] = useState({});
  const [loading, setLoading] = useState(false);

  console.log('lan auth token in DeviceStatuses:', lanAuthToken);
  console.log('selectedOption in DeviceStatuses:', selectedOption);

  // Stable callbacks so the bulk fetch effect doesn’t re-run unnecessarily
  const handleStatuses = useCallback((map) => {
    setStatusMap(map || {});
  }, []);

  const handleLoadingChange = useCallback((val) => {
    setLoading(!!val);
  }, []);

  // Optional: collect all device IDs we plan to render (for debug)
  const allDeviceIds = useMemo(() => {
    const ids = [];
    INITIAL_DEVICE_CATEGORIES.forEach((category) => {
      category.items.forEach((device) => {
        const id =
          selectedOption === 'LAN'
            ? device?.lan?.device_id
            : device?.wan?.device_id;
        if (id) ids.push(id);
      });
    });
    return ids;
  }, [selectedOption]);

  return (
    <>
      {/* Single bulk fetch for all statuses */}
      <DeviceListOnlineStatus
        selectedOption={selectedOption}
        // If needed, override endpoints here:
        // wanBackendUrl="http://3.227.99.254:8010/device_list/"
        // lanUrl="http://192.168.2.115/api/v1.0/device"
        // requestId="c45e846ca23ab42c9ae469d988ae32a96"
        // residenceId="r45844047053e43d78fe5272c5badbd3a"
        pollingInterval={30000}
        onStatuses={handleStatuses}
        onLoadingChange={handleLoadingChange}
      />

      <ScrollViewWrapper>
        {INITIAL_DEVICE_CATEGORIES.map((category, categoryIndex) => (
          <CategoryContainer key={categoryIndex}>
            <CategoryHeader>{category.category}</CategoryHeader>

            {category.items.map((device, deviceIndex) => {
              const deviceId =
                selectedOption === 'LAN'
                  ? device?.lan?.device_id
                  : device?.wan?.device_id;

              const isOnline =
                typeof statusMap[deviceId] === 'boolean' ? statusMap[deviceId] : false;

              return (
                <DeviceRow key={deviceIndex}>
                  <DeviceInfo>
                    <DeviceName>{device.title}</DeviceName>
                    <DeviceLocation>{device.location}</DeviceLocation>
                  </DeviceInfo>

                  {loading && typeof statusMap[deviceId] !== 'boolean' ? (
                    <CheckingText>Checking...</CheckingText>
                  ) : (
                    <StatusText isOnline={!!isOnline}>
                      {isOnline ? 'Online' : 'Offline'}
                    </StatusText>
                  )}
                </DeviceRow>
              );
            })}
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

const StatusText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.isOnline ? 'green' : 'red')};
  margin-left: 16px;
`;

const CheckingText = styled.Text`
  margin-left: 16px;
  color: #777;
`;