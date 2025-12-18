import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StatusText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.isOnline ? 'green' : 'red')};
  margin-left: 16px;
`;

/**
 * OnlineStatus
 *
 * Key change: for LAN we use the provided lanAuthToken prop (if present) and DO NOT fetch any WAN token.
 * If lanAuthToken is not passed, we optionally fall back to AsyncStorage (lanAuthStorageKey).
 *
 * Props:
 * - selectedOption: 'LAN' | 'WAN'
 * - pollingInterval: ms
 * - wanBackendUrl: backend proxy for WAN (unchanged)
 * - lanUrl: LAN device URL
 * - requestId, deviceId, residenceId
 * - lanAuthToken: token string already available on mount (preferred)
 * - lanAuthStorageKey: optional AsyncStorage key fallback
 */
export default function OnlineStatus({
  selectedOption = 'LAN',
  pollingInterval = 30000,
  wanBackendUrl = 'http://3.227.99.254:8010/online_status/',
  lanUrl = 'http://192.168.1.125/api/v1.0/device',
  requestId = 'c45e846ca23ab42c9ae469d988ae32a96',
  deviceId = 'd4f54a92bea2a440c8a6a23d0b636dcf7',
  residenceId = 'r45844047053e43d78fe5272c5badbd3a',
  lanAuthToken = null,
  lanAuthStorageKey = null,
}) {
  const [isOnline, setIsOnline] = useState(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  // Return token passed via prop or stored in AsyncStorage (if key provided).
  const resolveLanToken = async () => {
    if (lanAuthToken) {
      console.log('[OnlineStatus] Using lanAuthToken prop (no WAN checks).');
      return lanAuthToken;
    }
    if (!lanAuthStorageKey) return null;
    try {
      const raw = await AsyncStorage.getItem(lanAuthStorageKey);
      if (!raw) return null;
      // if stored as JSON { token: "...", expires_at: ... } handle that shape
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.token) return parsed.token;
      } catch (_e) {
        // not JSON, assume raw token string
        return raw;
      }
      return null;
    } catch (e) {
      console.warn('[OnlineStatus] Error reading LAN token from AsyncStorage', e);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchStatus() {
      setLoading(true);

      // Build common bodies
      const lanBody = {
        command: 'get_device_info',
        id: requestId,
        param: { device_id: deviceId },
      };
      const wanBody = {
        command: 'get_device_info',
        id: requestId,
        param: { residence_id: residenceId, device_id: deviceId },
      };

      try {
        if (selectedOption === 'WAN') {
          // Unchanged: call backend proxy for WAN
          console.log('[OnlineStatus] selectedOption: WAN -> calling backend proxy', wanBackendUrl);
          const res = await fetch(wanBackendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(wanBody),
            signal: controller.signal,
          });
          if (!res.ok) {
            console.warn('[OnlineStatus] WAN backend non-2xx', { status: res.status, url: wanBackendUrl });
            if (mounted) setIsOnline(false);
            return;
          }
          const json = await res.json();
          const onlineFlag = json && json.result && typeof json.result.online === 'boolean' ? json.result.online : null;
          if (mounted) setIsOnline(onlineFlag === null ? false : onlineFlag);
          return;
        }

        // LAN path: use provided lanAuthToken (or AsyncStorage fallback) and DO NOT call WAN auth.
        console.log('[OnlineStatus] selectedOption: LAN -> calling LAN URL', lanUrl);
        const token = await resolveLanToken();
        const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
        if (token) {
          // If token already includes 'Bearer ' take as-is, else prefix
          headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
        } else {
          console.log('[OnlineStatus] No LAN token provided; sending request without Authorization header');
        }

        // set a fetch timeout for LAN
        const timeoutMs = 7000;
        const timeoutPromise = new Promise((_, reject) => {
          const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error('timeout'));
          }, timeoutMs);
        });

        const fetchPromise = fetch(lanUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(lanBody),
          signal: controller.signal,
        });

        const res = await Promise.race([fetchPromise, timeoutPromise]);

        if (!res.ok) {
          // Log response body to help debug 401 issues
          let bodyText = '';
          try {
            bodyText = await res.text();
          } catch (_) {}
          console.warn('[OnlineStatus] non-2xx response from LAN URL', {
            status: res.status,
            statusText: res.statusText,
            url: lanUrl,
            body: bodyText,
            usedAuthorization: headers.Authorization || null,
          });
          if (mounted) setIsOnline(false);
          return;
        }

        const json = await res.json();
        const onlineFlag = json && json.result && typeof json.result.online === 'boolean' ? json.result.online : null;
        if (mounted) setIsOnline(onlineFlag === null ? false : onlineFlag);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('[OnlineStatus] fetch aborted');
        } else if (err.message === 'timeout') {
          console.warn('[OnlineStatus] LAN fetch timeout (device unreachable?)', { url: lanUrl });
        } else {
          console.warn('[OnlineStatus] LAN fetch error', err);
        }
        if (mounted) setIsOnline(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    // Initial fetch + polling
    fetchStatus();
    if (pollingInterval > 0) intervalRef.current = setInterval(fetchStatus, pollingInterval);

    return () => {
      mounted = false;
      controller.abort();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    selectedOption,
    pollingInterval,
    wanBackendUrl,
    lanUrl,
    requestId,
    deviceId,
    residenceId,
    lanAuthToken,
    lanAuthStorageKey,
  ]);

  if (loading && isOnline === null) {
    return (
      <View>
        <Text style={{ marginLeft: 16, color: '#777' }}>Checking...</Text>
      </View>
    );
  }

  return (
    <View>
      <StatusText isOnline={!!isOnline}>{isOnline ? 'Online' : 'Offline'}</StatusText>
    </View>
  );
}