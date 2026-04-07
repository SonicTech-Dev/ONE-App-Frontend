import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { VlcSimplePlayer } from 'react-native-vlc-rtsp';

const RTSPViewer = ({ uri }) => {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowOverlay(false), 1500);
    return () => clearTimeout(timer);
  }, [uri]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <VlcSimplePlayer
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
        url={uri}
        autoAspectRatio={false}
        onStartFullScreen={() => null}
        onCloseFullScreen={() => null}
      />
      {showOverlay && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000' }]} />
      )}
    </View>
  );
};

export default RTSPViewer;


