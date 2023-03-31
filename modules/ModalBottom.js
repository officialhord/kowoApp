import { useRef, useEffect } from 'react';
import { Animated, View, Modal, Dimensions, PanResponder, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import styles, { color } from './Styles';
import SVG from './SVG';

export default function ModalBottom({ children, onDismiss = null, style = "", visible = false }) {
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;

  const resetPositionAnim = Animated.timing(panY, {
    toValue: 0,
    duration: 10,
    useNativeDriver: true,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 10,
    useNativeDriver: true,
  });

  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const handleDismiss = () => closeAnim.start(onDismiss);

  useEffect(() => {
    resetPositionAnim.start();
  }, [resetPositionAnim]);

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: Animated.event([null, {dy: panY}], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gs) => {
        if (gs.dy > 0 && gs.vy > 2) {
          return handleDismiss();
        }
        return resetPositionAnim.start();
      },
    }),
  ).current;


  return (
    <View>
      <Modal
        animated
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={() => handleDismiss()}
        >
          <TouchableWithoutFeedback onPress={() => handleDismiss()}>
            <View style={styles.modalBottomBody}>
              <Animated.View
                style={[styles.modalBottomView, {transform: [{translateY: translateY}]}, ...style]}
                {...panResponders.panHandlers}>
                  <View style={styles.modalBottomSliderIndicatorRow}>
                    <View style={styles.modalBottomSliderIndicator} />
                    <TouchableOpacity onPress={() => handleDismiss()} style={[{marginLeft: 'auto'}]}>
                      <SVG
                        width={25}
                        height={25}
                        fill={color.white}
                        d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"
                        />
                      </TouchableOpacity>
                  </View>
                  {children}
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
