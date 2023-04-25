import api from "../api/api"
import Select from 'react-select'
import { useState, useEffect } from 'react'
import { WebhookInterface } from "../interfaces/webhook.interface"

const GoogleActionCreation = ({ webhook }: { webhook: WebhookInterface }) => {

  const [type, setType] = useState<string>("")
  const [selectedCountdown, setSelectedCountdown] = useState<number>(0)

  const [destinationAddress, setDestinationAddress] = useState<string>("")
  const [mailSubject, setMailSubject] = useState<string>("")
  const [mailBody, setMailBody] = useState<string>("")

  const [eventTitle, setEventTitle] = useState<string>("")
  
  const typeOptions = [
    { value: 'agenda', label: 'Agenda' },
    { value: 'gmail', label: 'Gmail' },
  ]

  const handleType = (e: any) => {
    setType(e.value)
  }

  return (
    <div className="googleCreation">
      <Select className="basic-single" options={typeOptions} onChange={handleType} placeholder="Select google service..." />
      {type === "agenda" ?
        <>
          <div className="numInput">
            <input type="text" placeholder="Event title..." onChange={(e) => setEventTitle(e.target.value)}/>
          </div>
          <div className="numInput">
            <input type="number" placeholder="Countdown" onChange={(e) => setSelectedCountdown(parseInt(e.target.value))} />
          </div>
          { eventTitle !== "" && selectedCountdown !== 0 ?
            <button onClick={() => {api.createAgendaAction(eventTitle, webhook.id, selectedCountdown); window.location.reload()}}>Create</button>
            : null
          }
        </>
        : null
      }
      {type === "gmail" ?
        <>
          <div className="numInput">
            <input type="text" placeholder="Destination address" onChange={(e) => setDestinationAddress(e.target.value)}/>
          </div>
          <div className="numInput">
            <input type="text" placeholder="Mail subject" onChange={(e) => setMailSubject(e.target.value)}/>
          </div>
          <div className="numInput">
            <input type="text" placeholder="Mail body" onChange={(e) => setMailBody(e.target.value)}/>
          </div>
          <div className="numInput">
            <input type="number" placeholder="Countdown" onChange={(e) => setSelectedCountdown(parseInt(e.target.value))} />
          </div>
          { destinationAddress !== "" && mailSubject !== "" && mailBody !== "" && selectedCountdown !== 0 ?
            <button onClick={() => {api.createGmailAction(destinationAddress, mailSubject, mailBody, webhook.id, selectedCountdown); window.location.reload()}}>Create</button>
            : null
          }
        </>
        : null
      }
    </div>
  )
}

export default GoogleActionCreation