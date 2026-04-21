import React, { useEffect, useRef } from 'react';
import { BridgeServer } from 'react-native-http-bridge-refurbished';

export default function CallbackServer({ port = 8080, onRequest }) {
  const lastCalledRef = useRef();
  const lastPayloadRef = useRef(null);

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

    const extractHeaders = (req) => {
      if (req?.headers && typeof req.headers === 'object') return req.headers;
      if (req?.header && typeof req.header === 'object') return req.header;
      return {};
    };

    server.post('/', async (req, res) => {
      lastCalledRef.current = Date.now();
      const payload = parsePayload(req);
      lastPayloadRef.current = payload;

      console.log('[CallbackServer] Incoming POST / callback');
      console.log('[CallbackServer] Request headers:', extractHeaders(req));
      console.log('[CallbackServer] Request payload:', payload);

      if (onRequest) onRequest(req, payload);
      console.log('[CallbackServer] Responding with 200 OK payload');
      return { message: 'Received JSON data' };
    });

    server.get('/', async (req, res) => {
      lastCalledRef.current = Date.now();
      console.log('[CallbackServer] Incoming GET / callback health check');
      console.log('[CallbackServer] Request query:', req?.query);
      if (onRequest) onRequest(req, req.query);
      console.log('[CallbackServer] Responding with LAN server health payload');
      return { message: 'LAN server is running' };
    });

    server.listen(port);
    console.log('[CallbackServer] Listening on port:', port);

    return () => {
      server.stop();
      console.log('[CallbackServer] Stopped. Last callback timestamp:', lastCalledRef.current, 'Last payload:', lastPayloadRef.current);
    };
  }, [port, onRequest]);

  return null;
}