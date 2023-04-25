import { ActionInterface } from "../interfaces/action.interface"
import { ProfileInterface } from "../interfaces/profile.interface"
import { useState, useEffect } from "react"
import { IoTrash } from "react-icons/io5"
import api from "../api/api"

const HueActionWidget = ({profile, action} : {profile: any, action: ActionInterface}) => {

    const [lights, setLights] = useState<any>([])
    const [scenes, setScenes] = useState<any>([])

    const getHueScenes = () => {
        api.getHueScenes().then((res) => {
            setScenes(res.data[0])
        })
    }

    const getHueLights = () => {
        api.getHueLights().then((res) => {
            if (res.state) {
                setLights(res.data[0])
            }
        })
    }


    const getLightName = (id: string) => {
        const light = lights?.find((light: any) => light?.external === id)
        return light?.name
    }

    const getSceneName = (id: string) => {
        const scene = scenes?.find((scene: any) => scene?.external === id)
        return scene?.name
    }

    useEffect(() => {
        getHueLights()
        getHueScenes()
    }, [])

    return (
        <div className='Event-body-actions'>
            <img src="logo/logo_hue.svg" alt="Hue" />
            { JSON.parse(action.data).type === "scene" ?
                <span>{getSceneName(JSON.parse(action.data).external)}</span>
                : null
            }
            { JSON.parse(action.data).type === "light" ?
                <span>{getLightName(JSON.parse(action.data).external)}</span>
                : null
            }
            { JSON.parse(action.data).action === "on" ?
                <span className="badge-on">On</span>
                : null
            }
            { JSON.parse(action.data).action === "off" ?
                <span className="badge-off">Off</span>
                : null
            }
            <button className="remove" onClick={() => {api.deleteAction(action.id); window.location.reload()}}><IoTrash /></button>
        </div>
    )
}

export default HueActionWidget