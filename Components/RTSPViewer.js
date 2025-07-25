import React from 'react';
import { View, Dimensions } from 'react-native';
import { VlcSimplePlayer } from 'react-native-vlc-rtsp';

const { width } = Dimensions.get('window');
const SQUARE_SIZE = width;

const RTSPViewer = ({ uri }) => (
  <View style={{ width: SQUARE_SIZE, height: SQUARE_SIZE }}>
    <VlcSimplePlayer
      autoplay={true}
      style={{ width: '100%', height: '100%' }} // Add height!
      url={uri} // <- FIXED
      autoAspectRatio={false}
      onStartFullScreen={() => null}
      onCloseFullScreen={() => null}
    />
  </View>
);

export default RTSPViewer;
