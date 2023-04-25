import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    FlatList,
    Alert,
    Linking,
} from "react-native";
import { showMessage } from 'react-native-flash-message';
import Modal from "react-native-modal";
import { event } from 'react-native-reanimated';
import WebView from "react-native-webview";
import { useDispatch } from "react-redux";
import Button from '../../../component/Button';

import getColorScheme from "../../../component/ColorsMode";
import Input from '../../../component/Input';
import PressableIcon from "../../../component/PressableIcon";
import api from "../../../lib/api/api";
import GithubLogo from "../../../lib/assets/GithubLogo";
import GoogleLogo from '../../../lib/assets/GoogleLogo';
import MicrosoftLogo from '../../../lib/assets/MicrosoftLogo';
import PhillipeHueLogo from "../../../lib/assets/PhillipHueLogo";
import RedditLogo from "../../../lib/assets/RedditLogo";
import StartonLogo from '../../../lib/assets/StartonLogo';
import TekMeLogo from '../../../lib/assets/TekMe';
import TwitchLogo from '../../../lib/assets/TwitchLogo';
import TwitterLogo from '../../../lib/assets/TwitterLogo';
import { profile } from "../../../store/action/userAction";

const INJECTED_JAVASCRIPT = `setTimeout(() => {
    window.ReactNativeWebView.postMessage(document.cookie);
}, 1000);`;

export default function AddApplicationModal({
    modalVisible,
    closeModal,
    user,
    setApplications,
}: any) {
    const color = getColorScheme();

    const [webviewUrl, setWebviewUrl] = React.useState<string | null>(null);
    const [inputOpen, setInputOpen] = React.useState<boolean>(false);
    const [placeholder, setPlaceholder] = React.useState<string>("");
    const [token, setToken] = React.useState<string>('');

    const webviewRef = React.useRef<WebView>(null);

    const hasGithub = user.aplications?.find(
        (app: any) => app.name === "Github"
    );
    const hasHue = user.aplications?.find(
        (app: any) => app.name === "Hue"
    );
    const hasTwitter = user.aplications?.find(
        (app: any) => app.name === "Twitter"
    );
    const hasTekme = user.aplications?.find(
        (app: any) => app.name === "Tekme"
    );
    const hasGoogle = user.aplications?.find(
        (app: any) => app.name === "Google"
    );
    const hasMicrosoft = user.aplications?.find(
        (app: any) => app.name === "Microsoft"
    );

    const dispatch = useDispatch();
    const navigation = useNavigation();


    const handleOpenURL = ({ url }: any) => {
        if (url.includes("token")) {
            try {
                const token = url.split("=")[1];
                updateAppConnected(token);
            } catch (error) {
                showMessage({
                    message: "Error",
                    description: "An error occured while trying to connect to the application",
                    type: "danger",
                })
            }
        }
    };
  
    useEffect(() => {
        Linking.addEventListener('url', handleOpenURL);
    }, []);

    const openWebview = (url: string) => {
        setWebviewUrl(api.api.getUri() + url);
    };

    const updateAppConnected = async (token: string) => {
        const res = await api.profile(token);
        setApplications(res.data.applications);
        closeModal();
        dispatch(
            profile(user.email, user.username, user.id, res.data.applications)
        );
        //@ts-ignore
        navigation.navigate("Profile");
    };

    const onBackPress = () => {
        setInputOpen(false);
        closeModal();
    };

    const setInput = (value: string) => {
        setInputOpen(!inputOpen);
        if (value === "Tekme") {
            setPlaceholder("Type your Tekme token here...");
        } else if (value === "Starton") {
            setPlaceholder("Type your Starton token here...");
        }
    }

    const onPressAdd = async () => {
        if (placeholder === "Type your Tekme token here...") {
            const res = await api.tekmeToken(user.token, token);
            if (res.status === 201) {
                console.log('ok')
                updateAppConnected(user.token);
            }
        } 
    }

    return (
        <Modal
            isVisible={modalVisible}
            onBackdropPress={onBackPress}
            onBackButtonPress={onBackPress}
            style={styles.container}
        >
            <View style={[styles.card, { backgroundColor: color.background }]}>
                {!webviewUrl ? (
                    <>
                        <Text style={[styles.title, { color: color.text }]}>
                            Add application
                        </Text>
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal style={styles.rowApp}>
                            {!hasGithub && (
                                <PressableIcon
                                    icon={GithubLogo(color.accent, 24)}
                                    onPress={() => openWebview("/auth/github")}
                                />
                            )}
                            {!hasHue && (
                                <PressableIcon
                                    icon={PhillipeHueLogo(color.accent, 24)}
                                    onPress={() => openWebview("/auth/hue")}
                                />
                            )}
                            {!hasTwitter && (
                                <PressableIcon
                                    icon={TwitterLogo(color.accent, 24)}
                                    onPress={() => openWebview("/auth/twitter")}
                                />
                            )}
                            {!hasGoogle && (
                                <PressableIcon
                                    icon={GoogleLogo(color.accent, 24)}
                                    onPress={() => Linking.openURL(api.api.getUri() + `/auth/google?device=mobile&token=${user.token}`)}
                                />
                            )}
                            {!hasTekme && (
                                <PressableIcon
                                    icon={TekMeLogo(color.accent, 24)}
                                    onPress={() => setInput('Tekme')}
                                />
                            )}
                            {!hasMicrosoft && (
                                <PressableIcon
                                    icon={MicrosoftLogo(color.accent, 24)}
                                    onPress={() => openWebview("/auth/microsoft")}
                                />
                            )}
                        </ScrollView>
                        {inputOpen && 
                            <> 
                                <Input placeholder={placeholder} onChangeText={(text) => setToken(text)} style={{width: '90%'}} />
                                <Button title="Add" onPress={onPressAdd}/>
                            </>
                        }
                    </>
                ) : (
                    <View>
                        <WebView
                            source={{ uri: webviewUrl }}
                            ref={webviewRef}
                            limitsNavigationsToAppBoundDomains={true}
                            onContentProcessDidTerminate={() =>
                                webviewRef.current?.reload()
                            }
                            style={styles.webview}
                            onNavigationStateChange={(event) => {
                                try {
                                    webviewRef.current?.injectJavaScript(
                                        INJECTED_JAVASCRIPT
                                    );
                                } catch (e) {
                                    console.log(e);
                                }
                            }}
                            onMessage={(event) => {
                                const cookie = event.nativeEvent.data;
                                if (cookie.includes("token")) {
                                    setWebviewUrl(null);
                                    updateAppConnected(cookie.split("=")[1]);
                                }
                            }}
                        />
                    </View>
                )}
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
    },

    card: {
        alignSelf: "center",
        borderRadius: 10,
        alignItems: "center",
        width: Dimensions.get("window").width * 0.8,
    },

    title: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 10,
    },

    rowApp: {
        flexDirection: "row",
    },

    webview: {
        flex: 1,
        height: Dimensions.get("window").height * 0.5,
        width: Dimensions.get("window").width * 0.9,
        borderRadius: 10,
    },
});
