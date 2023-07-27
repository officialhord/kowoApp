import { useState } from 'react';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import Input from './Input';
import DateTime from './DateTime';
import Button from './Button';
import styles, { color } from './Styles';
import Header from './Header';
import BackButton from './BackButton';
import ModalAlert from './ModalAlert';
import { Mail, Warning } from './Icon';
import APIs from './APIs';

export default function Register({ navigation }) {
  const [ data, setData ] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    password: '',
    cpassword: '',
  });
  const [ error, setError ] = useState('');
  const [ processing, setProcessing ] = useState(false);
  const [ mail, setMail ] = useState('');

  
  const onHandleChange = (name, value) => {
    setData({...data, [name]: value});
  };
  
  const onHandleChangeDate = (name, event, selectedDate) => {
    const currentDate = selectedDate.toISOString().split('T')[0];
    setData({...data, [name]: currentDate});
  };
  
  const submit = () => {
    setProcessing(true);
    if (!data.fullName || !data.email || !data.phoneNumber || !data.dateOfBirth || !data.password || !data.cpassword) {
      var errorMessage = () => {
        if (!data.fullName && !data.email && !data.phoneNumber && !data.dateOfBirth && !data.password && !data.cpassword) {
          return 'Please enter all information required to Sign Up'
        };
        if(!data.fullName) { return 'Please enter your Full Name' };
        if(!data.email) { return 'Please enter your Email Address' };
        if(!data.phoneNumber) { return 'Please enter your Phone Number' };
        if(!data.dateOfBirth) { return 'Please enter your Date of Birth' };
        if(!data.password) { return 'Please enter your Password' };
        if(!data.cpassword) { return 'Please enter your Confirm Password' };
      }
      setError(errorMessage);
      return setProcessing(false);
    } else if(!(/\S+@\S+\.\S+/.test(data.email))) {
      var errorMessage = () => {
        return 'Please enter a valid Email Address';
      }
      setError(errorMessage);
      return setProcessing(false);
    } else if(!(data.password === data.cpassword)) {
      var errorMessage = () => {
        return 'The Password Confirmation does not match the Password you entered';
      }
      setError(errorMessage);
      return setProcessing(false);
    } else if( (new Date(data.dateOfBirth) > new Date(new Date().setFullYear(new Date().getFullYear() - 15))) ) {
      var errorMessage = () => {
        return 'Your must be at least 15 years of age to use Kowo';
      }
      setError(errorMessage);
      return setProcessing(false);
    } else {
      //
    }

    const url = APIs.baseURL;
    if(data.fullName && data.email && data.phoneNumber && data.dateOfBirth && data.password && data.cpassword) {
      axios
        .post(`${url}useraccess/register-user`, {
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
  

  return (<>
    <Header
      start={<BackButton fill={color.white} navigation={navigation} />}
      center={<Text style={[styles.text_md, styles.fw_bold, styles.text_color_white]}>Create Account</Text>}
      end={<Text style={styles.text_sm}></Text>}
      styleHeader={[styles.bg_color_secondary, styles.text_color_white, styles.header_rounded]}
      />

    <ScrollView
      //stickyHeaderIndices={[0]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={styles.container}>

      <View style={[styles.form, styles.margin_md.t]}>
        <Input
          label="Full Name"
          name="fullName"
          value={data.fullName}
          handleChange={onHandleChange}
        />

        <Input
          label="Email Address"
          name="email"
          value={data.email}
          handleChange={onHandleChange}
        />

        <Input
          label="Phone Number"
          name="phoneNumber"
          value={data.phoneNumber}
          handleChange={onHandleChange}
        />
        
        <DateTime
          label="Date of Birth"
          name="dateOfBirth"
          value={data.dateOfBirth}
          handleChange={onHandleChangeDate}
          styleField={[styles.margin_md.b]}
        />
        
        <Input
          label="Password"
          name="password"
          value={data.password}
          handleChange={onHandleChange}
          type="password"
          secureTextEntry={true}
          styleField={[styles.margin_md.b]}
        />
        
        <Input
          label="Confirm Password"
          name="cpassword"
          value={data.cpassword}
          handleChange={onHandleChange}
          type="password"
          secureTextEntry={true}
          styleField={[styles.margin_md.b]}
        />
        
        <Text style={[styles.center, styles.margin_lg.y, styles.fw_bold]}>
          <Text style={[styles.text_xs, styles.center, styles.margin_md.y, styles.margin_sm.e, styles.fw_bold]}>
          By creating an account, you accept our 
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => WebBrowser.openBrowserAsync(url)}>
            <Text style={[styles.text_xs, styles.text_color_primary, styles.fw_bold]}>Terms & Conditions and Policy Privacy </Text>
          </TouchableOpacity>
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
              Sign Up
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

        
        <View style={[styles.bars, styles.center, styles.padding_xl.b]}>
          <Text style={[styles.text_xs, styles.center, styles.margin_xs.y, styles.margin_sm.e]}>
            Already have an account? 
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.text_xs, styles.text_color_primary]}>Log In</Text>
          </TouchableOpacity>
        </View>
        
      </View>
      
    </ScrollView>
  </>);
}
