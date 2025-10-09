import React, { useEffect, useState } from 'react';

export default function CallbackRegistration({
  deviceCallbackUrl,
  callbackUrl,
  token,
  callbackId,
  listenList = ['device'],
  run, // boolean: should trigger registration
  onStatus, // callback for status updates (optional)
}) {
  const [status, setStatus] = useState('');
  const [response, setResponse] = useState(null);

  useEffect(() => {
    console.log('[CallbackRegistration] useEffect fired');
    console.log('[CallbackRegistration] Props:', {
      deviceCallbackUrl,
      callbackUrl,
      token,
      callbackId,
      listenList,
      run,
      onStatus,
    });

    if (!run) {
      console.log('[CallbackRegistration] run prop is false, not registering callback.');
      return;
    }
    if (!token) {
      console.log('[CallbackRegistration] token is missing, not registering callback.');
      return;
    }

    async function registerCallback() {
      setStatus('Registering...');
      console.log('[CallbackRegistration] Attempting registration...');
      console.log('[CallbackRegistration] POST URL:', deviceCallbackUrl);
      console.log('[CallbackRegistration] POST Headers:', {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      });

      const postBody = {
        command: 'configure_callback',
        id: callbackId,
        param: {
          url: callbackUrl,
          listen_list: listenList,
        },
      };

      console.log('[CallbackRegistration] POST Body:', JSON.stringify(postBody, null, 2));

      try {
        const res = await fetch(deviceCallbackUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postBody),
        });

        console.log('[CallbackRegistration] Raw fetch response:', res);

        let data;
        try {
          data = await res.json();
          console.log('[CallbackRegistration] JSON response:', data);
        } catch (jsonError) {
          console.log('[CallbackRegistration] Failed to parse JSON:', jsonError);
          data = await res.text();
          console.log('[CallbackRegistration] Raw text response:', data);
        }

        setResponse(data);

        if (res.ok) {
          setStatus('Success');
          console.log('[CallbackRegistration] Registration success:', data);
          if (onStatus) onStatus('success', data);
        } else {
          setStatus('Error');
          console.log('[CallbackRegistration] Registration failed, status:', res.status);
          if (onStatus) onStatus('error', data);
        }
      } catch (err) {
        setStatus('Error');
        setResponse(err.message);
        console.log('[CallbackRegistration] Network or fetch error:', err);
        if (onStatus) onStatus('error', err.message);
      }
    }

    registerCallback();

  }, [run, deviceCallbackUrl, callbackUrl, token, callbackId, listenList, onStatus]);

  return null;
}