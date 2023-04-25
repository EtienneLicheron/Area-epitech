import React, { useEffect } from 'react'
import { useState } from 'react'
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Text, Alert, Linking } from 'react-native'
import { useDispatch } from 'react-redux'
import { WebView } from 'react-native-webview'
import Feather from "react-native-vector-icons/Feather";

import Button from '../component/Button'
import getColorScheme from '../component/ColorsMode'
import Input from '../component/Input'

import { login } from '../store/action/userAction'

import api from '../lib/api/api'
import PressableIcon from '../component/PressableIcon'
import GithubLogo from '../lib/assets/GithubLogo'
import TwitterLogo from '../lib/assets/TwitterLogo'
import CModal from '../component/Modal'
import PhillipeHueLogo from '../lib/assets/PhillipHueLogo'
import { showMessage } from "react-native-flash-message";
import GoogleLogo from '../lib/assets/GoogleLogo'
import MicrosoftLogo from '../lib/assets/MicrosoftLogo'
import TwitchLogo from '../lib/assets/TwitchLogo'

const INJECTED_JAVASCRIPT = `setTimeout(() => {
    window.ReactNativeWebView.postMessage(document.cookie);
}, 500);`

export default function LoginScreen(props: any) {
	const color = getColorScheme()
	const dispatch = useDispatch()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [modalVisible, setModalVisible] = useState(false)

	const webview = React.useRef<WebView>(null)
	const [url, setUrl] = useState('')

	const [data, setData] = useState('')

	const handleOpenURL = async ({url}: any) => {
		if (url.includes('token')) {
			const token = url.split('=')[1]
			setData(token)
			const res = await api.profile(token)
			if (res.status === 200) {
				showMessage({
					message:'Login successful',
					type:'success'
				})
				dispatch(login(token))
			} else {
				showMessage({
					message:'Network error: [' + res.status + '] ' + res.data.error + ' ' + res.data.message,
					type:'danger'
				})
			}
		}
	}

	useEffect(() => {
		Linking.addEventListener('url', handleOpenURL)
	}, [])


	const onClick = async () => {
		if (email === '' || password === '') {
			showMessage({
				message:'Please fill all the fields',
				type:'danger'
			})
			return
		}
		let res = await api.login(email, password)
		if (res.headers['set-cookie']) {
			const token: string = res.headers['set-cookie'][0].split(';')[0].split('=')[1]
			dispatch(login(token))
		} else {
			showMessage({
				message:'Network error: [' + res.status + '] ' + res.data.error + ' ' + res.data.message,
				type:'danger'
			})
		}
	}

	const githubConnect = async () => {
		console.log('Github connect')
		setUrl(`${api.api.getUri()}/auth/github`)
		setModalVisible(true)
	}

	const twitterConnect = async () => {
		console.log('Twitter connect')
		setUrl(`${api.api.getUri()}/auth/twitter`)
		setModalVisible(true)
	}

	const microsoftConnect = async () => {
		console.log('Microsoft connect')
		setUrl(`${api.api.getUri()}/auth/microsoft`)
		setModalVisible(true)
	}

	const googleConnect = async () => {
		console.log('Google connect')
		Linking.openURL(`${api.api.getUri()}/auth/google?device=mobile&token=`)
	}

	return (
		<ScrollView style={[{ flex: 1, backgroundColor: color.background }]} contentContainerStyle={{ flex: 1 }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				style={[styles.container, { backgroundColor: color.background }]}
			>
				<CModal visible={modalVisible} onPressClose={() => setModalVisible(false)}>
					<WebView
						useWebView2={true}
						ref={webview}
						// limitsNavigationsToAppBoundDomains={true}
						onContentProcessDidTerminate={webview.current?.reload}
						javaScriptCanOpenWindowsAutomatically
						style={{ flex: 1 }}
						onError={(evt) => {
							console.error('onError WebView')
							console.error(JSON.stringify(evt.nativeEvent, null, 4))
						}}
						source={{
							uri: `${url}`,
							headers: { 'Access-Control-Allow-Origin': '*' },
						}}
						// userAgent='Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5 Build/M4B30Z) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Mobile Safari/537.36'
						// userAgent="Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:11.0) like Gecko"
						onNavigationStateChange={(event) => {
							console.log('onNavigationStateChange')
							console.log(JSON.stringify(event, null, 4))
							try {
								// webview.current?.injectJavaScript('window.isNative = true')
								webview.current?.injectJavaScript(INJECTED_JAVASCRIPT)
							} catch (e) {
								console.log(e)
							}
						}}
						onMessage={(event) => {
							console.log('onMessage')
							if (event.nativeEvent.data.includes('access_token')) {
								setModalVisible(false)
								const token: string = event.nativeEvent.data.split(';')[0].split('=')[1]
								console.log(token)
								dispatch(login(token))
								setModalVisible(false)
							} else {
							}
						}}
					/>
				</CModal>
				<Feather name='user' size={24} color={color.accent} />
				<Input
					placeholder='Email'
					keyboardAppearance='default'
					keyboardType='default'
					style={Platform.OS === 'ios' ? {width: '50%'} : { width: '40%', height: '8%' }}
					onChangeText={(text) => setEmail(text)}
				/>
				<Input
					placeholder='Password'
					keyboardAppearance='default'
					keyboardType='default'
					style={Platform.OS === 'ios' ? {width: '50%'} : { width: '40%', height: '8%' }}
					onChangeText={(text) => setPassword(text)}
				/>
				<Button title='Login' onPress={onClick} />
				<View style={{ flexDirection: 'row' }}>
					<PressableIcon icon={GithubLogo(color.accent, 24)} onPress={githubConnect} />
					<PressableIcon icon={TwitterLogo(color.accent, 24)} onPress={twitterConnect} />
					<PressableIcon icon={MicrosoftLogo(color.accent, 24)} onPress={microsoftConnect} />
					<PressableIcon icon={GoogleLogo(color.accent, 24)} onPress={googleConnect} />
				</View>
			</KeyboardAvoidingView>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
})
