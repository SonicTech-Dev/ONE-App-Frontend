import { useEffect, useRef } from 'react';
import { buildLanHeaders } from './SmartScreenSections/auth';

/**
 * DeviceListOnlineStatus
 *
 * Fetches all device statuses in one call (LAN or WAN based on selectedOption),
 * builds a map of { [device_id]: boolean } and returns it via onStatuses.
 * Polls at the provided interval.
 */
export default function DeviceListOnlineStatus({
  selectedOption = 'LAN',
  pollingInterval = 30000,

  // Endpoints (override as needed)
  wanBackendUrl = 'http://3.227.99.254:8010/device_status/',
  lanUrl = 'http://192.168.2.115/api/v1.0/device',

  // Payload values (override as needed)
  requestId = 'c45e846ca23ab42c9ae469d988ae32a96',
  residenceId = 'r45844047053e43d78fe5272c5badbd3a',

  // Callbacks
  onStatuses = () => {},
  onLoadingChange = () => {},
}) {
  const intervalRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchAllStatuses() {
      if (!mounted) return;
      onLoadingChange(true);
      console.log('[DeviceListOnlineStatus] Fetching all statuses via', selectedOption);

      const lanBody = {
        command: 'get_device_list',
        id: requestId,
        param: {},
      };
      const wanBody = {
        command: 'get_device_list',
        id: requestId,
        param: { residence_id: residenceId },
      };

      try {
        if (selectedOption === 'WAN') {
          // WAN path: call backend proxy
          const res = await fetch(wanBackendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(wanBody),
            signal: controller.signal,
          });

          if (!res.ok) {
            console.warn('[DeviceListOnlineStatus] WAN backend non-2xx', {
              status: res.status,
              url: wanBackendUrl,
            });
            if (mounted) onStatuses({});
            return;
          }

          const json = await res.json();
          const map = buildWanStatusMap(json);
          if (mounted) onStatuses(map);
          return;
        }

        // LAN path: build fresh headers for every request
        let rawHeaders = {};
        try {
          rawHeaders = await buildLanHeaders();
        } catch (e) {
          console.warn('[DeviceListOnlineStatus] buildLanHeaders failed; returning empty map.', e);
          if (mounted) onStatuses({});
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
          console.warn('[DeviceListOnlineStatus] No Authorization derived from buildLanHeaders; returning empty map.');
          if (mounted) onStatuses({});
          return;
        }

        // Timeout helper
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
          console.warn('[DeviceListOnlineStatus] LAN non-2xx', {
            status: res.status,
            statusText: res.statusText,
            url: lanUrl,
            body: bodyText,
          });
          if (mounted) onStatuses({});
          return;
        }

        const json = await res.json();
        const map = buildLanStatusMap(json);
        if (mounted) onStatuses(map);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('[DeviceListOnlineStatus] fetch aborted');
        } else if (err.message === 'timeout') {
          console.warn('[DeviceListOnlineStatus] LAN fetch timeout (device unreachable?)', { url: lanUrl });
        } else {
          console.warn('[DeviceListOnlineStatus] fetch error', err);
        }
        if (mounted) onStatuses({});
      } finally {
        if (mounted) onLoadingChange(false);
      }
    }

    // Initial fetch + polling
    fetchAllStatuses();
    if (pollingInterval > 0) {
      intervalRef.current = setInterval(fetchAllStatuses, pollingInterval);
    }

    return () => {
      mounted = false;
      controller.abort();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // IMPORTANT: Do NOT include the callback props in deps, they change per render
  }, [selectedOption, pollingInterval, wanBackendUrl, lanUrl, requestId, residenceId]);

  // This component doesn't render UI; it only fetches and lifts state via callbacks.
  return null;
}

/**
 * Build a status map for WAN payload (device_status_summary.js shape).
 * Expects: { success, result: [ { device_id, online, ... }, ... ] }
 */
function buildWanStatusMap(json) {
  const map = {};
  if (!json || !Array.isArray(json.result)) return map;
  for (const item of json.result) {
    if (!item || !item.device_id) continue;
    map[item.device_id] = !!item.online;
  }
  return map;
}

/**
 * Build a status map for LAN payload (device_status_report.js shape).
 * Expects: { success, result: [ { device_id, online, sub_devices: [ { device_id, online }, ... ] }, ... ] }
 */
function buildLanStatusMap(json) {
  const map = {};
  if (!json || !Array.isArray(json.result)) return map;

  for (const device of json.result) {
    if (!device) continue;
    if (device.device_id) {
      map[device.device_id] = !!device.online;
    }
    if (Array.isArray(device.sub_devices)) {
      for (const sub of device.sub_devices) {
        if (!sub || !sub.device_id) continue;
        map[sub.device_id] = !!sub.online;
      }
    }
  }
  return map;
}