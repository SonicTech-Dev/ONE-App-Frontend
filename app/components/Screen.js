import React from "react";
import { Platform, StatusBar, StyleSheet, SafeAreaView, View } from "react-native";
import useColors from '../hooks/useColors'; // Adjust the path to where you saved useColors.js


function Screen({ children, style,paddingTop=Platform.OS==='ios'?0:StatusBar.currentHeight/2, }) {
  const colors = useColors();
  return (
    <SafeAreaView style={[styles.screen, style,{paddingTop:paddingTop,backgroundColor: colors.background}]}>
      {/* {children} */}
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  view: { flex: 1 },
});

export default Screen;
