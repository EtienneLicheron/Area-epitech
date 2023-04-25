import { ActionInterface } from "../interfaces/action.interface"
import { ProfileInterface } from "../interfaces/profile.interface"
import { useState, useEffect } from "react"
import { IoTrash } from "react-icons/io5"
import api from "../api/api"

const MicrosoftActionWidget = ({ profile, action }: { profile: any, action: ActionInterface }) => {
    console.log(action)
    return (
        <div className='Event-body-actions'>
            {JSON.parse(action.data).type === "Todo" ?
                <>
                    <img src="logo/logo_todo.svg" alt="Todo" />
                    <span>Add task to do</span>
                </>
                : null
            }
            {JSON.parse(action.data).type === "Outlook" ?
                <>
                    <img src="logo/logo_outlook.svg" alt="Outlook" />
                    <span>Send mail to {JSON.parse(action.data).destination}</span>
                </>
                : null
            }
            {JSON.parse(action.data).type === "Calendar" ?
                <>
                    <img src="logo/logo_calendar.svg" alt="Calendar" />
                    <span>Add event to Calendar</span>
                </>
                : null
            }
            <button className="remove" onClick={() => { api.deleteAction(action.id); window.location.reload() }}><IoTrash /></button>
        </div>
    )
}

export default MicrosoftActionWidget