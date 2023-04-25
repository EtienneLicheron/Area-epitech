import React from 'react';

import { Alert } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { showMessage } from 'react-native-flash-message';
import Button from '../../../../component/Button';
import getColorScheme from '../../../../component/ColorsMode';
import api from '../../../../lib/api/api';

const reactionTekme = {
    name: 'TekMe',
    reaction: [
        {
            type: 'door',
            actions: [
                'HUB',
                'Foyer',
                'Meetup',
                'SM1',
                'SM2',
                'Stream',
                'Admissions',
            ]
        },
    ]
}

interface Props {
    token: string;
    webhookId: number;
    close: () => void;
}

export default function ReactionTekme(props: Props) {
    const color = getColorScheme()

    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [items, setItems] = React.useState<ItemType<any>[]>([]);

    React.useEffect(() => {
        const tmp: { label: string; value: string; parent?: string }[] = [];

        reactionTekme.reaction.forEach((reactionApp, index) => {
            reactionApp.actions.forEach((action) => {
                console.log(action)
                tmp.push({
                    label: action,
                    value: action + '|' + index,
                })
            })
        });
        setItems(tmp);
        }, []);


    return (
        <>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                listMode='MODAL'
                placeholder="Select door to open"
                style={{marginTop: 5}}
                theme={color.is ? 'DARK' : 'LIGHT'}
                zIndex={9000}
            />
            <Button title='Add reaction' onPress={async () => {
                if (value === null) {
                    Alert.alert('Error', 'Please select a door to open');
                } else {
                    const res = await api.actionTekme(props.token, String(value).split('|')[0], props.webhookId);
                    props.close();
                    if (res.status === 201) {
                        showMessage({
                            message: 'Reaction added',
                            type: 'success',
                            icon: 'success',
                        });
                    } else {
                        showMessage({
                            message: 'Error',
                            type: 'danger',
                            icon: 'danger',
                        });
                    }
                }
            }} />
        </>
    )
}