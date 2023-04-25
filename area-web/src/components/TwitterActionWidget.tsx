import { ActionInterface } from "../interfaces/action.interface";
import { ProfileInterface } from "../interfaces/profile.interface";
import { useState, useEffect } from "react";
import { IoTrash } from "react-icons/io5";
import api from "../api/api";

const TwitterActionWidget = ({ profile, action }: {profile: any, action: ActionInterface}) => {
    return (
        <div className='Event-body-actions'>
            <img src="logo/logo_twitter.svg" alt="Twitter" />
            <span>{action.data}</span>
            <button className="remove" onClick={() => {api.deleteAction(action.id); window.location.reload()}}><IoTrash /></button>
        </div>
    )
}

export default TwitterActionWidget