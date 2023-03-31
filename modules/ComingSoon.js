import React, { useState, useEffect, useContext, useCallback } from 'react';
import { ScrollView, Text, View, RefreshControl } from 'react-native';
import styles from './Styles';
import Button from './Button';
import { delLocalData } from './Storage';
import { AppContext } from './Context';

export default function ComingSoon() {
  const { readFromStorage, resetTimeout } = useContext(AppContext);
  
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  useEffect(() => {
    onRefresh();
  }, []);
  
  return (
    <View
      style={[styles.container]}
      onStartShouldSetResponder={() => resetTimeout()}
      >
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >

          <View style={styles.container}>
            <Text style={[styles.text_lg, styles.center, styles.margin_xl.t]}>Coming Soon</Text>
          </View>

          <Text style={[styles.text_lg, styles.center, styles.margin_xl.t]}>You can Logout</Text>
          
          <Button
          onPress = {() => { delLocalData('status'); readFromStorage(); } }
          style = {[
                  styles.button_md,
                  styles.text_color_white,
                  styles.bg_color_primary,
                  styles.button_stretch,
                  styles.margin_sm.b,
              ]}
          styleText = {[
              styles.text_color_white,
          ]}
          >
              Log out
          </Button>

      </ScrollView>
    </View>
  );
}
