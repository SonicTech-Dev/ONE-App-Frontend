import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  PermissionsAndroid,
  Platform,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import { requireNativeComponent } from 'react-native';
const { Akuvox } = NativeModules;
const VideoCallView = requireNativeComponent('VideoCallView');

/**
 * NOTE:
 * - Devices/accounts now carry both sip_wan and sip_lan.
 * - When the user registers via WAN (registerSip) we set registeredTransport = 'wan'
 * - When the user registers via LAN (registerSipLan) we set registeredTransport = 'lan'
 * - Calls pick the appropriate sip id (sip_lan or sip_wan) based on registeredTransport.
 * - If not registered, we prompt the user to register first.
 */

const apiResult = {
  family_name: 'One-Dev Mockup-Flat',
  sip_group: '1191000500',
  devices: [
    // include both wan and lan SIP ids
    { device_id: 'd4f54a92bea2a440c8a6a23d0b636dcf7', device_name: 'HyPanel Supreme', mac: '0C110500755C', sip_wan: '1192101703', sip_lan: '1000' },
    { device_id: 'd1b001e5ddcf24d65a9d1c6ad23df43ba', device_name: 'Hypanel Lux', mac: '0C11052BF1CF', sip_wan: '1192101705', sip_lan: '1003' },
    { device_id: 'd9a69e144b34c47ea822169672c0fd40d', device_name: 'Hypanel KeyPlus  1 on M1', mac: '0C110527CAAC', sip_wan: '1192102163', sip_lan: '1001' },
    { device_id: 'd7ed72241e59342d29daffc0911503029', device_name: 'Hypanel KeyPlus 2 in M1', mac: '0C110527CA8F', sip_wan: '1192102164', sip_lan: '1002' },
  ],
  accounts: [
    { account_id: 'a9b41de81c3284515a5e833d53412fe14', sip_wan: '1192101702', sip_lan: '1192101702', account_name: 'fayis@sonictech.ae', first_name: 'User', last_name: 'Bela', email: 'fayis@sonictech.ae', main_sip: '1192101504' },
    { account_id: 'a26325098299c4090b7db6117cc0d623f', sip_wan: '1192101706', sip_lan: '1192101706', account_name: 'mahmoudsalah11350@gmail.com', first_name: 'Mahmoud', last_name: 'Salah', email: 'mahmoudsalah11350@gmail.com', main_sip: '1467100107' },
    { account_id: 'a2a340656d43745fdafce231cc9d1b2d1', sip_wan: '1192102110', sip_lan: '1192102110', account_name: 'marwan@sonictech.ae', first_name: 'Marwan', last_name: 'Khater', email: 'marwan@sonictech.ae', main_sip: '1467100107' },
  ],
  akuvox_devices: [
    { mac: '0C11052C6E92', device_name: 'Intercom R29', sip_wan: '1192101722', sip_lan: '1004' },
  ],
};

const getContacts = () => {
  const contacts = [];
  apiResult.devices.forEach(device => {
    contacts.push({
      id: device.device_id,
      name: device.device_name,
      sip_wan: device.sip_wan,
      sip_lan: device.sip_lan,
      type: 'Device',
    });
  });
  apiResult.accounts.forEach(account => {
    contacts.push({
      id: account.account_id,
      name: `${account.first_name} ${account.last_name}`,
      sip_wan: account.sip_wan,
      sip_lan: account.sip_lan,
      type: 'Account',
    });
  });
  apiResult.akuvox_devices.forEach((dev, idx) => {
    contacts.push({
      id: `akuvox_${idx}`,
      name: dev.device_name,
      sip_wan: dev.sip_wan,
      sip_lan: dev.sip_lan,
      type: 'Akuvox Device',
    });
  });
  return contacts;
};

