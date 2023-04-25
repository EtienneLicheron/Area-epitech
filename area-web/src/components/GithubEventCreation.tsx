import { useState, useEffect } from 'react';
import Select from "react-select";
import { toast } from 'react-toastify';
import api from "../api/api";

const GithubEventCreation = () => {
  const [repoOptions, setRepoOptions] = useState<any>([]);
  const [eventOptions, setEventOptions] = useState<any>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  useEffect(() => {
    api.getGithubRepositories().then((res) => {
      setRepoOptions(res.data[0].map((repo: string) => {
        return {
          value: repo,
          label: repo
        }
      }));
    });
  }, []);

  useEffect(() => {
    if (selectedRepo) {
      api.getGithubWebhooks(selectedRepo).then((res) => {
        setEventOptions(res.data[0].map((event: any) => {
          return {
            value: event.event,
            label: event.title
          }
        }));
      });
    }
  }, [selectedRepo]);

  const handleRepo = (e: any) => {
    setSelectedRepo(e.value);
  }

  const handleEvent = (e: any) => {
    setSelectedEvent(e.value);
  }

  const createGithub = () => {
    api.createGithubWebhook(selectedRepo, selectedEvent).then((res) => {
      if (res.state) {
        window.location.reload();
        toast.success('Webhook created !');
      } else {
        toast.error('Error while creating webhook');
      }
    });
  }

  return (
    <>
      <Select className="basic-single" onChange={handleRepo} classNamePrefix="select" placeholder="Select a repo..." name="color" options={repoOptions} />
      {selectedRepo ? <Select className="basic-single" onChange={handleEvent} classNamePrefix="select" placeholder="Select an event..." name="color" options={eventOptions} /> : null}
      {selectedEvent ? <button onClick={createGithub}>Create event</button> : null}
    </>
  )
}

export default GithubEventCreation;