import React, { ReactNode, useState, useEffect } from 'react'

import { Text, StyleSheet, TouchableOpacity, View, Alert } from 'react-native'
import { ItemType } from 'react-native-dropdown-picker'
import Button from '../../../component/Button'
import getColorScheme from '../../../component/ColorsMode'
import Picker from '../../../component/Picker'
import PressableIcon from '../../../component/PressableIcon'
import api from '../../../lib/api/api'

import Ionicons from "react-native-vector-icons/Ionicons";

import ChevronDownLogo from '../../../lib/assets/ChevronDownLogo'
import ChevronUpLogo from '../../../lib/assets/ChevronUpLogo'
import GithubLogo from '../../../lib/assets/GithubLogo'
import PhillipeHueLogo from '../../../lib/assets/PhillipHueLogo'
import { showMessage } from 'react-native-flash-message'
import TwitterLogo from '../../../lib/assets/TwitterLogo'
import TekMeLogo from '../../../lib/assets/TekMe'
import MicrosoftLogo from '../../../lib/assets/MicrosoftLogo'
import GoogleLogo from '../../../lib/assets/GoogleLogo'

interface Props {
	item: any
	token: string
	index: number
	expandedId: number
	updateExpandedId: (id: number) => void
	onAddWebhook: () => void
}

