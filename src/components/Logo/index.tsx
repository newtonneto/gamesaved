import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { VStack } from 'native-base';

import CircleSvg from '../../assets/imgs/loadingcircle.svg';
import LogoSvg from '../../assets/imgs/savegame.svg';

const Logo = () => {
  const [rotateAnimationCircle] = useState(new Animated.Value(0));
  const [rotateAnimationLogo] = useState(new Animated.Value(0));

  const interpolateRotatingCircle = rotateAnimationCircle.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const animatedStyleCircle = {
    transform: [
      {
        rotate: interpolateRotatingCircle,
      },
    ],
  };

  useEffect(() => {
    const handleAnimationCircle = () => {
      Animated.loop(
        Animated.timing(rotateAnimationCircle, {
          toValue: 360,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start(() => {
        rotateAnimationCircle.setValue(0);
      });
    };

    handleAnimationCircle();
  }, [rotateAnimationCircle, rotateAnimationLogo]);

  return (
    <VStack w={200} h={200} alignItems="center" justifyContent="center">
      <LogoSvg width={150} height={150} style={styles.logoSvg} />
      <Animated.View style={{ ...animatedStyleCircle, ...styles.animatedView }}>
        <CircleSvg width={200} height={200} style={styles.circleSvg} />
      </Animated.View>
    </VStack>
  );
};

const styles = StyleSheet.create({
  animatedView: {
    shadowColor: '#FBA94C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleSvg: { position: 'relative' },
  logoSvg: { position: 'absolute' },
});

export default Logo;
