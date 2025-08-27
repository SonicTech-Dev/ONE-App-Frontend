import React, { useState } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";

const CurtainSwitch = ({ initialBrightness = 50, onChange }) => {
  const [isOn, setIsOn] = useState(false);
  const [brightness, setBrightness] = useState(initialBrightness);

  // Handle switch toggle
  const handleToggle = () => {
    const newIsOn = !isOn;
    setIsOn(newIsOn);
    onChange(newIsOn, newIsOn ? brightness : 0); // Send 0 brightness when turning OFF
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Indicator 2</Text>

      {/* ON/OFF Switch */}
      <View style={styles.row}>
        <Text>{isOn ? "ON" : "OFF"}</Text>
        <Switch value={isOn} onValueChange={handleToggle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    // width: 250,
    marginVertical:10
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  slider: {
    width: 200,
    marginTop: 10,
  },
});

export default CurtainSwitch;