async function requestPermissionsIfNeeded() {
  if (Platform.OS === 'android') {
    const camera = PermissionsAndroid.PERMISSIONS.CAMERA;
    const audio = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    const granted = await PermissionsAndroid.requestMultiple([camera, audio]);
    return (
      granted[camera] === PermissionsAndroid.RESULTS.GRANTED &&
      granted[audio] === PermissionsAndroid.RESULTS.GRANTED
    );
  }
  return true;
}

export default function SdkContactScreen() {
  const [sipStatus, setSipStatus] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [currentCallId, setCurrentCallId] = useState(null); // Only set after SIP event
  const [incomingCall, setIncomingCall] = useState(null); // {callId, from}
  const [registeredTransport, setRegisteredTransport] = useState(null); // 'wan' | 'lan' | null

  const contacts = getContacts();

  // Listen for SIP call established event
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(Akuvox);
    const sub = eventEmitter.addListener('onCallEstablished', (params) => {
      setCurrentCallId(params.callId);
      setShowVideoCall(true);
      setIncomingCall(null); // hide incoming call UI if it was displayed
    });
    return () => sub.remove();
  }, []);

  // Listen for SIP incoming call event
  useEffect(() => {
    const eventEmitter = new NativeEventEmitter(Akuvox);
    const incomingCallSub = eventEmitter.addListener('onIncomingCall', (params) => {
      setIncomingCall(params);
      setShowVideoCall(false); // do not show video UI until accepted
      setCurrentCallId(params.callId); // keep callId ready for accept/reject
    });
    return () => incomingCallSub.remove();
  }, []);

  // SDK Actions
  const handleInitSdk = async () => {
    const permissionsGranted = await requestPermissionsIfNeeded();
    if (!permissionsGranted) {
      Alert.alert('Permission Denied', 'Camera and microphone permissions are required for calls.');
      return;
    }
    Akuvox.initSdk();
    Alert.alert('SDK Initialized');
  };

  const handleRegisterSip = async () => {
    try {
      const result = await Akuvox.registerSip(
        "q5sa4p2gwMD6DYkkixg75l/bymQWSz8kPiFiXSNwJflACaNIDR7+4ykJfHCTkZ8tRR0AIePjUBrV+qSskC7F2AYBWO30e198FGr187+vEdDVp0Y8AghGBK6pPe2GVLi9SDMf3OQkPfqyaxTlOLKn9ydX3MDyvYiKsuodonqmKjAg3PpmfEezF76tQNBNbDBztjSHe+Nkz8Yb01jkqtln2qdX8FKQyk/Rzza1ZYAjJzS6DBgcGhLNpwPz7jrjOF1v",
        "User bela"
      );
      // On success set registered transport to WAN
      setRegisteredTransport('wan');
      Alert.alert('Result', result);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to register SIP');
    }
  };

  const handleRegisterSipLan = async () => {
    try {
      const result = await Akuvox.registerSipLan(
        "4cUSgR92G0HEVtdqewd7AT4zS22YVQVM1/7OlVH7QnsnwtqrXdLYVtz8poL/nhWnUEVM7QTea2rWri23BdQHUxyhWOz3IuzWo9o/S3hS93c=",
        "User bela"
      );
      // On success set registered transport to LAN
      setRegisteredTransport('lan');
      Alert.alert('Result', result);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to register SIP (LAN)');
    }
  };

  const handleGetSipStatus = async () => {
    try {
      const status = await Akuvox.getSipStatus();
      setSipStatus(status);
      Alert.alert('SIP Status', status.toString());
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to get SIP status');
    }
  };

  // Utility to pick the right SIP id for contact based on current registration transport
  const pickSipForContact = (contact) => {
    if (!contact) return null;
    if (registeredTransport === 'lan') {
      // prefer sip_lan, fall back to sip_wan or generic sip if present
      return contact.sip_lan || contact.sip_wan || contact.sip;
    } else if (registeredTransport === 'wan') {
      return contact.sip_wan || contact.sip_lan || contact.sip;
    } else {
      // not registered: prefer wan by default but will prompt user to register
      return contact.sip_wan || contact.sip_lan || contact.sip;
    }
  };

  // Contact Call Actions
  const handleMakeAudioCall = async (contact) => {
    if (!registeredTransport) {
      Alert.alert('Not Registered', 'Please register SIP (WAN or LAN) before making calls.');
      return;
    }
    const permissionsGranted = await requestPermissionsIfNeeded();
    if (!permissionsGranted) {
      Alert.alert('Permission Denied', 'Camera and microphone permissions are required for calls.');
      return;
    }
    const sipToCall = pickSipForContact(contact);
    Akuvox.makeCall(sipToCall, contact.name, 0); // 0 for audio call
    setModalVisible(false);
    Alert.alert('Making Audio Call', `Calling ${contact.name} (${registeredTransport.toUpperCase()} SIP: ${sipToCall})`);
  };

  const handleMakeVideoCall = async (contact) => {
    if (!registeredTransport) {
      Alert.alert('Not Registered', 'Please register SIP (WAN or LAN) before making calls.');
      return;
    }
    const permissionsGranted = await requestPermissionsIfNeeded();
    if (!permissionsGranted) {
      Alert.alert('Permission Denied', 'Camera and microphone permissions are required for calls.');
      return;
    }
    const sipToCall = pickSipForContact(contact);
    Akuvox.makeCall(sipToCall, contact.name, 1); // 1 for video call
    setModalVisible(false);
    Alert.alert('Making Video Call', `Calling ${contact.name} (video) — ${registeredTransport.toUpperCase()} SIP: ${sipToCall}`);
  };

  // Accept/Reject Incoming Call
  const handleAcceptCall = async () => {
    if (!incomingCall || !incomingCall.callId) return;
    Akuvox.answerCall(incomingCall.callId); // Native must implement this!
    setShowVideoCall(true);
    setIncomingCall(null);
  };

  const handleRejectCall = async () => {
    if (!incomingCall || !incomingCall.callId) return;
    Akuvox.hangupCall(incomingCall.callId); // Ends the incoming call
    setShowVideoCall(false);
    setIncomingCall(null);
    setCurrentCallId(null);
  };

  // List Item Render
  const renderContactItem = ({ item }) => {
    const activeSip = registeredTransport ? pickSipForContact(item) : '(not registered)';
    return (
      <TouchableOpacity
        style={styles.contactItem}
        onPress={() => {
          setSelectedContact(item);
          setModalVisible(true);
        }}
      >
        <View>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactDetail}>
            {item.type} · SIP (WAN: {item.sip_wan || '-'} · LAN: {item.sip_lan || '-'})
          </Text>
          <Text style={[styles.contactDetail, { marginTop: 6 }]}>
            Active SIP: {registeredTransport ? activeSip : 'Register first'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Modal for Call Options
  const CallOptionsModal = () => (
    <Modal
      visible={modalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            Call {selectedContact?.name}
          </Text>
          <View style={styles.modalButtons}>
            <Button
              title="Audio Call"
              onPress={() => handleMakeAudioCall(selectedContact)}
              color="#3182ce"
            />
            <View style={{ height: 12 }} />
            <Button
              title="Video Call"
              onPress={() => handleMakeVideoCall(selectedContact)}
              color="#38a169"
            />
          </View>
          <View style={{ height: 12 }} />
          <Button
            title="Cancel"
            onPress={() => setModalVisible(false)}
            color="#a0aec0"
          />
        </View>
      </View>
    </Modal>
  );

  // Incoming Call UI
  const IncomingCallModal = () => (
    <Modal
      visible={!!incomingCall}
      transparent
      animationType="fade"
      onRequestClose={handleRejectCall}
    >
      <View style={styles.incomingModalBg}>
        <View style={styles.incomingModalContainer}>
          <Text style={styles.incomingTitle}>Incoming Call</Text>
          <Text style={styles.incomingFrom}>
            {incomingCall?.remoteDisplayName
              ? `From: ${incomingCall.remoteDisplayName}`
              : incomingCall?.remoteUserName
              ? `From: ${incomingCall.remoteUserName}`
              : incomingCall?.from
              ? `From: ${incomingCall.from}`
              : ''}
          </Text>
          <View style={styles.incomingBtnRow}>
            <TouchableOpacity style={styles.acceptBtn} onPress={handleAcceptCall}>
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn} onPress={handleRejectCall}>
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Video Call Overlay UI (only shown with valid callId)
  const VideoCallOverlay = () => (
    <View style={styles.videoCallOverlay} pointerEvents="box-none">
      {/* Remote video full screen */}
      {(currentCallId !== null) && (
        <VideoCallView style={styles.remoteVideo} type="remote" callId={currentCallId} />
      )}
      {/* Local video in corner */}
      <VideoCallView style={styles.localVideo} type="local" />
      <TouchableOpacity
        style={styles.endCallButton}
        onPress={() => {
          if (currentCallId !== null) {
            Akuvox.hangupCall(currentCallId);
          }
          setShowVideoCall(false);
          setCurrentCallId(null);
        }}
      >
        <Text style={styles.endCallText}>End Call</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topBar}>
        <Button title="Init SDK" onPress={handleInitSdk} color="#2b6cb0" />
        <Button title="Register SIP" onPress={handleRegisterSip} color="#2b6cb0" />
        <Button title="Register SIP (LAN)" onPress={handleRegisterSipLan} color="#2b6cb0" />
        <Button title="SIP Status" onPress={handleGetSipStatus} color="#2b6cb0" />
      </View>
      <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.headerTitle}>Contacts</Text>
          <Text style={{ color: registeredTransport ? '#38a169' : '#e53e3e', fontWeight: '700' }}>
            {registeredTransport ? `Registered: ${registeredTransport.toUpperCase()}` : 'Not Registered'}
          </Text>
        </View>

        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          renderItem={renderContactItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
        {sipStatus !== null && (
          <Text style={styles.sipStatus}>SIP Status: {sipStatus}</Text>
        )}
      </View>
      {modalVisible && selectedContact && <CallOptionsModal />}
      {incomingCall && <IncomingCallModal />}
      {showVideoCall && currentCallId !== null && <VideoCallOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7fafc' },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#e2e8f0',
    borderBottomWidth: 1,
    borderColor: '#cbd5e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'left',
    marginBottom: 16,
    color: '#2d3748',
  },
  contactItem: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#edf2f7',
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  contactName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2b6cb0',
  },
  contactDetail: {
    fontSize: 14,
    color: '#718096',
    marginTop: 2,
  },
  separator: {
    height: 8,
  },
  sipStatus: {
    marginTop: 12,
    fontSize: 16,
    color: '#38a169',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(45, 55, 72, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    shadowColor: '#2d3748',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#2b6cb0',
    textAlign: 'center',
  },
  modalButtons: {
    width: '100%',
  },
  incomingModalBg: {
    flex: 1,
    backgroundColor: 'rgba(45, 55, 72, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomingModalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    width: '80%',
    alignItems: 'center',
    elevation: 8,
  },
  incomingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2b6cb0',
    marginBottom: 8,
  },
  incomingFrom: {
    fontSize: 16,
    color: '#718096',
    marginBottom: 18,
  },
  incomingBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  acceptBtn: {
    backgroundColor: '#38a169',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginRight: 8,
  },
  acceptBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  rejectBtn: {
    backgroundColor: '#c53030',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginLeft: 8,
  },
  rejectBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  videoCallOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  remoteVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
  },
  localVideo: {
    position: 'absolute',
    width: 120,
    height: 160,
    right: 16,
    top: 16,
    backgroundColor: '#444',
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 101,
  },
  endCallButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#c53030',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    zIndex: 102,
  },
  endCallText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});