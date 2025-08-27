import React from 'react';
import {View, StyleSheet, TouchableOpacity, Text, Image} from 'react-native';
import useColors from '../../../hooks/useColors';

function AssistantButton({onPress}) {
    const colors = useColors();

    return(
       <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={{width:'15%',}}>
         <Image 
            source={require('../assets/one.png')} 
            style={styles.image}
            resizeMode="contain" 
            />
        </View>
        <View style={{width:'70%',marginLeft:10}}>
            <Text 
        style={{
            // fontFamily:'Arial', 
            fontWeight:700,
            fontSize:14,    
            color: colors.iphonegrey,
            fontStyle:'italic'
            }}>
            Ask One anything ...
        </Text> 
        </View>
       

       </TouchableOpacity>
    );
}

const styles=StyleSheet.create({
  container:{
    paddingHorizontal:20,
    paddingVertical:10,
    marginHorizontal:20,
    marginVertical:10,
    borderWidth:2,
    borderRadius:10,
    backgroundColor: '#f9f9f9',
    borderColor:'#6A0572',
    flexDirection:'row',
    justifyContent:'flex-start',
    alignItems:'center'
},
image: {
    width: '80%',
    height:20
  },
});

export default AssistantButton;