import React, { useState, useRef, useEffect,useContext } from 'react';
import { View, TextInput, Text, StyleSheet, Animated, Keyboard, TouchableWithoutFeedback,Platform } from 'react-native';
import useColors from '../../hooks/useColors';
import { Dropdown } from 'react-native-element-dropdown';
import {LanguageContext} from "../../context/LanguageContext";
import Entypo from 'react-native-vector-icons/Entypo'; 

const MaterialOutlinedDropdown = ({ 
    label_title,
    value, 
    isFocus,
    required,
    maxHeight=300,
    placeholder,
    onFocus,
    onBlur,
    onChange,
    data,
    paddingHorizontal=20,
    width='100%',
    reset,
    labelField="label",
    valueField="value"
 }) => {
  const colors = useColors();
    const [hasInteracted, setHasInteracted] = useState(false);

    const renderLabel = (label_title, value, isFocus,required) => {
        if (value || isFocus) {
          return (
            <Text style={[styles.label,{ color: colors.medium,fontFamily:regularFont,top: language === 'ar'?8:12, ...(flipStyles ? 
            { right: 30 } : 
            { left: 30}) }, isFocus && { color: colors.primary }]}>
              {label_title}{required?'*':null}
            </Text>
          );
        }
        return null;
      };

      useEffect(() => {
        // Reset hasInteracted when resetTrigger changes
        setHasInteracted(false);
      }, [reset]);

  const { language, direction, changeLanguage,boldFont, regularFont,isRTL,flipStyles } = useContext(LanguageContext);

  return (
   <>
   <View style={{paddingTop:20,paddingHorizontal:paddingHorizontal}}>

   {/* {renderLabel(label_title, value, isFocus,required)} */}
        <Dropdown
          style={[
            styles.dropdown, 
            isFocus ? { borderColor: colors.primary,borderWidth:2,width:width,backgroundColor:colors.background }
            :hasInteracted&&(value===null||value==="")&&required ?{borderColor: colors.danger,borderWidth:2,width:width,backgroundColor:colors.background }
            :{borderColor: colors.medium,borderWidth:0.75,width:width,backgroundColor:colors.background}
        ]}
          placeholderStyle={[
            styles.placeholderStyle,
            {textAlign: flipStyles ? 'right' : 'left',fontFamily:regularFont,backgroundColor:colors.background}, 
            isFocus ? { color:colors.primary,backgroundColor:colors.background }
            :hasInteracted&&(value===null||value==="")&&required ?{color:colors.danger,backgroundColor:colors.background }
            :{color: colors.medium,backgroundColor:colors.background}
        ]}
        renderRightIcon={()=>
          isFocus ? null :flipStyles||(Platform.OS!=='ios'&&isRTL&&language==='ar') ?null:
        <Entypo name="chevron-down" size={24} color={isFocus ? colors.black
        :hasInteracted&&(value===null||value==="")&&required ?colors.danger
        :colors.medium} />
        }
        // renderLeftIcon={()=>
        //   isFocus ? null :flipStyles||(Platform.OS!=='ios'&&isRTL&&language==='ar') ?
        //   <Entypo name="chevron-down" size={24} color={isFocus ? colors.black
        //     :hasInteracted&&(value===null||value==="")&&required ?colors.danger
        //     :colors.medium} />:null
        //           }
          itemTextStyle={{textAlign: flipStyles ? 'right' : 'left',fontFamily:regularFont,color:colors.primary,backgroundColor:colors.background, margin:-20, padding:20}}
          selectedTextStyle={[styles.selectedTextStyle,{textAlign: flipStyles ? 'right' : 'left',fontFamily:regularFont,color:colors.primary,backgroundColor:colors.background}]}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={[styles.iconStyle,{display:'none'}]}
          data={data}
          maxHeight={maxHeight}
          labelField={labelField}
          valueField={valueField}
          placeholder={!isFocus ? `${required&&Platform.OS === 'ios' && language === 'ar' && !isRTL?'*':''}${placeholder}${required&&(Platform.OS === 'ios' && !isRTL)?'*':''}` : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={()=>{
            setHasInteracted(true);
            onFocus();
        }}
        itemContainerStyle={{backgroundColor:colors.background}}
        containerStyle={{ backgroundColor: colors.background }}
        dropdownStyle={{ backgroundColor: colors.background }}

          onBlur={onBlur}
          onChange={onChange}
        />
  </View> 
  </>
   
  );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 60,
        // borderColor: colors.medium,
        borderWidth: 0.75,
        borderRadius: 4,
        paddingHorizontal: 15,
      },
      icon: {
        marginRight: 5,
      },
      label: {
        position: 'absolute',
        // backgroundColor: 'white',
        // left: 30,
        // top: 12,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
      },
      placeholderStyle: {
        fontSize: 16,
      },
      selectedTextStyle: {
        fontSize: 16,
        paddingHorizontal: 5,
      },
      iconStyle: {
        width: 20,
        height: 20,
      },
      inputSearchStyle: {
        height: 40,
        fontSize: 16,
      },
});

export default MaterialOutlinedDropdown;
