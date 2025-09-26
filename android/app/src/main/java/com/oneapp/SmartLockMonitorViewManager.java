package com.oneapp;

import android.content.Context;
import android.view.SurfaceView;
import android.widget.FrameLayout;
import android.util.Log;
import android.view.ViewGroup;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class SmartLockMonitorViewManager extends SimpleViewManager<FrameLayout> {
    public static final String REACT_CLASS = "SmartLockMonitorView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected FrameLayout createViewInstance(ThemedReactContext reactContext) {
        FrameLayout layout = new FrameLayout(reactContext);
        layout.setBackgroundColor(0xFFFF0000); // Red background for debug, remove in prod
        return layout;
    }

    @ReactProp(name = "monitorId")
    public void setMonitorId(FrameLayout view, int monitorId) {
        Context context = view.getContext();
        view.removeAllViews();
        Log.d(REACT_CLASS, "setMonitorId called with monitorId: " + monitorId);

        if (monitorId > 0) {
            try {
                SurfaceView remoteView = SmartLockVideoCache.get(monitorId);
                Log.d(REACT_CLASS, "Fetched SurfaceView for monitorId: " + monitorId + " = " + remoteView);
                if (remoteView != null) {
                    ViewGroup parent = (ViewGroup) remoteView.getParent();
                    if (parent != null) {
                        parent.removeView(remoteView);
                    }
                    view.post(() -> {
                        view.addView(remoteView, new FrameLayout.LayoutParams(
                            FrameLayout.LayoutParams.MATCH_PARENT,
                            FrameLayout.LayoutParams.MATCH_PARENT
                        ));
                        // Log size after layout pass
                        remoteView.post(() -> {
                            Log.d(REACT_CLASS, "SurfaceView attached size: " +
                                remoteView.getWidth() + "x" + remoteView.getHeight());
                        });
                        // Add delayed log to check if layout changes after some time
                        remoteView.postDelayed(() -> {
                            Log.d(REACT_CLASS, "SurfaceView size after delay: " +
                                remoteView.getWidth() + "x" + remoteView.getHeight());
                        }, 500);
                        Log.d(REACT_CLASS, "Smart lock remote video view attached for monitorId: " + monitorId);
                    });
                } else {
                    Log.e(REACT_CLASS, "Smart lock remote video view is null for monitorId: " + monitorId);
                }
            } catch (Exception e) {
                Log.e(REACT_CLASS, "Error attaching smart lock remote video view: " + e.getMessage(), e);
            }
        } else {
            Log.w(REACT_CLASS, "monitorId is not valid (" + monitorId + "), skipping video attachment.");
        }
    }
}