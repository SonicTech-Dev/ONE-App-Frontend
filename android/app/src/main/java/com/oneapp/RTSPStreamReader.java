package com.oneapp;

import java.io.File;
import android.content.Context;
import android.os.Environment;
import android.util.Log;

import org.bytedeco.javacv.*;
import org.bytedeco.opencv.opencv_core.Mat;

import static org.bytedeco.opencv.global.opencv_imgcodecs.*;

public class RTSPStreamReader {

    private static final String RTSP_URL = "rtsp://admin:Sonic123@192.168.1.205:554/";
    private final Context context;

    // Constructor to receive context
    public RTSPStreamReader(Context context) {
        this.context = context.getApplicationContext();
    }

    public void startStream() {
        new Thread(() -> {
            try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(RTSP_URL)) {
                grabber.setOption("rtsp_transport", "tcp"); // More reliable over poor networks
                grabber.start();

                OpenCVFrameConverter.ToMat converter = new OpenCVFrameConverter.ToMat();
                Frame frame;

                Log.d("RTSPStreamReader", "Streaming started");

                while ((frame = grabber.grab()) != null) {
                    Log.d("RTSPStreamReader", "Frame received at: " + System.currentTimeMillis());
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
            File dir = new File(context.getExternalFilesDir(null), "RTSPFrames");
            if (!dir.exists()) dir.mkdirs();

            String filename = new File(dir, "rtsp_frame_" + System.currentTimeMillis() + ".jpg").getAbsolutePath();
            imwrite(filename, mat);

            Log.d("RTSPStreamReader", "Frame saved to: " + filename);
            Log.d("RTSPStreamReader", "OCR method called at: " + System.currentTimeMillis());
        } catch (Exception e) {
            Log.e("RTSPStreamReader", "Error saving frame: " + e.getMessage());
        }
    }
}
