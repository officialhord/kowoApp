import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import PagerView from 'react-native-pager-view';
import styles, { color } from './Styles';
import Button from './Button';

export default function Onboarding({ navigation }) {
  const [ currentPage, setCurrentPage ] = useState(0);
  const pager = React.createRef();
  
  return (
    <View style={[styles.container, {paddingVertical: 40}]}>
      <View style={{flex: 1}}>
        
        <PagerView
          style={[{ flex: 1, height: '80%' }]}
          initialPage={0}
          ref={pager}
          onPageSelected={e => setCurrentPage(e.nativeEvent.position)}
          >

          <View style={styles.page} key="1">
            <Image
              style={styles.illustration}
              source={require('../assets/illustrations/0.png')}
              resizeMode="contain"
            />
            <Text style={[styles.text_lg, styles.fw_bolder]}>Investing, for</Text>
            <Text style={[styles.text_lg, styles.text_color_primary, styles.fw_bolder]}>everyone.</Text>
            <Text style={[styles.text_sm]}>Reach your goals with personalized insights, custom budgets and savings</Text>
          </View>

          <View style={styles.page} key="2">
            <Image
              style={styles.illustration}
              source={require('../assets/illustrations/1.png')}
              resizeMode="contain"
            />
            <Text style={[styles.text_lg, styles.fw_bolder]}>It’s your money,</Text>
            <Text style={[styles.text_lg, styles.text_color_primary, styles.fw_bolder]}>Own it.</Text>
            <Text style={[styles.text_sm]}>Stop living paycheck-to-paycheck, get out of debts and save your money.</Text>
          </View>

          <View style={styles.page} key="3">
            <Image
              style={styles.illustration}
              source={require('../assets/illustrations/2.png')}
              resizeMode="contain"
            />
            <Text style={[styles.text_lg, styles.fw_bolder]}>Welcome to</Text>
            <Image
              style={[styles.logo, {marginTop: '-15%'}]}
              source={require('../assets/illustrations/logo.png')}
              resizeMode="contain"
            />
            <Text style={[styles.text_sm, {marginTop: '-15%'}]}>Be the financial lifeline your kin needs.</Text>

          </View>
        </PagerView>

        <View style={styles.bars}>
          {[0,1,2].map((page, index) =>
          <TouchableOpacity
              key={index}
              style={[styles.bar, (currentPage < page) && styles.bg_color_secondary]}
              onPress = {() => pager.current.setPage(page)}>
          </TouchableOpacity>
          )}
        </View>

        {(currentPage < 2) ? <>
            <Button
              onPress = {() => pager.current.setPage(currentPage + 1)}
              style = {[
                      styles.button_md,
                      styles.text_color_black,
                      styles.bg_color_primary,
                      styles.button_stretch,
                      styles.margin_sm.b,
                  ]}
              styleText = {[
                  styles.text_color_black,
              ]}
              >
                  Next
            </Button>
            
            <Button
              onPress = {() => pager.current.setPage(2)}
              style = {[
                      styles.button_md,
                      styles.text_color_primary,
                      styles.bg_color_secondary,
                      styles.button_stretch,
                  ]}
              styleText = {[
                  styles.text_color_primary,
              ]}
              >
                  Skip
            </Button>
          </> : <>
            <Button
              onPress = {() => navigation.navigate('Login')}
              style = {[
                      styles.button_md,
                      styles.text_color_black,
                      styles.bg_color_primary,
                      styles.button_stretch,
                      styles.margin_sm.b,
                  ]}
              styleText = {[
                  styles.text_color_black,
              ]}
              >
                  Login
            </Button>
            
            <Button
              onPress = {() => navigation.navigate('Register')}
              style = {[
                      styles.button_md,
                      styles.text_color_primary,
                      styles.bg_color_secondary,
                      styles.button_stretch,
                  ]}
              styleText = {[
                  styles.text_color_primary,
              ]}
              >
                  Create Account
            </Button>
          </>}
      </View>
    </View>
  );
}
