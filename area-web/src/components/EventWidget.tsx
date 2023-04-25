import React, { useEffect, useState } from 'react'
import { WebhookInterface } from '../interfaces/webhook.interface'
import { ProfileInterface } from '../interfaces/profile.interface'
import { ActionInterface } from '../interfaces/action.interface'
import api from '../api/api'
import Select from 'react-select'
import HueActionCreation from './HueActionCreation'
import HueActionWidget from './HueActionWidget'
import TwitterActionCreation from './TwitterActionCreation'
import TwitterActionWidget from './TwitterActionWidget'
import TekmeActionCreation from './TekmeActionCreation'
import TekmeActionWidget from './TekmeActionWidget'
import GoogleActionCreation from './GoogleActionCreation'
import GoogleActionWidget from './GoogleActionWidget'
import MicrosoftActionCreation from './MicrosoftActionCreation'
import MicrosoftActionWidget from './MicrosoftActionWidget'
import { ApplicationInterface } from '../interfaces/application.interface'
import { GrClose } from 'react-icons/gr'

const EventWidget = ({ webhook }: { webhook: WebhookInterface }) => {
  const [actionCreation, setActionCreation] = useState(false)
  const [profile, setProfile] = useState<ProfileInterface>()
  const [applicationOptions, setApplicationOptions] = useState<any>([])
  const [selectedApplication, setSelectedApplication] = useState<string>("")
  const [actions, setActions] = useState<ActionInterface[]>([])

  const application = ["Hue", "Twitter", "Microsoft", "Tekme", "Google"]

  const getProfile = () => {
    api.profile().then((res) => {
      if (res.state) {
        setProfile(res.data);
      }
    });
  };

  useEffect(() => {
    getProfile();
  }, []);

  const getApplicationOptions = (): any => {
    const options: any = [];
    profile?.applications.map((app: any) => {
      if (application.includes(app.name)) {
        options.push({
          value: app.name,
          label: app.name,
        });
      }
    });
    return options;
  };

  useEffect(() => {
    setApplicationOptions(getApplicationOptions())
  }, [profile])

  const handleApplication = (e: any) => {
    setSelectedApplication(e.value);
  }

  const getActions = () => {
    setActions(webhook.actions)
  }

  const getApplicationName = (id: number): string => {
    let name = ""
    profile?.applications.map((app: ApplicationInterface) => {
      app.actions.map((action: ActionInterface) => {
        if (action.id === id) {
          name = app.name
        }
      }
      )
    })
    return name
  }

  const deleteWebhook = () => {
    api.deleteWebhook(webhook.id).then((res) => {
      if (res.state) {
        window.location.reload()
      }
    })
  }

  useEffect(() => {
    getActions()
  }, [webhook])

  const getApplicationFromWebhookId = (id: number): string => {
    let name = ""
    profile?.applications.map((app: ApplicationInterface) => {
      app.webhooks.map((webhook: WebhookInterface) => {
        if (webhook.id === id) {
          name = app.name
        }
      }
      )
    })
    return name
  }

  console.log(getApplicationFromWebhookId(webhook.id));

  return (
    <div className="Event">
      <button className="closeButton" onClick={deleteWebhook}>
        <GrClose />
      </button>
      <div className="Event-header">
        {getApplicationFromWebhookId(webhook.id) === "Github" ?
          <img src="logo/logo_github.svg" alt="GitHub" />
          : null
        }
        {getApplicationFromWebhookId(webhook.id) === "Microsoft" ?
          <img src="logo/logo_microsoft.svg" alt="Microsoft" />
          : null
        }
        <div className='Event-header-title'>
          <span>{webhook.argument + " " + webhook.event}</span>
        </div>
      </div>
      <div className="Event-body">
        {actions ?
          actions.map((action: ActionInterface) => {
            if (getApplicationName(action.id) === "Hue") {
              return (
                <div className="Action">
                  <HueActionWidget profile={profile} action={action} />
                </div>
              )
            }
            if (getApplicationName(action.id) === "Twitter") {
              return (
                <div className="Action">
                  <TwitterActionWidget profile={profile} action={action} />
                </div>
              )
            }
            if (getApplicationName(action.id) === "Tekme") {
              return (
                <div className="Action">
                  <TekmeActionWidget profile={profile} action={action} />
                </div>
              )
            }
            if (getApplicationName(action.id) === "Google") {
              return (
                <div className="Action">
                  <GoogleActionWidget profile={profile} action={action} />
                </div>
              )
            }
            if (getApplicationName(action.id) === "Microsoft") {
              return (
                <div className="Action">
                  <MicrosoftActionWidget profile={profile} action={action} />
                </div>
              )
            }
          })
          : null
        }
        <button className='add' onClick={() => setActionCreation(!actionCreation)}>+</button>
      </div>
      {actionCreation ?
        <div className='Action-creation-container'>
          <div className='Action-creation'>
              <button className='close' onClick={() => setActionCreation(!actionCreation)}><GrClose /></button>
            <div className='Action-creation-header'>
              <span>Choose an application</span>
            </div>
            <div className='Action-creation-body'>
              <Select className="basic-single" onChange={handleApplication} classNamePrefix="select" placeholder="Select an application..." name="color" options={applicationOptions} />
              {selectedApplication === "Hue" ?
                <HueActionCreation webhook={webhook} />
                : null
              }
              { selectedApplication === "Twitter" ?
                <TwitterActionCreation webhook={webhook} />
                : null
              }
              { selectedApplication === "Tekme" ?
                <TekmeActionCreation webhook={webhook} />
                : null
              }
              { selectedApplication === "Google" ?
                <GoogleActionCreation webhook={webhook} />
                : null
              }
              { selectedApplication === "Microsoft" ?
                <MicrosoftActionCreation webhook={webhook} />
                : null
              }
            </div>
          </div>
        </div>
        :
        null}
    </div>
  )
}

export default EventWidget