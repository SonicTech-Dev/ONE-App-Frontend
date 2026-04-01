import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    zIndex: 2,
    backgroundColor: '#f8f9fc',
    height: 170,
  },
  tabsContainer: {
    width: '100%',
    zIndex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    paddingTop: '41%',
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
  },
  // Apple Control Center Quick Action Dock
  actionDockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginBottom: 14,
    backgroundColor: '#6f4bd8', // frosted dark grey
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  actionButtonWrapper: {
    alignItems: 'center',
    width: 56,
  },
  actionButtonIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionButtonLabel: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  }
});