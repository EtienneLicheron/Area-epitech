import {useState} from "react"
import api from "../api/api"

const TokenInterface = ({name} : {name: string}) => {
    const [token, setToken] = useState<string>("")

    return (
        <div className="TokenInterface-container">
            <div className="TokenInterface">
                <input type="text" placeholder="Enter API token..." onChange={(e) => setToken(e.target.value)}/>
                {token 
                    ? <button onClick={() => {api.linkTekme(token); window.location.reload()}}>Submit</button>
                    : <button disabled>Submit</button>
                }
            </div>
        </div>
    )
}

export default TokenInterface