import React, { Component } from 'react'
import { View, ScrollView, Text, ImageBackground, StyleSheet, TouchableHighlight, TouchableOpacity, Image, Alert } from 'react-native'
import { Input, Button, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import bgLogin from '../../assets/img/MyPet.jpg'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import firebase from 'react-native-firebase';
import { COLOR } from '../../variables/general'
import Logo from '../../assets/img/MyPets/MyPetsWhite.png'
import startIcon from '../../assets/img/MyPets/icone1.png'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { FIREBASE_DATABASE_URL } from '../../variables/firebaseConfig'
import Loader from '../../components/Loader/loader'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import LinearGradient from 'react-native-linear-gradient'
import { CirclesLoader, PulseLoader, TextLoader, DotsLoader, EatBeanLoader } from 'react-native-indicator'

class Login extends Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)

    this.state = {
      hidePassword: true,
      iconPassword: "eye",
      showIconPassword: false,
      email: '',
      password: '',
      loadingVisible: false,
      alert: null,
      startPage: false,
    }
  }

  UNSAFE_componentWillMount() {
    this.tokenVerify()
  }

  async tokenVerify() {
    try {
      const userId = await AsyncStorage.getItem('user_id')
      if (userId !== null) {
        this.props.navigation.navigate("Home", { status: "reload" })
        this.setState({ startPage: true })
      } else {
        this.setState({ startPage: true })
      }
    } catch (e) {
      console.log(e)
    }
  }

  errorAlert(title, subtitle) {
    this.setState({
      alert:
        <SCLAlert
          theme="danger"
          show={true}
          title={title}
          subtitle={subtitle}
          onRequestClose={() => console.log('danger')}
        >
          <SCLAlertButton theme="danger" onPress={() => this.hideAlert(interval)}>Ok</SCLAlertButton>
        </SCLAlert>
    })
    let interval = setTimeout(() => this.setState({ alert: null }), 2500)
  }

  hideAlert(interval) {
    this.setState({ alert: null })
    clearInterval(interval)
  }

  handleEmailChange(email) {
    this.setState({ email: email.trim() })
  }

  handlePasswordChange(password) {
    this.setState({ password })

    if (password === '')
      this.setState({ showIconPassword: false })
    else
      this.setState({ showIconPassword: true })
  }

  handleShowPassword() {
    if (this.state.hidePassword === true)
      this.setState({ iconPassword: "eye-slash" })
    else
      this.setState({ iconPassword: "eye" })

    this.setState({ hidePassword: !this.state.hidePassword })
  }

  async handleLoginClick() {
    if (this.state.email !== "" && this.state.password !== "") {
      this.setState({ loadingVisible: true })
      await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          axios.get(FIREBASE_DATABASE_URL + "/app/accounts.json")
            .then(res => {
              const data = Object.entries(res.data).map((value) => ({ [value[0]]: value[1] }))
              data.forEach(element => {
                Object.entries(element).map((value) => {
                  if (value[1].user.auth.email === this.state.email.trim()) {
                    try {
                      AsyncStorage.setItem('user_id', value[0])
                      AsyncStorage.setItem('user_info', JSON.stringify(value[1].user.info))
                      
                      if (value[1].adresses !== null && value[1].adresses !== undefined) {
                        let userAdresses = Object.entries(value[1].adresses).map((value) => ({ [value[0]]: value[1] }))
                        let adresses = []
                        if (userAdresses !== null && userAdresses !== undefined) {
                          userAdresses.map(element => {
                            Object.entries(element).map((value) => {
                              adresses.push({
                                id: value[0],
                                info: value[1],
                                color: "grey"
                              })
                            })
                          })
                        }
                        AsyncStorage.setItem('user_adresses', JSON.stringify(adresses))
                      }
                      

                      if (value[1].user.info.cpf === "") {
                        this.props.navigation.navigate("RegisterEnd")
                      } else {
                        this.props.navigation.navigate("Home", { status: "reload" })
                      }
                    } catch (e) {
                      console.log(e)
                    }
                  }
                })
              })
            })
            .catch(err => this.errorAlert("Erro inesperado!", "Por favor, verifique os campos inseridos."))
        })
        .catch(error => this.errorAlert("Erro inesperado!", "Por favor, verifique os campos inseridos."))
      this.setState({ loadingVisible: false })
    } else {
      this.errorAlert("Dados inválidos!", "Email ou senha incorretos.")
    }
  }

  render() {

    return (
      this.state.startPage === true ?
        <LinearGradient colors={COLOR.backgroundLogin} style={STYLE.linearGradient}>

          <ScrollView contentContainerStyle={STYLE.backgroundContainer}>
            <Loader
              loading={this.state.loadingVisible} />
            {this.state.alert}
            <View style={{ width: "100%", alignItems: "center", textAlign: "center" }}>
              <Image
                style={{ width: 116.82, height: 158.4, resizeMode: "stretch" }}
                source={Logo}
              />
            </View>
            <View style={STYLE.container}>
              <View style={STYLE.cardLogin}>
                <Input
                  inputStyle={STYLE.input}
                  inputContainerStyle={STYLE.inputContainer}
                  placeholder='Email'
                  placeholderTextColor="white"
                  leftIcon={
                    <Icon
                      name='envelope'
                      size={20}
                      color='white'
                    />
                  }
                  onChangeText={(email) => this.handleEmailChange(email)}
                />

                <Input
                  inputStyle={STYLE.input}
                  inputContainerStyle={STYLE.inputContainer}
                  secureTextEntry={this.state.hidePassword}
                  containerStyle={{ marginTop: 15, marginBottom: 20 }}
                  placeholder='Senha'
                  placeholderTextColor="white"
                  leftIcon={
                    <Icon
                      name='lock'
                      size={20}
                      color='white'
                    />
                  }
                  rightIcon={
                    this.state.showIconPassword ?
                      <Icon
                        onPress={() => this.handleShowPassword()}
                        name={this.state.iconPassword}
                        size={20}
                        color={'white'}
                      />
                      : null
                  }
                  onChangeText={(password) => this.handlePasswordChange(password)}

                />

                <TouchableHighlight underlayColor='#000' style={STYLE.loginButton} onPress={() => this.handleLoginClick()}>
                  <Text style={STYLE.textButton}> Entrar </Text>
                </TouchableHighlight>

                <View style={{ marginLeft: 10, marginRight: 10, flexDirection: 'row', justifyContent: 'center' }}>

                  <TouchableHighlight style={STYLE.facebookButton} underlayColor='#042417' onPress={() => { }}>
                    <View style={STYLE.socialButton}>
                      <Icon
                        name="facebook-f"
                        size={15}
                        color="#FFFFFF"
                      />
                      <Text style={STYLE.textSocialButton}> Facebook </Text>
                    </View>
                  </TouchableHighlight>

                  <TouchableHighlight style={STYLE.googleButton} onPress={() => { }}>
                    <View style={STYLE.socialButton}>
                      <Icon
                        name="google"
                        size={15}
                        color="#FFFFFF"
                      />
                      <Text style={STYLE.textSocialButton}> Google </Text>
                    </View>
                  </TouchableHighlight>
                </View>

              </View>
            </View>
            <View style={{ marginLeft: 10, marginRight: 10, marginBottom: 30, flexDirection: 'row', justifyContent: 'space-around' }}>
              <TouchableOpacity>
                <Text style={STYLE.textFooter} onPress={() => this.props.navigation.navigate("Register")}> Criar Conta </Text>
              </TouchableOpacity>

              <TouchableOpacity>
                <Text style={STYLE.textFooter}> Esqueceu a senha? </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
        :
        <View style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: COLOR.buttonColor }}>
          <Image
            style={{ width: 130, height: 130, resizeMode: "stretch", marginBottom: 20 }}
            source={startIcon}
          />
          <DotsLoader betweenSpace={10} color="#FFFFFF" size={15} />
        </View>
    )
  }
}

