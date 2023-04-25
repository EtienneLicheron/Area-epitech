import { useEffect, useState } from 'react';
import Select from 'react-select';
import api from '../api/api';

const MicrosoftEventCreation = () => {
    const [services, setServices] = useState<any>([]);
    const [serviceEvents, setServiceEvents] = useState<any>([]);
    const [serviceEventOptions, setServiceEventOptions] = useState<any>([]);
    const [serviceOptions, setServiceOptions] = useState<any>([]);
    
    const [selectedService, setSelectedService] = useState<string>("");
    const [selectedEvent, setSelectedEvent] = useState<string>("");

    useEffect(() => {
        api.getMicrosoftServices().then((res) => {
            setServices(res.data);
        });
    }, []);

    useEffect(() => {
        setServiceOptions(services.map((service: any) => {
            return {
                value: service.title,
                label: service.title
            }
        }));
    }, [services]);

    useEffect(() => {
        if (selectedService) {
            services.forEach((service: any) => {
                if (service.title === selectedService) {
                    service.events.forEach((event: any) => {
                        setServiceEvents((prev: any) => [...prev, event]);
                    });
                }
            });
        }
    }, [selectedService, services]);

    useEffect(() => {
        setServiceEventOptions(serviceEvents.map((event: any) => {
            return {
                value: event,
                label: event
            }
        }));
    }, [serviceEvents]);

    const handleSelectedService = (e: any) => {
        if (e.value !== selectedService && selectedService !== "")
            setServiceEvents([]);
        setSelectedService(e.value);
    }

    return (
        <>
            <Select className="basic-single" onChange={handleSelectedService} classNamePrefix="select" placeholder="Select a service..." name="color" options={serviceOptions} />
            { selectedService ?
                <Select className="basic-single" onChange={(e: any) => setSelectedEvent(e.value)} classNamePrefix="select" placeholder="Select an event..." name="color" options={serviceEventOptions} />
                : null
            }
            { selectedEvent ? 
                <button onClick={() => {api.createMicrosoftWebhook(selectedService, selectedEvent); window.location.reload()}}>Create event</button>
            : null }
        </>
    );
}

export default MicrosoftEventCreation;