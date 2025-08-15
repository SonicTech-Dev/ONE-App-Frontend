import React from "react";
import { View } from "react-native";

/**
 * ROI overlay component: shows a center square ROI.
 * Use the same width/height as your video player.
 * @param {number} videoWidth - Width of the video view
 * @param {number} videoHeight - Height of the video view
 * @param {number} roiRatio - Ratio (0..1), default 0.5 (50% of min dim)
 */
const RoiOverlay = ({
  videoWidth,
  videoHeight,
  roiRatio = 0.5,
  borderColor = "#52e067",
  borderWidth = 3,
  borderRadius = 10,
}) => {
  const roiSize = Math.min(videoWidth, videoHeight) * roiRatio;
  const roiX = (videoWidth - roiSize) / 2;
  const roiY = (videoHeight - roiSize) / 2;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: roiX,
        top: roiY,
        width: roiSize,
        height: roiSize,
        borderWidth: borderWidth,
        borderColor: borderColor,
        borderRadius: borderRadius,
        backgroundColor: "rgba(0,0,0,0.0)",
        zIndex: 999,
      }}
    />
  );
};

export default RoiOverlay;