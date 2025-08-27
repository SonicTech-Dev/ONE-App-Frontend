import React from 'react';
import SL50LockModal from './Smart/SmartLock/Sl50';
import CurtainModal from './Smart/Curtain/CurtainOptions'; // Ensure this exists
import GenericDeviceModal from './Smart/Sensors/Sensors1'; // Fallback
import ACModal from './Smart/AC/AC'; // Ensure this exists
import SmartValveModal from './Smart/Smart-Valve/smartValve';
import DimmerLightModal from './Smart/DimmerLights/Dimmer';
import MotionSensorModal from './Smart/Sensors/MotionSensor'; // Ensure this exists
import FloodSensorModal from './Smart/Sensors/FloodSensor';
import DoorWindowSensorModal from './Smart/Sensors/DoorWindow';
import OccupancySensorModal from './Smart/Sensors/HumanPresense';
import TemperatureHumiditySensorModal from './Smart/Sensors/TemperatureHumidity';
import SmokeSensorModal from './Smart/Sensors/SmokeSensor';
import AirQualityMonitorModal from './Smart/Sensors/AirQualityMonitor';
import CoSensorModal from './Smart/Sensors/CoSensor';
import C6LockModal from './Smart/SmartLock/C6Lock';
import FourGangSwitchModal from './Smart/Switches/FourGangTouch';

export default function DeviceModals({
  selectedDevice,
  modalVisible,
  setModalVisible,
  handleToggle,
  handleSetPosition,
  handleSetTemperature,
  deviceStatus,
  handleSetHVACMode,
  handleSetFanSpeed,
  handleSetBrightness
})


{

  if (!selectedDevice) return null;
  const { title, isOn } = selectedDevice;
  if (
    title.includes("SL50 Smart Lock")
    ) {
    return (
      <SL50LockModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        isLocked={isOn}
        onToggleLock={() => {
          handleToggle(selectedDevice, isOn ? 'off' : 'on');
        }}
        deviceStatus={deviceStatus}
      />
    );
  }
   if (
    title.includes("C6 Lock")
    ) {
    return (
      <C6LockModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        isLocked={isOn}
        onToggleLock={() => {
          handleToggle(selectedDevice, isOn ? 'off' : 'on');
        }}
        deviceStatus={deviceStatus}
      />
    );
  }
  if (title === "Curtain") {
    return (
      <CurtainModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        onOpen={() => handleToggle(selectedDevice, "on")}
        onPause={() => handleToggle(selectedDevice, "stop")}
        onSetPosition={(pos) => handleSetPosition(selectedDevice, pos)}
        onCloseCurtain={() => handleToggle(selectedDevice, "off")}
        deviceStatus={deviceStatus}
      />
    );
  }
  if (
  title.includes("AC - Thermostat") ||
  title.includes("AC - Fancoil") ||
  title.includes("Super General AC")
) {
  return (
    <ACModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        deviceStatus={deviceStatus}
        isOn={selectedDevice.isOn}
        onTurnOn={() => handleToggle(selectedDevice, 'on')}
        onTurnOff={() => handleToggle(selectedDevice, 'off')}
        temperature={selectedDevice.temperature || 24}
        onSetTemperature={(temp) => handleSetTemperature(selectedDevice, temp)}
        hvacMode={selectedDevice.hvacMode || 'auto'}
        onSetHVACMode={(HVACmode) => handleSetHVACMode(selectedDevice, HVACmode)}
        fanSpeed={selectedDevice.fanSpeed || 'auto'}
        onSetFanSpeed={(speed) => handleSetFanSpeed(selectedDevice, speed)}
        />
  );
 }
 if (title.includes("Smart Valve")) {
    return (
      <SmartValveModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        onToggle={() => handleToggle(selectedDevice, isOn ? 'off' : 'on')}
        deviceStatus={deviceStatus}
        onOpenValve={() => handleToggle(selectedDevice, 'on')}
        onCloseValve={() => handleToggle(selectedDevice, 'off')}
      />
    );
  }

  if (title.includes("Dimmer 1")
    || title.includes("Dimmer 2") 
    || title.includes("Dimmer 3")
    || title.includes("Dimmer 4"))  
    {
    return (
      <DimmerLightModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        onToggle={() => handleToggle(selectedDevice, isOn ? 'off' : 'on')}
        deviceStatus={deviceStatus}
        onTurnOff={() => handleToggle(selectedDevice, 'off')}
        onTurnOn={() => handleToggle(selectedDevice, 'on')}
        onSetBrightness={(brightness) => handleSetBrightness(selectedDevice, brightness)}
      />
    );
  }
  if (title.includes("Motion Sensor")) {
    return (
      <MotionSensorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        deviceStatus={deviceStatus}
      />
    );
  }
  if (title.includes("Flood Sensor")) {
    return (
      <FloodSensorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        deviceStatus={deviceStatus}
      />
    );
  }
  if (title.includes("Door/Window Sensor")) {
    return (
      <DoorWindowSensorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        deviceStatus={deviceStatus}
      />
    );
  }
  if (title.includes("Occupancy Sensor")) {
    return (
      <OccupancySensorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        deviceStatus={deviceStatus}
      />
    );
  }
  if (title.includes("Occupancy Sensor")) {
    return (
      <OccupancySensorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        deviceStatus={deviceStatus}
      />
    );
  }
  if (title.includes("Temperature&Humidity Sensor")) {
    return (
      <TemperatureHumiditySensorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        deviceStatus={deviceStatus}
      />
    );
  }
  if (title.includes("Smoke Sensor")) {
    return (
      <SmokeSensorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        deviceStatus={deviceStatus}
      />
    );
  }
  if (title.includes("Air Detector")) {
    return (
      <AirQualityMonitorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        deviceStatus={deviceStatus}
      />
    );
  }
  if (title.includes("CO Sensor")) {
    return (
      <CoSensorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        deviceStatus={deviceStatus}
      />
    );
  }
  if (title.includes("4 Gang Switch")) {
    return (
      <FourGangSwitchModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        deviceStatus={deviceStatus}
        switchAbilityName={selectedDevice}
        onToggleSwitch={(deviceName, newState) => handleToggle(selectedDevice, newState) }
      />
    );
  }

  // Add more device types here if needed.


  // Generic fallback
  return (
    <GenericDeviceModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      device={selectedDevice}
      deviceStatus={deviceStatus}
    />
  );
}