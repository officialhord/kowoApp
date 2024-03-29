import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import axios from "axios";
import Header from "./Header";
import BackButton from "./BackButton";
import Currency from "./Currency";
import styles, { color } from "./Styles";
import { delLocalData, getLocalData, setLocalData } from "./Storage";
import { AppContext } from "./Context";
import APIs from "./APIs";
import SVG from "./SVG";

export default function Wallet({ navigation }) {
  const { appData, readFromStorage, resetTimeout } = useContext(AppContext);

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

  const url = APIs.baseURL;

  useEffect(() => {
    if (refreshing) {
      axios
        .post(`${url}account-service/fetch-user-accounts`)
        .then((response) => {
          console.log(response.data);
          if (response.status === 200) {
            setLocalData("accounts", response.data);
            readFromStorage();
          }
        })
        .catch((error) => {
          //console.error(error);
        });
    }
  }, [refreshing]);

  return (
    <>
      <Header
        start={
          <BackButton
            fill={color.white}
            navigation={navigation}
            icon="M5.928 7.976l4.357 4.357-.618.62L5 8.284v-.618L9.667 3l.618.619-4.357 4.357z"
          />
        }
        center={
          <Text
            style={[styles.text_md, styles.fw_bold, styles.text_color_white]}
          >
            Kowo Wallet
          </Text>
        }
        end={<Text style={styles.text_sm}></Text>}
        styleHeader={[
          styles.bg_color_secondary,
          styles.text_color_white,
          styles.header_rounded,
          { position: "absolute", width: "100%", zIndex: 1 },
        ]}
      />

      <View
        style={[styles.container, { paddingHorizontal: 0 }]}
        onStartShouldSetResponder={() => resetTimeout()}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View
            style={[
              styles.bg_color_secondary,
              styles.header_rounded,
              styles.padding_lg.xy,
              { marginTop: 100 },
            ]}
          >
            <View
              style={[
                styles.bg_color_primary,
                styles.radius_md,
                styles.padding_md.y,
              ]}
            >
              <View style={{ flex: 1 }}>
                <View style={[styles.padding_md.x]}>
                  <Text
                    style={[
                      styles.left,
                      styles.text_md,
                      styles.text_color_secondary,
                      styles.fw_bold,
                    ]}
                  >
                    Kowo Wallet
                  </Text>
                  <Text
                    style={[
                      styles.left,
                      styles.text_sm,
                      styles.text_color_secondary,
                    ]}
                  >
                    {appData?.user?.walletResponse?.virtualAccountNumber ??
                      "---"}
                  </Text>
                  <View style={[styles.left, { flexDirection: "row" }]}>
                    <Image
                      style={[
                        styles.center,
                        {
                          width: 15,
                          height: 15,
                          marginBottom: 12,
                          marginRight: 5,
                        },
                      ]}
                      source={require("../assets/illustrations/naira-sec.png")}
                      resizeMode="contain"
                    />
                    <Text
                      style={[
                        styles.center,
                        styles.text_xl,
                        styles.text_color_secondary,
                        styles.fw_bold,
                      ]}
                    >
                      <Currency
                        amount={
                          appData?.user?.walletResponse?.walletBalance ?? 0
                        }
                      />
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={[styles.container]}>
            <View style={[styles.row, styles.space_between]}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ComingSoon")}
                style={[{ width: "45%" }]}
              >
                <View
                  style={[
                    styles.radius_md,
                    styles.padding_xs.xy,
                    { backgroundColor: "#FFF9E9" },
                  ]}
                >
                  <View
                    style={[
                      styles.center,
                      styles.margin_sm.y,
                      styles.padding_md.xy,
                      styles.bg_color_primary,
                      { borderRadius: 200 },
                    ]}
                  >
                    <SVG
                      width={29}
                      height={28}
                      fill={color.white}
                      style={[styles.center, styles.margin_s.s]}
                      d="M0.0138313 7.86008L0.0761261 19.4945C0.0837399 20.9165 1.25341 22.0737 2.67539 22.0661L23.3588 21.9553C24.7807 21.9477 25.938 20.778 25.9303 19.356L25.8681 7.72165C25.8604 6.29967 24.6908 5.14246 23.2688 5.15007L20.6834 5.16391L20.6972 7.74934L23.2826 7.73549L23.3449 19.3699L2.66155 19.4806L2.59925 7.84624L5.18468 7.8324L5.17083 5.24697L2.58541 5.26082C1.16343 5.26843 0.0062175 6.4381 0.0138313 7.86008Z M17.5893 9.17498L19.4218 10.9879L12.9929 17.4861L6.49471 11.0572L8.30768 9.22468L11.6737 12.5419L11.6067 0.0414312L14.1921 0.0275879L14.2591 12.5281L17.5893 9.17498Z"
                    />
                  </View>
                  <Text
                    style={[styles.text_xs, styles.center, { marginTop: 3 }]}
                  >
                    Add Money
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ComingSoon")}
                style={[{ width: "45%" }]}
              >
                <View
                  style={[
                    styles.radius_md,
                    styles.padding_xs.xy,
                    { backgroundColor: "#FFF9E9" },
                  ]}
                >
                  <View
                    style={[
                      styles.center,
                      styles.margin_sm.y,
                      styles.padding_md.xy,
                      styles.bg_color_primary,
                      { borderRadius: 200 },
                    ]}
                  >
                    <SVG
                      width={30}
                      height={29}
                      fill={color.white}
                      style={[styles.center]}
                      d="M29.2266 0.773443C28.8913 0.442033 28.4745 0.204996 28.0183 0.0862894C27.5621 -0.0324169 27.0827 -0.0285845 26.6284 0.0973992L1.93293 7.06993C1.41393 7.216 0.951806 7.51683 0.608186 7.9323C0.264566 8.34778 0.0557905 8.85815 0.00970475 9.39533C-0.036381 9.93252 0.0824141 10.471 0.350246 10.9389C0.618077 11.4069 1.02221 11.782 1.50875 12.0143L12.6966 17.3034L17.9857 28.4913C18.1966 28.9454 18.5337 29.3293 18.9568 29.5972C19.3798 29.8652 19.871 30.0058 20.3717 30.0024H20.5971C21.136 29.9597 21.6489 29.7525 22.0662 29.4087C22.4835 29.0649 22.785 28.6012 22.9301 28.0803L29.9026 3.37157C30.0286 2.91733 30.0324 2.43787 29.9137 1.98166C29.795 1.52546 29.558 1.10868 29.2266 0.773443ZM20.2524 25.8401L15.7985 16.4418L21.008 11.2455C21.3068 10.9467 21.4747 10.5414 21.4747 10.1188C21.4747 9.69615 21.3068 9.29085 21.008 8.99202C20.7092 8.69319 20.3039 8.52531 19.8812 8.52531C19.4586 8.52531 19.0533 8.69319 18.7545 8.99202L13.5582 14.2015L4.1599 9.7476L26.5754 3.4246L20.2524 25.8401Z"
                    />
                  </View>
                  <Text
                    style={[styles.text_xs, styles.center, { marginTop: 3 }]}
                  >
                    Send Money
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={[styles.row, styles.space_between, { marginTop: 0 }]}>
              <TouchableOpacity
                onPress={() => navigation.navigate("ComingSoon")}
                style={[{ width: "45%" }]}
              >
                <View
                  style={[
                    styles.radius_md,
                    styles.padding_xs.xy,
                    { backgroundColor: "#FFF9E9" },
                  ]}
                >
                  <View
                    style={[
                      styles.center,
                      styles.margin_sm.y,
                      styles.padding_md.xy,
                      styles.bg_color_primary,
                      { borderRadius: 200 },
                    ]}
                  >
                    <SVG
                      width={24}
                      height={30}
                      fill={color.white}
                      style={[styles.center, styles.margin_xs.s]}
                      d="M16.1285 0H3.007C2.2106 0.00359553 1.44785 0.321558 0.884703 0.884702C0.321558 1.44785 0.00359553 2.2106 0 3.007V27.063C0.00359553 27.8594 0.321558 28.6222 0.884703 29.1853C1.44785 29.7484 2.2106 30.0664 3.007 30.07H16.1285C16.9249 30.0664 17.6876 29.7484 18.2508 29.1853C18.8139 28.6222 19.1319 27.8594 19.1355 27.063V3.007C19.1319 2.2106 18.8139 1.44785 18.2508 0.884702C17.6876 0.321558 16.9249 0.00359553 16.1285 0ZM17.4953 27.063C17.4953 27.4255 17.3513 27.7732 17.0949 28.0295C16.8386 28.2858 16.491 28.4298 16.1285 28.4298H3.007C2.6445 28.4298 2.29684 28.2858 2.04051 28.0295C1.78419 27.7732 1.64018 27.4255 1.64018 27.063V3.007C1.64018 2.6445 1.78419 2.29684 2.04051 2.04051C2.29684 1.78419 2.6445 1.64018 3.007 1.64018H16.1285C16.491 1.64018 16.8386 1.78419 17.0949 2.04051C17.3513 2.29684 17.4953 2.6445 17.4953 3.007V27.063ZM14.7616 5.19391C14.7616 5.41141 14.6752 5.62 14.5214 5.7738C14.3676 5.9276 14.159 6.014 13.9415 6.014H5.19391C4.97641 6.014 4.76781 5.9276 4.61402 5.7738C4.46022 5.62 4.37382 5.41141 4.37382 5.19391C4.37382 4.97641 4.46022 4.76781 4.61402 4.61402C4.76781 4.46022 4.97641 4.37382 5.19391 4.37382H13.9415C14.159 4.37382 14.3676 4.46022 14.5214 4.61402C14.6752 4.76781 14.7616 4.97641 14.7616 5.19391Z"
                    />
                  </View>
                  <Text
                    style={[styles.text_xs, styles.center, { marginTop: 3 }]}
                  >
                    Airtime & Data
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ComingSoon")}
                style={[{ width: "45%" }]}
              >
                <View
                  style={[
                    styles.radius_md,
                    styles.padding_xs.xy,
                    { backgroundColor: "#FFF9E9" },
                  ]}
                >
                  <View
                    style={[
                      styles.center,
                      styles.margin_sm.y,
                      styles.padding_md.xy,
                      styles.bg_color_primary,
                      { borderRadius: 200 },
                    ]}
                  >
                    <SVG
                      width={28}
                      height={30}
                      fill={color.white}
                      style={[styles.center, styles.margin_xs.s]}
                      d="M5.46154 7.19231C5.1854 7.19231 4.96154 7.41616 4.96154 7.69231C4.96154 7.96845 5.1854 8.19231 5.46154 8.19231V7.19231ZM9.92308 8.19231C10.1992 8.19231 10.4231 7.96845 10.4231 7.69231C10.4231 7.41616 10.1992 7.19231 9.92308 7.19231V8.19231ZM5.46154 15C5.1854 15 4.96154 15.2239 4.96154 15.5C4.96154 15.7761 5.1854 16 5.46154 16V15ZM18.8462 16C19.1223 16 19.3462 15.7761 19.3462 15.5C19.3462 15.2239 19.1223 15 18.8462 15V16ZM5.46154 19.4615C5.1854 19.4615 4.96154 19.6854 4.96154 19.9615C4.96154 20.2377 5.1854 20.4615 5.46154 20.4615V19.4615ZM18.8462 20.4615C19.1223 20.4615 19.3462 20.2377 19.3462 19.9615C19.3462 19.6854 19.1223 19.4615 18.8462 19.4615V20.4615ZM5.46154 23.9231C5.1854 23.9231 4.96154 24.1469 4.96154 24.4231C4.96154 24.6992 5.1854 24.9231 5.46154 24.9231V23.9231ZM9.92308 24.9231C10.1992 24.9231 10.4231 24.6992 10.4231 24.4231C10.4231 24.1469 10.1992 23.9231 9.92308 23.9231V24.9231ZM21.0769 1V0.5V1ZM3.23077 1L3.23077 0.5L3.23077 1ZM1 3.23077H0.5H1ZM1 27.7692H0.5H1ZM5.46154 8.19231H9.92308V7.19231H5.46154V8.19231ZM5.46154 16H18.8462V15H5.46154V16ZM5.46154 20.4615H18.8462V19.4615H5.46154V20.4615ZM5.46154 24.9231H9.92308V23.9231H5.46154V24.9231ZM3.23077 30.5H21.0769V29.5H3.23077V30.5ZM21.0769 30.5C21.8012 30.5 22.4958 30.2123 23.0079 29.7002L22.3008 28.9931C21.9762 29.3176 21.536 29.5 21.0769 29.5V30.5ZM23.0079 29.7002C23.52 29.1881 23.8077 28.4935 23.8077 27.7692H22.8077C22.8077 28.2283 22.6253 28.6685 22.3008 28.9931L23.0079 29.7002ZM23.8077 27.7692V3.23077H22.8077V27.7692H23.8077ZM23.8077 3.23077C23.8077 2.50652 23.52 1.81194 23.0079 1.29982L22.3008 2.00693C22.6253 2.33151 22.8077 2.77174 22.8077 3.23077H23.8077ZM23.0079 1.29982C22.4957 0.787705 21.8012 0.5 21.0769 0.5V1.5C21.536 1.5 21.9762 1.68235 22.3008 2.00693L23.0079 1.29982ZM21.0769 0.5H3.23077V1.5H21.0769V0.5ZM3.23077 0.5C2.50652 0.5 1.81194 0.787705 1.29982 1.29982L2.00693 2.00693C2.33151 1.68235 2.77174 1.5 3.23077 1.5L3.23077 0.5ZM1.29982 1.29982C0.787705 1.81194 0.5 2.50652 0.5 3.23077L1.5 3.23077C1.5 2.77174 1.68235 2.33151 2.00693 2.00693L1.29982 1.29982ZM0.5 3.23077V27.7692H1.5V3.23077H0.5ZM0.5 27.7692C0.5 28.4935 0.787705 29.1881 1.29982 29.7002L2.00693 28.9931C1.68235 28.6685 1.5 28.2283 1.5 27.7692H0.5ZM1.29982 29.7002C1.81194 30.2123 2.50652 30.5 3.23077 30.5V29.5C2.77174 29.5 2.33151 29.3176 2.00693 28.9931L1.29982 29.7002ZM18.9039 7.69238C18.9039 7.72425 18.878 7.75008 18.8462 7.75008V8.75008C19.4303 8.75008 19.9039 8.27653 19.9039 7.69238H18.9039ZM18.8462 7.75008C18.8143 7.75008 18.7885 7.72425 18.7885 7.69238H17.7885C17.7885 8.27653 18.262 8.75008 18.8462 8.75008V7.75008ZM18.7885 7.69238C18.7885 7.66052 18.8143 7.63469 18.8462 7.63469V6.63469C18.262 6.63469 17.7885 7.10823 17.7885 7.69238H18.7885ZM18.8462 7.63469C18.878 7.63469 18.9039 7.66052 18.9039 7.69238H19.9039C19.9039 7.10823 19.4303 6.63469 18.8462 6.63469V7.63469Z"
                    />
                  </View>
                  <Text
                    style={[styles.text_xs, styles.center, { marginTop: 3 }]}
                  >
                    Pay Bills
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("ComingSoon")}
              style={[styles.end, { marginLeft: "auto" }]}
            >
              <Text style={[styles.text_sm, styles.center, styles.margin_xs.y]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
