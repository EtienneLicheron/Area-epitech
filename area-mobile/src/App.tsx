import * as React from 'react'
import { View, Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { BottomTabNavigationOptions, createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { tabBarIconProps, screenOptionProps } from './lib/interface/interface'

import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { connect } from 'react-redux'

import Ionicons from 'react-native-vector-icons/Ionicons'

import getColorScheme from './component/ColorsMode'

import HomeScreen from './View/HomeScreen'
import LinkScreen from './View/Link/LinkScreen'
import ProfileScreen from './View/Profile/ProfileScreen'
import LogoutScreen from './View/LogoutScreen'

import LoginScreen from './View/LoginScreen'
import RegisterScreen from './View/RegisterScreen'

const Tab = createBottomTabNavigator()

function MainNavigation({ user }: any) {
	const colors = getColorScheme()
	const screenOption = ({ route }: screenOptionProps): BottomTabNavigationOptions => ({
		tabBarIcon: ({ focused, color, size }: tabBarIconProps) => {
			let iconName: string = ''

			if (route.name === 'Home') {
				iconName = focused ? 'ios-home' : 'ios-home-outline'
			} else if (route.name === 'Logout') {
				iconName = focused ? 'logout' : 'logout'
				return <AntDesign name={iconName} size={size} color={color} />
			} else if (route.name === 'Login') {
				iconName = focused ? 'account-arrow-up' : 'account-arrow-up-outline'
				return <MaterialCommunityIcons name={iconName} size={24} color={color} />
			} else if (route.name === 'Register') {
				iconName = focused ? 'account-plus' : 'account-plus-outline'
				return <MaterialCommunityIcons name={iconName} size={size} color={color} />
			} else if (route.name === 'Profile') {
				iconName = focused ? 'person' : 'person-outline'
			} else if (route.name === 'Link') {
				iconName = focused ? 'link' : 'link-outline'
			}
			return <Ionicons name={iconName} size={size} color={color} />
		},
		tabBarShowLabel: true,
		tabBarHideOnKeyboard: true,
		tabBarStyle: {
			borderTopColor: colors.background,
			borderTopWidth: 0,
			borderBottomWidth: 0,
			borderRadius: 50,
			margin: 10,
			position: 'absolute',
			shadowColor: colors.shadow, //.is === 'light' ? '#1c1c1c' : 'grey',
			shadowOffset: {
				width: 1,
				height: 3,
			},
			shadowOpacity: 0.25,
			shadowRadius: 3.84,
			elevation: 1,
			alignItems: 'center',
			alignContent: 'center',
			alignSelf: 'center',
		},
		tabBarBackground: () => (
			<View
				style={{
					backgroundColor: colors.background,
					height: Platform.OS === 'ios' ? '75%' : '100%',
					width: '100%',
					borderRadius: 50,
				}}
			/>
		),
		tabBarActiveTintColor: colors.accent,
		tabBarInactiveTintColor: colors.inactive,
		headerBackground: () => (
			<View
				style={{
					backgroundColor: colors.background,
					height: '100%',
					alignItems: 'center',
				}}
			/>
		),
		headerTintColor: colors.text,
	})

	return (
		<View
			style={{
				backgroundColor: colors.background,
				height: '100%',
				width: '100%',
				position: 'absolute',
			}}>
			<Tab.Navigator screenOptions={screenOption}>
				{user.isLogged ? (
					<>
						<Tab.Screen
							name="Home"
							component={HomeScreen}
							options={{ title: 'Home', headerShown: false }}
						/>
						<Tab.Screen name="Link" component={LinkScreen} options={{ title: 'Link' }} />
						<Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
						<Tab.Screen name="Logout" component={LogoutScreen} options={{ title: 'Logout' }} />
					</>
				) : (
					<>
						<Tab.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
						<Tab.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
					</>
				)}
			</Tab.Navigator>
		</View>
	)
}

function App(props: any) {
	return (
		<NavigationContainer>
			<MainNavigation {...props} />
		</NavigationContainer>
	)
}

const mapStateToProps = (state: any, props: any) => {
	return {
		...state,
		...props,
	}
}

export const ConnectedApp = connect(mapStateToProps)(App)
