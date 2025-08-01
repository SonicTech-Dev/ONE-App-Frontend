import org.bytedeco.javacv.*;
import org.bytedeco.opencv.opencv_core.Mat;
import static org.bytedeco.opencv.global.opencv_imgcodecs.*;

public class RTSPStreamReader {

    private static final String RTSP_URL = "rtsp://username:password@ip_address:port/stream";

    public void startStream() {
        new Thread(() -> {
            try (FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(RTSP_URL)) {
                grabber.setOption("rtsp_transport", "tcp"); // More reliable over poor networks
                grabber.start();

                OpenCVFrameConverter.ToMat converter = new OpenCVFrameConverter.ToMat();
                Frame frame;

                while ((frame = grabber.grab()) != null) {
                    Mat mat = converter.convert(frame);
                    if (mat != null) {
                        // 👉 Call OCR processing here
                        processFrame(mat);
                    }
                }

                grabber.stop();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }).start();
    }

    private void processFrame(Mat mat) {
        // Save frame for now just to check if it's working
        String filename = "/sdcard/rtsp_frame.jpg";
        imwrite(filename, mat);
        System.out.println("Frame saved to " + filename);

        // TODO: Pass this frame to ML Kit OCR (next step)
    }
}
