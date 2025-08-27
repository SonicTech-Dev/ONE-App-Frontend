import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Text,
  Dimensions,
  Animated,
} from 'react-native';
import useColors from '../hooks/useColors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { BlurView } from '@react-native-community/blur';
import { Calendar } from 'react-native-calendars';
import MaterialFilledTextField from '../components/MaterialUI/MaterialFilledTextField';
import AppButton from '../components/AppButton';
import moment from "moment";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function CreatePassModal({ modalVisible, setModalVisible }) {
  const colors = useColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(1)).current;
  const [innerModalHeight, setInnerModalHeight] = useState(0);
  const screenHeight = Dimensions.get('window').height;

  // States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    setInnerModalHeight(screenHeight * 0.55); // Set inner modal height to 75% of the screen height
  }, [screenHeight]);

  useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

  const hideModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setModalVisible(false));
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString); // Save the selected date
    setCalendarVisible(false); // Hide the calendar after selecting a date
  };

  const handleCreatePass = () => {
    if (!firstName || !lastName || !selectedDate) {
      alert('Please fill in all fields and select a date.');
      return;
    }

    // Handle pass creation logic
    console.log('Pass Created:', { firstName, lastName, selectedDate });
    alert(`Pass Created for ${firstName} ${lastName} on ${selectedDate}`);
    hideModal();
  };

  return (
    <>
      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={hideModal}
      >
        <BlurView style={[StyleSheet.absoluteFill, styles.blurContainer]} intensity={15}>
          <TouchableOpacity onPress={hideModal} style={StyleSheet.absoluteFill} />
        </BlurView>

        <Animated.View
          style={[
            styles.modalContent,
            {
              height: innerModalHeight,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, innerModalHeight],
                  }),
                },
              ],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={[styles.innerModalContent, { backgroundColor: colors.background }]}>
            {/* Close Button */}
            <TouchableOpacity onPress={hideModal} style={styles.closeButton(colors)}>
              <MaterialIcons name="close" size={32} color={colors.white} />
            </TouchableOpacity>

            <ScrollView
              bounces={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20, marginHorizontal: 20 }}
              scrollEventThrottle={16}
            >
              <View style={{ paddingTop: 20 }}>
                <Text
                  style={[
                    styles.header,
                    {
                      fontSize: SCREEN_WIDTH >= 414 ? 28 : 24,
                      color: colors.primary,
                    },
                  ]}
                >
                  Create New Pass
                </Text>
              </View>

              {/* First Name Field */}
              <MaterialFilledTextField
                label="First Name"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                autoCorrect={false}
                autoCapitalize="none"
                required
              />

              {/* Last Name Field */}
              <MaterialFilledTextField
                label="Last Name"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
                autoCorrect={false}
                autoCapitalize="none"
                required
              />

              {/* Display Selected Date */}

              {/* Show Calendar */}
              {calendarVisible && (
                <Calendar
                  onDayPress={handleDateSelect}
                  markedDates={{
                    [selectedDate]: { selected: true, selectedColor: colors.primary },
                  }}
                  theme={{
                    todayTextColor: colors.secondary,
                    selectedDayBackgroundColor: colors.primary,
                  }}
                  minDate={moment().format('YYYY-MM-DD')}
                />
              )}

              {/* Button to Open Calendar */}
              {!calendarVisible && (
                <TouchableOpacity style={{
                    backgroundColor:'#F5F5F5',
                    padding:10,
                    borderRadius:5,
                    height:60,
                    justifyContent:'center',
                    marginBottom:10
                }} onPress={() => setCalendarVisible(true)}>
                    <Text style={{
                        color:'#aaa',fontSize:16}}>
                        Date*
                    </Text>
                    {selectedDate&&
                    (<Text>
                    {selectedDate}
                    </Text>)}
                </TouchableOpacity>
              )}

              {/* Create Pass Button */}
              {!calendarVisible && (<AppButton
                title="Create Pass"
                color={colors.primary}
                text="background"
                onPress={handleCreatePass}
              />)}
            </ScrollView>
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  blurContainer: {
    justifyContent: 'flex-end',
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  innerModalContent: {
    paddingTop: 20,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: (colors)=>({
    zIndex: 1,
    height: 40,
    width: 40,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 10,
    marginLeft: 10,
  }),
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectedDateContainer: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  selectedDateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  changeDateText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default CreatePassModal;
