import axios, { AxiosInstance } from 'axios'
import { HOST_API, PORT_API } from '@env'

class API {
	api: AxiosInstance
	constructor() {
		this.api = axios.create({
			baseURL: `${HOST_API}:${PORT_API}`,
			// baseURL: `http://area.benjaminvic.fr:${PORT_API}`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})
	}

	/*
	 * Local auth
	*/
	/*
	* @brief: login the user
	* @param email: string - email of the user
	* @param password: string - password of the user 
	*/
	login = async (email: string, password: string) => {
		const result = await this.api.post('/auth/login', {
				email: email,
				password: password,
			}).then((res) => {
				return res
			}).catch((err) => {
				console.error('Error in login: [api.tsx]')
				return err.response
			})
		return result
	}

	/*
	* @brief: register the user
	* @param username: string - username of the user
	* @param email: string - email of the user
	* @param password: string - password of the user
	*/
	register = async (username: string, email: string, password: string) => {
		const result = await this.api.post('/auth/register', {
				username: username,
				email: email,
				password: password,
			}).then((res) => {
				return res
			}).catch((err) => {
				console.error('Error in register: [api.tsx]')
				return err.response
			})
		return result
	}
	/**********************************************************************/

	/*
	* External Application Authentication / Link
	*/
	/*
	* @brief: login with Github or link local account with Github
	* @param token: string - token of the user (if the user is already logged in)
	*/
	github = async (token: string = '') => {
		const result = await this.api.get('/auth/github', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				// console.log(res.data);
				return res
			}).catch((err) => {
				console.error(JSON.stringify(err, null, 4))
				return false
			})
		return result
	}

	/* 
	* @brief: login with Twitter or link local account with Twitter
	* @param token: string - token of the user (if the user is already logged in)
	*/
	twitter = async (token: string = '') => {
		const results = await this.api.get('/auth/twitter', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				console.log(res.data)
				return res.data
			}).catch(() => {
				console.error('Error in twitter: [api.tsx]')
				return false
			})
		return results
	}

