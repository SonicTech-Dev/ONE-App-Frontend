package com.oneapp;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridge.ReactApplicationContext;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class AkuvoxPackage implements ReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new AkuvoxModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        // Register the VideoCallViewManager here so it's available to React Native
        return Arrays.<ViewManager>asList(
            new VideoCallViewManager()
        );
    }
}