const STYLE = StyleSheet.create({

  backgroundContainer: {
    flexGrow: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    // width: "100%",
    // height: "100%"
  },

  linearGradient: {
    flex: 1,
  },

  container: {
    // height: hp("40%"),
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    margin: 30,
    padding: 20,
    marginBottom: 5,
  },

  cardLogin: {
    justifyContent: "center",
    height: "auto"
  },

  inputContainer: {
    borderColor: "white"
  },

  input: {
    marginLeft: 20,
    color: "grey"
  },

  loginButton: {
    marginTop: 15,
    marginBottom: 20,
    height: 40,
    backgroundColor: COLOR.buttonColor,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  textButton: {
    color: "#FFFFFF",
    fontSize: 15,
  },

  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  facebookButton: {
    backgroundColor: "#3B5B98",
    borderRadius: 20,
    height: 40,
    marginRight: 10,
    width: "50%"
  },

  googleButton: {
    backgroundColor: "#CE4A37",
    borderRadius: 20,
    height: 40,
    marginLeft: 10,
    width: "50%"
  },

  textSocialButton: {
    color: "#FFFFFF",
    fontSize: 15,
    marginLeft: 5
  },

  textFooter: {
    fontSize: 20,
    color: "#696969",
    fontWeight: "700"
  }
})

export default Login