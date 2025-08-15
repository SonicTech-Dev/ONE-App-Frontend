package com.oneapp;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.ColorMatrix;
import android.graphics.ColorMatrixColorFilter;
import android.graphics.Paint;
import android.util.Log;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import org.bytedeco.javacv.*;
import org.bytedeco.opencv.opencv_core.Mat;

// ML Kit imports
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.Text;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

public class RTSPStreamReader {
    private final String streamId;
    private final String rtspUrl;
    private final ReactContext reactContext;
    private long lastOcrTime = 0;
    private static final long OCR_INTERVAL_MS = 400; // Faster throttle
    private String lastRecognizedText = "";
    private boolean running = false;

    // ROI size ratio (as a fraction of the video dimensions)
    private static final float ROI_SIZE_RATIO = 0.5f; // 50% of the smaller dimension

    public RTSPStreamReader(ReactContext reactContext, String streamId, String rtspUrl) {
        this.reactContext = reactContext;
        this.streamId = streamId;
        this.rtspUrl = rtspUrl;
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
            if (channels >= 3) {
                b = data[i * channels] & 0xff;
                g = data[i * channels + 1] & 0xff;
                r = data[i * channels + 2] & 0xff;
            }
            pixels[i] = (a << 24) | (r << 16) | (g << 8) | b;
        }
        bmp.setPixels(pixels, 0, width, 0, 0, width, height);
        return bmp;
    }

    private Bitmap cropCenterSquare(Bitmap bitmap) {
        int width = bitmap.getWidth();
        int height = bitmap.getHeight();
        int roiSize = (int)(Math.min(width, height) * ROI_SIZE_RATIO);
        int roiX = (width - roiSize) / 2;
        int roiY = (height - roiSize) / 2;
        return Bitmap.createBitmap(bitmap, roiX, roiY, roiSize, roiSize);
    }

    // Optional: convert to grayscale for better OCR (can experiment)
    private Bitmap toGrayscale(Bitmap srcImage) {
        Bitmap bmpGrayscale = Bitmap.createBitmap(srcImage.getWidth(), srcImage.getHeight(), Bitmap.Config.ARGB_8888);
        Canvas c = new Canvas(bmpGrayscale);
        Paint paint = new Paint();
        ColorMatrix cm = new ColorMatrix();
        cm.setSaturation(0);
        ColorMatrixColorFilter f = new ColorMatrixColorFilter(cm);
        paint.setColorFilter(f);
        c.drawBitmap(srcImage, 0, 0, paint);
        return bmpGrayscale;
    }

    // Optional: downscale for speed
    private Bitmap downscale(Bitmap src, int maxWidth) {
        if (src.getWidth() > maxWidth) {
            int scaledHeight = (int) (src.getHeight() * ((float)maxWidth / src.getWidth()));
            return Bitmap.createScaledBitmap(src, maxWidth, scaledHeight, true);
        }
        return src;
    }

    private void saveDebugBitmap(Context context, Bitmap bmp) {
        try {
            File file = new File(context.getFilesDir(), "roi_debug_" + System.currentTimeMillis() + ".png");
            FileOutputStream out = new FileOutputStream(file);
            bmp.compress(Bitmap.CompressFormat.PNG, 100, out);
            out.flush();
            out.close();
            Log.d("OCR", "ROI debug image saved: " + file.getAbsolutePath());
        } catch (IOException e) {
            Log.e("OCR", "Failed to save ROI debug image", e);
        }
    }

    public void startStream() {
        running = true;
        new Thread(() -> {
            try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(rtspUrl)) {
                grabber.setOption("rtsp_transport", "tcp");
                grabber.setOption("fflags", "nobuffer");
                grabber.setOption("flags", "low_delay");
                grabber.setOption("max_delay", "500000");
                grabber.start();

                OpenCVFrameConverter.ToMat converter = new OpenCVFrameConverter.ToMat();
                Frame frame;

                Log.d("RTSPStreamReader", "Streaming started: " + streamId);

                while (running && (frame = grabber.grab()) != null) {
                    long now = System.currentTimeMillis();
                    if (now - lastOcrTime < OCR_INTERVAL_MS) {
                        continue;
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

    public void stopStream() {
        running = false;
    }

    private void processFrame(Mat mat) {
        try {
            Bitmap bitmap = matToBitmap(mat);
            // Step 1: Crop to center square ROI
            Bitmap roiBitmap = cropCenterSquare(bitmap);
            // Step 2: Optional - save for debug
            saveDebugBitmap(reactContext, roiBitmap);
            // Step 3: Optional - grayscale
            Bitmap processedBitmap = toGrayscale(roiBitmap);
            // Step 4: Optional - downscale for speed (e.g., max 320 px width)
            processedBitmap = downscale(processedBitmap, 320);

            // Step 5: Run ML Kit OCR (on-device)
            InputImage image = InputImage.fromBitmap(processedBitmap, 0);
            TextRecognizer recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
            recognizer.process(image)
                .addOnSuccessListener(visionText -> {
                    String recognizedText = visionText.getText();
                    String digitsOnly = recognizedText.replaceAll("[^0-9.]", "");
                    if (!digitsOnly.isEmpty() && !digitsOnly.equals(lastRecognizedText)) {
                        lastRecognizedText = digitsOnly;
                        sendToReactNative(digitsOnly);
                    }
                })
                .addOnFailureListener(
                    e -> Log.e("RTSPStreamReader", "ML Kit OCR failed: " + e.getMessage())
                );
        } catch (Exception e) {
            Log.e("RTSPStreamReader", "Error processing frame: " + e.getMessage());
        }
    }

    private void sendToReactNative(String recognizedText) {
        if (reactContext != null) {
            WritableMap params = Arguments.createMap();
            params.putString("text", recognizedText);
            params.putString("streamId", streamId);
            reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("onTextDetected", params);
        }
    }
}