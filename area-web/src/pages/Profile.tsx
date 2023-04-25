import { useState, useEffect } from "react";
import { ProfileInterface } from "../interfaces/profile.interface";
import api from "../api/api";
import '../styles/Profile.css';
import TokenInterface from "../components/TokenInterface";

const Profile = () => {
  const [profile, setProfile] = useState<ProfileInterface>();
  const [tokenInterface, setTokenInterface] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] = useState<string>("");

  const getProfile = () => {
    api.profile().then((res) => {
      if (res.state) {
        setProfile(res.data);
      }
    });
  };

  const Applications: string[] = ["Github", "Hue", "Google", "Microsoft", "Twitter"];
  const ApiTokenApp: string[] = ["Tekme"];

  useEffect(() => {
    getProfile();
  }, []);

  const disconnect = (app: string) => {
    api.applicationDisconnect(app).then((res) => {
      if (res.state) {
        getProfile();
        window.location.reload();
      }
    });
  };

  const connect = (app: string) => {
    window.location.replace(process.env.REACT_APP_API_HOST + ':' + process.env.REACT_APP_API_PORT + "/auth/" + app);
  };

  return (
    <div className="Profile">
      <div className="Profile-card">
        {profile?.username ?
          <div className="Profile-card-header">
            <div className="Profile-card-header-pic"><span>{profile?.username[0].toLocaleUpperCase()}</span></div>
            <span>{profile?.username}</span>
          </div> : null
        }
        <div className="Profile-card-body">
          {profile?.applications.map((app) => {
            return (
              <div className="Profile-card-body-app">
                <img src={"logo/logo_" + app.name.toLocaleLowerCase() + ".svg"} alt={app.name} />
                <button className="disconnect" onClick={() => disconnect(app.name)}>Disconnect</button>
              </div>
            );
          })}
          {Applications.map((app: string) => {
            if (!profile?.applications.map((app) => app.name).includes(app)) {
              return (
                <div className="Profile-card-body-app">
                  <img src={"logo/logo_" + app.toLocaleLowerCase() + ".svg"} alt={app} />
                  <button onClick={() => connect(app)}>Connect</button>
                </div>
              );
            }
            return null;
          })}
          {ApiTokenApp.map((app: string) => {
            if (!profile?.applications.map((app) => app.name).includes(app)) {
            return (
              <div className="Profile-card-body-app">
                <img src={"logo/logo_" + app.toLocaleLowerCase() + ".svg"} alt={app} />
                <button onClick={() => {setTokenInterface(true); setSelectedApplication(app)}}>Enter Token</button>
              </div>
            );
            }
          })}
        </div>
      </div>
      { tokenInterface ?
        <TokenInterface name={selectedApplication} />
        : null
      }
    </div>
  );
};

export default Profile;