package com.oneapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashMap;
import java.util.Map;

public class RTSPModule extends ReactContextBaseJavaModule {

    // Manage multiple RTSP stream readers by ID
    private final Map<String, RTSPStreamReader> streamReaders = new HashMap<>();

    public RTSPModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "RTSPModule";
    }

    // Start a stream for a given streamId and RTSP URL
    @ReactMethod
    public void startStream(String streamId, String rtspUrl) {
        if (!streamReaders.containsKey(streamId)) {
            RTSPStreamReader reader = new RTSPStreamReader(getReactApplicationContext(), streamId, rtspUrl);
            streamReaders.put(streamId, reader);
            reader.startStream();
        }
    }

    // Stop a stream by streamId
    @ReactMethod
    public void stopStream(String streamId) {
        if (streamReaders.containsKey(streamId)) {
            streamReaders.get(streamId).stopStream();
            streamReaders.remove(streamId);
        }
    }

    // Stop all streams
    @ReactMethod
    public void stopAllStreams() {
        for (RTSPStreamReader reader : streamReaders.values()) {
            reader.stopStream();
        }
        streamReaders.clear();
    }
}