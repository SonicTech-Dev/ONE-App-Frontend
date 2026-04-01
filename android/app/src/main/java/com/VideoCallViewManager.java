package com.oneapp;

import android.content.Context;
import android.app.Activity;
import android.view.View;
import android.view.ViewGroup;
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
        private static final long ATTACH_RETRY_DELAY_MS = 250L;

        public String type;
        public int callId = -1;
        private final Runnable attachRunnable = this::updateViewInternal;

        public VideoCallFrameLayout(Context context) {
            super(context);
        }

        @Override
        protected void onAttachedToWindow() {
            super.onAttachedToWindow();
            updateView();
        }

        @Override
        protected void onDetachedFromWindow() {
            removeCallbacks(attachRunnable);
            removeAllViews();
            super.onDetachedFromWindow();
        }

        public void updateView() {
            removeCallbacks(attachRunnable);
            post(attachRunnable);
        }

        private void updateViewInternal() {
            if (type == null) return;

            try {
                View videoView = null;
                MediaManager mediaManager = getMediaManager();

                if (mediaManager == null) {
                    Log.w(REACT_CLASS, "MediaManager not available yet, retrying for type=" + type);
                    scheduleRetry();
                    return;
                }

                if ("local".equals(type)) {
                    videoView = mediaManager.getLocalVideoView();
                } else if ("remote".equals(type)) {
                    if (callId == -1) {
                        Log.d(REACT_CLASS, "Waiting for callId before attaching remote video");
                        scheduleRetry();
                        return;
                    }
                    videoView = mediaManager.getRemoteVideoView(callId);
                }

                if (videoView == null) {
                    Log.d(REACT_CLASS, "Video view is null, retrying type=" + type + " callId=" + callId);
                    scheduleRetry();
                    return;
                }

                if (getChildCount() > 0 && getChildAt(0) == videoView) {
                    return;
                }

                attachVideoView(videoView);
            } catch (Exception e) {
                Log.e(REACT_CLASS, "Error attaching video view", e);
                scheduleRetry();
            }
        }

        private void scheduleRetry() {
            if (!isAttachedToWindow()) {
                return;
            }
            removeCallbacks(attachRunnable);
            postDelayed(attachRunnable, ATTACH_RETRY_DELAY_MS);
        }

        private void attachVideoView(View videoView) {
            removeCallbacks(attachRunnable);

            if (videoView.getParent() instanceof ViewGroup) {
                ((ViewGroup) videoView.getParent()).removeView(videoView);
            }

            removeAllViews();
            videoView.setVisibility(View.VISIBLE);
            addView(
                videoView,
                new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT
                )
            );
            requestLayout();
            invalidate();
            Log.d(REACT_CLASS, type + " video view attached for callId: " + callId);
        }

        private MediaManager getMediaManager() {
            try {
                if (getContext() instanceof ThemedReactContext) {
                    Activity currentActivity = ((ThemedReactContext) getContext()).getCurrentActivity();
                    if (currentActivity != null) {
                        return MediaManager.getInstance(currentActivity);
                    }
                }
                Context appContext = getContext() != null ? getContext().getApplicationContext() : null;
                if (appContext != null) {
                    return MediaManager.getInstance(appContext);
                }
                return MediaManager.getInstance(getContext());
            } catch (Exception e) {
                Log.e(REACT_CLASS, "Failed to get MediaManager", e);
                return null;
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
        Log.d(REACT_CLASS, "setType: " + type + " callId=" + view.callId);
        view.updateView();
    }

    @ReactProp(name = "callId")
    public void setCallId(VideoCallFrameLayout view, int callId) {
        view.callId = callId;
        Log.d(REACT_CLASS, "setCallId: " + callId + " type=" + view.type);
        view.updateView();
    }
}