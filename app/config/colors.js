const defaultColors = {
  black: "#000",
  white: "#ffffff",
  medium: "#6e6969",
  light: "#f8f4f4",
  lightDanger: "#ffd0ca",
  danger: "#b8081c",
  dark: "#0c0c0c",
  primary: '#966afd',
  secondary: '#2EC4FF',
  tertiary: '#fff',
  lightGrey:"#f5f5f5",
  grey:"#737373",
  background:'#FFFFFF',
  lightMode:'#e0dddd',
  darkMode:'#222222',
  lightModeText:'#000',
  darkModeText:'#8e8d8d',
  iphonegrey:'#9499a5',
};

export const getColors = (customColors = {}) => ({
  ...defaultColors,
  ...customColors,
});

export default defaultColors;
