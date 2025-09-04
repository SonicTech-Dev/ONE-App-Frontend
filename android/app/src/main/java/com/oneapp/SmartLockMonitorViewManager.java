package com.oneapp;

import android.content.Context;
import android.view.SurfaceView;
import android.widget.FrameLayout;
import android.util.Log;

import com.akuvox.mobile.libcommon.model.media.MediaManager;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

/**
 * SmartLockMonitorViewManager for React Native <SmartLockMonitorView/>
 * Attaches remote video SurfaceView for smart lock LAN monitoring sessions.
 */
public class SmartLockMonitorViewManager extends SimpleViewManager<FrameLayout> {
    public static final String REACT_CLASS = "SmartLockMonitorView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected FrameLayout createViewInstance(ThemedReactContext reactContext) {
        FrameLayout frameLayout = new FrameLayout(reactContext);
        return frameLayout;
    }

    /**
     * Attach remote video view for LAN monitor session.
     * Pass monitorId from JS as prop.
     */
    @ReactProp(name = "monitorId")
    public void setMonitorId(FrameLayout view, int monitorId) {
        Context context = view.getContext();
        view.removeAllViews();
        try {
            // Use monitorId to get remote video view for monitoring
            SurfaceView remoteView = MediaManager.getInstance(context).getRemoteVideoView(monitorId);
            if (remoteView != null) {
                if (remoteView.getParent() != null) {
                    ((FrameLayout) remoteView.getParent()).removeView(remoteView);
                }
                view.addView(remoteView);
                Log.d(REACT_CLASS, "Smart lock remote video view attached for monitorId: " + monitorId);
            } else {
                Log.e(REACT_CLASS, "Smart lock remote video view is null for monitorId: " + monitorId);
            }
        } catch (Exception e) {
            Log.e(REACT_CLASS, "Error attaching smart lock remote video view: " + e.getMessage());
        }
    }
}