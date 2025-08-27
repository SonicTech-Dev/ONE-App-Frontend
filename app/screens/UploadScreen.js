import React from "react";
import { View, StyleSheet, Modal,Appearance,ActivityIndicator } from "react-native";

function UploadScreen({ onDone, progress = 0, visible = false }) {

  return (
    <Modal 
    visible={visible} 
    transparent 
    >
      <View style={[styles.container]}>
         
          <ActivityIndicator
                    color={'black'}
                    size="large"
                    style={styles.loader}
                />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: "center", 
    justifyContent: "center",
    // height:200,
    // width:200,
  // marginLeft:'25%',
  // marginTop:'70%',
  opacity:0.75 
},
  animation: { width: 50,opacity:1},
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -18 }, { translateY: -18 }],
},
});

export default UploadScreen;
