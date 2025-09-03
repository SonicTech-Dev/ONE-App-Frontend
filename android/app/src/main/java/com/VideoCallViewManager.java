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
 * VideoCallViewManager for React Native <VideoCallView/>
 * Handles both local and remote video views for calls.
 * Only attaches SurfaceView after call is active and props are set.
 */
public class VideoCallViewManager extends SimpleViewManager<FrameLayout> {
    public static final String REACT_CLASS = "VideoCallView";

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
     * Handles local video view attachment.
     * Called with type="local".
     */
    @ReactProp(name = "type")
    public void setType(FrameLayout view, String type) {
        Context context = view.getContext();
        view.removeAllViews();

        if ("local".equals(type)) {
            try {
                SurfaceView localView = MediaManager.getInstance(context).getLocalVideoView();
                if (localView != null) {
                    // Avoid multiple parents (SurfaceView can only be attached to one ViewGroup)
                    if (localView.getParent() != null) {
                        ((FrameLayout) localView.getParent()).removeView(localView);
                    }
                    view.addView(localView);
                    Log.d(REACT_CLASS, "Local video view attached");
                } else {
                    Log.e(REACT_CLASS, "Local video view is null");
                }
            } catch (Exception e) {
                Log.e(REACT_CLASS, "Error attaching local video view: " + e.getMessage());
            }
        }
        // remote handled in setCallId
    }

    /**
     * Handles remote video view attachment.
     * Only called when type="remote" and callId changes.
     */
    @ReactProp(name = "callId")
    public void setCallId(FrameLayout view, int callId) {
        Context context = view.getContext();

        // Ensure we only attach remote video if type is remote
        Object typeTag = view.getTag();
        String type = (typeTag instanceof String) ? (String) typeTag : null;

        view.removeAllViews();
        try {
            SurfaceView remoteView = MediaManager.getInstance(context).getRemoteVideoView(callId);
            if (remoteView != null) {
                if (remoteView.getParent() != null) {
                    ((FrameLayout) remoteView.getParent()).removeView(remoteView);
                }
                view.addView(remoteView);
                Log.d(REACT_CLASS, "Remote video view attached for callId: " + callId);
            } else {
                Log.e(REACT_CLASS, "Remote video view is null for callId: " + callId);
            }
        } catch (Exception e) {
            Log.e(REACT_CLASS, "Error attaching remote video view: " + e.getMessage());
        }
    }
}