import React, { useEffect } from 'react'

import { SectionList, View, Text } from 'react-native'
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker'
import getColorScheme from '../../../component/ColorsMode'
import PressableIcon from '../../../component/PressableIcon'
import ChevronDownLogo from '../../../lib/assets/ChevronDownLogo'
import ChevronUpLogo from '../../../lib/assets/ChevronUpLogo'
import { UserState } from '../../../lib/interface/interface'
import { typeSection } from '../../../lib/interface/Section'
import ReactionGoogle from './Reaction/GoogleReaction'
import ReactionHue from './Reaction/HueReaction'
import ReactionMicrosoft from './Reaction/MicrosoftReaction'
import ReactionTekme from './Reaction/TekMeReaction'
import ReactionTwitter from './Reaction/TwitterReaction'

interface Props {
	webhooks: typeSection[]
	user: UserState
	closeModal: () => void
}

export default function WebhooksCard(props: Props) {
	const colors = getColorScheme()

	const [open, setOpen] = React.useState(false)
	const [value, setValue] = React.useState(null)
	const [items, setItems] = React.useState<ItemType<any>[]>([])
	const [loading, setLoading] = React.useState(true)

	const [openIndex, setOpenIndex] = React.useState('')

	useEffect(() => {
		console.log('focus WebHook')
		const tmp: { label: string; value: string; parent?: string }[] = []
		if (props.webhooks.length === 0) {
			return
		}
		props.webhooks.forEach((section) => {
			section.reactions.forEach((reactionApp, index) => {
				const appNames = reactionApp.name
				if (tmp.find((item) => item.value === appNames + index)) {
					
				} else {
					tmp.push({
						label: appNames.toLocaleUpperCase(),
						value: appNames + index,
					})
				}
			})
		})
		setItems(tmp)
	}, [])

	useEffect(() => {
		if (items.length > 0) {
			setLoading(false)
		}
	}, [items])

	const renderItemAction = (item: any) => {
		// console.error(value)
		if (value === null) {
			return <View />
		} else if (String(value).includes('hue')) {
			return <ReactionHue token={props.user.token} webhookId={item[0].id} close={props.closeModal} />
		} else if (String(value).includes('twitter')) {
			return <ReactionTwitter token={props.user.token} webhookId={item[0].id} close={props.closeModal} />
		} else if (String(value).includes('tekme')) {
			return <ReactionTekme token={props.user.token} webhookId={item[0].id} close={props.closeModal} />
		} else if (String(value).includes('microsoft')) {
			return <ReactionMicrosoft token={props.user.token} webhookId={item[0].id} close={props.closeModal} />
		} else if (String(value).includes('google')) {
			return <ReactionGoogle token={props.user.token} webhookId={item[0].id} close={props.closeModal} />
		}
	}

	return (
		<SectionList
			sections={props.webhooks}
			automaticallyAdjustKeyboardInsets={true}
			renderSectionHeader={({ section: { title } }) => {
				return (
					<View style={{ marginTop: 5, backgroundColor: colors.background2, padding: 5, borderRadius: 5 }}>
						<Text style={{ color: colors.text, fontSize: 20, fontWeight: 'bold' }}>{title}</Text>
					</View>
				)
			}}
			keyExtractor={(item, index) => item + index}
			renderItem={(item) => {
				return (
					<View
						style={{
							margin: 5,
							backgroundColor: colors.background2,
							padding: 5,
							borderRadius: 5,
							alignItems: 'center',
						}}>
						<View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
							<Text style={{ color: colors.text, fontSize: 20, fontWeight: '800' }}>{item.item}</Text>
							<PressableIcon
								onPress={() => {
									if (item.index.toString() === openIndex.split('|')[1] && item.section.title === openIndex.split('|')[0]) {
										setOpenIndex('')
									} else {
										setOpenIndex(item.section.title + '|' + item.index)
									}
								}}
								icon={
									item.index.toString() === openIndex.split('|')[1] && item.section.title === openIndex.split('|')[0]
										? ChevronUpLogo(colors.text, 40)
										: ChevronDownLogo(colors.text, 40)
								}
							/>
						</View>
						{item.index.toString() === openIndex.split('|')[1] && item.section.title === openIndex.split('|')[0] ? (
							<View style={{alignItems: "center"}}>
								<DropDownPicker
									open={open}
									value={value}
									items={items}
									setOpen={setOpen}
									setValue={setValue}
									setItems={setItems}
									placeholder="Select an item"
									listMode='MODAL'
									loading={loading}
									ActivityIndicatorComponent={() => <Text>loading</Text>}
									listParentLabelStyle={{ fontWeight: 'bold' }}
									theme={colors.is === 'dark' ? 'DARK' : 'LIGHT'}
									ListEmptyComponent={() => <Text>Empty, add more app to get more action</Text>}
									zIndex={10000}
								/>
								{open && <View style={{ height: 100 }} />}
								{renderItemAction(
									item.section.webhooks.filter((p) => {
										if (p.argument === item.item.split(' - ')[0] && p.event === item.item.split(' - ')[1])
											return p
									})
								)}
							</View>
						) : null}
					</View>
				)
			}}
		/>
	)
}
