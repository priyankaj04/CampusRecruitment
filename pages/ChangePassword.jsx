import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { TalentDetailsByReg, ChangeTalentPassword } from '../api';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChangePassword = ({ navigation }) => {
    const id = 'e35147fb-b336-4858-9dc1-2438a5524a7c';
    const [oldpassword, setOldpassword] = useState('');
    const [newpassword, setNewpassword] = useState('');
    const [oldpass, setOldpass] = useState('');
    const [confirm, setConfirm] = useState('');
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showMsg, setShowMsg] = useState(false);
    const [msg, setMsg] = useState('');
    const [talentid, setTalentid] = useState('');

    useEffect(() => {
        TalentDetailsByReg(id).then((res) => {
            if (res.status) {
                setTalentid(res.data[0].talent_id);
                setOldpass(res.data[0].password);
            }
            setIsLoading(false);
        })
    }, [])

    const handleClick = () => {
        if (confirm != newpassword) {
            setShowMsg(true);
            setMsg("Sorry, but the password and confirm password entries must match. Please double-check and try again.")
        } else {
            setShowMsg(false);
            setIsLoading(true);
            let reqbody = { password: oldpassword, newpassword: newpassword }
            //console.log(reqbody);
            ChangeTalentPassword(reqbody, talentid).then((res) => {
                //console.log(res);
                if (res.status) {
                    navigation.navigate('Profile');
                    setIsLoading(false);
                } else {
                    setShowMsg(true);
                    setMsg(res.data.message);
                }
                setIsLoading(false);
            })
        }
    }
    

    return (
        <ScrollView>
            <View style={{ backgroundColor: 'white', minHeight: '100%' }}>
                <View style={{
                    backgroundColor: '#407BFF',
                    alignItems: "center",
                    height: 400,
                    justifyContent: "center"
                }}>
                    <Image
                        source={require('../assets/changepassword.png')}
                        style={{
                            width: 300,
                            height: 300
                        }}
                    />
                </View>
                <KeyboardAvoidingView>
                    <View style={{ alignItems: 'center', marginTop: 20 }}>
                        <TextInput
                            placeholder="Old Password"
                            style={{
                                height: 50,
                                borderColor: 'transparent',
                                borderWidth: 1,
                                width: 350,
                                borderRadius: 25,
                                padding: 10,
                                backgroundColor: '#e5e5e5',
                                margin: 10,
                                fontSize: 16
                            }}
                            onChangeText={(e) => { setOldpassword(e) }}
                            value={oldpassword}
                            inputMode="text"
                        />
                        <View style={{
                            backgroundColor: '#e5e5e5',
                            height: 50,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: 10,
                            padding: 10,
                            borderRadius: 25,
                        }}>
                            <TextInput
                                placeholder='New password'
                                style={{
                                    height: 50,
                                    borderColor: 'transparent',
                                    borderWidth: 1,
                                    width: 300,
                                    backgroundColor: '#e5e5e5',
                                    fontSize: 16,
                                    borderRadius: 25,
                                }}
                                secureTextEntry={show ? false : true}
                                onChangeText={(e) => setNewpassword(e)}
                                value={newpassword}
                                keyboardType="default"
                            />
                            <Icon name={show ? "eye" : "eye-slash"} color="gray" size={26} onPress={() => setShow(!show)} />
                        </View>
                        <TextInput
                            placeholder="Confirm Password"
                            style={{
                                height: 50,
                                borderColor: 'transparent',
                                borderWidth: 1,
                                width: 350,
                                borderRadius: 25,
                                padding: 10,
                                backgroundColor: '#e5e5e5',
                                margin: 10,
                                fontSize: 16
                            }}
                            secureTextEntry
                            onChangeText={(e) => { setConfirm(e); }}
                            value={confirm}
                            inputMode="text"
                        />
                        {showMsg && <Text style={{ color: 'red', margin: 10, textAlign: 'left' }}><Icon name="info-circle" size={14} color='red' />  {msg}</Text>}
                        <TouchableOpacity style={styles.btn} onPress={() => handleClick()}>
                            <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </ScrollView>
    )
}

export default ChangePassword

const styles = StyleSheet.create({
    btn: {
        width: 350,
        height: 50,
        backgroundColor: '#407BFF',
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        marginTop: 0,
        borderRadius: 25,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: 'black',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 3,
        marginTop: 40
    },
})