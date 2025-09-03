package com.oneapp;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;

import com.akuvox.mobile.libcommon.model.media.MediaManager;
import com.akuvox.mobile.libcommon.params.SurfaceViewsParams;
import com.akuvox.mobile.libcommon.bean.CallDataBean;
import com.akuvox.mobile.libcommon.bean.MakeCallBean;
import com.akuvox.mobile.libcommon.exp.ISipMessageListener;
import com.akuvox.mobile.libcommon.wrapper.struct.MonitorDataWrap;
import com.akuvox.mobile.libcommon.bean.SipTransTypeEnum;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * AkuvoxModule: React Native bridge for Akuvox SIP/Video SDK.
 * Handles SIP registration, call events, and emits events to JS for UI updates.
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

    @ReactMethod
    public void initSdk() {
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

                    // Stop local video stream (release camera)
                    MediaManager.getInstance(reactContext).stopLocalVideo(callId);

                    // Emit event to JS for call ended (optional)
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
                    Log.d("SIP", "Incoming call: " + callData);
                    // You should emit an event to JS here so the UI can show incoming call UI!
                    WritableMap params = Arguments.createMap();
                    params.putInt("callId", callData.callId);
                    params.putString("from", callData.remoteUserName); // or remoteDisplayName if available
                    reactContext
                        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                        .emit("onIncomingCall", params);
                    return 0;
                }

                @Override
                public int sipMessageEstablishedCall(CallDataBean callData) {
                    // Use field, NOT method
                    int callId = callData.callId;

                    // Start camera stream for local video
                    MediaManager.getInstance(reactContext).startLocalVideo(callId);

                    // Emit event to JS to show video UI
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
            /*
             * -1: Failed
             *  0: Disabled
             *  1: Registering
             *  2: Registered ✅
             *  3: Registration Failed ❌
             */
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

    // You can implement answerCall, hangupCall, etc. as needed.
    // Example (uncomment and adapt as needed):
    /*
    @ReactMethod
    public void answerCall(int callId) {
        MediaManager.getInstance(reactContext).acceptCall(callId, 1);
    }
    */
}