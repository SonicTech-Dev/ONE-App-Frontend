import React, { useEffect, useState, useRef } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { buildLanHeaders } from './SmartScreenSections/auth';

const StatusText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.isOnline ? 'green' : 'red')};
  margin-left: 16px;
`;

/**
 * OnlineStatus
 *
 * Builds new LAN headers for every request using buildLanHeaders(),
 * while WAN keeps using the backend proxy. This ignores lanAuthToken
 * and derives headers fresh per poll.
 */
export default function OnlineStatus({
  selectedOption = 'LAN',
  pollingInterval = 30000,
  wanBackendUrl = 'https://one-development.soniciot.com/online_status/',
  lanUrl = 'http://192.168.2.115/api/v1.0/device',
  requestId = 'c45e846ca23ab42c9ae469d988ae32a96',
  deviceId = 'd4f54a92bea2a440c8a6a23d0b636dcf7',
  residenceId = 'r45844047053e43d78fe5272c5badbd3a',
}) {
  const [isOnline, setIsOnline] = useState(null);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchStatus() {
      setLoading(true);

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

        // LAN path: build fresh headers for every request
        console.log('[OnlineStatus] selectedOption: LAN -> building fresh headers and calling LAN URL', lanUrl);

        let rawHeaders = {};
        try {
          rawHeaders = await buildLanHeaders();
        } catch (e) {
          console.warn('[OnlineStatus] buildLanHeaders failed, marking offline.', e);
          if (mounted) setIsOnline(false);
          return;
        }

        const possibleToken =
          rawHeaders.Authorization ??
          rawHeaders.token ??
          rawHeaders.authToken ??
          null;

        const Authorization =
          rawHeaders.Authorization && rawHeaders.Authorization.startsWith('Bearer ')
            ? rawHeaders.Authorization
            : possibleToken
            ? possibleToken.startsWith('Bearer ')
              ? possibleToken
              : `Bearer ${possibleToken}`
            : undefined;

        const headers = {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...(Authorization ? { Authorization } : {}),
          ...Object.fromEntries(
            Object.entries(rawHeaders).filter(
              ([k]) => !['Authorization', 'token', 'authToken'].includes(k)
            )
          ),
        };

        if (!headers.Authorization) {
          console.warn('[OnlineStatus] No Authorization derived from buildLanHeaders; marking offline.');
          if (mounted) setIsOnline(false);
          return;
        }

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
          console.warn('[OnlineStatus] LAN/WAN fetch error', err);
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