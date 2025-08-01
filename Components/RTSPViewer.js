import React from 'react';
import { View } from 'react-native';
import { VlcSimplePlayer } from 'react-native-vlc-rtsp';

const RTSPViewer = ({ uri }) => (
  <View style={{ flex: 1, backgroundColor: 'black' }}>
    <VlcSimplePlayer
      autoplay={true}
      style={{ flex: 1 }}
      url={uri}
      autoAspectRatio={false}
      onStartFullScreen={() => null}
      onCloseFullScreen={() => null}
    />
  </View>
);

export default RTSPViewer;