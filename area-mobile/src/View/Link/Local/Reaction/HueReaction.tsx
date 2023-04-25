import React, { Dispatch } from 'react';

import { StyleSheet, Alert } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { showMessage } from 'react-native-flash-message';
import Button from '../../../../component/Button';
import getColorScheme from '../../../../component/ColorsMode';
import api from '../../../../lib/api/api';

const reactionHue = {
    name: 'Hue',
    reaction: [
        {
            type: 'light',
            actions: ['on', 'off'],
        },
        {
            type: 'scene',
            actions: ['on', 'off'],
        },
    ]
}

interface Props {
    token: string;
    webhookId: number;
    close: () => void;
}

export default function ReactionHue(props: Props) {
    const color = getColorScheme()

    const [open1, setOpen1] = React.useState(false); // open dropdown for type
    const [open2, setOpen2] = React.useState(false); // open dropdown for action
    const [open3, setOpen3] = React.useState(false); // open dropdown for light or scene selection

    const [value1, setValue1] = React.useState(null);
    const [value2, setValue2] = React.useState(null);
    const [value3, setValue3] = React.useState(null);

    const [items1, setItems1] = React.useState<ItemType<any>[]>([]);
    const [items2, setItems2] = React.useState<ItemType<any>[]>([]);
    const [items3, setItems3] = React.useState<ItemType<any>[]>([]);

    React.useEffect(() => {
        const tmp1: { label: string; value: string; parent?: string }[] = [];
        const tmp2: { label: string; value: string; parent?: string }[] = [];

        reactionHue.reaction.forEach((reactionType, index) => {
            tmp1.push({
                label: reactionType.type,
                value: reactionType.type + '|' + index,
            });
            if (tmp2.length === 0) {
                reactionType.actions.forEach((action, index) => {
                    tmp2.push({
                        label: action,
                        value: action + '|' + index,
                    });
                })
            }
        })
        setItems1(tmp1);
        setItems2(tmp2);
    }, []);

    const onSelectType = async (value: any) => {
        if (String(value).split('|')[0] === 'light') {
            const res = await api.getHueLights(props.token);
            try {
                const items = JSON.parse(JSON.stringify(res[0], null, 2));
                const tmp: { label: string; value: string; parent?: string }[] = [];
                items.forEach((item: any) => {
                    tmp.push({
                        label: item.name,
                        value: item.external
                    });
                });
                setItems3(tmp);
            } catch (error) {
                props.close();
                showMessage({
                    message: 'Error',
                    description: 'Error while getting lights',
                    type: 'danger',
                })
            }
        } else if (String(value).split('|')[0] === 'scene') {
            const res = await api.getHueScenes(props.token);
            try {
                const items = JSON.parse(JSON.stringify(res[0], null, 2));
                const tmp: { label: string; value: string; parent?: string }[] = [];
                items.forEach((item: any) => {
                    tmp.push({
                        label: item.name,
                        value: item.external + '|' + item.name
                    });
                });
                setItems3(tmp);
            } catch (error) {
                props.close();
                showMessage({
                    message: 'Error',
                    description: 'Error while getting scenes',
                    type: 'danger',
                })
            }
        }
    }

    const openDropDown = (index: number) => {
        if (index === 1) {
            if (open1) {
                setOpen1(false);
            } else {
                setOpen2(false);
                setOpen3(false);
                setOpen1(true);
            }
        } else if (index === 2) {
            if (open2) {
                setOpen2(false);
            } else {
                setOpen1(false);
                setOpen3(false);
                setOpen2(true);
            }
        } else if (index === 3) {
            if (open3) {
                setOpen3(false);
            } else {
                setOpen1(false);
                setOpen2(false);
                setOpen3(true);
            }
        }
    }

    return (
        <>
            <DropDownPicker
                open={open1}
                value={value1}
                items={items1}
                setOpen={() => openDropDown(1)}
                setValue={setValue1}
                setItems={setItems1}
                onChangeValue={onSelectType}
                placeholder="Select a reaction type"
                listMode='MODAL'
                style={{ marginTop: 5 }}
                theme={color.is ? 'DARK' : 'LIGHT'}
                zIndex={9000}
            />
            <DropDownPicker
                open={open2}
                value={value2}
                items={items2}
                setOpen={() => openDropDown(2)}
                setValue={setValue2}
                setItems={setItems2}
                listMode='MODAL'
                placeholder="Select a reaction action"
                style={{ marginTop: 5 }}
                theme={color.is ? 'DARK' : 'LIGHT'}
                zIndex={8000}
            />
            <DropDownPicker
                open={open3}
                value={value3}
                items={items3}
                setOpen={() => openDropDown(3)}
                setValue={setValue3}
                setItems={setItems3}
                listMode='MODAL'
                placeholder="Select a light or scene"
                style={{ marginTop: 5 }}
                theme={color.is ? 'DARK' : 'LIGHT'}
                zIndex={7000}
            />
            <Button title="Add reaction" onPress={async () => {
                if (value1 === null || value2 === null || value3 === null) {
                    Alert.alert('Error', 'Please select a type, action and light or scene');
                } else {
                    const res = await api.actionHue(props.token, String(value1).split('|')[0], String(value2).split('|')[0], String(value3).split('|')[0], props.webhookId);
                    props.close()
                    if (res.status === 201) {
                        showMessage({
                            message: 'Success',
                            description: 'Reaction added',
                            type: 'success',
                        })
                    } else {
                        showMessage({
                            message: 'Error',
                            description: 'Error while adding reaction',
                            type: 'danger',
                        })
                    }
                }
            }} />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    reactionContainer: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 5,
        margin: 5,
    },
    reactionText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});