import React from "react";
import Svg, { Circle, G, Text, Image as SvgImage } from "react-native-svg";

const RecoveryCircle = ({
  score,
  size = 100,
  strokeWidth = 10,
  // Instead of centerText, we now support centerImageSource
  centerImageSource,
  centerImageWidth,
  centerImageHeight,
  // Corner numbers
  topLeftText,
  topRightText,
  bottomLeftText,
  bottomRightText,
  // Optional corner labels (displayed underneath the numbers)
  topLeftLabel,
  topRightLabel,
  bottomLeftLabel,
  bottomRightLabel,
  // Optional text color and font size props (for the corner numbers)
  textColor = "white",
  cornerFontSize =16, // if not provided, will default based on size
  // Optional label font size; if not provided, defaults to 80% of cornerFontSize
  labelFontSize,
  spacing = 8, // New prop to add space between circles
}) => {
  // Define an offset for the text to appear outside the progress circle.
  const textOffset = strokeWidth + 4;
  // Extend the SVG canvas to include extra space for the texts.
  const extendedWidth = size + 20 * textOffset;  // Keep extra space for horizontal padding
  const extendedHeight = size + 3 * textOffset; // Reduce extra vertical padding
    
  // Center of the extended canvas.
  const centerX = extendedWidth / 2;
  const centerY = extendedHeight / 2;
  
  // Original circle radius.
  const radius = size / 2;
  // Adjusted radius for drawing the circle (accounting for strokeWidth).
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  // Normalize score to a percentage. If score is between 0 and 1, multiply by 100.
  const percentage =
    typeof score === "number" && score <= 1 ? score * 100 : score;
  
  // Calculate stroke dash offset based on the percentage.
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

    const strain = topRightText;
     // Ensure strain is a number
  const strainValue = parseFloat(strain) || 0;
  const strainNormalized = Math.min(strainValue, 21) / 21;
  
  // Scale strain circle dynamically
  const strainRadius = normalizedRadius * 1.15+ spacing;
  const strainCircumference = strainRadius * 2 * Math.PI;
  const strainStrokeDashoffset = strainCircumference * (1 - strainNormalized);

  // Determine recovery color based on percentage.
  const getRecoveryColorLocal = (score) => {
    const perc = score <= 1 ? score * 100 : score;
    if (perc >= 67) return "#16EC06"; // High Recovery (green)
    if (perc >= 34) return "#FFDE00"; // Medium Recovery (yellow)
    return "#FF0026"; // Low Recovery (red)
  };

  // Calculate positions relative to the extended canvas.
  const topLeftPos = {
    x: centerX - normalizedRadius - textOffset -40,
    y: centerY - normalizedRadius - textOffset +30,
  };
  const topRightPos = {
    x: centerX + normalizedRadius + textOffset +40,
    y: centerY - normalizedRadius - textOffset +30,
  };
  const bottomLeftPos = {
    x: centerX - normalizedRadius - textOffset -40,
    y: centerY + normalizedRadius + textOffset -30,
  };
  const bottomRightPos = {
    x: centerX + normalizedRadius + textOffset +40,
    y: centerY + normalizedRadius + textOffset -30,
  };

  // Default font sizes based on the overall size.
  const computedCornerFontSize = cornerFontSize || size * 0.12;
  const computedLabelFontSize =
    labelFontSize || computedCornerFontSize * 0.8;

  // Vertical offset to position the label underneath the corner number.
  const labelOffset = computedCornerFontSize * 1.2;

  // Default dimensions for the center image.
  const defaultCenterImageWidth = size * 0.5;
  const defaultCenterImageHeight = size * 0.5;

  return (
<Svg width={extendedWidth} height={extendedHeight}>
    {/* Recovery Circle */}
      <G rotation="-90" origin={`${centerX}, ${centerY}`}>
        {/* Background circle */}
        <Circle
          stroke="rgba(255, 255, 255, 0.1)"
          fill="none"
          cx={centerX}
          cy={centerY}
          r={normalizedRadius}
          strokeWidth={strokeWidth}
        />
        {/* Foreground progress circle */}
        <Circle
          stroke={getRecoveryColorLocal(score)}
          fill="none"
          cx={centerX}
          cy={centerY}
          r={normalizedRadius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        //   strokeLinecap="round"
        />
      </G>

      {/* Strain Circle */}
      <G rotation="-90" origin={`${centerX}, ${centerY}`}>
        {/* Background circle */}
        <Circle
        stroke="rgba(255, 255, 255, 0.1)"
        fill="none"
        cx={centerX}
        cy={centerY}
        r={strainRadius}
        strokeWidth={strokeWidth}
      />
      <Circle
        stroke={'#0093E7'}
        fill="none"
        cx={centerX}
        cy={centerY}
        r={strainRadius}
        strokeWidth={strokeWidth}
        strokeDasharray={strainCircumference}
        strokeDashoffset={strainStrokeDashoffset}
      />
      </G>

      {/* Center Image */}
      {centerImageSource && (
        <SvgImage
          x={centerX - (centerImageWidth || defaultCenterImageWidth) / 2}
          y={centerY - (centerImageHeight || defaultCenterImageHeight) / 2}
          width={centerImageWidth || defaultCenterImageWidth}
          height={centerImageHeight || defaultCenterImageHeight}
          preserveAspectRatio="xMidYMid slice"
          href={centerImageSource}
        />
      )}

      {/* Top Left Number */}
      {topLeftText && (
        <>
          <Text
            x={topLeftPos.x+6}
            y={topLeftPos.y}
            fill={getRecoveryColorLocal(score)}
            fontSize={computedCornerFontSize}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontWeight={700}
          >
            {topLeftText}
          </Text>
          {topLeftLabel && (
            <Text
              x={topLeftPos.x-10}
              y={topLeftPos.y + labelOffset-8}
              fill={getRecoveryColorLocal(score)}
              fontSize={computedLabelFontSize}
              textAnchor="middle"
              alignmentBaseline="hanging"
              fontWeight={700}
            >
              {topLeftLabel}
            </Text>
          )}
        </>
      )}

      {/* Top Right Number */}
      {topRightText && (
        <>
          <Text
            x={topRightPos.x-6}
            y={topRightPos.y}
            fill={'#0093E7'}
            fontSize={computedCornerFontSize}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontWeight={700}
          >
            {topRightText}
          </Text>
          {topRightLabel && (
            <Text
              x={topRightPos.x+5}
              y={topRightPos.y + labelOffset-8}
              fill={'#0093E7'}
              fontSize={computedLabelFontSize}
              textAnchor="middle"
              alignmentBaseline="hanging"
              fontWeight={700}
            >
              {topRightLabel}
            </Text>
          )}
        </>
      )}

      {/* Bottom Left Number */}
      {bottomLeftText && (
        <>
          <Text
            x={bottomLeftPos.x+15}
            y={bottomLeftPos.y}
            fill={textColor}
            fontSize={computedCornerFontSize}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontWeight={700}
          >
            {bottomLeftText}
          </Text>
          {bottomLeftLabel && (
            <Text
              x={bottomLeftPos.x+10}
              y={bottomLeftPos.y + labelOffset-8}
              fill={textColor}
              fontSize={computedLabelFontSize}
              textAnchor="middle"
              alignmentBaseline="hanging"
              fontWeight={700}
            >
              {bottomLeftLabel}
            </Text>
          )}
        </>
      )}

      {/* Bottom Right Number */}
      {bottomRightText && (
        <>
          <Text
            x={bottomRightPos.x}
            y={bottomRightPos.y}
            fill={textColor}
            fontSize={computedCornerFontSize}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontWeight={700}
          >
            {bottomRightText}
          </Text>
          {bottomRightLabel && (
            <Text
              x={bottomRightPos.x}
              y={bottomRightPos.y + labelOffset-8}
              fill={textColor}
              fontSize={computedLabelFontSize}
              textAnchor="middle"
              alignmentBaseline="hanging"
              fontWeight={700}
            >
              {bottomRightLabel}
            </Text>
          )}
        </>
      )}
    </Svg>
  );
};

export default RecoveryCircle;
