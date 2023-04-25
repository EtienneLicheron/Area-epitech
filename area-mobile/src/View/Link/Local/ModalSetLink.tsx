import React, { useEffect } from 'react'

import { ActivityIndicator, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { connect } from 'react-redux'
import getColorScheme from '../../../component/ColorsMode'

import CModal from '../../../component/Modal'
import typeApplication from '../../../lib/interface/Application'
import { typeSection, typeWebhook } from '../../../lib/interface/Section'
import { getReactionType } from '../../../lib/utils/getReactionType'
import WebhooksCard from './WebhooksCard'

interface Props {
	visible: boolean
	close: () => void
	app: typeApplication[]
	user?: any
}

function ModalSetLink(props: Props) {
	const [webhooks, setWebhooks] = React.useState<typeSection[]>([])
	const [loading, setLoading] = React.useState(true)
	const colors = getColorScheme()

	useEffect(() => {
		console.log('focus')
		const tmp: typeSection[] = []
		if (!props.app) return
		props.app.forEach((app) => {
			if (app.webhooks.length === 0) return
			const tmpWebhooks: typeWebhook[] = []
			app.webhooks.forEach((webhook) => {
				tmpWebhooks.push(webhook)
			})
			tmp.push({
				title: app.name,
				data: app.webhooks.map((webhook) => webhook.argument + ' - ' + webhook.event),
				webhooks: tmpWebhooks,
				reactions: getReactionType(app.name, props.app),
			})
		})
		setWebhooks(tmp)
		setLoading(false)
	}, [props.app])

	return (
		<CModal visible={props.visible} onPressClose={() => props.close()}>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.background }]}>
				{loading ? (
					<ActivityIndicator size='large' color='#0000ff' />
				) : (
					<WebhooksCard webhooks={webhooks} user={props.user} closeModal={() => props.close()} />
				)}
			</KeyboardAvoidingView>
		</CModal>
	)
}

const mapStateToProps = (state: any) => {
	return {
		...state,
	}
}

export default connect(mapStateToProps)(ModalSetLink)

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
})
