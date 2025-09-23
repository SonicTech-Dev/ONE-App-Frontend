package com.oneapp;

import android.view.SurfaceView;
import java.util.HashMap;
import java.util.Map;

/**
 * Simple cache for monitorId -> SurfaceView
 */
public class SmartLockVideoCache {
    private static final Map<Integer, SurfaceView> remoteVideoMap = new HashMap<>();
    public static void put(int monitorId, SurfaceView surfaceView) {
        remoteVideoMap.put(monitorId, surfaceView);
        android.util.Log.d("SmartLockVideoCache", "put: monitorId=" + monitorId + ", surfaceView=" + surfaceView);
    }
    public static SurfaceView get(int monitorId) {
        SurfaceView view = remoteVideoMap.get(monitorId);
        android.util.Log.d("SmartLockVideoCache", "get: monitorId=" + monitorId + ", surfaceView=" + view);
        return view;
    }
    public static void remove(int monitorId) {
        remoteVideoMap.remove(monitorId);
        android.util.Log.d("SmartLockVideoCache", "remove: monitorId=" + monitorId);
    }
}