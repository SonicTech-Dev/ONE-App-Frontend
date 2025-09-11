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
    }
    public static SurfaceView get(int monitorId) {
        return remoteVideoMap.get(monitorId);
    }
    public static void remove(int monitorId) {
        remoteVideoMap.remove(monitorId);
    }
}