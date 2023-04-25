import api from "../api/api"
import Select from 'react-select'
import { useState, useEffect } from 'react'
import { WebhookInterface } from "../interfaces/webhook.interface"

const HueActionCreation = ({webhook}: {webhook: WebhookInterface}) => {

  const [type, setType] = useState<string>("")
  const [lights, setLights] = useState<[{name: string, external: string}]>()
  const [scenes, setScenes] = useState<[{name: string, external: string}]>()
  const [selectedLight, setSelectedLight] = useState<{name: string, external: string}>({name: "", external: ""})
  const [selectedScene, setSelectedScene] = useState<{name: string, external: string}>({name: "", external: ""})
  const [selectedAction, setSelectedAction] = useState<string>("")
  const [selectedCountdown, setSelectedCountdown] = useState<number>(0)
  const [scene, setScene] = useState<string[]>([])
  const [light, setLight] = useState<string[]>([])

  const typeOptions = [
    { value: 'scene', label: 'Scene' },
    { value: 'light', label: 'Light' }
  ]

  const actionOptions = [
    { value: 'on', label: 'On' },
    { value: 'off', label: 'Off' }
  ]

  const handleType = (e: any) => {
    setType(e.value)
  }

  const getHueScenes = () => {
    api.getHueScenes().then((res) => {
      setScenes(res.data[0])
    })
  }

  const getHueLights = () => {
    api.getHueLights().then((res) => {
      setLights(res.data[0])
    })
  }

  useEffect(() => {
    if (type === "scene") {
      getHueScenes()
    } else if (type === "light") {
      getHueLights()
    }
  }, [type])

  const lightOptions = lights?.map((light: any) => {
    return { value: light.name, label: light.name }
  })

  const sceneOptions = scenes?.map((scene: any) => {
    return { value: scene.name, label: scene.name }
  })

  const handleLight = (e: any) => {
    setSelectedLight(lights?.find((light: any) => light.name === e.value)!)
  }

  const handleScene = (e: any) => {
    setSelectedScene(scenes?.find((scene: any) => scene.name === e.value)!)
  }

  const handleAction = (e: any) => {
    setSelectedAction(e.value)
  }

  const createAction = () => {
    console.log(type, selectedAction, selectedScene.external, webhook.id, selectedCountdown)
    if (type === "scene")
      api.createHueAction(type, selectedAction, selectedScene?.external, webhook.id, selectedCountdown).then((res) => {
        if (res.state) {
          window.location.reload()
        }
    })
    else if (type === "light")
      api.createHueAction(type, selectedAction, selectedLight?.external, webhook.id, selectedCountdown).then((res) => {
        if (res.state) {
          window.location.reload()
        }
    })
  }

  return (
    <div className="hueCreation">
      <Select className="basic-single" onChange={handleType} classNamePrefix="select" placeholder="Scene or Light" name="color" options={typeOptions} />
      {type === "scene" ?
        <Select className="basic-single" onChange={handleScene} classNamePrefix="select" placeholder="Select a scene..." name="color" options={sceneOptions} />
        : null
      }
      {type ===  "light" ?
        <Select className="basic-single" onChange={handleLight} classNamePrefix="select" placeholder="Select a light..." name="color" options={lightOptions} />
        : null
      }
      {selectedLight.name !== "" || selectedScene.name !== "" ?
        <Select className="basic-single" onChange={handleAction} classNamePrefix="select" placeholder="Select an action" name="color" options={actionOptions} />
        : null
      }
      {selectedAction ?
        <div className="numInput">
          <input type="number" placeholder="Countdown" onChange={(e) => setSelectedCountdown(parseInt(e.target.value))} />
        </div>
        : null
      }
      {selectedCountdown ?
        <button onClick={() => createAction()}>Create</button>
        : null
      }
    </div>
  )
}

export default HueActionCreation