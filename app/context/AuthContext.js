import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const BACKEND_URL = "https://one-development.soniciot.com";
export const LAN_BASE_URL = "http://192.168.2.115/api/v1.0";

// General Wan Account (Strictly for Registration)
const GENERAL_USERNAME = "fayis@sonictech.ae";
const GENERAL_PASSWORD = "Fayis@123";
const CLIENT_ID = "ccf1ac952146b11f0904c02dd80f92105";
const CLIENT_SECRET = "scf1ac95d146b11f0904c02dd80f92105";

export function AuthProvider({ children }) {
  const [lanToken, setLanToken] = useState(null);
  const [wanToken, setWanToken] = useState(null);
  const [userCredentials, setUserCredentials] = useState(null);
  const [networkMode, setNetworkMode] = useState('WAN');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const checkPersistedAuth = async () => {
      try {
        const storedMode = await AsyncStorage.getItem('networkMode') || 'WAN';
        // Manage the currently active session explicitly
        const activeEmail = await AsyncStorage.getItem('activeEmail');
        const activePassword = await AsyncStorage.getItem('activePassword');

        // Do not restore old access tokens across launches.
        // They can be expired and cause immediate 401/unauthorized errors on startup.
        await AsyncStorage.multiRemove(['lanToken', 'wanToken']);
        setLanToken(null);
        setWanToken(null);
        setNetworkMode(storedMode);
        
        if (activeEmail && activePassword) {
          setUserCredentials({ email: activeEmail, password: activePassword });
        }
      } catch (e) {
        console.error("Failed to load auth state", e);
      } finally {
        setIsInitializing(false);
      }
    };
    checkPersistedAuth();
  }, []);

  const determineNetworkMode = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); 
      const response = await fetch(LAN_BASE_URL + "/device/info", {
        signal: controller.signal,
        method: 'GET'
      });
      clearTimeout(timeoutId);
      if (response.ok || response.status === 401 || response.status === 403) {
        setNetworkMode('LAN');
        return 'LAN';
      }
      setNetworkMode('WAN');
      return 'WAN';
    } catch (e) {
      setNetworkMode('WAN');
      return 'WAN';
    }
  };

  const fetchWanToken = async (email, password) => {
    const AUTH_URL = "https://api.ecloud.akubela.com/api/v1.0/invoke/open-ability/method/oauth2/token";
    const body = "username=" + encodeURIComponent(email) +
      "&password=" + encodeURIComponent(password) +
      "&grant_type=password&client_id=" + encodeURIComponent(CLIENT_ID) +
      "&client_secret=" + encodeURIComponent(CLIENT_SECRET) +
      "&scope=user&expires_in=100000";

    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await response.json();
    if (!response.ok || !data.success) throw new Error("Failed WAN token: " + JSON.stringify(data));
    return data.result.access_token;
  };

  const fetchLanToken = async (email, password) => {
    const AUTH_URL = LAN_BASE_URL + "/auth";
    const body = "username=" + encodeURIComponent(email) +
      "&password=" + encodeURIComponent(password) +
      "&grant_type=password&expires_in=100000";

    const response = await fetch(AUTH_URL, {
      method: "POST",
      headers: { accept: "application/json", "content-type": "application/x-www-form-urlencoded" },
      body,
    });
    const text = await response.text();
    const data = JSON.parse(text);
    if (!response.ok || !data.success) throw new Error(`Failed LAN token: ${response.status} ${text}`);
    return data.result.access_token;
  };

  /** Dynamically grabs from cache instantly, or fetches from Network exactly 1 time! */
  const getActiveLanToken = async (forceRefresh = false) => {
    if (lanToken && !forceRefresh) return lanToken;
    if (!userCredentials) throw new Error("No offline credentials available.");
    const token = await fetchLanToken(userCredentials.email, userCredentials.password);
    setLanToken(token);
    await AsyncStorage.setItem('lanToken', token);
    return token;
  };

  const getActiveWanToken = async (forceRefresh = false) => {
    if (wanToken && !forceRefresh) return wanToken;
    if (!userCredentials) throw new Error("No offline credentials available.");
    const token = await fetchWanToken(userCredentials.email, userCredentials.password);
    setWanToken(token);
    await AsyncStorage.setItem('wanToken', token);
    return token;
  };

  const login = async (email, password) => {
    // 1. Detect if we are physically on the home Wi-Fi (LAN) or out in the world (WAN)
    const mode = await determineNetworkMode();
    setUserCredentials({ email, password });

    try {
      // 2. ALWAYS attempt the Cloud (Django Proxy) first if the Internet is working!
      const response = await fetch(`${BACKEND_URL}/api/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) throw new Error("Invalid online login.");

      // 3. Internet is working and Django confirmed the password! 
      // Save this user centrally in the offline vault and mark them as the active session.
      await AsyncStorage.setItem('activeEmail', email);
      await AsyncStorage.setItem('activePassword', password);

      const usersStr = await AsyncStorage.getItem('savedOfflineUsers');
      let offlineUsers = {};
      try { offlineUsers = usersStr ? JSON.parse(usersStr) : {}; } catch (e) {}
      
      offlineUsers[email] = password;
      await AsyncStorage.setItem('savedOfflineUsers', JSON.stringify(offlineUsers));

      // Generate the eCloud WAN Token
      const wToken = await fetchWanToken(email, password);
      setWanToken(wToken);
      await AsyncStorage.setItem('wanToken', wToken);

      // If they happen to be home on the LAN, simultaneously generate the LAN Token too!
      if (mode === 'LAN') {
        try {
          const lToken = await fetchLanToken(email, password);
          setLanToken(lToken);
          await AsyncStorage.setItem('lanToken', lToken);
        } catch (e) {
          console.warn("LAN detected but panel token rejected.", e);
        }
      }

      await AsyncStorage.setItem('networkMode', mode);
      return { success: true, mode };

    } catch (onlineError) {
      // 4. OFFLINE FAIL-SAFE: The Internet is completely DOWN or Unreachable!
      if (mode === 'LAN') {
        const usersStr = await AsyncStorage.getItem('savedOfflineUsers');
        let offlineUsers = {};
        try { offlineUsers = usersStr ? JSON.parse(usersStr) : {}; } catch (e) {}
        
        if (offlineUsers[email] && offlineUsers[email] === password) {
          // Offline Match! Generate LAN token instantly bypassing the cloud.
          const lToken = await fetchLanToken(email, password);
          setLanToken(lToken);
          await AsyncStorage.setItem('lanToken', lToken);
          
          await AsyncStorage.setItem('activeEmail', email);
          await AsyncStorage.setItem('activePassword', password);
          await AsyncStorage.setItem('networkMode', 'LAN');
          return { success: true, mode: 'LAN' };
        } else {
          throw new Error("Invalid offline credentials. Must sign in online first to cache this user.");
        }
      } else {
        throw new Error("Network offline and no local panel detected.");
      }
    }
  };

  const generateGeneralWanToken = async () => fetchWanToken(GENERAL_USERNAME, GENERAL_PASSWORD);

  const logout = async () => {
    setLanToken(null);
    setWanToken(null);
    setUserCredentials(null);
    setNetworkMode('WAN');
    // Important: We purposefully DO NOT wipe 'savedOfflineUsers' here so that multiple users can log back offline! 
    await AsyncStorage.multiRemove(['lanToken', 'wanToken', 'networkMode', 'activeEmail', 'activePassword']);
  };

  return (
    <AuthContext.Provider value={{ 
      lanToken, wanToken, getActiveLanToken, getActiveWanToken,
      networkMode, isInitializing, login, logout, generateGeneralWanToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
