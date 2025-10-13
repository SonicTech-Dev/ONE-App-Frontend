import React, { useEffect, useState } from 'react';
import { BridgeServer } from 'react-native-http-bridge-refurbished';
import { Text } from 'react-native';

export default function CallbackServer({ port = 8080, onRequest }) {
  const [lastCalled, setLastCalled] = useState();
  const [lastPayload, setLastPayload] = useState(null);

  useEffect(() => {
    const server = new BridgeServer('lan_http_service', true);

    // Helper to parse the payload from incoming requests
    const parsePayload = (req) => {
      if (req.body) return req.body;
      if (req.data) return req.data;
      if (req.rawBody) {
        try {
          return JSON.parse(req.rawBody);
        } catch (e) {
          return req.rawBody;
        }
      }
      if (req.postData) {
        try {
          return JSON.parse(req.postData);
        } catch (e) {
          return req.postData;
        }
      }
      return undefined;
    };

    server.post('/', async (req, res) => {
      setLastCalled(Date.now());
      const payload = parsePayload(req);
      setLastPayload(payload);
      // Log only the JSON payload, fully expanded
      console.log(
        'LANServer: Received POST body:',
        JSON.stringify(payload, null, 2)
      );
      if (onRequest) onRequest(req, payload);
      return { message: 'Received JSON data' };
    });

    server.get('/', async (req, res) => {
      setLastCalled(Date.now());
      console.log('LANServer: Received GET query:', JSON.stringify(req.query, null, 2));
      if (onRequest) onRequest(req, req.query);
      return { message: 'LAN server is running' };
    });

    server.listen(port);

    return () => {
      server.stop();
      console.log('LANServer: Stopped');
    };
  }, [port, onRequest]);

}