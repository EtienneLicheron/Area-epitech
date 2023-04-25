import { WebhookInterface } from "../interfaces/webhook.interface"
import { useState } from "react"
import api from "../api/api"

const TwitterActionCreation = ({ webhook }: { webhook: WebhookInterface }) => {
    const [wroteText, setWroteText] = useState<string>("")
    const [selectedCountdown, setSelectedCountdown] = useState<number>(0)

    return (
        <div className="twitterCreation">
            <div className="numInput">
                <input type="text" onChange={(e) => setWroteText(e.target.value)} placeholder="Tweet" />
            </div>
            <div className="numInput">
                <input type="number" placeholder="Countdown" onChange={(e) => setSelectedCountdown(parseInt(e.target.value))} />
            </div>
            { selectedCountdown > 0 && wroteText !== ""
                ? <button onClick={() => {api.createTwitterAction(wroteText, webhook.id, selectedCountdown); window.location.reload()}}>Create</button>
                : null
            }
        </div>
    )
}

export default TwitterActionCreation