export default function ItemLinkable(props: Props) {
	const [expanded, setExpanded] = useState(false)

	const [logo, setLogo] = useState<ReactNode>(null)
	const [description, setDescription] = useState('')

	const [placeholder1, setPlaceholder1] = useState('')
	const [placeholder2, setPlaceholder2] = useState('')

	const [open1, setOpen1] = useState(false)
	const [value1, setValue1] = useState('')
	const [items1, setItems1] = useState<ItemType<any>[]>([])

	const [open2, setOpen2] = useState(false)
	const [value2, setValue2] = useState('')
	const [items2, setItems2] = useState<ItemType<any>[]>([])

	const itemRef = React.useRef(null)

	const colors = getColorScheme()

	useEffect(() => {
		props.item.name === 'Github' && setGithub()
		props.item.name === 'Hue' && setHue()
		props.item.name === 'Twitter' && setTwitter()
		props.item.name === 'Tekme' && setTekme()
		props.item.name === 'Microsoft' && setMicrosoft()
		props.item.name === 'Google' && setGoogle()
	}, [])

	useEffect(() => {
		props.expandedId === props.index ? setExpanded(true) : setExpanded(false)
	}, [props.expandedId])

	useEffect(() => {
		if (value1.length > 0) {
			if (props.item.name === 'Github') {
				getGithubWebhook()
			} else if (props.item.name === 'Microsoft') {
				setMicrosoftEvents()
			}
		}
	}, [value1])

	const setGithub = async () => {
		setLogo(GithubLogo(colors.accent, 50))
		setDescription('Create a new webhook in your Github repository.')
		setPlaceholder1('Select a repository')
		setPlaceholder2('Select an event')
		const repo = await api.githubRepository(props.token)
		let itemsPars: { label: string; value: string }[] = []
		repo.data[0].forEach((elem: any, idx: number) => {
			itemsPars.push({ label: elem, value: elem + ';' + idx.toString() })
		})
		setItems1(itemsPars)
	}

	const getGithubWebhook = async () => {
		const res = await api.githubEvents(props.token, value1.split(';')[0])
		let itemsPars: { label: string; value: string; other: any }[] = []
		res.data[0].forEach((elem: any, idx: number) => {
			itemsPars.push({
				label: elem.title,
				value: elem.event,
				other: elem,
			})
		})
		setItems2(itemsPars)
	}

	const setGoogle = () => {
		setLogo(GoogleLogo(colors.accent, 50))
		setDescription('Create a new webhook in your Google account.')
		setPlaceholder1('Select a account')
	}

	const setHue = () => {
		setLogo(PhillipeHueLogo(colors.accent, 50))
		setDescription('Create a new webhook in your Hue bridge.')
		setPlaceholder1('Select a bridge')
	}

	const setTekme = () => {
		setLogo(TekMeLogo(colors.accent, 50))
		setDescription('Create a new webhook in your TekMe account.')
		setPlaceholder1('Select a account')
	}

	const setTwitter = () => {
		setLogo(TwitterLogo(colors.accent, 50))
		setDescription('Create a new webhook in your Twitter account.')
		setPlaceholder1('Select a account')
	}

	const setMicrosoft = async () => {
		setLogo(MicrosoftLogo(colors.accent, 50))
		setDescription('Create a new webhook in your Microsoft account.')
		setPlaceholder1('Select a type')
		setPlaceholder2('Select a event')
		const res = await api.microsoftServices(props.token)
		let itemsPars: { label: string; value: string }[] = []
		res.data.forEach((elem: any, idx: number) => {
			itemsPars.push({ label: elem.title, value: elem.title + ';' + idx.toString() })
		})
		setItems1(itemsPars)
	}

	const setMicrosoftEvents = async () => {
		const res = await api.microsoftServices(props.token)
		let itemsPars: { label: string; value: string }[] = []
		res.data.forEach((elem: any, idx: number) => {
			if (elem.title === value1.split(';')[0]) {
				elem.events.forEach((event: any, idx: number) => {
					itemsPars.push({ label: event, value: event + ';' + idx.toString() })
				})
			}
		})
		setItems2(itemsPars)
	}

	const itemPress = () => {
		setExpanded(!expanded)
		console.log(items1)
		setOpen1(false)
		setOpen2(false)
		props.updateExpandedId(expanded ? -1 : props.index)
	}

	const openDropdown = (dropdown: number) => {
		if (dropdown === 1) {
			if (open1) {
				setOpen1(false)
			} else {
				setOpen2(false)
				setOpen1(true)
			}
		} else if (dropdown === 2) {
			if (open2) {
				setOpen2(false)
			} else {
				setOpen1(false)
				setOpen2(true)
			}
		}
	}

	const setMessage = () => {
		const event: any = items2.find((elem: any) => {
			return elem.value === value2
		})
		const json = JSON.parse(JSON.stringify(event.other))
		showMessage({
			message: `Event: ${json.title}`,
			description: `${json.description}`,
			type: 'info',
			icon: 'info',
			duration: 5000,
		})
	}

	const createWebhook = async () => {
		if (props.item.name === 'Github') {
			const res = await api.githubWebhook(props.token, value1.split(';')[0], value2)
			// console.log(res)
		} else if (props.item.name === 'Microsoft') {
			const res = await api.microsoftWebhook(props.token, value1.split(';')[0], value2.split(';')[0])
			// console.log(JSON.stringify(res, null, 2))
		}
		props.onAddWebhook()
	}

	return (
		<View
			style={[
				styles.card,
				{
					backgroundColor: colors.background2,
					shadowColor: colors.shadow,
				},
			]}
		>
			<View style={styles.cardIconContainer}>
				{logo}
				<View style={styles.cardTextContainer}>
					<Text style={[styles.title, { color: colors.accent }]}>{props.item.name}</Text>
				</View>
				<TouchableOpacity onPress={itemPress} ref={itemRef}>
					{expanded ? ChevronUpLogo(colors.accent, 50) : ChevronDownLogo(colors.accent, 50)}
				</TouchableOpacity>
			</View>
			{expanded && (
			items1.length > 0 && (
				<View
					style={{
						padding: 10,
						alignItems: 'center',
						display: 'flex',
					}}
				>
					<Text style={{ color: colors.text, marginBottom: 5 }}>{description}</Text>
					<Picker
						open={open1}
						setOpen={() => openDropdown(1)}
						value={value1}
						setValue={setValue1}
						items={items1}
						setItems={setItems1}
						placeholder={placeholder1}
						//zIndex={10000 - props.index * 1000}
					/>
					<View style={{ height: 10 }} />
					<View/>
					<Picker
						open={open2}
						setOpen={() => openDropdown(2)}
						value={value2}
						setValue={setValue2}
						items={items2}
						setItems={setItems2}
						placeholder={placeholder2}
						disabled={value1 === ''}
						//zIndex={9000 - props.index * 1000}
					/>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: 10,
						}}
					>
						<PressableIcon
							icon={
								<Ionicons
									name='information-circle-outline'
									size={24}
									color={value2 === '' ? colors.inactive : colors.accent}
								/>
							}
							onPress={setMessage}
							disabled={value2 === ''}
						/>
						<Button title='Create' onPress={createWebhook} disabled={value2===''} />
					</View>
				</View>
				)
				|| items1.length === 0 && (
					<View style={{ padding: 10, alignItems: 'center', display: 'flex' }}>
						<Text style={{ color: colors.text, marginBottom: 5 }}> You can't create webhook with this app!</Text>
					</View>
				)
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	card: {
		borderRadius: 10,
		padding: 10,
		margin: 10,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},

	cardIconContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	cardTextContainer: {
		flexDirection: 'column',
		alignItems: 'center',
	},

	title: {
		fontSize: 20,
		fontWeight: 'bold',
	},
})
