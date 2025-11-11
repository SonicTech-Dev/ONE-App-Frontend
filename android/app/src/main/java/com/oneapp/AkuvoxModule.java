package com.oneapp;

import android.app.Application;
import android.util.Log;
import androidx.annotation.NonNull;
import android.view.SurfaceView;

import com.akuvox.mobile.libcommon.model.media.MediaManager;
import com.akuvox.mobile.libcommon.params.SurfaceViewsParams;
import com.akuvox.mobile.libcommon.bean.CallDataBean;
import com.akuvox.mobile.libcommon.bean.MakeCallBean;
import com.akuvox.mobile.libcommon.exp.ISipMessageListener;
import com.akuvox.mobile.libcommon.udp.IRtspMessageListener;
import com.akuvox.mobile.libcommon.udp.IRequestListener;
import com.akuvox.mobile.libcommon.wrapper.struct.MonitorDataWrap;
import com.akuvox.mobile.libcommon.bean.SipTransTypeEnum;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AkuvoxModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private IRtspMessageListener smartLockRtspListener = null;

    public AkuvoxModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        Log.d("AkuvoxModule", "AkuvoxModule loaded");
    }

    @NonNull
    @Override
    public String getName() {
        return "Akuvox";
    }

    // Utility to emit events to JS
    private void emitToJS(String eventName, WritableMap params) {
        Log.d("AkuvoxModule", "Emitting event to JS: " + eventName + " | " + params.toString());
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(eventName, params);
    }

    // ---------------- SIP/VIDEO CALL SDK ---------------- //

    @ReactMethod
    public void initSdk() {
        Log.d("SIP", "AkuvoxModule: initSdk called");
        MediaManager.initAKTalkSDK(
            (Application) reactContext.getApplicationContext(),
            new ISipMessageListener() {
                @Override
                public int rtspMessageErrorMonitor(String error) {
                    Log.e("SIP", "RTSP error: " + error);
                    WritableMap params = Arguments.createMap();
                    params.putString("error", error);
                    emitToJS("onRtspError", params);
                    return 0;
                }
                @Override
                public int rtspMessageEstablishedMonitor(int monitorId, SurfaceViewsParams surfaceViewsParams) {
                    Log.d("AkuvoxModule", "rtspMessageEstablishedMonitor called! monitorId=" + monitorId);

                    SurfaceView remoteView = MediaManager
                        .getInstance(getReactApplicationContext())
                        .getRemoteVideoView(monitorId);

                    Log.d("AkuvoxModule", "getRemoteVideoView for monitorId=" + monitorId + ", remoteView=" + remoteView);

                    if (remoteView != null) {
                        SmartLockVideoCache.put(monitorId, remoteView);
                        Log.d("AkuvoxModule", "Remote video view cached for monitorId=" + monitorId);
                    } else {
                        Log.e("AkuvoxModule", "Failed to get remote video view for monitorId=" + monitorId);
                    }

                    WritableMap params = Arguments.createMap();
                    params.putInt("monitorId", monitorId);
                    params.putString("surfaceViewsParams", 
                        surfaceViewsParams != null ? surfaceViewsParams.toString() : "null");
                    emitToJS("onMonitorEstablished", params);

                    return 0;
                }

                @Override
                public int rtspMessageFinishedMonitor() {
                    Log.d("SIP", "RTSP finished");
                    return 0;
                }

                @Override
                public int sipMessageFinishedCall(int callId, String reason) {
                    Log.d("SIP", "Call finished: ID=" + callId + ", reason=" + reason);
                    MediaManager.getInstance(reactContext).stopLocalVideo(callId);
                    WritableMap params = Arguments.createMap();
                    params.putInt("callId", callId);
                    params.putString("reason", reason);
                    emitToJS("onCallFinished", params);
                    return 0;
                }

                @Override
                public int sipMessageIncomingCall(CallDataBean callData) {
                    Log.d("SIP", "Incoming call: callId=" + callData.callId
                        + ", remoteUserName=" + callData.remoteUserName
                        + ", remoteDisplayName=" + callData.remoteDisplayName
                        + ", callVideoMode=" + callData.callVideoMode);
                    WritableMap params = Arguments.createMap();
                    params.putInt("callId", callData.callId);
                    params.putString("remoteUserName", callData.remoteUserName);
                    params.putString("remoteDisplayName", callData.remoteDisplayName);
                    emitToJS("onIncomingCall", params);
                    return 0;
                }

                @Override
                public int sipMessageEstablishedCall(CallDataBean callData) {
                    int callId = callData.callId;
                    MediaManager.getInstance(reactContext).startLocalVideo(callId);
                    WritableMap params = Arguments.createMap();
                    params.putInt("callId", callId);
                    emitToJS("onCallEstablished", params);
                    Log.d("SIP", "Call established: " + callId);
                    return 0;
                }

                @Override
                public int sipMessageRegStatus(int status) {
                    Log.d("SIP", "Registration status: " + status);
                    return 0;
                }

                @Override
                public int rtspMessageAudioIntercom(int var1, int var2, MonitorDataWrap var3) {
                    return 0;
                }

                @Override
                public int rtspMessageMonitorLoadSurfaceView(int monitorId, SurfaceViewsParams surfaceViewsParams) {
                    Log.d("AkuvoxModule", "rtspMessageMonitorLoadSurfaceView called! monitorId=" + monitorId);
                    WritableMap params = Arguments.createMap();
                    params.putInt("monitorId", monitorId);
                    params.putString("surfaceViewsParams", surfaceViewsParams != null ? surfaceViewsParams.toString() : "null");
                    emitToJS("onMonitorLoadSurfaceView", params);
                    return 0;
                }
            }
        );
        MediaManager.getInstance(reactContext).initMedia(reactContext);
    }

    @ReactMethod
    public void registerSip(String ciphertext, String displayName, Promise promise) {
        try {
            MediaManager.getInstance(reactContext).setSipTransType(SipTransTypeEnum.TRANS_TYPE_TLS);
            int result = MediaManager.getInstance(reactContext).setSipAccount(ciphertext, displayName);
            MediaManager.getInstance(reactContext).setSipBackendOnline(true);

            if (result == 0) {
                promise.resolve("SIP account registered successfully.");
                Log.d("SIP", "App registered with account: " + displayName + " / " + ciphertext);

            } else {
                promise.reject("REGISTER_ERROR", "setSipAccount returned error code: " + result);
            }
        } catch (Exception e) {
            promise.reject("REGISTER_EXCEPTION", e.getMessage());
        }
    }
    /* 
    @ReactMethod
    public void registerSipLan(String ciphertext, String displayName, Promise promise) {
        try {
            MediaManager.getInstance(reactContext).setSipTransType(SipTransTypeEnum.TRANS_TYPE_UDP);
            int result = MediaManager.getInstance(reactContext).setSipAccount(ciphertext, displayName);
            MediaManager.getInstance(reactContext).setSipBackendOnline(true);

            if (result == 0) {
                promise.resolve("SIP account registered successfully.");
                Log.d("SIP", "App registered with account: " + displayName + " / " + ciphertext);

            } else {
                promise.reject("REGISTER_ERROR", "setSipAccount returned error code: " + result);
            }
        } catch (Exception e) {
            promise.reject("REGISTER_EXCEPTION", e.getMessage());
        }
    }
    */
    @ReactMethod
    public void getSipStatus(Promise promise) {
        try {
            int status = MediaManager.getInstance(reactContext).getLineStatus();
            promise.resolve(status);
        } catch (Exception e) {
            promise.reject("STATUS_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void makeCall(String remoteUserName, String remoteDisplayName, int callVideoMode) {
        MakeCallBean makeCallBean = new MakeCallBean();
        makeCallBean.remoteUserName = remoteUserName;
        makeCallBean.remoteDisplayName = remoteDisplayName;
        makeCallBean.callVideoMode = callVideoMode;
        MediaManager.getInstance(reactContext).makeCall(makeCallBean, reactContext);
    }

    @ReactMethod
    public void hangupCall(int callId) {
        MediaManager.getInstance(reactContext).hungupCall(callId);
    }

    @ReactMethod
    public void answerCall(int callId) {
        MediaManager.getInstance(reactContext).answerCall(callId, 1);
    }

    // ---------------- SMART LOCK LAN MONITORING FLOW ---------------- //

    @ReactMethod
    public void setRtspMessageListener(final String deviceId, final String userId) {
        Log.d("SMARTLOCK", "setRtspMessageListener called for deviceId: " + deviceId + ", userId: " + userId);
        smartLockRtspListener = new IRtspMessageListener() {
            @Override
            public void onRtspReady(String rtspUrl) {
                Log.d("SMARTLOCK", "RTSP Ready: " + rtspUrl + ", deviceId: " + deviceId + ", userId: " + userId);
                WritableMap params = Arguments.createMap();
                params.putString("status", "rtspReady");
                params.putString("rtspUrl", rtspUrl);
                emitToJS("onSmartLockRtsp", params);
            }
            @Override
            public void onRtspStop() {
                Log.d("SMARTLOCK", "RTSP Stopped, deviceId: " + deviceId);
                WritableMap params = Arguments.createMap();
                params.putString("status", "rtspStop");
                emitToJS("onSmartLockRtsp", params);
            }
        };
        MediaManager.getInstance(reactContext).setRtspMessageListener(smartLockRtspListener);
    }

    @ReactMethod
    public void clearRtspMessageListener() {
        Log.d("SMARTLOCK", "clearRtspMessageListener called");
        MediaManager.getInstance(reactContext).setRtspMessageListener(null);
        smartLockRtspListener = null;
    }

    // Per SDK: prepareVideoStart immediately after setting listener, only needs deviceId
    @ReactMethod
    public void prepareVideoStart(String deviceId) {
        Log.d("SMARTLOCK", "prepareVideoStart called: " + deviceId);
        int result = MediaManager.getInstance(reactContext).prepareVideoStart(deviceId);
        Log.d("SMARTLOCK", "prepareVideoStart result: " + result);
    }

    // Per SDK: after receiving RTSP URL, start monitor using startMonitorViaLAN
    @ReactMethod
    public void startMonitorViaLAN(String rtspUrl, String deviceId, Promise promise) {
        try {
            Log.d("SMARTLOCK", "startMonitorViaLAN called: rtspUrl=" + rtspUrl + ", deviceId=" + deviceId);
            int monitorId = MediaManager.getInstance(reactContext).startMonitorViaLAN(rtspUrl, deviceId);
            Log.d("SMARTLOCK", "startMonitorViaLAN returned monitorId: " + monitorId);
            WritableMap params = Arguments.createMap();
            params.putInt("monitorId", monitorId);
            params.putString("rtspUrl", rtspUrl);
            promise.resolve(params);
            emitToJS("onMonitorEstablished", params);
        } catch (Exception e) {
            Log.e("SMARTLOCK", "startMonitorViaLAN exception: " + e.getMessage(), e);
            promise.reject("MONITOR_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void stopVideoViaLAN(String deviceId) {
        Log.d("SMARTLOCK", "stopVideoViaLAN called: " + deviceId);
        MediaManager.getInstance(reactContext).stopVideoViaLAN(deviceId);
    }

    @ReactMethod
    public void finishMonitor(int monitorId) {
        Log.d("SMARTLOCK", "finishMonitor called: " + monitorId);
        SmartLockVideoCache.remove(monitorId);
        MediaManager.getInstance(reactContext).finishMonitor(monitorId);
    }

    // WAN monitor (unchanged)
    @ReactMethod
    public void startWanMonitor(String rtspUrl, String ciphertext, Promise promise) {
        try {
            Log.d("WAN_MONITOR", "startWanMonitor called: rtspUrl=" + rtspUrl + ", ciphertext=" + ciphertext);
            int monitorId = MediaManager.getInstance(reactContext).startMonitor(rtspUrl, ciphertext);
            Log.d("WAN_MONITOR", "startMonitor returned monitorId: " + monitorId);
            WritableMap params = Arguments.createMap();
            params.putInt("monitorId", monitorId);
            params.putString("rtspUrl", rtspUrl);
            promise.resolve(params);
            emitToJS("onWanMonitorStarted", params);
        } catch (Exception e) {
            Log.e("WAN_MONITOR", "startWanMonitor exception: " + e.getMessage(), e);
            promise.reject("WAN_MONITOR_ERROR", e.getMessage());
        }
    }

    @ReactMethod
    public void initLockConfig(String residenceId, String userId, String deviceId, String deviceIp) {
        Log.d("SMARTLOCK", "initLockConfig called: " + residenceId + ", " + userId + ", " + deviceId + ", " + deviceIp);
        MediaManager.getInstance(reactContext).initLockConfig(residenceId, userId, deviceId, deviceIp);
    }

    @ReactMethod
    public void unlockViaLAN(String deviceId, final Callback callback) {
        Log.d("SMARTLOCK", "unlockViaLAN called: " + deviceId);
        MediaManager.getInstance(reactContext).unlockViaLAN(deviceId, new IRequestListener<Boolean>() {
            @Override
            public void onResult(Boolean success) {
                Log.d("SMARTLOCK", "Unlock result: " + success);
                callback.invoke(success);
            }
        });
    }
}