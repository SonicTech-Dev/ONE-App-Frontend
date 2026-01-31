package com.oneapp;

import android.view.View;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Simple cache for monitorId -> View (SurfaceView or TextureView)
 */
public class SmartLockVideoCache {
    private static final ConcurrentHashMap<Integer, View> remoteVideoMap = new ConcurrentHashMap<>();

    public static void put(int monitorId, View view) {
        remoteVideoMap.put(monitorId, view);
        android.util.Log.d("SmartLockVideoCache", "put: monitorId=" + monitorId +
                ", view=" + view + ", type=" + (view != null ? view.getClass().getSimpleName() : "null"));
    }

    public static View get(int monitorId) {
        View view = remoteVideoMap.get(monitorId);
        android.util.Log.d("SmartLockVideoCache", "get: monitorId=" + monitorId +
                ", view=" + view + ", type=" + (view != null ? view.getClass().getSimpleName() : "null"));
        return view;
    }

    public static void remove(int monitorId) {
        remoteVideoMap.remove(monitorId);
        android.util.Log.d("SmartLockVideoCache", "remove: monitorId=" + monitorId);
    }
}