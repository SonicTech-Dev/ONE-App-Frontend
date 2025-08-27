import React, { useState, useRef } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, Keyboard, TouchableWithoutFeedback } from 'react-native';
import useColors from '../../hooks/useColors';

const MaterialFilledTextField = ({ label, value, onChangeText,maxLength,multiline=false,disabled,backgroundColor='#F5F5F5',required,  }) => {
  const colors = useColors();
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value === '' ? 0 : 1)).current;
  const labelPosition = useRef(new Animated.Value(value === '' ? 18 : 8)).current;
  const [inputPadding, setInputPadding] = useState(26);
  const lineAnim = useRef(new Animated.Value(0)).current;
  const [charCount, setCharCount] = useState((value ? value.length : 0));

  const handleFocus = () => {
    setIsFocused(true);
    Animated.parallel([
        Animated.timing(animatedIsFocused, {
          toValue: 1,
          duration: 350,
          useNativeDriver: false,
        }),
        Animated.timing(labelPosition, {
          toValue: 8,
          duration: 350,
          useNativeDriver: false,
        }),
        Animated.timing(lineAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
          })
    ]).start();
    setInputPadding(26);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value === ''&&!required) {
      Animated.parallel([
        Animated.timing(animatedIsFocused, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(labelPosition, {
          toValue: 18,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(lineAnim, {
            toValue: 0,
            duration: 350,
            useNativeDriver: false,
          })
      ]).start();
      setInputPadding(26);
    }else{
        Animated.timing(lineAnim, {
            toValue: 1,
            duration: 350,
            useNativeDriver: false,
          }).start();
          setInputPadding(26);
    }
  };

  const handleTapOutside = () => {
    setIsFocused(false);
    Keyboard.dismiss();
  };

  const labelStyle = {
    position: 'absolute',
    left: 12,
    top: labelPosition,
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: isFocused||value ? colors.primary : '#aaa',
  };

  const lineStyle = {
    borderBottomWidth: 2,
    borderBottomColor: value===''&&!isFocused&&required?colors.danger:colors.primary,
    width: lineAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
    position: 'absolute',
    bottom: 0,
    left: 0,
  };

  const handleTextChange = (text) => {
    const remainingChars = text.length;
    setCharCount(remainingChars);
    onChangeText(text);
  };

  return (
    <TouchableWithoutFeedback onPress={handleTapOutside}>
        <View style={{marginBottom:10}}>
      <View style={[styles.wrapper,{backgroundColor:backgroundColor, borderRadius:5}]}>
      <View style={[styles.container,
        // {backgroundColor: disabled?'#F5F5F5':'#fff',}
        ]}>
      <Animated.Text style={labelStyle}>{label}{required?'*':null}</Animated.Text>
        <TextInput
          style={[styles.input, { paddingTop: inputPadding }]}
          value={value}
          onChangeText={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          maxLength={maxLength}
          multiline={multiline}
          editable={!disabled}
          selectTextOnFocus={!disabled}
        />
        </View>
        <Animated.View style={lineStyle} />
      </View>
      {maxLength?
      <View style={styles.charCountContainer}>
        <Text style={styles.charCount}>{charCount}/{maxLength}</Text>
      </View>:null}
      </View>
</TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
    // backgroundColor: '#F5F5F5',
    // borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    height:60,
    // paddingBottom:18
  },
  container: {
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    height:60,
  },
  input: {
    paddingTop: 26,
    // paddingBottom:18,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#212121',
  },
  label: {
    position: 'absolute',
    left: 12,
    // fontSize: 16,
    color: '#757575',
  },
  charCountContainer: {
    alignSelf: 'flex-end',
    // marginTop: 2,
    marginRight: 0,
  },
  charCount: {
    fontSize: 12,
    color: '#757575',
  },
});

export default MaterialFilledTextField;
