import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RecruiterLoginForm, AdminLoginForm, HodLogin } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const RecruiterLogin = ({ navigation }) => {

  const [email, setEmail] = useState('');
  const [email1, setEmail1] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [showHelper, setShowHelper] = useState(false);
  const [msg, setMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const Streams = ['Department of Computer Science', 'Department of Commerce', 'Department of Arts', 'Department of Science'];

  const getData = async (id, val, name) => {
    await AsyncStorage.multiSet([[id, val], ['user_type', name]]);
  };
  const getData1 = async (id, val, name, department) => {
    await AsyncStorage.multiSet([[id, val], ['user_type', name], ['department', department]]);
  };

  const handleClick = () => {

    if (email == 'admin') {
      if (!password || password.length === 0 || email1.length === 0 || !email1) {
        setShowHelper(true);
        setMsg('All fields are required'); return;
      }
      let reqbody = {
        email: email1,
        password
      }
      AdminLoginForm(reqbody).then((res) => {
        if (res.status) {
          setIsLoading(false);
          setShowHelper(false);
          getData('admin_id', res.data.admin_id, 'admin').then(() => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'IndexDashboard' }]
            })
            navigation.navigate('IndexDashboard', { screen: "Dashboard" })
          })
        } else {
          setShowHelper(true);
          setMsg(res.data.message);
          setIsLoading(false);
        }
      }).catch((err) => {
        console.log("it failed", err);
        setIsLoading(false);
        setShowHelper(true);
        setMsg(err.message);
      })
    } else {
      if (!password || password.length === 0 || email.length === 0 || !email) {
        setShowHelper(true);
        setMsg('All fields are required');
        return;
      } else if (password && password.length < 8) {
        setShowHelper(true);
        setMsg('Password must be at least 8 characters');
        return;
      } else {
        setShowHelper(false);
        setIsLoading(true);
        let reqbody = {
          email,
          password
        }
        //student login
        RecruiterLoginForm(reqbody).then((res) => {
          console.log("its response", res);
          if (res.status) {
            setIsLoading(false);
            setShowHelper(false);
            getData('recruiter_id', res.data.recruiter_id, 'recruiter').then(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'IndexRecruiter' }]
              })
              navigation.navigate('IndexRecruiter');
            })
          } else {
            setShowHelper(true);
            setMsg(res.data.message);
            setIsLoading(false);
          }
        }).catch((err) => {
          console.log("it failed", err);
          setIsLoading(false);
          setShowHelper(true);
          setMsg(err);
        })
        //
      }
    }
  }

  const handleLogin = () => {
    if (!password || password.length === 0 || email1.length === 0 || !email1) {
      setShowHelper(true);
      setMsg('All fields are required'); return;
    }
    let reqbody = {
      department: email1,
      password
    }
    HodLogin(reqbody).then((res) => {
      if (res.status) {
        setIsLoading(false);
        setShowHelper(false);
        getData1('hod_id', res.data.hod_id, 'hod', res.data.department).then(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Subjects' }]
          })
          navigation.navigate('Subjects')
        })
      } else {
        setShowHelper(true);
        setMsg(res.data.message);
        setIsLoading(false);
      }
    }).catch((err) => {
      //console.log("it failed", err);
      setIsLoading(false);
      setShowHelper(true);
      setMsg(err.message);
    })
  }

  return (
    <ScrollView >
      <View style={styles.container}>
        <Text style={{
          color: '#407BFF',
          fontWeight: 'bold',
          fontSize: 24,
          textAlign: 'center'
        }}>Welcome Back!</Text>
        <Text style={{
          color: 'gray',
          fontWeight: 'bold',
          fontSize: 18,
        }}>Please sign in to continue.</Text>
        <Image
          source={require('../assets/achieve.png')}
          style={{ width: '100%', height: 400 }}
        />
        <KeyboardAvoidingView >
          {email != 'hod' ? <View>
          <TextInput
            placeholder="Email"
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
            onChangeText={(e) => setEmail(e)}
            value={email}
            keyboardType="default"
          />{email && email == 'admin' &&
            <TextInput
              placeholder="Email"
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
              onChangeText={(e) => setEmail1(e)}
              value={email1}
              keyboardType="default"
            />
          }
          <View style={{
            backgroundColor: '#e5e5e5',
            height: 50,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            margin: 10,
            padding: 5,
            borderRadius: 25,
          }}>
            <TextInput
              placeholder='Password'
              style={{
                height: 50,
                borderColor: 'transparent',
                borderWidth: 1,
                width: 300,
                padding: 10,
                backgroundColor: '#e5e5e5',
                fontSize: 16,
                borderRadius: 25,
              }}
              secureTextEntry={visible ? false : true}
              onChangeText={(e) => setPassword(e)}
              value={password}
              keyboardType="default"
            />
            <Icon name={visible ? "eye" : "eye-slash"} color="gray" size={26} onPress={() => setVisible(!visible)} />
          </View>
          {showHelper && <Text style={{ color: 'red', margin: 10 }}><Icon name="info-circle" size={14} color='red' />  {msg}</Text>}
          {isLoading ? <ActivityIndicator color='#407BFF' size="small" /> :
            <TouchableOpacity style={styles.btn} onPress={() => handleClick()}><Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }} >Log In</Text></TouchableOpacity>
            }
          </View> :
            <View>
              <TextInput
                placeholder="Email"
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
                onChangeText={(e) => setEmail(e)}
                value={email}
                keyboardType="default"
              />
              <View style={{
                height: 50,
                borderColor: 'transparent',
                borderWidth: 1,
                width: 350,
                borderRadius: 25,
                backgroundColor: '#e5e5e5',
                margin: 10,
                fontSize: 16
              }}>
                <Picker
                  selectedValue={email1}
                  onValueChange={(itemValue) => {
                    setEmail1(itemValue)
                  }
                  }>
                  {Streams.map((item) => <Picker.Item key={item} label={item} value={item} />)}
                </Picker>
              </View>
              <View style={{
                backgroundColor: '#e5e5e5',
                height: 50,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 10,
                padding: 5,
                borderRadius: 25,
              }}>
                <TextInput
                  placeholder='Password'
                  style={{
                    height: 50,
                    borderColor: 'transparent',
                    borderWidth: 1,
                    width: 300,
                    padding: 10,
                    backgroundColor: '#e5e5e5',
                    fontSize: 16,
                    borderRadius: 25,
                  }}
                  secureTextEntry={visible ? false : true}
                  onChangeText={(e) => setPassword(e)}
                  value={password}
                  keyboardType="default"
                />
                <Icon name={visible ? "eye" : "eye-slash"} color="gray" size={26} onPress={() => setVisible(!visible)} />
              </View>
              {showHelper && <Text style={{ color: 'red', margin: 10 }}><Icon name="info-circle" size={14} color='red' />  {msg}</Text>}
              {isLoading ? <ActivityIndicator color='#407BFF' size="small" /> :
                <TouchableOpacity style={styles.btn} onPress={() => handleLogin()}><Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }} >Log In</Text></TouchableOpacity>
              }
          </View>
          }
        </KeyboardAvoidingView>
        {(email !== 'admin' || email != 'hod') && <Text style={{
          color: '#407BFF',
          fontWeight: 'bold',
          fontSize: 16,
          margin: 10
        }} onPress={() => {
          navigation.navigate('ForgotPassword', { type: 'recruiter' })
        }}>Forgot Password?</Text>
        }
        <Text style={{
          color: 'gray',
          fontSize: 16,
          margin: 10
        }}>Don't have an account? <Text style={{ color: '#407BFF', fontWeight: 'bold' }} onPress={() => navigation.navigate('RecruiterRegister')}>Signup</Text></Text>
      </View>
    </ScrollView>
  )
}

export default RecruiterLogin

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
    width: '100%',
  },
  btn: {
    width: 350,
    height: 50,
    backgroundColor: '#407BFF',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 25
  }
})