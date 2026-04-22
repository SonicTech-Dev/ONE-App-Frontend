package com.oneapp;

import android.view.View;
import android.view.SurfaceView;
import android.widget.FrameLayout;
import android.util.Log;
import android.view.ViewGroup;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

public class SmartLockMonitorViewManager extends SimpleViewManager<FrameLayout> {
    public static final String REACT_CLASS = "SmartLockMonitorView";
    private static final int MAX_ATTACH_ATTEMPTS = 6;
    private static final long ATTACH_RETRY_DELAY_MS = 120L;

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected FrameLayout createViewInstance(ThemedReactContext reactContext) {
        FrameLayout layout = new FrameLayout(reactContext);
        layout.setBackgroundColor(0xFF222222); // dark background
        return layout;
    }

    private void attachRemoteView(FrameLayout container, int monitorId, int attempt) {
        container.removeAllViews();

        if (monitorId <= 0) {
            Log.w(REACT_CLASS, "monitorId is not valid (" + monitorId + "), skipping video attachment.");
            return;
        }

        try {
            View remoteView = SmartLockVideoCache.get(monitorId);
            Log.d(REACT_CLASS, "attachRemoteView attempt=" + attempt + " monitorId=" + monitorId + " view=" + remoteView);

            if (remoteView == null) {
                if (attempt < MAX_ATTACH_ATTEMPTS) {
                    container.postDelayed(() -> attachRemoteView(container, monitorId, attempt + 1), ATTACH_RETRY_DELAY_MS);
                } else {
                    Log.e(REACT_CLASS, "Remote video view is still null for monitorId: " + monitorId);
                }
                return;
            }

            ViewGroup parent = (ViewGroup) remoteView.getParent();
            if (parent != null) {
                parent.removeView(remoteView);
            }
            if (remoteView instanceof SurfaceView) {
                SurfaceView surfaceView = (SurfaceView) remoteView;
                surfaceView.setZOrderMediaOverlay(true);
                surfaceView.setZOrderOnTop(false);
                surfaceView.setWillNotDraw(false);
            }
            remoteView.setVisibility(View.VISIBLE);

            container.addView(remoteView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
            ));
            container.requestLayout();
            container.invalidate();
            remoteView.requestLayout();
            remoteView.invalidate();

            container.post(() -> Log.d(REACT_CLASS, "Remote View attached. Type=" +
                remoteView.getClass().getSimpleName() + ", size=" +
                remoteView.getWidth() + "x" + remoteView.getHeight()));

            if ((remoteView.getWidth() == 0 || remoteView.getHeight() == 0) && attempt < MAX_ATTACH_ATTEMPTS) {
                container.postDelayed(() -> attachRemoteView(container, monitorId, attempt + 1), ATTACH_RETRY_DELAY_MS);
            }
        } catch (Exception e) {
            Log.e(REACT_CLASS, "Error attaching remote video view: " + e.getMessage(), e);
        }
    }

    @ReactProp(name = "monitorId")
    public void setMonitorId(FrameLayout view, int monitorId) {
        Log.d(REACT_CLASS, "setMonitorId called with monitorId: " + monitorId);
        attachRemoteView(view, monitorId, 1);
    }
}