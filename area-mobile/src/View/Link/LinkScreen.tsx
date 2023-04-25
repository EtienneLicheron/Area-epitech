import React, { useCallback } from 'react'
import { useEffect, useState } from 'react'

import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native'
import { connect, useDispatch } from 'react-redux'

import api from '../../lib/api/api'

import Button from '../../component/Button'
import getColorScheme from '../../component/ColorsMode'
import ItemLinkable from './Local/ItemLinkable'
import { useFocusEffect } from '@react-navigation/native'
import typeApplication from '../../lib/interface/Application'
import { profile } from '../../store/action/userAction'
import ModalSetLink from './Local/ModalSetLink'

function LinkScreen(props: any) {
	const [services, setServices] = useState<typeApplication[]>([])
	const colors = getColorScheme()
	const dispatch = useDispatch()

	const [expandedId, setExpandedId] = useState(-1)
	const [modalVisible, setModalVisible] = useState(false)

	useEffect(() => {
		setServices(props.user.aplications)
		// setServices(props.user.aplications.filter((item: typeApplication) => {
		// 	if (item.name !== 'Hue' && item.name !== 'Google' && item.name !== 'Twitter' && item.name !== 'Tekme' )
		// 		return item
		// }))
	}, [props.user.aplications])


	const updateExpandedId = (id: number) => {
		setExpandedId(id)
	}

	const onAddWebhook = async () => {
		const res = await api.profile(props.user.token)
		if (res.data.id) {
			setServices(res.data.applications)
			dispatch(profile(res.data.email, res.data.username, res.data.id, res.data.applications))
			console.log('Done')
		}
	}

	const renderItem = ({ item, index }: any) => {
		return (
			<ItemLinkable
				item={item}
				token={props.user.token}
				index={index}
				expandedId={expandedId}
				updateExpandedId={updateExpandedId}
				onAddWebhook={onAddWebhook}
			/>
		)
	}

	return (
		<View
			style={[styles.container, { backgroundColor: colors.background }]}>
			{ services && services.length > 0 ? (
				<FlatList
					ListHeaderComponent={() => (
						<View style={{ maxWidth: '50%', alignSelf: 'center', justifyContent: 'center' }}>
							<Button title="See your webhooks" onPress={() => setModalVisible(true)} />
						</View>
					)}
					data={services}
					renderItem={null}
					CellRendererComponent={renderItem}
					style={styles.list}
					keyExtractor={(item, index) => index.toString()}
				/>
			) : (
				<ActivityIndicator size="large" color={colors.text} />
			)}
			<ModalSetLink visible={modalVisible} close={() => setModalVisible(false)} app={props.user.aplications} />
		</View>
	)
}

const mapStateToProps = (state: any) => {
	return {
		...state,
	}
}

export default connect(mapStateToProps)(LinkScreen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},

	list: {
		flex: 1,
		width: '100%',
	},
})