	/*
	* @brief: login with Microsoft or link local account with Microsoft
	* @param token: string - token of the user (if the user is already logged in)
	*/
	microsoft = async (token: string = '') => {
		const results = await this.api.get('/auth/microsoft', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
		}).then((res) => {
			console.log(res.data)
			return res.data
		}).catch(() => {
			console.error('Error in microsoft: [api.tsx]')
			return false
		})
		return results
	}

	/*
	* @brief: login with Google or link local account with Google
	* @param token: string - token of the user (if the user is already logged in)
	*/
	google = async (token: string = '') => {
		const results = await this.api.get('/auth/google', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				console.log(res.data)
				return res.data
			}).catch(() => {
				console.error('Error in google: [api.tsx]')
				return false
			})
		return results
	}

	/*
	* @brief: login with Twitch or link local account with Twitch
	* @param token: string - token of the user (if the user is already logged in)
	*/
	twitch = async (token: string = '') => {
		const results = await this.api.get('/auth/twitch', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				console.log(res.data)
				return res.data
			}).catch(() => {
				console.error('Error in twitch: [api.tsx]')
				return false
			})
		return results
	}

	/* 
	* @brief: login with Hue or link local account with Hue
	* @param token: string - token of the user (if the user is already logged in)
	*/
	phillipeHue = async (token: string) => {
		const results = await this.api.get('/auth/hue', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				return res.data
			}).catch((err) => {
				console.error('Error in phillipeHue: [api.tsx]')
				console.error(err)
				return false
			})
		return results
	}

	/*
	* Link account
	*/
	/*
	* @brief: link local account with Tekme
	* @param token: string - token of the user
	*/
	tekmeToken = async (token: string, tekmeToken: string) => {
		const body = JSON.stringify({
			token: tekmeToken,
		})
		const result = await this.api.post('/applications/tekme', body, {
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'application/json',
				},
			}).then((res) => {
				return res
			}).catch((err) => {
				console.error(JSON.stringify(err.response, null, 4))
				console.error('Error in tekmeToken: [api.tsx]')
				return err.response
			})
		return result
	}
	
	/*
	* Remove application
	*/
	/*
	* @brief: remove application from user
	* @param token: string - token of the user
	* @param app: string - name of the application
	*/
	deleteApplication = async (token: string, app: string) => {
		const res = await this.api.delete(`/application/${app}`, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((_res) => {
				return true
			}).catch((err) => {
				console.error('Error in deleteApplication: [api.tsx]')
				console.error(JSON.stringify(err, null, 4))
				return false
			})
		return res
	}
	/**********************************************************************/

	/*
	* User
	*/
	/*
	* @brief: get user profile
	* @param token: string - token of the user
	*/
	profile = async (token: string) => {
		const res = await this.api.get('/', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				return res
			}).catch((err) => {
				console.error('Error in profile: [api.tsx]')
				return err.response
			})
		return res
	}

	/*
	* @brief: update user profile
	* @param token: string - token of the user
	* @param username: string - new username
	* @param email: string - new email
	* @param password: string - new password
	*/
	updateProfile = async (token: string, username: string = '', email: string = '', password: string = '') => {
		let body = {}

		body = (username !== '') ? { username: username, ...body } : body
		body = (email !== '') ? { email: email, ...body } : body
		body = (password !== '') ? { password: password, ...body } : body
		const res = await this.api.put('/', body, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				console.log(res.data)
				return res
			}).catch((err) => {
				console.error('Error in updateProfile: [api.tsx]')
				return err.response
			})
		return res
	}

	/* 
	* @brief: delete user profile
	* @param token: string - token of the user
	*/
	deleteProfile = async (token: string) => {
		const res = await this.api.delete('/', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				console.log(res.data)
				return res
			}).catch((err) => {
				console.error('Error in deleteProfile: [api.tsx]')
				return err.response
			})
		return res
	}

	/**********************************************************************/

	/*
	* Github webhook
	*/
	/*
	* @brief: delete webhook
	* @param token: string - token of the user
	*/
	deleteWebhook = async (token: string, id: string) => {
		const res = await this.api.delete(`/webhooks/${id}`, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				console.log(res.data)
				return res
			}).catch((err) => {
				console.error('Error in deleteWebhook: [api.tsx]')
				return err.response
			})
		return res
	}

	/*
	* @brief: get all Github repositories
	* @param token: string - token of the user
	*/
	githubRepository = async (token: string) => {
		const res = await this.api.get('/webhooks/github/repositories', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				// console.log(res.data);
				return res
			}).catch((err) => {
				console.error('Error in githubRepository: [api.tsx]')
				return err.response
			})
		return res
	}

	/*
	* @brief: get all Github events for a repository
	* @param token: string - token of the user
	* @param repositories: string - name of the repository
	*/
	githubEvents = async (token: string, repositories: string) => {
		const res = await this.api.get(`/webhooks/github/events/${repositories}`, {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				// console.log(res.data);
				return res
			}).catch((err) => {
				console.error('Error in githubEvents: [api.tsx]')
				return err.response
			})
		return res
	}

	/*
	* @brief: create a webhook
	* @param token: string - token of the user
	* @param repositories: string - name of the repository
	* @param events: string - name of the event
	*/
	githubWebhook = async (token: string, repositories: string, events: string) => {
		const body = { repository: repositories, event: events }
		const res = await this.api.post('/webhooks/github', body, {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			return res
		}).catch((err) => {
			console.error(JSON.stringify(err.response, null, 4))
			// console.error("Error in githubWebhook: [api.tsx]");
			return err.response
		})
		return res
	}

	/**********************************************************************/

	/*
	* Microsoft webhook
	*/
	/*
	* @brief: get available microsoft services
	* @param token: string - token of the user
	*/
	microsoftServices = async (token: string) => {
		const res = await this.api.get('/webhooks/microsoft/services', {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			// console.log(res.data);
			return res
		}).catch((err) => {
			console.error('Error in microsoftServices: [api.tsx]')
			return err.response
		})
		return res
	}

	/*
	* @brief: create a microsoft webhook
	* @param token: string - token of the user
	* @param service: string - name of the service
	* @param event: string - name of the event
	*/
	microsoftWebhook = async (token: string, service: string, event: string) => {
		const body = { service: service, event: event }
		const res = await this.api.post('/webhooks/microsoft', body, {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			return res
		}).catch((err) => {
			console.error('Error in microsoftWebhook: [api.tsx]')
			return err.response
		})
		return res
	}

	/**********************************************************************/

	/*
	* Google webhook
	*/
	/*
	* @brief: get available google services
	* @param token: string - token of the user
	*/
	googleServices = async (token: string) => {
		const res = await this.api.get('/webhooks/google/services', {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			// console.log(res.data);
			return res
		}).catch((err) => {
			console.error('Error in googleServices: [api.tsx]')
			return err.response
		})
		return res
	}

	/*
	* @brief: create a google webhook
	* @param token: string - token of the user
	* @param service: string - name of the service
	* @param event: string - name of the event
	*/
	googleWebhook = async (token: string, service: string, event: string) => {
		const body = { service: service, event: event }
		const res = await this.api.post('/webhooks/google', body, {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			return res
		}).catch((err) => {
			console.error('Error in googleWebhook: [api.tsx]')
			return err.response
		})
		return res
	}

	/*
	* Actions
	*/
	/*
	* @brief: delete action 
	* @param token: string - token of the user
	* @param id: string - id of the action
	*/
	deleteAction = async (token: string, id: string) => {
		const res = await this.api.delete(`/actions/${id}`, {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			console.log(res.data)
			return res
		}).catch((err) => {
			console.error('Error in deleteActionHue: [api.tsx]')
			return err.response
		})
		return res
	}

	/* 
	* Actions hue
	*/
	/*
	* @brief: get hue available lights
	* @param token: string - token of the user
	*/
	getHueLights = async (token: string) => {
		const results = await this.api.get('/actions/hue/lights', {
				headers: {
					Authorization: 'Bearer ' + token,
				},
			}).then((res) => {
				// console.log(JSON.stringify(res, null, 4))
				return res.data
			}).catch((err) => {
				console.error('Error in getHueLights: [api.tsx]')
				return err.response
			})
		return results
	}

	/*
	@brief: get hue lights info
	@param token: string - token of the user
	@param external: string - external id of the light
	*/
	getHueLightInfo = async (token: string, external: string) => {
		const results = await this.api.get(`/actions/hue/lights/${external}`, {
			headers: {	
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			// console.log(JSON.stringify(res, null, 4))
			return res.data
		}).catch((err) => {
			console.error('Error in getHueLightInfo: [api.tsx]')
			return err.response
		})
		return results
	}

	/*
	* @brief: get hue available scenes
	* @param token: string - token of the user
	*/
	getHueScenes = async (token: string) => {
		const results = await this.api.get('/actions/hue/scenes', {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			// console.log(JSON.stringify(res, null, 4))
			return res.data
		}).catch((err) => {
			console.error('Error in getHueScenes: [api.tsx]')
			return err.response
		})
		return results
	}

	/*
	* @brief: get hue scenes info
	* @param token: string - token of the user
	* @param external: string - external id of the scene
	*/
	getHueSceneInfo = async (token: string, external: string) => {
		const results = await this.api.get(`/actions/hue/scenes/${external}`, {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			// console.log(JSON.stringify(res, null, 4))
			return res.data
		}).catch((err) => {
			console.error('Error in getHueSceneInfo: [api.tsx]')
			return err.response
		})
		return results
	}

	/*
	* @brief: create a hue action
	* @param token: string - token of the user
	* @param type: string - type of the action
	* @param action: string - action of the action
	* @param external: string - external id of the action
	* @param webhook: number - id of the webhook
	* @param countdown: number - countdown of the action
	*/
	actionHue = async (
		token: string,
		type: string,
		action: string,
		external: string,
		webhook: number,
		countdown: number = 60,
	) => {
		const body = JSON.stringify({
			type: type,
			action: action,
			external: external,
			webhook: webhook,
			countdown: countdown,
		})
		const res = await this.api.post('/actions/hue', body, {
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'application/json',
				},
			}).then((res) => {
				return res
			}).catch((err) => {
				console.error(JSON.stringify(err.response, null, 4))
				console.error('Error in actionHue: [api.tsx]')
				return err.response
			})
		return res
	}

	/* 
	* Actions twitter
	*/
	/*
	* @brief: create a twitter action
	* @param token: string - token of the user
	* @param message: string - message of the action
	* @param webhook: number - id of the webhook
	* @param countdown: number - countdown of the action
	*/
	actionTwitter = async (token: string, message: string, webhook: number, countdown: number = 60) => {
		const body = JSON.stringify({
			message: message,
			webhook: webhook,
			countdown: countdown,
		})
		const result = await this.api.post('/actions/twitter', body, {
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'application/json',
				},
			}).then((res) => {
				return res
			}).catch((err) => {
				console.error(JSON.stringify(err.response, null, 4))
				console.error('Error in actionTwitter: [api.tsx]')
				return err.response
			})
		return result
	}

	/*
	* Tekme actions
	*/
	/*
	* @brief: get available doors
	* @param token: string - token of the user
	*/
	getTekmeDoors = async (token: string) => {
		const results = await this.api.get('/actions/tekme/doors', {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			// console.log(JSON.stringify(res, null, 4))
			return res.data
		}).catch((err) => {
			console.error('Error in getTekmeDoors: [api.tsx]')
			return err.response
		})
		return results
	}

	/*
	* @brief: create a tekme action
	* @param token: string - token of the user
	* @param door: string - door of the action
	* @param webhook: number - id of the webhook
	* @param countdown: number - countdown of the action
	*/
	actionTekme = async (token: string, door: string, webhook: number, countdown: number = 60) => {
		const body = JSON.stringify({
			door: door,
			webhook: webhook,
			countdown: countdown,
		})
		const result = await this.api.post('/actions/tekme', body, {
				headers: {
					Authorization: 'Bearer ' + token,
					'Content-Type': 'application/json',
				},
			}).then((res) => {
				return res
			}).catch((err) => {
				console.error(JSON.stringify(err.response, null, 4))
				console.error('Error in tekmeAction: [api.tsx]')
				return err.response
			})
		return result
	}

	/*
	* Gmail actions
	*/
	/*
	* @brief: create a gmail action
	* @param token: string - token of the user
	* @param destination: string - destination for the email
	* @param subject: string - subject of the email
	* @param message: string - message of the email
	* @param webhook: number - id of the webhook
	* @param countdown: number - countdown of the action
	*/
	actionGmail = async (
		token: string,
		destination: string,
		subject: string,
		message: string,
		webhook: number,
		countdown: number = 60,
	) => {
		const body = JSON.stringify({
			destination: destination,
			subject: subject,
			message: message,
			webhook: webhook,
			countdown: countdown,
		})
		const result = await this.api.post('/actions/gmail', body, {
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
		}).then((res) => {
			return res
		}).catch((err) => {
			console.error('Error in actionGmail: [api.tsx]')
			return err.response
		})
		return result
	}

	/*
	* Outlook actions
	*/
	/*
	* @brief: create a outlook action
	* @param token: string - token of the user
	* @param destination: string - destination for the email
	* @param subject: string - subject of the email
	* @param message: string - message of the email
	* @param webhook: number - id of the webhook
	* @param countdown: number - countdown of the action
	*/
	actionOutlook = async (
		token: string,
		destination: string,
		subject: string,
		message: string,
		webhook: number,
		countdown: number = 60,
	) => {
		const body = JSON.stringify({
			destination: destination,
			subject: subject,
			message: message,
			webhook: webhook,
			countdown: countdown,
		})
		const result = await this.api.post('/actions/outlook', body, {
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
		}).then((res) => {
			return res
		}).catch((err) => {
			console.error('Error in actionOutlook: [api.tsx]')
			console.error(JSON.stringify(err.response, null, 4))
			return err.response
		})
		return result
	}

	/*
	* Todo actions (Microsoft)
	*/
	/*
	* @brief: get the todo lists
	* @param token: string - token of the user
	*/
	getTodoLists = async (token: string) => {
		const results = await this.api.get('/actions/todo/lists', {
			headers: {
				Authorization: 'Bearer ' + token,
			},
		}).then((res) => {
			// console.log(JSON.stringify(res, null, 4))
			return res.data
		}).catch((err) => {
			// console.error('Error in getTodoLists: [api.tsx]')
			// console.error(JSON.stringify(err.response, null, 4))
			return err.response
		})
		return results
	}

	/*
	* @brief: create a todo action
	* @param token: string - token of the user
	* @param task: string - task to add
	* @param external: string - external id of the list
	* @param webhook: number - id of the webhook
	* @param countdown: number - countdown of the action
	*/
	actionTodo = async (token: string, task: string, external: string, webhook: number, countdown: number = 60) => {
		const body = JSON.stringify({
			task: task,
			external: external,
			webhook: webhook,
			countdown: countdown,
		})
		const result = await this.api.post('/actions/todo', body, {
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
		}).then((res) => {
			return res
		}).catch((err) => {
			console.error('Error in actionTodo: [api.tsx]')
			return err.response
		})
		return result
	}

	/*
	* Calendar actions (Microsoft)
	*/
	/*
	* @brief: create a calendar action
	* @param token: string - token of the user
	* @param title: string - title of the event
	* @param webhook: number - id of the webhook
	* @param countdown: number - countdown of the action
	*/
	actionCalendar = async (token: string, title: string, webhook: number, countdown: number = 60) => {
		const body = JSON.stringify({
			title: title,
			webhook: webhook,
			countdown: countdown,
		})
		const result = await this.api.post('/actions/calendar', body, {
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
		}).then((res) => {
			return res
		}).catch((err) => {
			console.error('Error in actionCalendar: [api.tsx]')
			return err.response
		})
		return result
	}

	/*
	* Agenda actions (Google)
	*/
	/*
	* @brief: create a google agenda action
	* @param token: string - token of the user
	* @param title: string - title of the event
	* @param webhook: number - id of the webhook
	* @param countdown: number - countdown of the action
	*/
	actionGoogleAgenda = async (token: string, title: string, webhook: number, countdown: number = 60) => {
		const body = JSON.stringify({
			title: title,
			webhook: webhook,
			countdown: countdown,
		})
		const result = await this.api.post('/actions/agenda', body, {
			headers: {
				Authorization: 'Bearer ' + token,
				'Content-Type': 'application/json',
			},
		}).then((res) => {
			return res
		}).catch((err) => {
			console.error('Error in actionGoogleAgenda: [api.tsx]')
			return err.response
		})
		return result
	}
		
}

export default new API()
