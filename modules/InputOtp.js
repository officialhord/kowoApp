import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Keyboard } from "react-native";

export default function InputOtp({
  label,
  name,
  code,
  setCode,
  setOtpReady,
  maximumLength = 5,
  keyboardType = "numeric",
  style = "",
  styleLabel = "",
 }) {
  const boxArray = new Array(maximumLength).fill(0);
  const inputRef = useRef();

  const [isInputBoxFocused, setIsInputBoxFocused] = useState(false);

  const handleOnPress = () => {
    setIsInputBoxFocused(true);
    inputRef.current.focus();
  };

  const handleOnBlur = () => {
    setIsInputBoxFocused(false);
  };

  useEffect(() => {
    // update pin ready status
    setOtpReady(code.length === maximumLength);
    // clean up function
    return () => {
      setOtpReady(false);
    };
  }, [code]);
  const boxDigit = (_, index) => {
    const emptyInput = "";
    const digit = code[index] || emptyInput;

    const isCurrentValue = index === code.length;
    const isLastValue = index === maximumLength - 1;
    const isCodeComplete = code.length === maximumLength;

    const isValueFocused = isCurrentValue || (isLastValue && isCodeComplete);

    return (
      <View style={[styles.SplitBoxes, ((isInputBoxFocused && isValueFocused) && styles.SplitBoxesFocused), ...style]} key={index}>
        <Text style={[styles.SplitBoxText, ...style]}>{digit}</Text>
      </View>
    );
  };

  return (
    <Pressable style={styles.Container} onPress={Keyboard.dismiss}>
      <Text style={[styles.LabelContainer, ...styleLabel]}>{label}</Text>
      <View style={[styles.OTPInputContainer]}>
        <Pressable style={[styles.SplitOTPBoxesContainer]} onPress={handleOnPress}>
          {boxArray.map(boxDigit)}
        </Pressable>
        <TextInput
          style={[styles.TextInputHidden, ...style]}
          value={code}
          onChangeText={(input) => setCode(name, input)}
          maxLength={maximumLength}
          ref={inputRef}
          onBlur={handleOnBlur}
          keyboardType={keyboardType}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingVertical: 10,
  },
  LabelContainer: {
    fontSize: 14,
  },
  ButtonContainer: {
    backgroundColor: '#000000',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    marginTop: 30,
  },
  ButtonText: {
    color: 'black',
    fontSize: 20,
  },
  OTPInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  TextInputHidden: {
    position: 'absolute',
    opacity: 0,
  },
  SplitOTPBoxesContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  SplitBoxText: {
    fontSize: 20,
    color: '#000000',
    paddingHorizontal: 10,
  },
  SplitBoxes: {
    borderColor: '#D9D9D9',
    borderWidth: 2,
    borderRadius: 15,
    padding: 12,
    minWidth: 60,
    minHeight: 60,
  },
  SplitBoxesFocused: {
    backgroundColor: '#D9D9D9',
  }
});