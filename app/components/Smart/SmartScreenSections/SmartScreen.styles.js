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
  },
  // Apple Control Center Quick Action Dock
  actionDockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#1c1c1e', // frosted dark grey
    borderRadius: 24,
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
    width: 60,
  },
  actionButtonIcon: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  actionButtonLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  }
});