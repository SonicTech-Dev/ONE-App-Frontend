import { Alert } from 'react-native';

export const controlDevice = async (
  deviceId,
  abilityId,
  command,
  attribute,
  selectedOption,
  LAN_HEADERS // required, must be passed through props
) => {
  // Normalize selectedOption
  const isLAN = selectedOption && selectedOption.toLowerCase() === 'lan';

  if (isLAN) {
    const lanApiUrl = `http://192.168.2.115/api/v1.0/device`;
    const body = {
      command: "control_device",
      id: "c45e846ca23ab42c9ae469d988ae32a96",
      param: {
        device_id: deviceId,
        ability_id: abilityId,
        action: command,
        ...(attribute ? { attribute } : {}),
      },
    };
    console.log('LAN headers received for API:', LAN_HEADERS);

    try {
      const response = await fetch(lanApiUrl, {
        method: 'POST',
        headers: LAN_HEADERS,
        body: JSON.stringify(body),
      });

      if (response.ok) {
      } else {
        Alert.alert('Error', 'LAN control failed. Please check device connection.');
      }
    } catch (error) {
      console.error('LAN error:', error);
      Alert.alert('Error', 'Failed to control device locally.');
    }
  } else {
    const apiUrl = 'http://3.227.99.254:8010/control_devices/';
    const body = {
      command: 'batch_control_device',
      id: 'c45e846ca23ab42c9ae469d988ae32a96',
      param: {
        residence_id: 'r45844047053e43d78fe5272c5badbd3a',
        devices: [
          {
            device_id: deviceId,
            ability_id: abilityId,
            control: command,
            ...(attribute ? { attribute } : {}),
          },
        ],
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error controlling device:', error);
      Alert.alert('Error', 'Failed to control the device. Please check your connection.');
    }
  }
};

export const deviceStatus = async (
  deviceId,
  selectedOption,
  setSelectedDeviceStatus,
  LAN_HEADERS // required, must be passed through props
) => {
  // Normalize selectedOption
  const isLAN = selectedOption && selectedOption.toLowerCase() === 'lan';

  if (isLAN) {
    const lanApiUrl = `http://192.168.2.115/api/v1.0/device`;
    const body = {
      command: 'get_device_info',
      id: 'c45e846ca23ab42c9ae469d988ae32a96',
      param: {
        device_id: deviceId,
      },
    };
    try {
      const response = await fetch(lanApiUrl, {
        method: 'POST',
        headers: LAN_HEADERS,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedDeviceStatus(data);
      } else {
        Alert.alert('Error', 'LAN control failed. Please check device connection.');
      }
    } catch (error) {
      console.error('LAN error:', error);
      Alert.alert('Error', 'Failed to retrieve device status locally.');
    }
  } else {
    const apiUrl = 'http://3.227.99.254:8010/device_status/';
    const body = {
      command: 'get_device_info',
      id: 'c45e846ca23ab42c9ae469d988ae32a96',
      param: {
        residence_id: 'r45844047053e43d78fe5272c5badbd3a',
        device_id: deviceId,
      },
    };
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedDeviceStatus(data);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error retrieving device status:', error);
      Alert.alert('Error', 'Failed to retrieve the device status. Please check your connection.');
    }
  }
};