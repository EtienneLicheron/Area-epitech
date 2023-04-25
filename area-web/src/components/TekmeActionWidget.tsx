import { ActionInterface } from "../interfaces/action.interface"
import { IoTrash } from "react-icons/io5"
import api from "../api/api"

const TekmeActionWidget = ({ profile, action }: { profile: any, action: ActionInterface }) => {
    return (
        <div className='Event-body-actions'>
            <img src="logo/logo_tekme.svg" alt="Tekme" />
            <span>Open {action.data}</span>
            <button className="remove" onClick={() => {api.deleteAction(action.id); window.location.reload()}}><IoTrash /></button>
        </div>
    )
}

export default TekmeActionWidget