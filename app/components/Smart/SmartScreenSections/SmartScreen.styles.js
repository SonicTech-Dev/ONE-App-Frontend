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
    paddingTop: "50%",
    paddingBottom: "20%",
    paddingHorizontal: 10,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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