import { WebhookInterface } from "../interfaces/webhook.interface";
import { useState, useEffect } from "react";
import Select from "react-select";
import api from "../api/api";

const TekmeActionCreation = ({ webhook }: { webhook: WebhookInterface }) => {
  const [avaibleDoors, setAvaibleDoors] = useState<string[]>([]);
  const [selectedDoor, setSelectedDoor] = useState<string>("");
  const [selectedCountdown, setSelectedCountdown] = useState<number>(0);
  const options: any = [];

  const getAvaibleDoors = () => {
    api.getTekmeDoors().then((res) => {
      if (res.state) {
        setAvaibleDoors(res.data[0]);
      }
    });
  };

  const handleDoor = (e: any) => {
    setSelectedDoor(e.value);
  };

  useEffect(() => {
    getAvaibleDoors();
  }, []);

  avaibleDoors?.map((door: string) => {
    options.push({
      value: door,
      label: door,
    });
  });

  return (
    <div className="tekmeCreation">
      <Select className="basic-single" placeholder="Select a door..."  classNamePrefix="select" options={options} onChange={handleDoor} />
        <div className="numInput">
          <input type="number" placeholder="Countdown" onChange={(e) => setSelectedCountdown(parseInt(e.target.value))} />
        </div>
        { selectedCountdown > 0 && selectedDoor !== ""
          ? <button onClick={() => {api.createTekmeAction(selectedDoor, webhook.id, selectedCountdown); window.location.reload()}}>Create</button>
          : null
        }
    </div>
  )
}

export default TekmeActionCreation