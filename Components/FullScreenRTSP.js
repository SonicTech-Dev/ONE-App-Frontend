import React from 'react';
import { View, StyleSheet } from 'react-native';
import RTSPViewer from './RTSPViewer';

const FullScreenRTSP = ({ route }) => {
  const { uri } = route.params;
  return (
    <View style={styles.fullScreenContainer}>
      <RTSPViewer uri={uri} />
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
});

export default FullScreenRTSP;