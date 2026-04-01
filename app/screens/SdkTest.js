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
  NativeModules,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { Akuvox } = NativeModules;

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
    { account_id: 'a9b41de81c3284515a5e833d53412fe14', sip_wan: '1192101702', sip_lan: '1192101702', account_name: 'fayis@sonictech.ae', first_name: 'Laguna Mockup', last_name: 'One-Development', email: 'fayis@sonictech.ae', main_sip: '1192101504' },
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
      sip_group: apiResult.sip_group,
      type: 'Device',
    });
  });
  apiResult.accounts.forEach(account => {
    contacts.push({
      id: account.account_id,
      name: `${account.first_name} ${account.last_name}`,
      sip_wan: account.sip_wan,
      sip_lan: account.sip_lan,
      main_sip: account.main_sip,
      sip_group: apiResult.sip_group,
      type: 'Account',
    });
  });
  apiResult.akuvox_devices.forEach((dev, idx) => {
    contacts.push({
      id: `akuvox_${idx}`,
      name: dev.device_name,
      sip_wan: dev.sip_wan,
      sip_lan: dev.sip_lan,
      sip_group: apiResult.sip_group,
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

export default function SdkContactScreen({ navigation }) {
  const [sipStatus, setSipStatus] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [registeredTransport, setRegisteredTransport] = useState(null); // 'wan' | 'lan' | null

  const contacts = getContacts();

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

  // Keep transport synced when this screen regains focus (after user switches LAN/WAN in SmartScreen).
  useFocusEffect(
    React.useCallback(() => {
      loadTransport();
    }, [])
  );

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

  const uniqueSipTargets = (items) => {
    const seen = new Set();
    const result = [];

    items.forEach((item) => {
      const value = typeof item === 'string' || typeof item === 'number' ? String(item).trim() : '';
      if (!value || seen.has(value)) {
        return;
      }
      seen.add(value);
      result.push(value);
    });

    return result;
  };

  // Build ordered SIP candidates for resilient dialing.
  const getSipCandidatesForContact = (contact) => {
    if (!contact) return [];

    if (registeredTransport === 'lan') {
      return uniqueSipTargets([
        contact.sip_lan,
        contact.sip_wan,
        contact.main_sip,
        contact.sip_group,
        contact.sip,
      ]);
    }

    if (registeredTransport === 'wan') {
      return uniqueSipTargets([
        contact.main_sip,
        contact.sip_wan,
        contact.sip_lan,
        contact.sip_group,
        contact.sip,
      ]);
    }

    return uniqueSipTargets([
      contact.main_sip,
      contact.sip_wan,
      contact.sip_lan,
      contact.sip_group,
      contact.sip,
    ]);
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
    const sipCandidates = getSipCandidatesForContact(contact);
    const sipToCall = sipCandidates[0];
    if (!sipToCall) {
      Alert.alert('Missing SIP', `No valid SIP target found for ${contact?.name || 'contact'}.`);
      return;
    }

    console.log('[Contacts] Audio call target:', {
      transport: registeredTransport,
      sipToCall,
      sipCandidates,
      contact: contact?.name,
    });
    Akuvox.makeCall(sipToCall, contact.name, 0); // 0 for audio call
    setModalVisible(false);
    
    // Immediately navigate to ActiveCallScreen in Outgoing mode
    navigation.navigate('ActiveCallScreen', {
      callId: 'dialing',
      remoteName: contact.name,
      isOutgoing: true,
      dialTargets: sipCandidates,
      dialTargetIndex: 0,
      callVideoMode: 0,
    });
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
    const sipCandidates = getSipCandidatesForContact(contact);
    const sipToCall = sipCandidates[0];
    if (!sipToCall) {
      Alert.alert('Missing SIP', `No valid SIP target found for ${contact?.name || 'contact'}.`);
      return;
    }

    console.log('[Contacts] Video call target:', {
      transport: registeredTransport,
      sipToCall,
      sipCandidates,
      contact: contact?.name,
    });
    Akuvox.makeCall(sipToCall, contact.name, 1); // 1 for video call
    setModalVisible(false);

    // Immediately navigate to ActiveCallScreen in Outgoing mode
    navigation.navigate('ActiveCallScreen', {
      callId: 'dialing',
      remoteName: contact.name,
      isOutgoing: true,
      dialTargets: sipCandidates,
      dialTargetIndex: 0,
      callVideoMode: 1,
    });
  };

  // List Item Render
  const renderContactItem = ({ item }) => {
    const activeSip = registeredTransport ? (getSipCandidatesForContact(item)[0] || '(missing sip)') : '(not registered)';
    return (
      <TouchableOpacity
        style={styles.contactItem}
        activeOpacity={0.7}
        onPress={() => {
          setSelectedContact(item);
          setModalVisible(true);
        }}
      >
        <View style={styles.contactAvatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactDetail}>
            {item.type} {item.sip_lan ? `• LAN` : ''}
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
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />
      {sipStatus !== null && (
        <Text style={styles.sipStatus}>SIP Status: {sipStatus}</Text>
      )}

      {modalVisible && selectedContact && <CallOptionsModal />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0d0d0d' }, // Ultra dark background
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(20,20,20,0.8)',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
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
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    backgroundColor: '#1a1a1c', // Dark frosted row
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#32d2d6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  contactName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 14,
    color: '#8e8e93',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent', 
  },
  sipStatus: {
    marginTop: 12,
    fontSize: 14,
    color: '#34c759',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 30,
    width: '100%',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    color: '#ffffff',
    textAlign: 'center',
  },
  modalButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  actionText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  incomingModalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    alignItems: 'center',
  },
  incomingModalContainer: {
    backgroundColor: '#1c1c1e',
    borderRadius: 24,
    padding: 32,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  incomingTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
  },
  incomingFrom: {
    fontSize: 16,
    color: '#a1a1aa',
    marginBottom: 24,
  },
  incomingBtnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#34c759',
    paddingVertical: 16,
    borderRadius: 16,
    marginRight: 8,
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 16,
    marginLeft: 8,
    alignItems: 'center',
  },
  rejectBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
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
    backgroundColor: '#000',
  },
  localVideo: {
    position: 'absolute',
    width: 120,
    height: 160,
    right: 20,
    top: 60,
    backgroundColor: '#111',
    borderRadius: 12,
    overflow: 'hidden',
    zIndex: 101,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  endCallButton: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center',
    backgroundColor: '#ff3b30',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 102,
  },
  endCallText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});