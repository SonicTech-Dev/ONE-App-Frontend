package com.oneapp;

import android.app.Application;
import android.util.Log;

import androidx.annotation.NonNull;

import com.akuvox.mobile.libcommon.model.media.MediaManager;
import com.akuvox.mobile.libcommon.params.SurfaceViewsParams;
import com.akuvox.mobile.libcommon.bean.CallDataBean;
import com.akuvox.mobile.libcommon.bean.MakeCallBean;
import com.akuvox.mobile.libcommon.exp.ISipMessageListener;
import com.akuvox.mobile.libcommon.udp.IRtspMessageListener;
import com.akuvox.mobile.libcommon.udp.IRequestListener;
import com.akuvox.mobile.libcommon.wrapper.struct.MonitorDataWrap;
import com.akuvox.mobile.libcommon.bean.SipTransTypeEnum;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Callback;

/**
 * AkuvoxModule: React Native bridge for Akuvox SIP/Video SDK & Smart Lock.
 * Handles SIP registration, call events, smart lock LAN unlock/monitoring, and emits events to JS for UI updates.
 */
public class AkuvoxModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public AkuvoxModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "Akuvox";
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
                    return 0;
                }

                @Override
                public int rtspMessageEstablishedMonitor(int monitorId, SurfaceViewsParams surfaceViewsParams) {
                    Log.d("SIP", "RTSP established, monitorId: " + monitorId);
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
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onCallFinished", params);
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
                    params.putInt("callVideoMode", callData.callVideoMode);
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onIncomingCall", params);
                    return 0;
                }

                @Override
                public int sipMessageEstablishedCall(CallDataBean callData) {
                    int callId = callData.callId;
                    MediaManager.getInstance(reactContext).startLocalVideo(callId);
                    WritableMap params = Arguments.createMap();
                    params.putInt("callId", callId);
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onCallEstablished", params);
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
                public int rtspMessageMonitorLoadSurfaceView(int var1, SurfaceViewsParams var2) {
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
            } else {
                promise.reject("REGISTER_ERROR", "setSipAccount returned error code: " + result);
            }
        } catch (Exception e) {
            promise.reject("REGISTER_EXCEPTION", e.getMessage());
        }
    }

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
        MediaManager.getInstance(reactContext).hungupCall(callId); // Corrected spelling
    }

    @ReactMethod
    public void answerCall(int callId) {
        MediaManager.getInstance(reactContext).answerCall(callId, 1); // 1 for video, 0 for audio
    }

    // ---------------- SMART LOCK SDK EXTENSIONS ---------------- //

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

    // LAN Video Monitoring (RTSP)
    IRtspMessageListener smartLockRtspListener = null;

    @ReactMethod
    public void setRtspMessageListener() {
        Log.d("SMARTLOCK", "setRtspMessageListener called");
        smartLockRtspListener = new IRtspMessageListener() {
            @Override
            public void onRtspReady(String msg) {
                Log.d("SMARTLOCK", "RTSP Ready: " + msg);
                WritableMap params = Arguments.createMap();
                params.putString("status", "rtspReady");
                params.putString("msg", msg);
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onSmartLockRtsp", params);
            }
            @Override
            public void onRtspStop() {
                Log.d("SMARTLOCK", "RTSP Stopped");
                WritableMap params = Arguments.createMap();
                params.putString("status", "rtspStop");
                reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onSmartLockRtsp", params);
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

    @ReactMethod
    public void prepareVideoStart(String deviceId) {
        Log.d("SMARTLOCK", "prepareVideoStart called: " + deviceId);
        MediaManager.getInstance(reactContext).prepareVideoStart(deviceId);
    }

    @ReactMethod
    public void startMonitorViaLAN(String deviceId, String userId) {
        Log.d("SMARTLOCK", "startMonitorViaLAN called: " + deviceId);
        MediaManager.getInstance(reactContext).startMonitorViaLAN(deviceId, userId);
    }

    @ReactMethod
    public void stopVideoViaLAN(String deviceId) {
        Log.d("SMARTLOCK", "stopVideoViaLAN called: " + deviceId);
        MediaManager.getInstance(reactContext).stopVideoViaLAN(deviceId);
    }

    @ReactMethod
    public void finishMonitor(int monitorId) {
        Log.d("SMARTLOCK", "finishMonitor called: " + monitorId);
        MediaManager.getInstance(reactContext).finishMonitor(monitorId);
    }
}