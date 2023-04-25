import api from "../api/api"
import Select from 'react-select'
import { useState, useEffect } from 'react'
import { WebhookInterface } from "../interfaces/webhook.interface"

const MicrosoftActionCreation = ({ webhook }: { webhook: WebhookInterface }) => {
    const [type, setType] = useState<string>("")

    const [destinationAddress, setDestinationAddress] = useState<string>("")
    const [mailSubject, setMailSubject] = useState<string>("")
    const [mailBody, setMailBody] = useState<string>("")

    const [eventTitle, setEventTitle] = useState<string>("")
    const [lists, setLists] = useState<any>([])
    const [listsOptions, setListsOptions] = useState<any>([])
    const [selectedList, setSelectedList] = useState<string>("")

    const [calendarTitle, setCalendarTitle] = useState<string>("")

    const [selectedCountdown, setSelectedCountdown] = useState<number>(0)

    const typeOptions = [
        { value: 'outlook', label: 'Outlook' },
        { value: 'todo', label: 'Todo' },
        { value: 'calendar', label: 'Calendar' },
    ]

    const handleType = (e: any) => {
        setType(e.value)
    }

    useEffect(() => {
        api.getTodoLists().then((res) => {
            setLists(res.data)
        })
    }, [])

    useEffect(() => {
        let options: any = []
        console.log(lists)
        lists[0]?.map((list: any) => {
            options.push({ value: list.external, label: list.name })
        })
        setListsOptions(options)
    }, [lists])

    const handleList = (e: any) => {
        setSelectedList(e.value)
    }

    return (
        <div className="microsoftCreation">
            <Select className="basic-single" options={typeOptions} onChange={handleType} placeholder="Select microsoft service..." />
            {type === "outlook" ?
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
                        <button onClick={() => {api.createOutlookAction(destinationAddress, mailSubject, mailBody, webhook.id, selectedCountdown); window.location.reload()}}>Create</button>
                        : null
                    }
                </>
            : null
            }
            {type === "todo" ?
                <>
                    <div className="numInput">
                        <input type="text" placeholder="Task title" onChange={(e) => setEventTitle(e.target.value)}/>
                    </div>
                    <Select className="basic-single" options={listsOptions} onChange={handleList} placeholder="Select list..." />
                    <div className="numInput">
                        <input type="number" placeholder="Countdown" onChange={(e) => setSelectedCountdown(parseInt(e.target.value))} />
                    </div>
                    { eventTitle !== "" && selectedList !== "" && selectedCountdown !== 0 ?
                        <button onClick={() => {api.createTodoAction(eventTitle, selectedList, webhook.id, selectedCountdown); window.location.reload()}}>Create</button>
                        : null
                    }
                </>
            : null
            }
            {type === "calendar" ?
                <>
                    <div className="numInput">
                        <input type="text" placeholder="Event title" onChange={(e) => setCalendarTitle(e.target.value)}/>
                    </div>
                    <div className="numInput">
                        <input type="number" placeholder="Countdown" onChange={(e) => setSelectedCountdown(parseInt(e.target.value))} />
                    </div>
                    { calendarTitle !== "" && selectedCountdown !== 0 ?
                        <button onClick={() => {api.createCalendarAction(calendarTitle, webhook.id, selectedCountdown); window.location.reload()}}>Create</button>
                        : null
                    }
                </>
            : null
            }
        </div>
    )
}

export default MicrosoftActionCreation