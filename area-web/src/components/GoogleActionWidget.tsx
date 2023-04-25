import { ActionInterface } from "../interfaces/action.interface"
import { ProfileInterface } from "../interfaces/profile.interface"
import { useState, useEffect } from "react"
import { IoTrash } from "react-icons/io5"
import api from "../api/api"

const GoogleActionWidget = ({ profile, action }: { profile: any, action: ActionInterface }) => {
  return (
    <div className='Event-body-actions'>
      {JSON.parse(action.data).type === "Agenda" ?
        <>
          <img src="logo/logo_agenda.svg" alt="Agenda" />
          <span>Add event to Agenda</span>
        </>
        : null
      }
      {JSON.parse(action.data).type === "Gmail" ?
        <>
          <img src="logo/logo_gmail.svg" alt="Gmail" />
          <span>Send mail to {JSON.parse(action.data).destination}</span>
        </>
        : null
      }
      <button className="remove" onClick={() => { api.deleteAction(action.id); window.location.reload() }}><IoTrash /></button>
    </div>
  )
}

export default GoogleActionWidget
