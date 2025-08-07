package com.oneapp;

import android.graphics.Bitmap;
import android.util.Log;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

import org.bytedeco.javacv.*;
import org.bytedeco.opencv.opencv_core.Mat;

public class RTSPStreamReader {

    private static final String RTSP_URL = "rtsp://admin:Sonic123@192.168.1.205:554/";
    private final ReactContext reactContext;
    private long lastOcrTime = 0;
    private static final long OCR_INTERVAL_MS = 700; // process 1.4 frames/sec
    private String lastRecognizedText = "";

    public RTSPStreamReader(ReactContext reactContext) {
        this.reactContext = reactContext;
    }

    public static Bitmap matToBitmap(Mat mat) {
        int width = mat.cols();
        int height = mat.rows();
        Bitmap bmp = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);
        int[] pixels = new int[width * height];
        byte[] data = new byte[width * height * (int)mat.elemSize()];
        mat.data().get(data);
        int channels = mat.channels();
        for (int i = 0; i < width * height; i++) {
            int r = 0, g = 0, b = 0, a = 255;
            b = data[i * channels] & 0xff;
            g = data[i * channels + 1] & 0xff;
            r = data[i * channels + 2] & 0xff;
            pixels[i] = (a << 24) | (r << 16) | (g << 8) | b;
        }
        bmp.setPixels(pixels, 0, width, 0, 0, width, height);
        return bmp;
    }

    public void startStream() {
        new Thread(() -> {
            try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(RTSP_URL)) {
                grabber.setOption("rtsp_transport", "tcp");
                grabber.start();

                OpenCVFrameConverter.ToMat converter = new OpenCVFrameConverter.ToMat();
                Frame frame;

                Log.d("RTSPStreamReader", "Streaming started");

                while ((frame = grabber.grab()) != null) {
                    // --- Throttle OCR requests ---
                    long now = System.currentTimeMillis();
                    if (now - lastOcrTime < OCR_INTERVAL_MS) {
                        continue;  // skip this frame
                    }
                    lastOcrTime = now;

                    Log.d("RTSPStreamReader", "Frame received at: " + now);
                    Mat mat = converter.convert(frame);
                    if (mat != null) {
                        Log.d("RTSPStreamReader", "Mat converted, processing...");
                        processFrame(mat);
                    } else {
                        Log.w("RTSPStreamReader", "Null frame skipped");
                    }
                }
                grabber.stop();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void processFrame(Mat mat) {
        try {
            Bitmap bitmap = matToBitmap(mat); // Use full frame
            Log.d("RTSPStreamReader", "Bitmap size: " + bitmap.getWidth() + "x" + bitmap.getHeight());

            InputImage image = InputImage.fromBitmap(bitmap, 0);
            TextRecognizer recognizer = TextRecognition.getClient(new TextRecognizerOptions.Builder().build());

            recognizer.process(image)
                .addOnSuccessListener(text -> {
                    String recognizedText = text.getText();
                    String digitsOnly = recognizedText.replaceAll("[^0-9]", "");
                    if (!digitsOnly.isEmpty() && !digitsOnly.equals(lastRecognizedText)) {
                        lastRecognizedText = digitsOnly;
                        sendToReactNative(digitsOnly);
                    }
                })
                .addOnFailureListener(e -> {
                    Log.e("RTSPStreamReader", "OCR Error: " + e.getMessage());
                });

        } catch (Exception e) {
            Log.e("RTSPStreamReader", "Error processing frame: " + e.getMessage());
        }
    }

    private void sendToReactNative(String recognizedText) {
        if (reactContext != null) {
            WritableMap params = Arguments.createMap();
            params.putString("text", recognizedText);
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onTextDetected", params); // Consistent event name
        }
    }
}