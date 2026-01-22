import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requireNativeComponent } from 'react-native';
const { Akuvox } = NativeModules;
const VideoCallView = requireNativeComponent('VideoCallView');

/**
 * Contacts now reflect SIP registration initiated in SmartScreen.
 * We read 'registeredTransport' from AsyncStorage to know whether LAN/WAN was chosen.
 * Buttons for init/register are removed — registration happens automatically in SmartScreen.
 */

const apiResult = {
  family_name: 'One-Dev Mockup-Flat',
  sip_group: '1191000500',
  devices: [
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

  // Load chosen transport from SmartScreen
  useEffect(() => {
    const loadTransport = async () => {
      try {
        const t = await AsyncStorage.getItem('registeredTransport');
        if (t === 'lan' || t === 'wan') {
          setRegisteredTransport(t);
        } else {
          setRegisteredTransport(null);
        }
      } catch (e) {
        console.warn('[Contacts] Failed to load registeredTransport:', e);
      }
    };
    loadTransport();
  }, []);

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

  // Optionally poll or fetch SIP status to show user feedback
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await Akuvox.getSipStatus();
        setSipStatus(status);
      } catch (e) {
        // non-blocking
      }
    };
    fetchStatus();
  }, []);

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
      Alert.alert('Not Registered', 'Please go to Smart page and choose LAN or WAN to register SIP.');
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
      Alert.alert('Not Registered', 'Please go to Smart page and choose LAN or WAN to register SIP.');
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
            Active SIP: {registeredTransport ? activeSip : 'Register in Smart page'}
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
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#3182ce' }]}
              onPress={() => handleMakeAudioCall(selectedContact)}
            >
              <Text style={styles.actionText}>Audio Call</Text>
            </TouchableOpacity>
            <View style={{ height: 12 }} />
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#38a169' }]}
              onPress={() => handleMakeVideoCall(selectedContact)}
            >
              <Text style={styles.actionText}>Video Call</Text>
            </TouchableOpacity>
          </View>
          <View style={{ height: 12 }} />
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#a0aec0' }]}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.actionText}>Cancel</Text>
          </TouchableOpacity>
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
      {/* Header with status pill (no init/register buttons) */}
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>Contacts</Text>
        <View style={[styles.statusPill, { backgroundColor: registeredTransport ? '#C6F6D5' : '#FED7D7' }]}>
          <Text style={[styles.statusPillText, { color: registeredTransport ? '#22543D' : '#822727' }]}>
            {registeredTransport ? `Registered: ${registeredTransport.toUpperCase()}` : 'Not Registered'}
          </Text>
        </View>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 16 }}
      />
      {sipStatus !== null && (
        <Text style={styles.sipStatus}>SIP Status: {sipStatus}</Text>
      )}

      {modalVisible && selectedContact && <CallOptionsModal />}
      {incomingCall && <IncomingCallModal />}
      {showVideoCall && currentCallId !== null && <VideoCallOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f7fafc' },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#e2e8f0',
    borderBottomWidth: 1,
    borderColor: '#cbd5e0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2d3748',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  contactItem: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#edf2f7',
    marginVertical: 6,
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
  actionBtn: {
    width: '100%',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
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