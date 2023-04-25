import React from 'react'
import { Alert } from 'react-native'

import { showMessage } from 'react-native-flash-message'
import Button from '../../../../component/Button';
import getColorScheme from '../../../../component/ColorsMode';
import Input from '../../../../component/Input';
import api from '../../../../lib/api/api';

interface Props {
    token: string;
    webhookId: number;
    close: () => void;
}

export default function ReactionTwitter(props: Props) {    
    const [tweet, setTweet] = React.useState<string>('')
    return (
        <>
            <Input placeholder="Type your tweet here..." value={tweet} onChangeText={setTweet} />
            <Button title="Add reaction" onPress={async () => {
                if (tweet === '') {
                    Alert.alert('Error', 'Please fill all fields')
                } else {
                    const res = await api.actionTwitter(props.token, tweet, props.webhookId)
                    props.close()
                    if (res.status === 201) {
                        showMessage({
                            message: 'Reaction added',
                            type: 'success',
                        })
                    } else {
                        showMessage({
                            message: `Error: ${res.data.message}`,
                            type: 'danger',
                        })
                    }
                }
            }} />
        </>
    )
}