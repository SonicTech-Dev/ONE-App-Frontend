package com.oneapp;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class RTSPModule extends ReactContextBaseJavaModule {
    private RTSPStreamReader streamReader;

    public RTSPModule(ReactApplicationContext reactContext) {
        super(reactContext);
        streamReader = new RTSPStreamReader(reactContext);
    }

    @Override
    public String getName() {
        return "RTSPModule";
    }

    @ReactMethod
    public void startStream() {
        streamReader.startStream();
    }
}