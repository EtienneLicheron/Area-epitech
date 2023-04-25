import '../styles/Services.css';
import api from '../api/api';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import { ProfileInterface } from '../interfaces/profile.interface';
import { ApplicationInterface } from '../interfaces/application.interface';
import { WebhookInterface } from '../interfaces/webhook.interface';
import { SelectInterface } from '../interfaces/select.interface';
import { ToastContainer } from 'react-toastify';
import { GrClose } from 'react-icons/gr';
import GithubEventCreation from '../components/GithubEventCreation';
import MicrosoftEventCreation from '../components/MicrosoftEventCreation';
import EventWidget from '../components/EventWidget';

const Services = () => {
  const [profile, setProfile] = useState<ProfileInterface>();
  const [webhooks, setWebhooks] = useState<any>([]);

  const [selectedApplication, setSelectedApplication] = useState<string>("");

  const [actionCreation, setActionCreation] = useState(false);

  const eventApplications = ["Github", "Microsoft"];

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

  const getWebhook = () => {
    profile?.applications.map((app: ApplicationInterface) => {
      app.webhooks.map((webhook: any) => {
        setWebhooks((webhooks: any) => [...webhooks, webhook]);
      });
    });
  };

  useEffect(() => {
    getWebhook();
  }, [profile]);

  const getApplicationOptions = (): SelectInterface[] => {
    const options: SelectInterface[] = [];
    profile?.applications.map((app: ApplicationInterface) => {
      if (eventApplications.includes(app.name)) {
        options.push({
          value: app.name,
          label: app.name,
        });
      }
    });
    return options;
  };

  const applicationOptions = getApplicationOptions();

  const handleApplication = (e: any) => {
    setSelectedApplication(e.value);
  };

  return (
    <div className="Services">
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      <button className='Button-create-event' onClick={() => setActionCreation(!actionCreation)}>Create new event</button>
      {actionCreation ?
        <div className='Create-event-container'>
          <div className="Create-event">
            <button className='Button-close' onClick={() => setActionCreation(!actionCreation)}><GrClose /></button>
            <div className="Create-event-header">
              <h1>Create event</h1>
            </div>
            <div className="Create-event-body">
              <Select className="basic-single" onChange={handleApplication} classNamePrefix="select" placeholder="Select application..." name="color" options={applicationOptions} />
              {selectedApplication === "Github" ? <GithubEventCreation /> : null}
              {selectedApplication === "Microsoft" ? <MicrosoftEventCreation /> : null}
            </div>
          </div>
        </div>
        : null
      }
      <div className="Events">
        {webhooks ?
          webhooks.map((webhook: any) => {
            return (
              <>
                <EventWidget webhook={webhook} />
              </>
            )
          })
          : null
        }
      </div>
    </div>
  );
};

export default Services;
