import React from 'react';
import { Alert, View } from 'react-native';
import DropDownPicker, { ItemType } from 'react-native-dropdown-picker';
import { showMessage } from 'react-native-flash-message';
import { Text } from 'react-native-svg';
import Button from '../../../../component/Button';
import getColorScheme from '../../../../component/ColorsMode';
import Input from '../../../../component/Input';
import api from '../../../../lib/api/api';

const reactionMicrosoft = {
    name: 'Microsoft',
    reaction: [
        {
            type: 'outlook',
            actions: [
                'send email',
            ]
        },
        {
            type: 'todo',
            actions: [
                'create task',
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

export default function ReactionMicrosoft(props: Props) {
    const color = getColorScheme()
    
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(null);
    const [items, setItems] = React.useState<ItemType<any>[]>([]);

    const [to, setTo] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [body, setBody] = React.useState('');

    const [openTodo, setOpenTodo] = React.useState(false);
    const [valueTodo, setValueTodo] = React.useState(null);
    const [itemsTodo, setItemsTodo] = React.useState<ItemType<any>[]>([]);
    const [titleTodo, setTitleTodo] = React.useState('');

    const [calendarTitle, setCalendarTitle] = React.useState('');


    React.useEffect(() => {
        const getTodo = async () => {
            const res = await api.getTodoLists(props.token);
            return res;
        }

        const tmp: { label: string; value: string; parent?: string }[] = [];

        reactionMicrosoft.reaction.forEach((reactionApp, index) => {
            tmp.push({
                label: reactionApp.type,
                value: reactionApp.type + '|' + index,
            })
        });

        setItems(tmp);

        getTodo().then((res) => {
            const tmpTodo: { label: string; value: string; parent?: string }[] = [];
            console.log(res);
            res[0].forEach((todo: any) => {
                tmpTodo.push({
                    label: todo.name,
                    value: todo.external,
                })
            })
            setItemsTodo(tmpTodo);
        })

        
    }, []);

    const outlook = () => {
        return (
            <>
                <Input value={to} onChangeText={setTo} placeholder="To..." style={{minWidth: '90%'}} />
                <Input value={subject} onChangeText={setSubject} placeholder="Subject..." style={{minWidth: '90%'}} />
                <Input value={body} onChangeText={setBody} placeholder="Body..." style={{minWidth: '90%'}} multiline={true} />
            </>
        )
    }

    const todo = () => {
        return (
            <>
                <DropDownPicker
                    open={openTodo}
                    value={valueTodo}
                    items={itemsTodo}
                    setOpen={setOpenTodo}
                    setValue={setValueTodo}
                    setItems={setItemsTodo}
                    placeholder="Select a todo list"
                    listMode='MODAL'
                    style={{marginTop: 5}}
                    theme={color.is ? 'DARK' : 'LIGHT'}
                    zIndex={8000}
                />
                <Input value={titleTodo} onChangeText={setTitleTodo} placeholder="Title..." style={{minWidth: '90%'}} />
            </>
        )
    }

    const calendar = () => {
        return (
            <>
                <Input value={calendarTitle} onChangeText={setCalendarTitle} placeholder="Title..." style={{minWidth: '90%'}} />
            </>
        )
    }

    const renderFromType = () => {
        if (value === 'outlook|0') {
            return outlook();
        } else if (value === 'todo|1') {
            return todo();
        } else if (value === 'calendar|2') {
            return calendar();
        } 
    }
        

    return (
        <>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select an action"
                listMode='MODAL'
                style={{marginTop: 5}}
                theme={color.is ? 'DARK' : 'LIGHT'}
                zIndex={9000}
            />
            {renderFromType()}
            <Button title="Add" onPress={async() => {
                if (value === 'outlook|0') {
                    if (to === '' || subject === '' || body === '') {
                        Alert.alert('Error', 'Please fill all fields');
                        return;
                    }
                    const res = await api.actionOutlook(props.token, to, subject, body, props.webhookId)
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
                } else if (value === 'todo|1') {
                    if (titleTodo === '' || valueTodo === null) {
                        Alert.alert('Error', 'Please fill all fields');
                        return;
                    }
                    const res = await api.actionTodo(props.token, titleTodo, String(valueTodo), props.webhookId)
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
                } else if (value === 'calendar|2') {
                    if (calendarTitle === '') {
                        Alert.alert('Error', 'Please fill all fields');
                        return;
                    }
                    const res = await api.actionCalendar(props.token, calendarTitle, props.webhookId)
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
    )
}