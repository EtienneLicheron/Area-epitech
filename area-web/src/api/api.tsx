import axios, { AxiosInstance } from "axios";
import { ProfileInterface } from "../interfaces/profile.interface";
import { ResultInterface } from "../interfaces/result.interface";

class Api {
  api: AxiosInstance;
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_HOST + ':' + process.env.REACT_APP_API_PORT,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
    });
  };

  register = async (username: string, email: string, password: string): Promise<ResultInterface> => {
    const res: ResultInterface = await this.api.post('/auth/register', {
      username: username,
      email: email,
      password: password,
    }, { withCredentials: true })
      .then(() => {return {state: true}})
      .catch((err) => {return {state: false, data: err}});
    return res;
  }

  login = async (email: string, password: string): Promise<ResultInterface> => {
    const res: ResultInterface = await this.api.post('/auth/login', {
      email: email,
      password: password
    }, { withCredentials: true })
      .then(() => {return {state: true}})
      .catch((err) => {return {state: false, data: err}});
    return res;
  }

  profile = async (): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.get<ProfileInterface>('/', {
      withCredentials: true,
    })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  deleteWebhook = async (id: number): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.delete('/webhooks/' + id, {
      withCredentials: true,
    })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  deleteAction = async (id: number): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.delete('/actions/' + id, {
      withCredentials: true,
    })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  getGithubRepositories = async (): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.get('/webhooks/github/repositories', {
      withCredentials: true,
    })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  getGithubWebhooks = async (repository: string): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.get('/webhooks/github/events/' + repository, {
      withCredentials: true,
    })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  createGithubWebhook = async (repository: string, event: string) => {
    const res: ResultInterface | null = await this.api.post('/webhooks/github', {
      repository: repository,
      event: event,
    }, { withCredentials: true })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  applicationDisconnect = async (application: string) => {
    const res: ResultInterface | null = await this.api.delete('/application/' + application, {
      withCredentials: true,
    })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  getHueScenes = async (): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.get('/actions/hue/scenes', {
      withCredentials: true,
    })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  getHueLights = async (): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.get('/actions/hue/lights', {
      withCredentials: true,
    })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  createHueAction = async (type: string, action: string, external: string, webhook: number, countdown: number): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.post('/actions/hue', {
      type: type,
      action: action,
      external: external,
      webhook: webhook,
      countdown: countdown,
    }, { withCredentials: true })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  createTwitterAction = async (message: string, webhook: number, countdown: number): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.post('/actions/twitter', {
      message: message,
      webhook: webhook,
      countdown: countdown,
    }, { withCredentials: true })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  linkTekme = async (token: string): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.post('/applications/tekme', {
      token: token,
    }, { withCredentials: true })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  getTekmeDoors = async (): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.get('/actions/tekme/doors', {
      withCredentials: true,
    })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  createTekmeAction = async (door: string, webhook: number, countdown: number): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.post('/actions/tekme', {
      door: door,
      webhook: webhook,
      countdown: countdown,
    }, { withCredentials: true })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  createGmailAction = async (destination: string, subject:string, message: string, webhook: number, countdown: number): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.post('/actions/gmail', {
      destination: destination,
      subject: subject,
      message: message,
      webhook: webhook,
      countdown: countdown,
    }, { withCredentials: true })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  createAgendaAction = async (title: string, webhook: number, countdown: number): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.post('/actions/agenda', {
      title: title,
      webhook: webhook,
      countdown: countdown,
    }, { withCredentials: true })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  getTodoLists = async (): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.get('/actions/todo/lists', {
      withCredentials: true,
    })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  createTodoAction = async (task: string, external: string, webhook: number, countdown: number): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.post('/actions/todo', {
      task: task,
      external: external,
      webhook: webhook,
      countdown: countdown,
    }, { withCredentials: true })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  createCalendarAction = async (title: string, webhook: number, countdown: number): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.post('/actions/calendar', {
      title: title,
      webhook: webhook,
      countdown: countdown,
    }, { withCredentials: true })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  createOutlookAction = async (destination: string, subject:string, message: string, webhook: number, countdown: number): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.post('/actions/outlook', {
      destination: destination,
      subject: subject,
      message: message,
      webhook: webhook,
      countdown: countdown,
    }, { withCredentials: true })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  getMicrosoftServices = async (): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.get('/webhooks/microsoft/services', {
      withCredentials: true,
    })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }

  createMicrosoftWebhook = async (service: string, event: string): Promise<ResultInterface> => {
    const res: ResultInterface | null = await this.api.post('/webhooks/microsoft', {
      service: service,
      event: event,
    }, { withCredentials: true })
      .then((res) => {return {state: true, data: res.data}})
      .catch(() => {return {state: false}});
    return res;
  }
}

const api = new Api();
export default api;
