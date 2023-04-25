import typeApplication from '../interface/Application'

const reaction = [
    {
        name: 'hue',
        reactions: [
            {
                type: 'light',
                actions: [
                    'on',
                    'off'
                ]
            },
            {
                type: 'scene',
                actions: [
                    'on',
                    'off'
                ]
            }
        ]
    },
    {
        name: 'twitter',
        reactions: [
            {
                type: 'tweet',
                actions: [
                    'USER_MESSAGE'
                ]
            }
        ]
    },
    {
        name: 'tekme',
        reactions: [
            {
                type: 'door',
                actions: [
                    'HUB',
                    '4eme',
                    'Foyer',
                    'Meetup',
                    'SM1',
                    'SM2',
                    'Stream',
                    'Admission',
                ]
            }
        ]
    },
    {
        name: 'microsoft',
        reactions: [
            {
                type: 'outlook',
                actions: [
                    'SEND_EMAIL'
                ]
            },
            {
                type: 'todo',
                actions: [
                    'ADD_TODO'
                ]
            },
            {
                type: 'calendar',
                actions: [
                    'CREATE_CALENDAR'
                ]
            }
        ]
    },
    {
        name: 'google',
        reactions: [
            {
                type: 'gmail',
                actions: [
                    'SEND_EMAIL'
                ]
            },
            {
                type: 'agenda',
                actions: [
                    'CREATE_AGENDA'
                ]
            }
        ]
    }
]

export const getReactionType = (action: string, app: typeApplication[]) => {
    const possibleReactions = reaction.filter((reaction) => { 
        if (reaction.name !== action && app.find((app) => app.name.toLocaleLowerCase() === reaction.name.toLocaleLowerCase())) {
            return reaction
        }
    })
    return possibleReactions
}