import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Input, CheckBox, Overlay } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLOR } from '../../../variables/general'
import axios from 'axios'
import { FIREBASE_DATABASE_URL } from '../../../variables/firebaseConfig'
import firebase from 'react-native-firebase'
import Loader from '../../../components/Loader/loader'
import Util from '../../../variables/util'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'

class Register extends Component {
  static navigationOptions = {
    title: "Registrar",
    headerStyle: {
      backgroundColor: COLOR.headerBackground,
    },
    headerTintColor: COLOR.headerText
  }

  constructor(props) {
    super(props)

    this.state = {
      dataInfos: {
        email: '',
        password: '',
        confirmPassword: '',
        emailState: '',
        passwordState: '',
        confirmPasswordState: '',
      },
      checked: false,
      overlayVisible: false,
      loadingVisible: false,
      alert: null
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

  successAlert(title, subtitle) {
    this.setState({
      alert:
        <SCLAlert
          theme="success"
          show={true}
          title={title}
          subtitle={subtitle}
          onRequestClose={() => console.log('success')}
        >
          <SCLAlertButton theme="success" onPress={() => {
            this.hideAlert(interval)
            this.props.navigation.goBack(null)
          }}>Ok</SCLAlertButton>
        </SCLAlert>
    })

    let interval = setTimeout(() => {
      this.setState({ alert: null })
      this.props.navigation.goBack(null)
    }, 2500)
  }

  hideAlert(interval) {
    this.setState({ alert: null })
    clearInterval(interval)
  }


  onInputChange(type, value) {
    let dataInfos = this.state.dataInfos
    dataInfos[type] = value
    this.setState({ dataInfos })
  }

  async handleClick() {
    console.log(this.state.dataInfos)
    if (this.state.dataInfos.emailState === 'has-success' &&
      this.state.dataInfos.passwordState === 'has-success' &&
      this.state.dataInfos.confirmPasswordState === 'has-success' &&
      this.state.checked === true) {

      this.setState({ loadingVisible: true })
      await firebase.auth().createUserWithEmailAndPassword(this.state.dataInfos.email, this.state.dataInfos.password)
        .then(res => {
          let data = {
            user: {
              auth: {
                email: this.state.dataInfos.email,
              },
              info: {
                userAvatar: "",
                name: "",
                lastName: "",
                cpf: "",
                phone: "",
                dateOfBirth: "",
              }
            }
          }
          axios.post(FIREBASE_DATABASE_URL + "/app/accounts.json", data)
            .then(res => {
              this.successAlert("MyPets", "Conta criada com sucesso, divirta-se.")
            })
            .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
        })
        .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))

      this.setState({ loadingVisible: false })
    }
    else {
      this.errorAlert("Dados inválidos!", "Por favor, preencha todos os campos de forma válida.")
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={STYLE.container}>
        <Loader
          loading={this.state.loadingVisible} />
        {this.state.alert}
        <Input
          placeholder="Email..."
          inputStyle={STYLE.input}
          inputContainerStyle={STYLE.inputContainer2}
          containerStyle={STYLE.inputContainer1}
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({
            dataInfos:
              Util.emailValidation(value, this.state.dataInfos)
          })}
        />
        <Input
          placeholder="Senha..."
          inputStyle={STYLE.input}
          inputContainerStyle={STYLE.inputContainer2}
          containerStyle={STYLE.inputContainer1}
          underlineColorAndroid='transparent'
          secureTextEntry={true}
          onChangeText={(value) => this.setState({
            dataInfos:
              Util.passwordValidation(value, this.state.dataInfos)
          })}
        />
        <Input
          placeholder="Confirmar senha..."
          inputStyle={STYLE.input}
          inputContainerStyle={STYLE.inputContainer2}
          containerStyle={STYLE.inputContainer1}
          underlineColorAndroid='transparent'
          secureTextEntry={true}
          onChangeText={(value) => this.setState({
            dataInfos:
              Util.confirmPasswordValidation(value, this.state.dataInfos)
          })}
        />
        <Overlay
          isVisible={this.state.overlayVisible}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor="grey"
          width="90%"
          height="80%"
          overlayStyle={STYLE.overlayStyle}
        >
          <Icon
            style={STYLE.overlayIconClose}
            name='times'
            size={30}
            color='red'
            onPress={() => this.setState({ overlayVisible: false })}
          />
        </Overlay>
        <CheckBox
          title={
            <Text style={{fontSize: 16}}> Concordo com os {" "}
              <Text onPress={() => this.setState({ overlayVisible: true })} style={{ color: "red", fontSize: 16, fontStyle: "italic"}}>
                termos e condições
              </Text> da MyPets.
            </Text>}
          checked={this.state.checked}
          onIconPress={() => this.setState({ checked: !this.state.checked })}
          // onPress={() => this.setState({ overlayVisible: true })}
          onPress={() => this.setState({ checked: !this.state.checked })}
          containerStyle={STYLE.checkBoxContainer}
        />
        <TouchableHighlight
          style={STYLE.registerButton}
          onPress={() => this.handleClick()}>
          <Text style={STYLE.textButton}> Criar Conta </Text>
        </TouchableHighlight>
      </ScrollView>
    )
  }
}

const STYLE = StyleSheet.create({

  container: {
    flexGrow: 1,
    backgroundColor: COLOR.screenBackground,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center"
  },

  iconSideBar: {
    marginLeft: 15,
    fontSize: 30,
  },

  input: {
    width: "90%",
    borderRadius: 25,
    marginTop: "10%",
    backgroundColor: "#FFFFFF",
    paddingLeft: 20
  },

  inputDanger: {
    width: "90%",
    borderColor: "rgba(255,0,0, 0.8)",
    borderWidth: 2,
    borderRadius: 25,
    marginTop: "10%",
    backgroundColor: "#FFFFFF",
    paddingLeft: 20,
    paddingRight: 0
  },

  inputContainer1: {
    alignItems: "center",
  },

  inputContainer2: {
    borderBottomWidth: 0,
    width: "90%"
  },

  registerButton: {
    marginTop: 40,
    height: 50,
    width: "80%",
    backgroundColor: COLOR.buttonColor,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },

  textButton: {
    color: "#FFFFFF",
    fontSize: 18,
  },

  checkBoxContainer: {
    marginTop: 40,
    width: "85%",
    backgroundColor: "transparent",
    borderColor: "transparent"
  },

  overlayStyle: {
    borderRadius: 25,
  },

  overlayIconClose: {
    textAlign: "right"
  }
})

export default Register