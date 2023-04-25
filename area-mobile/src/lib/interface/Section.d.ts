import { typeReactionForApp } from './Reaction'

export interface typeWebhook {
	action: []
	argument: string
	event: string
	external: string
	id: number
}

export interface typeSection {
	title: string
	data: string[]
	webhooks: typeWebhook[]
	reactions: typeReactionForApp[]
}