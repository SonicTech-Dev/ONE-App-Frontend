package com.oneapp;

import android.view.View;
import android.view.SurfaceView;
import android.view.TextureView;
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
        layout.setBackgroundColor(0xFF222222); // Dark background
        return layout;
    }

    @ReactProp(name = "monitorId")
    public void setMonitorId(FrameLayout view, int monitorId) {
        view.removeAllViews();
        Log.d(REACT_CLASS, "setMonitorId called with monitorId: " + monitorId);

        if (monitorId > 0) {
            try {
                View remoteView = SmartLockVideoCache.get(monitorId); // Must return a View (SurfaceView or TextureView)
                Log.d(REACT_CLASS, "Fetched remote video View for monitorId: " + monitorId + " = " + remoteView);

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
                        remoteView.post(() -> {
                            Log.d(REACT_CLASS, "Remote View attached. Type=" +
                                remoteView.getClass().getSimpleName() + ", size=" +
                                remoteView.getWidth() + "x" + remoteView.getHeight());
                        });
                    });
                } else {
                    Log.e(REACT_CLASS, "Remote video view is null for monitorId: " + monitorId);
                }
            } catch (Exception e) {
                Log.e(REACT_CLASS, "Error attaching remote video view: " + e.getMessage(), e);
            }
        } else {
            Log.w(REACT_CLASS, "monitorId is not valid (" + monitorId + "), skipping video attachment.");
        }
    }
}