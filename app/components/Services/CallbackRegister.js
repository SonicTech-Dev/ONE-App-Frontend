import React, { useEffect } from 'react';

/**
 * CallbackRegister Component
 * - Sends a POST request to register a callback with the external server.
 * - Uses props passed for full customization and manages error/success responses.
 */
export default function CallbackRegistration({
  deviceCallbackUrl, // The external server's callback registration endpoint
  callbackUrl,       // Your app's callback URL
  lanHeaders,        // Full LAN headers (including Authorization)
  callbackId,        // Unique ID for the callback
  listenList,        // List of event types to listen for
  run,               // Boolean flag to trigger registration
  onStatus           // Callback for success or error status
}) {
  useEffect(() => {
    // Trigger the callback registration only if `run` is true
    if (run) {
      const configureCallback = async () => {
        try {
          // Define request payload based on the provided format
          const payload = {
            command: "configure_callback",
            id: callbackId,
            param: {
              url: callbackUrl,
              listen_list: listenList,
            },
          };

          // Send the POST request to register the callback
          const response = await fetch(deviceCallbackUrl, {
            method: 'POST',
            headers: {
              ...lanHeaders, // Use the full lanHeaders directly
              'Content-Type': 'application/json', // Ensure payload format
              Accept: 'application/json',        // Expected response format
            },
            body: JSON.stringify(payload),        // Convert payload to JSON
          });

          const data = await response.json();      // Parse JSON response

          // Handle response based on success/error status
          if (response.ok) {
            onStatus('success', data);            // Notify successful registration
          } else {
            console.error('Callback Registration Failed:', data);
            onStatus('error', data);              // Notify of failure
          }
        } catch (error) {
          // Catch network errors or unexpected issues
          console.error('Callback Registration Error:', error.message);
          onStatus('error', { message: error.message });
        }
      };

      configureCallback(); // Execute the callback registration logic
    }
  }, [deviceCallbackUrl, callbackUrl, lanHeaders, callbackId, listenList, run, onStatus]);

  // Return null since this component does not render any UI
  return null;
}