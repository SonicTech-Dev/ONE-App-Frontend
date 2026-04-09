package com.oneapp;

import android.app.Activity;
import android.content.Context;
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
 *
 * Attaches the SDK-managed SurfaceView for local/remote video directly in
 * the @ReactProp setters (synchronous, same approach as the known-working
 * fd84ee8 commit).  If the SDK view is not ready yet (null), we retry every
 * RETRY_DELAY_MS up to MAX_RETRIES times so we handle the camera warm-up
 * period without blocking the UI thread.
 */
public class VideoCallViewManager extends SimpleViewManager<VideoCallViewManager.VideoCallFrameLayout> {
    public static final String REACT_CLASS = "VideoCallView";

    public static class VideoCallFrameLayout extends FrameLayout {
        private static final long RETRY_DELAY_MS = 200L;
        private static final int  MAX_RETRIES    = 40; // 8 s total

        String type   = null;
        int    callId = -1;
        int    retries = 0;

        private final Runnable retryRunnable = this::tryAttachView;

        public VideoCallFrameLayout(Context context) {
            super(context);
        }

        @Override
        protected void onAttachedToWindow() {
            super.onAttachedToWindow();
            tryAttachView();
        }

        @Override
        protected void onDetachedFromWindow() {
            removeCallbacks(retryRunnable);
            removeAllViews();
            super.onDetachedFromWindow();
        }

        /** Called synchronously from @ReactProp setters and on window attach. */
        public void tryAttachView() {
            removeCallbacks(retryRunnable);
            if (type == null) return;

            MediaManager mm = getMediaManager();
            if (mm == null) {
                scheduleRetry("MediaManager null");
                return;
            }

            View videoView = null;
            try {
                if ("local".equals(type)) {
                    videoView = mm.getLocalVideoView();
                } else if ("remote".equals(type)) {
                    if (callId == -1) {
                        scheduleRetry("callId not set yet");
                        return;
                    }
                    videoView = mm.getRemoteVideoView(callId);
                } else {
                    return; // unknown type
                }
            } catch (Exception e) {
                Log.e(REACT_CLASS, "getVideoView error: " + e.getMessage());
                scheduleRetry("exception in getVideoView");
                return;
            }

            if (videoView == null) {
                scheduleRetry(type + " view still null (callId=" + callId + ")");
                return;
            }

            // Already attached – nothing to do.
            if (getChildCount() > 0 && getChildAt(0) == videoView) {
                retries = 0;
                return;
            }

            // Detach from previous parent first (SurfaceView can only live in one parent).
            if (videoView.getParent() instanceof ViewGroup) {
                ((ViewGroup) videoView.getParent()).removeView(videoView);
            }

            removeAllViews();
            videoView.setVisibility(View.VISIBLE);
            addView(videoView, new FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT));
            requestLayout();
            invalidate();
            retries = 0;
            Log.d(REACT_CLASS, type + " video attached  callId=" + callId);
        }

        private void scheduleRetry(String reason) {
            if (!isAttachedToWindow()) return;
            if (retries >= MAX_RETRIES) {
                Log.w(REACT_CLASS, type + " video: giving up after " + MAX_RETRIES + " retries (" + reason + ")");
                return;
            }
            Log.d(REACT_CLASS, type + " retry #" + (retries + 1) + " in " + RETRY_DELAY_MS + "ms — " + reason);
            retries++;
            postDelayed(retryRunnable, RETRY_DELAY_MS);
        }

        private MediaManager getMediaManager() {
            try {
                Activity activity = null;
                if (getContext() instanceof ThemedReactContext) {
                    activity = ((ThemedReactContext) getContext()).getCurrentActivity();
                }
                return MediaManager.getInstance(activity != null ? activity : getContext().getApplicationContext());
            } catch (Exception e) {
                Log.e(REACT_CLASS, "getMediaManager error: " + e.getMessage());
                return null;
            }
        }
    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected VideoCallFrameLayout createViewInstance(ThemedReactContext context) {
        return new VideoCallFrameLayout(context);
    }

    @ReactProp(name = "type")
    public void setType(VideoCallFrameLayout view, String type) {
        view.type = type;
        view.retries = 0;
        Log.d(REACT_CLASS, "setType=" + type + "  callId=" + view.callId);
        view.tryAttachView();
    }

    @ReactProp(name = "callId")
    public void setCallId(VideoCallFrameLayout view, int callId) {
        view.callId = callId;
        view.retries = 0;
        Log.d(REACT_CLASS, "setCallId=" + callId + "  type=" + view.type);
        view.tryAttachView();
    }
}
