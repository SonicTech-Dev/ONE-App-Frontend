import React from 'react';
import { View } from 'react-native';
import { VlcSimplePlayer } from 'react-native-vlc-rtsp';

const RTSPViewer = ({ uri, style }) => (
  <View style={[{ backgroundColor: 'black' }, style]}>
    <VlcSimplePlayer
      autoplay={true}
      style={{ width: '100%', height: '100%' }}
      url={uri}
      autoAspectRatio={false}
      onStartFullScreen={() => null}
      onCloseFullScreen={() => null}
    />
  </View>
);

export default RTSPViewer;