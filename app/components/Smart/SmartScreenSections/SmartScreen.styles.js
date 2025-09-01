import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
    backgroundColor: '#f8f9fc',
    height: 200,
  },
  tabsContainer: {
    width: '100%',
    zIndex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingTop: 200,
    paddingHorizontal: 20,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sdkTestTileRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sdkTestTile: {
    flex: 1,
    minWidth: 0,
    maxWidth: '100%',
  }
});