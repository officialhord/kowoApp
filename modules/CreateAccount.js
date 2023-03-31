import React, { useEffect, useState, useContext, useCallback } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import Header from './Header';
import BackButton from './BackButton';
import Input from './Input';
import Dropdown from './Dropdown';
import Button from './Button';
import Currency from './Currency';
import styles, { color } from './Styles';
import { delLocalData, getLocalData, setLocalData } from './Storage';
import { AppContext } from './Context';
import APIs from './APIs';
import SVG from './SVG';
import ModalBottom from './ModalBottom';
import ModalAlert from './ModalAlert';
import { Mail, Warning } from './Icon';

export default function CreateAccount({ navigation }) {
  const { appData, readFromStorage, resetTimeout } = useContext(AppContext);

  const [ data, setData ] = useState({
    accountName: '',
    targetAmount: '',
    withrawalDate: '',
    frequency: '',
  });
  const [ error, setError ] = useState('');
  const [ processing, setProcessing ] = useState(false);
  const [ mail, setMail ] = useState('');
  
  const onHandleChange = (name, value) => {
    setData({...data, [name]: value});
  };
  
  const onHandleChangeDropdown = (event, name, value) => {
    setData({...data, [name]: value});
  };
  
  const submit = () => {
    setProcessing(true);
    if (!data.accountName || !data.targetAmount || !data.frequency || !data.withrawalDate) {
      var errorMessage = () => {
        if (!data.accountName && !data.targetAmount && !data.frequency && !data.withrawalDate) {
          return 'Please enter all information required to Create an Account'
        };
        if(!data.accountName) { return 'Please enter Account name' };
        if(!data.targetAmount) { return 'Please enter Amount to be saved' };
        if(!data.frequency) { return 'Please enter Saving Frequency' };
        if(!data.withrawalDate) { return 'Please enter Withdrawal Date' };
      }
      setError(errorMessage);
      return setProcessing(false);
    } else {
      //
    }
    if(data.accountName && data.targetAmount && data.frequency && data.withrawalDate) {
      axios
        .post('https://kintrust-api.herokuapp.com/account-service/fetch-user-accounts', {
          ...data
        }, {
        headers: {
          'Authorization': '',
        }})
      .then(response => {
        if (response.status === 200) {
          //console.log(response.data);
          if (response.data.requestResponse.status == "00") {
            setMail(response.data.requestResponse.statusDescription);
          } else {
            var errorMessage = () => {
              return response.data.requestResponse.statusDescription;
            }
            setError(errorMessage);
          }
        }
        return setProcessing(false);
      })
      .catch(error => {
        //console.error(error);
        setError('Network Error!');
        return setProcessing(false);
      });
    }
  };
  
  
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

  useEffect(() => {
    if(refreshing) {
        APIs.UserAccountsTransactions()
        .then(response => {
            console.log(response.data);
            if (response.status === 200) {
                setLocalData('accounts', response.data);
                readFromStorage();
            }
        })
        .catch(error => {
            //console.error(error);
        });
    }
  }, [refreshing]);


  return (<>
    <Header
      start={<BackButton fill={color.black} navigation={navigation} icon="arrow-left" />}
      center={<Text style={[styles.text_md, styles.fw_bold]}>Create Account</Text>}
      end={<Text style={styles.text_sm}></Text>}
      styleHeader={[styles.bg_color_white, styles.text_color_white, styles.header_rounded]}
      />

    <View
      style={[styles.container]}
      onStartShouldSetResponder={() => resetTimeout()}
      >
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >

        <View style={[styles.form, styles.margin_md.t]}>
          <Text style={[styles.text_sm, styles.fw_bolder, styles.margin_md.b]}>Let’s get started!</Text>
          <Input
            label="Account name"
            name="accountName"
            value={data.accountName}
            handleChange={onHandleChange}
            styleField={[{marginBottom: 0}]}
          />
          <Text style={[styles.text_s, styles.left, styles.margin_md.b]}>
            Give a name to your save plan as you save periodically e.g Tuition fees
          </Text>
  
          <Input
            label="Amount to be saved"
            name="targetAmount"
            value={data.targetAmount}
            currency={true}
            handleChange={onHandleChange}
            keyboardType="numeric"
            styleField={[{marginBottom: 0}]}
          />
          <Text style={[styles.text_s, styles.left, styles.margin_md.b]}>
            Choose amount to saved into your savings plan account (This can be changed at intervals)
          </Text>
  
          <Dropdown
            label="Saving Frequency"
            title="How often do you want to save?"
            name="frequency"
            value={data.frequency}
            options={[
                        {value: 'daily', name: 'Daily'},
                        {value: 'weekly', name: 'Weekly'},
                        {value: 'monthly', name: 'Monthly'},
                        {value: 'once', name: 'Just this once'}
                    ]}
            handleChange={onHandleChangeDropdown}
            styleField={[{marginBottom: 0}]}
          />
          <Text style={[styles.text_s, styles.left, styles.margin_md.b]}>
            Choose how often you want to save. Be it daily, weekly or monthly.
          </Text>
  
          <Dropdown
            label="Withdrawal Date"
            title="How long do you want to save for?"
            name="withrawalDate"
            value={data.withrawalDate}
            options={[
                        {value: 3, name: '3 Months'},
                        {value: 6, name: '6 Months'},
                        {value: 12, name: '1 Year'},
                        {value: 'date', name: 'Let me choose'}
                    ]}
            handleChange={onHandleChangeDropdown}
            styleField={[{marginBottom: 0}]}
          />
          <Text style={[styles.text_s, styles.left, styles.margin_md.b]}>
            Choose how long you want to save for. Be it a short span or long span plan
          </Text>
          
          <Button
            onPress = {() => submit()}
            processing={processing}
            style = {[
                    styles.button_md,
                    styles.text_color_primary,
                    styles.bg_color_secondary,
                    styles.button_stretch,
                    styles.margin_sm.b,
                ]}
            styleText = {[
                styles.text_color_primary,
            ]}
            >
                Proceed
          </Button>
  
          <ModalAlert
            icon={<Warning />}
            title="Error!"
            message={error}
            primary="Okay"
            onPressPrimary={() => setError('')}
            />
  
          <ModalAlert
            icon={<Mail />}
            title="Check your email"
            message={mail}
            primary="Enter code manually"
            onPressPrimary={() => { navigation.navigate('Verify', data); setMail(''); }}
            />
            
        </View>

      </ScrollView>
    </View>
    </>);
}
