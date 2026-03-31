import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CallbackRegistration({
  deviceCallbackUrl, // e.g. http://192.168.2.115/api/v1.0/callback
  callbackUrl,       // e.g. http://<your-ip>:8080/
  callbackId,
  listenList,
  run,
  onStatus,          // function(status: 'success' | 'error', data?: any)
}) {
  const { getActiveLanToken } = useAuth();
  const [lanHeaders, setLanHeaders] = useState(null);

  // Build LAN headers once
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = await getActiveLanToken();
        const headers = { 'Authorization': `Bearer ${token}` };
        if (mounted) setLanHeaders(headers || null);
        console.log('[CallbackRegistration] Built LAN headers:', headers);
      } catch (err) {
        console.error('[CallbackRegistration] Failed to build LAN headers:', err);
        if (mounted) setLanHeaders(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Register callback when run=true and headers are ready
  useEffect(() => {
    if (!run) return;
    if (!lanHeaders || typeof lanHeaders !== 'object') {
      console.warn('[CallbackRegistration] LAN headers not ready, cannot register callback.');
      onStatus?.('error', { message: 'LAN headers not ready' });
      return;
    }

    const controller = new AbortController();

    const configureCallback = async () => {
      try {
        const payload = {
          command: 'configure_callback',
          id: callbackId,
          param: {
            url: callbackUrl,
            listen_list: listenList,
          },
        };

        // Log the outgoing request
        const reqHeaders = {
          ...lanHeaders,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };
        console.log('[CallbackRegistration] Request URL:', deviceCallbackUrl);
        console.log('[CallbackRegistration] Request Headers:', reqHeaders);
        console.log('[CallbackRegistration] Request Payload:', payload);

        const response = await fetch(deviceCallbackUrl, {
          method: 'POST',
          headers: reqHeaders,
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        // Collect response headers if available
        const respHeaders = {};
        try {
          response.headers?.forEach?.((v, k) => { respHeaders[k] = v; });
        } catch {}

        // Read body as text, then try parse JSON for logging
        const text = await response.text();
        let data = null;
        try { data = text ? JSON.parse(text) : null; } catch {}

        // Log the response
        console.log('[CallbackRegistration] Response Status:', response.status, response.statusText);
        console.log('[CallbackRegistration] Response Headers:', respHeaders);
        console.log('[CallbackRegistration] Response Body:', data ?? text);

        // Pass parsed data (if any) to onStatus
        if (response.ok) {
          onStatus?.('success', data ?? { status: response.status });
        } else {
          onStatus?.('error', data ?? { status: response.status, statusText: response.statusText });
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('[CallbackRegistration] Network/Error:', error);
        onStatus?.('error', { message: error.message || 'Network error' });
      }
    };

    configureCallback();
    return () => controller.abort();
  }, [run, lanHeaders, deviceCallbackUrl, callbackUrl, callbackId, listenList, onStatus]);

  return null;
}