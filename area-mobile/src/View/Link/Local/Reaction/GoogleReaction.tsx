import React from 'react';
import { Alert, Text } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { showMessage } from 'react-native-flash-message';
import Button from '../../../../component/Button';
import Input from '../../../../component/Input';
import Picker from '../../../../component/Picker';
import api from '../../../../lib/api/api';

const reactionGoogle = {
    name: 'Google',
    reaction: [
        {
            type: 'gmail',
            actions: [
                'send email',
            ]
        },
        {
            type: 'calendar',
            actions: [
                'create event',
            ]
        },
    ]
}

interface Props {
    token: string;
    webhookId: number;
    close: () => void;
}

export default function ReactionGoogle(props: Props) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState<string>('');
    const [items, setItems] = React.useState<ItemType<any>[]>([]);
    
    const [to, setTo] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [body, setBody] = React.useState('');

    const [calendarTitle, setCalendarTitle] = React.useState('');

    React.useEffect(() => {
        const tmp: { label: string; value: string; parent?: string }[] = [];

        reactionGoogle.reaction.forEach((reactionType, index) => {
            tmp.push({
                label: reactionType.type,
                value: reactionType.type + '|' + index,
            })
        });
        setItems(tmp);
    }, []);

    const gmail = () => {
        return (
            <>
                <Input value={to} onChangeText={setTo} placeholder="To" style={{ minWidth: '90%' }} />
                <Input value={subject} onChangeText={setSubject} placeholder="Subject" style={{ minWidth: '90%' }} />
                <Input value={body} onChangeText={setBody} placeholder="Body" style={{ minWidth: '90%' }} />
            </>
        )
    }

    const calendar = () => {
        return (
            <>
                <Input value={calendarTitle} onChangeText={setCalendarTitle} placeholder="Title" style={{ minWidth: '90%' }} />
            </>
        )
    }

    const renderAction = () => {
        if (value === 'gmail|0') {
            return gmail()
        } else if (value === 'calendar|1') {
            return calendar()
        }
    }

    return (
        <>
            <Picker 
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select a reaction"
                style={{ marginTop: 5 }}
            />
            {renderAction()}
            <Button title="Add" onPress={async () => {
                if (value === 'gmail|0') {
                    if (to === '' || subject === '' || body === '') {
                        Alert.alert('Error', 'Please fill all fields');
                        return;
                    }
                    const res = await api.actionGmail(props.token, to, subject, body, props.webhookId);
                    props.close();
                    if (res.status === 201) {
                        showMessage({
                            message: 'Reaction added',
                            type: 'success',
                            icon: 'success',
                        })
                    } else {
                        showMessage({
                            message: 'Error',
                            type: 'danger',
                            icon: 'danger',
                        })
                    }
                } else if (value === 'calendar|1') {
                    if (calendarTitle === '') {
                        Alert.alert('Error', 'Please fill all fields');
                        return;
                    }
                    const res = await api.actionGoogleAgenda(props.token, calendarTitle, props.webhookId);
                    props.close();
                    if (res.status === 201) {
                        showMessage({
                            message: 'Reaction added',
                            type: 'success',
                            icon: 'success',
                        })
                    } else {
                        showMessage({
                            message: 'Error',
                            type: 'danger',
                            icon: 'danger',
                        })
                    }
                }
            }} />
        </>
    );
}