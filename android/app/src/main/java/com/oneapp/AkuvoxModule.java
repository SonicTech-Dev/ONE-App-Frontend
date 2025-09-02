package com.oneapp;

import android.app.Application;
import android.content.Context;

import androidx.annotation.NonNull;
import android.util.Log;

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
                    // Establish monitoring
                    Log.d("SIP", "RTSP established, monitorId: " + monitorId);
                    return 0;
                }

                @Override
                public int rtspMessageFinishedMonitor() {
                    // Finish monitoring
                    Log.d("SIP", "RTSP finished");
                    return 0;
                }

                @Override
                public int sipMessageFinishedCall(int callId, String reason) {
                    // Finish the call
                    Log.d("SIP", "Call finished: ID=" + callId + ", reason=" + reason);
                    return 0;
                }

                @Override
                public int sipMessageIncomingCall(CallDataBean callData) {
                    // An incoming call
                    Log.d("SIP", "Incoming call: " + callData);
                    return 0;
                }

                @Override
                public int sipMessageEstablishedCall(CallDataBean callData) {
                    // Establish a call
                    Log.d("SIP", "Call established: " + callData);
                    return 0;
                }

                @Override
                public int sipMessageRegStatus(int status) {
                    // The account registration status
                    Log.d("SIP", "Registration status: " + status);
                    return 0;
                }

                    @Override
                public int rtspMessageAudioIntercom(int var1, int var2, MonitorDataWrap var3) {
                    // stub
                    return 0;
                }

                @Override
                public int rtspMessageMonitorLoadSurfaceView(int var1, SurfaceViewsParams var2) {
                    // stub
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

    // Add more methods as needed (answerCall, hangupCall, etc.)
}
