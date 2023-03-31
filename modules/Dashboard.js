import React, { useEffect, useState, useContext, useCallback } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, RefreshControl } from 'react-native';
import axios from 'axios';
import Button from './Button';
import Currency from './Currency';
import styles, { color } from './Styles';
import { delLocalData, getLocalData, setLocalData } from './Storage';
import { AppContext } from './Context';
import APIs from './APIs';
import SVG from './SVG';
import { PlusCircle } from './Icon';
import ModalBottom from './ModalBottom';

export default function Dashboard({ navigation }) {
  const { appData, readFromStorage, resetTimeout } = useContext(AppContext);
  
  const [ addMoney, setAddMoney ] = useState(false);
  const [ mySavings, setMySavings ] = useState(false);
  
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
        axios
          .post('https://kintrust-api.herokuapp.com/account-service/fetch-user-accounts')
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

            <View style={[styles.row, styles.margin_xl.t]}>
                <Image
                    style={[styles.avatar, styles.start, styles.margin_sm.e]}
                    source={appData?.user?.userProfile ?? null}
                    resizeMode="contain"
                />
                <Text style={[styles.text_lg, styles.start, {marginTop: 3}]}>Hi {appData?.user?.userName?.split(' ')[0]}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ComingSoon')} style={[styles.end, {marginLeft: 'auto'}]}>
                    <SVG
                        width={25}
                        height={30}
                        style={[{marginTop: -35}]}
                        fill={color.primary}
                        d="M25 6.25001C25 8.93056 22.8194 11.1111 20.1389 11.1111C17.4583 11.1111 15.2778 8.93056 15.2778 6.25001C15.2778 3.56945 17.4583 1.3889 20.1389 1.3889C22.8194 1.3889 25 3.56945 25 6.25001ZM22.2222 13.5972C21.5278 13.7778 20.8333 13.8889 20.1389 13.8889C18.1141 13.8852 16.1732 13.0792 14.7414 11.6475C13.3097 10.2157 12.5037 8.27484 12.5 6.25001C12.5 4.20834 13.3056 2.36112 14.5833 0.986118C14.3313 0.677147 14.0135 0.428299 13.6531 0.257707C13.2927 0.0871155 12.8987 -0.000922923 12.5 7.2954e-06C10.9722 7.2954e-06 9.72222 1.25001 9.72222 2.77778V3.18056C5.59722 4.40278 2.77778 8.19445 2.77778 12.5V20.8333L0 23.6111V25H25V23.6111L22.2222 20.8333V13.5972ZM12.5 29.1667C14.0417 29.1667 15.2778 27.9306 15.2778 26.3889H9.72222C9.72222 27.1256 10.0149 27.8321 10.5358 28.3531C11.0567 28.874 11.7633 29.1667 12.5 29.1667Z"
                    />
                </TouchableOpacity>
            </View>


            <View style={[styles.bg_color_secondary, styles.radius_md, styles.padding_md.y]}>
                <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
                    <View style={{flex: 1}}>
                        <View style={[styles.page]}>
                            <Text style={[styles.center, styles.text_md, styles.text_color_white]}>Kowo Wallet</Text>
                            <Text style={[styles.center, styles.text_md, styles.text_color_white]}>{appData?.user?.walletResponse?.virtualAccountNumber ?? '---'}</Text>
                            <View style={[styles.center, {flexDirection: 'row'}]}>
                                <Image
                                    style={[styles.center, {width: 15, height: 15, marginBottom: 12, marginRight: 5}]}
                                    source={require('../assets/illustrations/naira.png')}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.center, styles.text_xl, styles.text_color_white, styles.fw_bolder]}><Currency amount={appData?.user?.walletResponse?.walletBalance ?? 0} /></Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>


            <Button
                onPress = {() => setAddMoney(!addMoney)}
                style = {[
                        styles.button_md,
                        styles.text_color_primary,
                        styles.bg_color_secondary,
                        styles.button_stretch,
                        styles.margin_md.t
                    ]}
                styleText = {[
                        styles.text_xs,
                        styles.text_color_primary,
                        styles.fw_bold,
                        styles.padding_xs.t,
                        styles.padding_xs.s
                    ]}
                icon = {<PlusCircle />}
                >
                ADD MONEY
            </Button>
            <ModalBottom visible={addMoney && !mySavings} onDismiss={() => setAddMoney(!addMoney)}>
                <Text style={[styles.text_sm, styles.text_color_white, styles.fw_bold]}>What do you want to do?</Text>

                <TouchableOpacity onPress={() => setMySavings(!mySavings)}>
                    <View style={[styles.row, styles.margin_sm.y, styles.radius_md, styles.padding_xs.y, styles.padding_md.x, {backgroundColor: '#262626'}]}>
                        <View style={[styles.center, styles.margin_sm.y, styles.margin_md.e, styles.padding_md.xy, styles.bg_color_primary, {borderRadius: 200}]}>
                            <SVG
                                width={22}
                                height={21}
                                fill={color.white}
                                style={[styles.center]}
                                d="M19 0H9C8.20435 0 7.44129 0.316071 6.87868 0.87868C6.31607 1.44129 6 2.20435 6 3V10C6 10.7956 6.31607 11.5587 6.87868 12.1213C7.44129 12.6839 8.20435 13 9 13H19C19.7956 13 20.5587 12.6839 21.1213 12.1213C21.6839 11.5587 22 10.7956 22 10V3C22 2.20435 21.6839 1.44129 21.1213 0.87868C20.5587 0.316071 19.7956 0 19 0ZM20 10C20 10.2652 19.8946 10.5196 19.7071 10.7071C19.5196 10.8946 19.2652 11 19 11H9C8.73478 11 8.48043 10.8946 8.29289 10.7071C8.10536 10.5196 8 10.2652 8 10V3C8 2.73478 8.10536 2.48043 8.29289 2.29289C8.48043 2.10536 8.73478 2 9 2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V10ZM16.5 6C16.1298 6.00125 15.7733 6.14028 15.5 6.39C15.285 6.19455 15.0178 6.06577 14.7309 6.0193C14.4441 5.97284 14.1499 6.01069 13.8842 6.12826C13.6185 6.24582 13.3926 6.43805 13.234 6.68157C13.0755 6.92509 12.9911 7.20942 12.9911 7.5C12.9911 7.79058 13.0755 8.07491 13.234 8.31843C13.3926 8.56195 13.6185 8.75418 13.8842 8.87174C14.1499 8.98931 14.4441 9.02716 14.7309 8.9807C15.0178 8.93423 15.285 8.80545 15.5 8.61C15.6806 8.77413 15.8985 8.89172 16.1348 8.95258C16.3711 9.01344 16.6187 9.01572 16.8561 8.95923C17.0935 8.90274 17.3135 8.78919 17.4971 8.62842C17.6807 8.46765 17.8223 8.26452 17.9096 8.03664C17.9969 7.80877 18.0273 7.56304 17.9981 7.32076C17.969 7.07848 17.8812 6.84697 17.7423 6.64632C17.6034 6.44567 17.4177 6.28192 17.2012 6.1693C16.9847 6.05667 16.744 5.99856 16.5 6ZM15 15C14.7348 15 14.4804 15.1054 14.2929 15.2929C14.1054 15.4804 14 15.7348 14 16V17C14 17.2652 13.8946 17.5196 13.7071 17.7071C13.5196 17.8946 13.2652 18 13 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V13H3C3.26522 13 3.51957 12.8946 3.70711 12.7071C3.89464 12.5196 4 12.2652 4 12C4 11.7348 3.89464 11.4804 3.70711 11.2929C3.51957 11.1054 3.26522 11 3 11H2V10C2 9.73478 2.10536 9.48043 2.29289 9.29289C2.48043 9.10536 2.73478 9 3 9C3.26522 9 3.51957 8.89464 3.70711 8.70711C3.89464 8.51957 4 8.26522 4 8C4 7.73478 3.89464 7.48043 3.70711 7.29289C3.51957 7.10536 3.26522 7 3 7C2.20435 7 1.44129 7.31607 0.87868 7.87868C0.31607 8.44129 0 9.20435 0 10V17C0 17.7956 0.31607 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H13C13.7956 20 14.5587 19.6839 15.1213 19.1213C15.6839 18.5587 16 17.7956 16 17V16C16 15.7348 15.8946 15.4804 15.7071 15.2929C15.5196 15.1054 15.2652 15 15 15ZM5 16H6C6.26522 16 6.51957 15.8946 6.70711 15.7071C6.89464 15.5196 7 15.2652 7 15C7 14.7348 6.89464 14.4804 6.70711 14.2929C6.51957 14.1054 6.26522 14 6 14H5C4.73478 14 4.48043 14.1054 4.29289 14.2929C4.10536 14.4804 4 14.7348 4 15C4 15.2652 4.10536 15.5196 4.29289 15.7071C4.48043 15.8946 4.73478 16 5 16Z"
                            />
                        </View>
                        <Text style={[styles.text_sm, styles.center, styles.text_color_white, styles.fw_bold, {marginTop: 3}]}>My Savings</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('ComingSoon')}>
                    <View style={[styles.row, styles.margin_sm.y, styles.radius_md, styles.padding_xs.y, styles.padding_md.x, {backgroundColor: '#262626'}]}>
                        <View style={[styles.center, styles.margin_sm.y, styles.margin_md.e, styles.padding_md.xy, styles.bg_color_primary, {borderRadius: 200}]}>
                            <SVG
                                width={22}
                                height={21}
                                fill={color.white}
                                style={[styles.center]}
                                d="M7.5 6.93694L6.4 4.55856L4 3.46847L6.4 2.37838L7.5 0L8.6 2.37838L11 3.46847L8.6 4.55856L7.5 6.93694ZM14 9.90991L13.05 7.87838L11 6.93694L13.05 5.9955L14 3.96396L14.95 5.9955L17 6.93694L14.95 7.87838L14 9.90991ZM3 11.8919L2.05 9.86036L0 8.91892L2.05 7.97748L3 5.94595L3.95 7.97748L6 8.91892L3.95 9.86036L3 11.8919ZM3.5 18.3333L2 16.8468L9.5 9.41441L13.5 13.3784L20.6 5.47523L22 6.86261L13.5 16.3514L9.5 12.3874L3.5 18.3333Z"
                            />
                        </View>
                        <Text style={[styles.text_sm, styles.center, styles.text_color_white, styles.fw_bold, {marginTop: 3}]}>Ajo</Text>
                    </View>
                </TouchableOpacity>
            </ModalBottom>
            <ModalBottom visible={mySavings} onDismiss={() => setMySavings(!mySavings)}>
                <Text style={[styles.text_sm, styles.text_color_white, styles.fw_bold]}>Savings Accounts</Text>

                {(appData.accounts && (appData.accounts.length > 0)) && appData.accounts.map((account, index) =>
                <TouchableOpacity onPress={() => { setAddMoney(!addMoney); setMySavings(!mySavings); navigation.navigate('ComingSoon'); } }>
                    <View style={[styles.row, styles.margin_sm.y, styles.radius_md, styles.padding_xs.y, styles.padding_md.x, {backgroundColor: '#262626'}]}>
                        <View style={[styles.center, styles.margin_sm.y, styles.margin_md.e, styles.padding_md.xy, styles.bg_color_primary, {borderRadius: 200}]}>
                            <SVG
                                width={22}
                                height={21}
                                fill={color.white}
                                style={[styles.center]}
                                d="M19 0H9C8.20435 0 7.44129 0.316071 6.87868 0.87868C6.31607 1.44129 6 2.20435 6 3V10C6 10.7956 6.31607 11.5587 6.87868 12.1213C7.44129 12.6839 8.20435 13 9 13H19C19.7956 13 20.5587 12.6839 21.1213 12.1213C21.6839 11.5587 22 10.7956 22 10V3C22 2.20435 21.6839 1.44129 21.1213 0.87868C20.5587 0.316071 19.7956 0 19 0ZM20 10C20 10.2652 19.8946 10.5196 19.7071 10.7071C19.5196 10.8946 19.2652 11 19 11H9C8.73478 11 8.48043 10.8946 8.29289 10.7071C8.10536 10.5196 8 10.2652 8 10V3C8 2.73478 8.10536 2.48043 8.29289 2.29289C8.48043 2.10536 8.73478 2 9 2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V10ZM16.5 6C16.1298 6.00125 15.7733 6.14028 15.5 6.39C15.285 6.19455 15.0178 6.06577 14.7309 6.0193C14.4441 5.97284 14.1499 6.01069 13.8842 6.12826C13.6185 6.24582 13.3926 6.43805 13.234 6.68157C13.0755 6.92509 12.9911 7.20942 12.9911 7.5C12.9911 7.79058 13.0755 8.07491 13.234 8.31843C13.3926 8.56195 13.6185 8.75418 13.8842 8.87174C14.1499 8.98931 14.4441 9.02716 14.7309 8.9807C15.0178 8.93423 15.285 8.80545 15.5 8.61C15.6806 8.77413 15.8985 8.89172 16.1348 8.95258C16.3711 9.01344 16.6187 9.01572 16.8561 8.95923C17.0935 8.90274 17.3135 8.78919 17.4971 8.62842C17.6807 8.46765 17.8223 8.26452 17.9096 8.03664C17.9969 7.80877 18.0273 7.56304 17.9981 7.32076C17.969 7.07848 17.8812 6.84697 17.7423 6.64632C17.6034 6.44567 17.4177 6.28192 17.2012 6.1693C16.9847 6.05667 16.744 5.99856 16.5 6ZM15 15C14.7348 15 14.4804 15.1054 14.2929 15.2929C14.1054 15.4804 14 15.7348 14 16V17C14 17.2652 13.8946 17.5196 13.7071 17.7071C13.5196 17.8946 13.2652 18 13 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V13H3C3.26522 13 3.51957 12.8946 3.70711 12.7071C3.89464 12.5196 4 12.2652 4 12C4 11.7348 3.89464 11.4804 3.70711 11.2929C3.51957 11.1054 3.26522 11 3 11H2V10C2 9.73478 2.10536 9.48043 2.29289 9.29289C2.48043 9.10536 2.73478 9 3 9C3.26522 9 3.51957 8.89464 3.70711 8.70711C3.89464 8.51957 4 8.26522 4 8C4 7.73478 3.89464 7.48043 3.70711 7.29289C3.51957 7.10536 3.26522 7 3 7C2.20435 7 1.44129 7.31607 0.87868 7.87868C0.31607 8.44129 0 9.20435 0 10V17C0 17.7956 0.31607 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H13C13.7956 20 14.5587 19.6839 15.1213 19.1213C15.6839 18.5587 16 17.7956 16 17V16C16 15.7348 15.8946 15.4804 15.7071 15.2929C15.5196 15.1054 15.2652 15 15 15ZM5 16H6C6.26522 16 6.51957 15.8946 6.70711 15.7071C6.89464 15.5196 7 15.2652 7 15C7 14.7348 6.89464 14.4804 6.70711 14.2929C6.51957 14.1054 6.26522 14 6 14H5C4.73478 14 4.48043 14.1054 4.29289 14.2929C4.10536 14.4804 4 14.7348 4 15C4 15.2652 4.10536 15.5196 4.29289 15.7071C4.48043 15.8946 4.73478 16 5 16Z"
                            />
                        </View>
                        <View>
                        <Text style={[styles.text_sm, styles.center, styles.text_color_white, styles.fw_bold, {marginTop: 3}]}>{account.accountName}</Text>
                            <View style={[styles.left, {flexDirection: 'row'}]}>
                                <Image
                                    style={[styles.center, {width: 15, height: 15, marginBottom: 5, marginRight: 5}]}
                                    source={require('../assets/illustrations/naira.png')}
                                    resizeMode="contain"
                                />
                                <Text style={[styles.center, styles.text_sm, styles.text_color_white]}><Currency amount={account.accountBalance} /></Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                )}

                <TouchableOpacity onPress={() => { setAddMoney(!addMoney); setMySavings(!mySavings); navigation.navigate('CreateAccount'); } }>
                    <View style={[styles.row, styles.margin_sm.y, styles.radius_md, styles.padding_xs.y, styles.padding_md.x, {backgroundColor: '#262626'}]}>
                        <View style={[styles.center, styles.margin_sm.y, styles.margin_md.e, styles.padding_md.xy, styles.bg_color_primary, {borderRadius: 200}]}>
                            <SVG
                                width={21}
                                height={21}
                                fill={color.white}
                                style={[styles.center]}
                                d="M13.8955 5.30811V8.61719H0.738281V5.30811H13.8955ZM9.12305 0.100586V14.0752H5.52393V0.100586H9.12305Z"
                            />
                        </View>
                        <Text style={[styles.text_sm, styles.center, styles.text_color_white, styles.fw_bold, {marginTop: 3}]}>Create account</Text>
                    </View>
                </TouchableOpacity>
            </ModalBottom>

            
            <View style={[styles.row, styles.space_between]}>
                <TouchableOpacity onPress={() => navigation.navigate('ComingSoon')} style={[{width: '30%'}]}>
                    <View style={[styles.radius_md, styles.padding_xs.xy, {backgroundColor: '#E9FFF2'}]}>
                        <View style={[styles.center, styles.margin_sm.y, styles.padding_md.xy, {borderRadius: 200, backgroundColor: '#40D079'}]}>
                            <SVG
                                width={25}
                                height={25}
                                fill={color.white}
                                style={[styles.center]}
                                d="M13.8955 5.30811V8.61719H0.738281V5.30811H13.8955ZM9.12305 0.100586V14.0752H5.52393V0.100586H9.12305Z"
                            />
                        </View>
                        <Text style={[styles.text_s, styles.center, {marginTop: 3}]}>New Account</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ComingSoon')} style={[{width: '30%'}]}>
                    <View style={[styles.radius_md, styles.padding_xs.xy, {backgroundColor: '#FFF9E9'}]}>
                        <View style={[styles.center, styles.margin_sm.y, styles.padding_md.xy, {borderRadius: 200, backgroundColor: '#E5B323'}]}>
                            <SVG
                                width={25}
                                height={24}
                                fill={color.white}
                                style={[styles.center]}
                                d="M22 7.65217C22 7.77902 21.9496 7.90066 21.8599 7.99036C21.7702 8.08005 21.6486 8.13043 21.5217 8.13043C21.3949 8.13043 21.2732 8.08005 21.1836 7.99036C21.0939 7.90066 21.0435 7.77902 21.0435 7.65217V1.63804L13.2478 9.4337C13.1557 9.51642 13.0368 9.56312 12.913 9.56522C12.7853 9.56492 12.6621 9.51817 12.5663 9.4337C12.4806 9.34092 12.433 9.21925 12.433 9.09294C12.433 8.96663 12.4806 8.84495 12.5663 8.75217L20.362 0.956522H14.3478C14.221 0.956522 14.0993 0.906134 14.0096 0.816442C13.92 0.726751 13.8696 0.605104 13.8696 0.478261C13.8696 0.351418 13.92 0.229771 14.0096 0.140079C14.0993 0.0503881 14.221 0 14.3478 0H21.5217C21.6486 0 21.7702 0.0503881 21.8599 0.140079C21.9496 0.229771 22 0.351418 22 0.478261V7.65217ZM17.6957 12.4348C17.5688 12.4348 17.4472 12.4852 17.3575 12.5749C17.2678 12.6646 17.2174 12.7862 17.2174 12.913V20.5652C17.2174 20.6921 17.167 20.8137 17.0773 20.9034C16.9876 20.9931 16.866 21.0435 16.7391 21.0435H1.43478C1.30794 21.0435 1.18629 20.9931 1.0966 20.9034C1.00691 20.8137 0.956522 20.6921 0.956522 20.5652V5.26087C0.956522 5.13403 1.00691 5.01238 1.0966 4.92269C1.18629 4.833 1.30794 4.78261 1.43478 4.78261H9.08696C9.2138 4.78261 9.33545 4.73222 9.42514 4.64253C9.51483 4.55284 9.56522 4.43119 9.56522 4.30435C9.56522 4.17751 9.51483 4.05586 9.42514 3.96617C9.33545 3.87647 9.2138 3.82609 9.08696 3.82609H1.43478C1.05425 3.82609 0.689312 3.97725 0.420238 4.24632C0.151164 4.5154 0 4.88034 0 5.26087V20.5652C0 20.9457 0.151164 21.3107 0.420238 21.5798C0.689312 21.8488 1.05425 22 1.43478 22H16.7391C17.1197 22 17.4846 21.8488 17.7537 21.5798C18.0227 21.3107 18.1739 20.9457 18.1739 20.5652V12.913C18.1739 12.7862 18.1235 12.6646 18.0338 12.5749C17.9441 12.4852 17.8225 12.4348 17.6957 12.4348Z"
                            />
                        </View>
                        <Text style={[styles.text_s, styles.center, {marginTop: 3}]}>Req. Withdraw</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ComingSoon')} style={[{width: '30%'}]}>
                    <View style={[styles.radius_md, styles.padding_xs.xy, {backgroundColor: '#FAEAFF'}]}>
                        <View style={[styles.center, styles.margin_sm.y, styles.padding_md.xy, {borderRadius: 200, backgroundColor: '#E07EFF'}]}>
                            <SVG
                                width={25}
                                height={24}
                                fill={color.white}
                                style={[styles.center]}
                                d="M22.5 0H2.5C1.1125 0 0.0125 1.1125 0.0125 2.5L0 17.5C0 18.8875 1.1125 20 2.5 20H22.5C23.8875 20 25 18.8875 25 17.5V2.5C25 1.1125 23.8875 0 22.5 0ZM22.5 17.5H2.5V10H22.5V17.5ZM22.5 5H2.5V2.5H22.5V5Z"
                            />
                        </View>
                        <Text style={[styles.text_s, styles.center, {marginTop: 3}]}>Payments</Text>
                    </View>
                </TouchableOpacity>
            </View>


            <TouchableOpacity onPress={() => navigation.navigate('ComingSoon')} style={[styles.end, {marginLeft: 'auto'}]}>
                <Text style={[styles.text_sm, styles.center, styles.margin_xs.y]}>View All</Text>
            </TouchableOpacity>

                {appData?.user?.walletTransactions.length > 0 ? appData?.user?.walletTransactions.map((transaction, index) => 
                <View style={[styles.margin_md.b]} key={index}>
                    <View style={[styles.bg_color_primary, styles.padding_xs.xy]}>
                        <Text style={[styles.text_sm]}>{new Date(transaction.transactionDate).toDateString()}</Text>
                    </View>
                    <View style={[styles.row, {marginVertical: 20}]}>
                        <SVG
                            width={25}
                            height={20}
                            style={[styles.margin_md.e]}
                            fill={color.primary}
                            d="M19 0H9C8.20435 0 7.44129 0.316071 6.87868 0.87868C6.31607 1.44129 6 2.20435 6 3V10C6 10.7956 6.31607 11.5587 6.87868 12.1213C7.44129 12.6839 8.20435 13 9 13H19C19.7956 13 20.5587 12.6839 21.1213 12.1213C21.6839 11.5587 22 10.7956 22 10V3C22 2.20435 21.6839 1.44129 21.1213 0.87868C20.5587 0.316071 19.7956 0 19 0ZM20 10C20 10.2652 19.8946 10.5196 19.7071 10.7071C19.5196 10.8946 19.2652 11 19 11H9C8.73478 11 8.48043 10.8946 8.29289 10.7071C8.10536 10.5196 8 10.2652 8 10V3C8 2.73478 8.10536 2.48043 8.29289 2.29289C8.48043 2.10536 8.73478 2 9 2H19C19.2652 2 19.5196 2.10536 19.7071 2.29289C19.8946 2.48043 20 2.73478 20 3V10ZM16.5 6C16.1298 6.00125 15.7733 6.14028 15.5 6.39C15.285 6.19455 15.0178 6.06577 14.7309 6.0193C14.4441 5.97284 14.1499 6.01069 13.8842 6.12826C13.6185 6.24582 13.3926 6.43805 13.234 6.68157C13.0755 6.92509 12.9911 7.20942 12.9911 7.5C12.9911 7.79058 13.0755 8.07491 13.234 8.31843C13.3926 8.56195 13.6185 8.75418 13.8842 8.87174C14.1499 8.98931 14.4441 9.02716 14.7309 8.9807C15.0178 8.93423 15.285 8.80545 15.5 8.61C15.6806 8.77413 15.8985 8.89172 16.1348 8.95258C16.3711 9.01344 16.6187 9.01572 16.8561 8.95923C17.0935 8.90274 17.3135 8.78919 17.4971 8.62842C17.6807 8.46765 17.8223 8.26452 17.9096 8.03664C17.9969 7.80877 18.0273 7.56304 17.9981 7.32076C17.969 7.07848 17.8812 6.84697 17.7423 6.64632C17.6034 6.44567 17.4177 6.28192 17.2012 6.1693C16.9847 6.05667 16.744 5.99856 16.5 6ZM15 15C14.7348 15 14.4804 15.1054 14.2929 15.2929C14.1054 15.4804 14 15.7348 14 16V17C14 17.2652 13.8946 17.5196 13.7071 17.7071C13.5196 17.8946 13.2652 18 13 18H3C2.73478 18 2.48043 17.8946 2.29289 17.7071C2.10536 17.5196 2 17.2652 2 17V13H3C3.26522 13 3.51957 12.8946 3.70711 12.7071C3.89464 12.5196 4 12.2652 4 12C4 11.7348 3.89464 11.4804 3.70711 11.2929C3.51957 11.1054 3.26522 11 3 11H2V10C2 9.73478 2.10536 9.48043 2.29289 9.29289C2.48043 9.10536 2.73478 9 3 9C3.26522 9 3.51957 8.89464 3.70711 8.70711C3.89464 8.51957 4 8.26522 4 8C4 7.73478 3.89464 7.48043 3.70711 7.29289C3.51957 7.10536 3.26522 7 3 7C2.20435 7 1.44129 7.31607 0.87868 7.87868C0.31607 8.44129 0 9.20435 0 10V17C0 17.7956 0.31607 18.5587 0.87868 19.1213C1.44129 19.6839 2.20435 20 3 20H13C13.7956 20 14.5587 19.6839 15.1213 19.1213C15.6839 18.5587 16 17.7956 16 17V16C16 15.7348 15.8946 15.4804 15.7071 15.2929C15.5196 15.1054 15.2652 15 15 15ZM5 16H6C6.26522 16 6.51957 15.8946 6.70711 15.7071C6.89464 15.5196 7 15.2652 7 15C7 14.7348 6.89464 14.4804 6.70711 14.2929C6.51957 14.1054 6.26522 14 6 14H5C4.73478 14 4.48043 14.1054 4.29289 14.2929C4.10536 14.4804 4 14.7348 4 15C4 15.2652 4.10536 15.5196 4.29289 15.7071C4.48043 15.8946 4.73478 16 5 16Z"
                        />
                        <Text style={[styles.text_sm, styles.start]}>Transaction</Text>
                        <Text style={[styles.text_sm, styles.end, {marginLeft: 'auto'}, ((transaction.transactionType === 'WITHDRAWAL') ? styles.text_color_danger : styles.text_color_success)]}> {((transaction.transactionType === 'WITHDRAWAL') ? "-" : "+")}<Currency amount={transaction.transactionAmount} /></Text>
                    </View>
                </View>
                ) : (
                    <View style={[styles.center, styles.text_color_gray]}>
                        <View style={[styles.center, styles.margin_sm.y, styles.padding_md.xy]}>
                            <SVG
                                width={36}
                                height={60}
                                fill={color.gray}
                                style={[styles.center]}
                                d="M0 0V18H0.0300007L0 18.03L12 30L0 42L0.0300007 42.03H0V60H36V42.03H35.97L36 42L24 30L36 18.03L35.97 18H36V0H0ZM30 43.5V54H6V43.5L18 31.5L30 43.5ZM18 28.5L6 16.5V6H30V16.5L18 28.5Z"
                            />
                        </View>
                        <Text style={[styles.text_md, styles.text_color_gray]}>No transactions yet</Text>
                    </View>
                )}


      </ScrollView>
    </View>
    );
}
