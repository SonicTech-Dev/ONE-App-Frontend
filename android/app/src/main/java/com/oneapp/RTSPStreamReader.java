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
    // --- Add variables for throttling and duplicate filtering ---
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
            int width = mat.cols();
            int height = mat.rows();

            // === ROI: match your overlay exactly; center it for now ===
            double ROI_WIDTH_PERCENT = 0.5;
            double ROI_HEIGHT_PERCENT = 0.5;

            int roiWidth = (int) (width * ROI_WIDTH_PERCENT);
            int roiHeight = (int) (height * ROI_HEIGHT_PERCENT);
            int roiX = (width - roiWidth) / 2;
            int roiY = (height - roiHeight) / 2;

            // Clamp to ensure ROI is inside image bounds
            if (roiWidth <= 0 || roiHeight <= 0 || roiX < 0 || roiY < 0 
                || roiX + roiWidth > width || roiY + roiHeight > height) {
                Log.e("RTSPStreamReader", "Invalid ROI: x=" + roiX + ", y=" + roiY + ", w=" + roiWidth + ", h=" + roiHeight);
                return;
            } else {
                Log.d("RTSPStreamReader", "ROI: x=" + roiX + ", y=" + roiY + ", w=" + roiWidth + ", h=" + roiHeight);
            }

            org.bytedeco.opencv.opencv_core.Rect roiRect =
                new org.bytedeco.opencv.opencv_core.Rect(roiX, roiY, roiWidth, roiHeight);
            Mat roiMat = new Mat(mat, roiRect);

            Bitmap bitmap = matToBitmap(roiMat);
            Log.d("RTSPStreamReader", "Bitmap size: " + bitmap.getWidth() + "x" + bitmap.getHeight());

            InputImage image = InputImage.fromBitmap(bitmap, 0);
            TextRecognizer recognizer = TextRecognition.getClient(new TextRecognizerOptions.Builder().build());

            recognizer.process(image)
                .addOnSuccessListener(text -> {
                    String recognizedText = text.getText();
                    Log.d("RTSPStreamReader", "OCR Text: " + recognizedText);

                    if (recognizedText != null && !recognizedText.trim().isEmpty() && !recognizedText.equals(lastRecognizedText)) {
                        lastRecognizedText = recognizedText;
                        sendToReactNative(recognizedText);
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