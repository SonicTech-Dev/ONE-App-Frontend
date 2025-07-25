import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import RTSPViewer from './RTSPViewer';

const RTSP_URLS = [
  'rtsp://admin:Sonic123@192.168.1.205:554',
  'rtsp://admin:Sonic123@192.168.1.205:554',
  'rtsp://admin:Sonic123@192.168.1.205:554',
];

const TabbedRTSPViewer = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'tab1', title: 'Camera 1' },
    { key: 'tab2', title: 'Camera 2' },
    { key: 'tab3', title: 'Camera 3' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'tab1':
        return <RTSPViewer uri={'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov'} />;
      case 'tab2':
        return <RTSPViewer uri={RTSP_URLS[1]} />;
      case 'tab3':
        return <RTSPViewer uri={RTSP_URLS[2]} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: 'blue' }}
            style={{ backgroundColor: 'white' }}
            labelStyle={{ color: 'black' }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TabbedRTSPViewer;
