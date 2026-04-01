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
public class VideoCallViewManager extends SimpleViewManager<VideoCallViewManager.VideoCallFrameLayout> {
    public static final String REACT_CLASS = "VideoCallView";

    public static class VideoCallFrameLayout extends FrameLayout {
        public String type;
        public int callId = -1;

        public VideoCallFrameLayout(Context context) {
            super(context);
        }

        public void updateView() {
            if (type == null || callId == -1) return;
            removeAllViews();
            try {
                if ("local".equals(type)) {
                    SurfaceView localView = MediaManager.getInstance(getContext()).getLocalVideoView();
                    if (localView != null) {
                        if (localView.getParent() != null) {
                            ((FrameLayout) localView.getParent()).removeView(localView);
                        }
                        addView(localView);
                        Log.d(REACT_CLASS, "Local video view attached");
                    } else {
                        Log.e(REACT_CLASS, "Local video view is null");
                    }
                } else if ("remote".equals(type)) {
                    SurfaceView remoteView = MediaManager.getInstance(getContext()).getRemoteVideoView(callId);
                    if (remoteView != null) {
                        if (remoteView.getParent() != null) {
                            ((FrameLayout) remoteView.getParent()).removeView(remoteView);
                        }
                        addView(remoteView);
                        Log.d(REACT_CLASS, "Remote video view attached for callId: " + callId);
                    } else {
                        Log.e(REACT_CLASS, "Remote video view is null for callId: " + callId);
                    }
                }
            } catch (Exception e) {
                Log.e(REACT_CLASS, "Error attaching video view: " + e.getMessage());
            }
        }
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected VideoCallFrameLayout createViewInstance(ThemedReactContext reactContext) {
        return new VideoCallFrameLayout(reactContext);
    }

    @ReactProp(name = "type")
    public void setType(VideoCallFrameLayout view, String type) {
        view.type = type;
        view.updateView();
    }

    @ReactProp(name = "callId")
    public void setCallId(VideoCallFrameLayout view, int callId) {
        view.callId = callId;
        view.updateView();
    }
}