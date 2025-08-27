import React, { useState, useRef,useEffect,useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, Keyboard, TouchableWithoutFeedback,Platform } from 'react-native';
import useColors from '../../hooks/useColors';
import {LanguageContext} from "../../context/LanguageContext";
import I18n from '../../config/i18n';
import { StoreContext } from '../../context/StoreContext';

const MaterialOutlinedTextField = ({ 
    label, 
    value, 
    onChangeText,
    maxLength,
    multiline=false,
    disabled,
    backgroundColor='#F5F5F5',
    required,
    marginTop=10,
    IconComponent,
    ...textInputProps 
}) => {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value === '' ? 0 : 1)).current;
  const labelPosition = useRef(new Animated.Value(0)).current;
  const [inputPadding, setInputPadding] = useState(26);
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [charCount, setCharCount] = useState((value ? value.length : 0));
  const [hasInteracted, setHasInteracted] = useState(false);
  const { language, direction, changeLanguage,boldFont, regularFont,isRTL,flipStyles } = useContext(LanguageContext);
  const {darkMode}=useContext(StoreContext)

  useEffect(() => {
    // Adjust the initial state of label if there's a value
    if (value) {
        Animated.parallel([
            Animated.timing(animatedIsFocused, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
            Animated.timing(labelPosition, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    }
}, [value]);

  const handleFocus = () => {
    setIsFocused(true);
    setHasInteracted(true);
    Animated.parallel([
        Animated.timing(animatedIsFocused, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(labelPosition, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
    ]).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value === '') {
      Animated.parallel([
        Animated.timing(animatedIsFocused, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(labelPosition, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }else{
        Animated.timing(lineAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: false,
          }).start();
    }
  };

  const handleTapOutside = () => {
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const labelStyle = {
    position: 'absolute',
    // left: IconComponent?-5:10, // Adjust this to position the label correctly
    backgroundColor: isFocused?backgroundColor:backgroundColor, // This should match the background color of the `container` view
    color: isFocused?colors.primary:hasInteracted&&value===""&&required?colors.danger:colors.medium,
    paddingHorizontal: 8, // Add some padding on the sides of the label
    fontSize: animatedIsFocused.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 14],
      }),
      top: labelPosition.interpolate({
        inputRange: [0, 1],
        outputRange: [language === 'ar'?(Platform.OS==='ios'?12:15):18, language === 'ar'?(Platform.OS==='ios'?-15:-12):-8], // Adjust the output range to move the label outside the View
      }),
      ...(flipStyles ? 
    { right: IconComponent ? 10 : 10} : 
    { left: IconComponent ? -5 : 10 }),
    fontFamily:regularFont
  };

  const containerStyle = {
    borderWidth: isFocused?2:hasInteracted&&value===""&&required?2:0.75,
    borderColor: isFocused?colors.primary:hasInteracted&&value===""&&required?colors.danger:colors.medium,
    borderRadius: 4,
    height:!multiline?60:undefined,
    marginBottom: 4,
    paddingTop: IconComponent?10:30, // Make room for the label to move outside the View
    paddingHorizontal: 15,
    marginTop:marginTop
    // ,flexDirection:direction
    
  };

  const handleTextChange = (text) => {
    const remainingChars = text.length;
    setCharCount(remainingChars);
    onChangeText(text);
  };

  return (
!IconComponent?  <>
    
    <TouchableWithoutFeedback onPress={handleTapOutside}>   
      <View style={[containerStyle,{backgroundColor:backgroundColor}]}>
      <Animated.Text style={labelStyle}>{label}{required?'*':null}</Animated.Text>
        <TextInput
          style={[styles.input,{
            top:-40,
            textAlign:flipStyles||(Platform.OS!=='ios'&&isRTL&&language==='ar') ?'right':'left',
            fontFamily:regularFont,
            color:darkMode?colors.white:'#212121',
            // backgroundColor:colors.danger,
            ...(multiline && { height: undefined, minHeight: 60, paddingTop: 20, paddingBottom: 10 }),
          }]}
          value={value}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={label===I18n.t("CreateAndUploadScreen.ClientTAXID")?maxLength+2:maxLength}
          multiline={multiline}
          editable={!disabled}
          selectTextOnFocus={!disabled}
          {...textInputProps}
        />
      </View>
     
</TouchableWithoutFeedback> 
{maxLength?
      <View style={[styles.charCountContainer,{alignSelf: language==="ar"?"flex-start":'flex-end',marginRight: flipStyles?0:5,marginLeft:flipStyles?5:0}]}>
        <Text style={styles.charCount}>{label===I18n.t("CreateAndUploadScreen.ClientTAXID")?(value.replaceAll('-','').length):charCount}/{maxLength}</Text>
      </View>:null}
      </>
      :
      
      <>
      <TouchableWithoutFeedback onPress={handleTapOutside}>   
        <View style={[containerStyle,{
            // backgroundColor:colors.danger,
            flexDirection:direction,
            justifyContent:flipStyles?'flex-end':'flex-start',
            alignItems:'center'
            }]}>
            <View style={{flexDirection:'column',width:'95%'}}>
        <Animated.Text style={labelStyle}>{label}{required?'*':null}</Animated.Text>
          <TextInput
            style={[
                styles.input,
                {
                    top:-10,
                    textAlign: flipStyles ? 'right' : 'left',
                    marginRight:flipStyles?0:0,
                    marginLeft:flipStyles?0:0,
                    color:darkMode?colors.white:'#212121'
                    // backgroundColor:colors.black
                }]}
            value={value}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={label===I18n.t("CreateAndUploadScreen.ClientTAXID")?maxLength+2:maxLength}
            multiline={multiline}
            editable={!disabled}
            selectTextOnFocus={!disabled}
            {...textInputProps}
          />
          </View>
          <View style={{
            flexDirection:'column',
            top:-5
            // backgroundColor:'yellow'
            }}>
          {IconComponent}
          </View>
        </View>
       
  </TouchableWithoutFeedback> 
  {maxLength?
        <View style={styles.charCountContainer}>
          <Text style={styles.charCount}>{label===I18n.t("CreateAndUploadScreen.ClientTAXID")?(value.replaceAll('-','').length):charCount}/{maxLength}</Text>
        </View>:null}
        </>
  );
};

const styles = StyleSheet.create({
  input: {
    height:60,
    paddingHorizontal: 5,
    fontSize: 16,
    // color: '#212121',
    marginTop:10
  },
  charCountContainer: {
    // alignSelf: 'flex-end',
    // marginTop: 2,
    marginRight: 5,
  },
  charCount: {
    fontSize: 12,
    color: '#757575',
  },
});

export default MaterialOutlinedTextField;
