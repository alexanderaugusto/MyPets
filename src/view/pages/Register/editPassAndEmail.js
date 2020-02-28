import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLOR } from '../../../variables/general'
import { FIREBASE_DATABASE_URL } from '../../../variables/firebaseConfig'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Loader from '../../../components/Loader/loader'
import Util from '../../../variables/util'
import { TextInputMask } from 'react-native-masked-text'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import firebase from 'react-native-firebase'

class EditPassAndEmail extends Component {
  static navigationOptions = {
    title: "Editar Dados",
    headerStyle: {
      backgroundColor: COLOR.headerBackground,
    },
    headerTintColor: COLOR.headerText
  }

  constructor(props) {
    super(props)

    this.state = {
      newEmail: "",
      currentPassword: "",
      newPassword: "",
      loadingVisible: false,
      alert: null,
      userId: AsyncStorage.getItem('user_id')
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

    let interval = setTimeout(() => {this.setState({ alert: null })}, 2500)
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

  hideAlert(interval){
    this.setState({ alert: null })
    clearInterval(interval)
  }
  
  async changeEmail() {
    let currentPassword = this.state.currentPassword
    let newEmail = this.state.newEmail
    let emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    this.setState({ loadingVisible: true })
    if (currentPassword.length >= 6 && emailRex.test(newEmail)) {
      await this.reauthenticate(currentPassword).then(() => {
        var user = firebase.auth().currentUser
        user.updateEmail(newEmail).then(() => {
          let data = {
            email: newEmail
          }
          axios.put(FIREBASE_DATABASE_URL + "/app/accounts/" + this.state.userId._55 + "/user/auth.json", data)
            .then(res => {
              this.successAlert("MyPets", "Email alterado com sucesso!")
            })
            .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))

        }).catch((error) => this.errorAlert("Erro inesperado!", "Por favor, verifique os campos inseridos."))
      }).catch((error) => this.errorAlert("Erro inesperado!", "Por favor, verifique os campos inseridos."))
    } else {
      this.errorAlert("Dados Inválidos!", "O novo email ou a senha atual estão incorretos.")
    }
    this.setState({ loadingVisible: false })
  }

  async changePassword() {
    let currentPassword = this.state.currentPassword
    let newPassword = this.state.newPassword

    this.setState({ loadingVisible: true })
    if (currentPassword.length >= 6 && newPassword.length >= 6) {
      await this.reauthenticate(currentPassword).then(() => {
        var user = firebase.auth().currentUser
        user.updatePassword(newPassword).then(() => {
          this.successAlert("MyPets", "Senha alterada com sucesso!")
        }).catch((error) => this.errorAlert("Erro inesperado!", "Por favor, verifique os campos inseridos."))
      }).catch((error) => this.errorAlert("Erro inesperado!", "Por favor, verifique os campos inseridos."))
    } else {
      this.errorAlert("Dados Inválidos!", "A senha atual ou a nova senha estão incorretas.")
    }
    this.setState({ loadingVisible: false })
  }

  reauthenticate(currentPassword) {
    var user = firebase.auth().currentUser
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email, currentPassword)
    return user.reauthenticateWithCredential(cred);
  }


  render() {
    return (
      <ScrollView contentContainerStyle={STYLE.container}>
        <Loader
          loading={this.state.loadingVisible} />
        {this.state.alert}

        {this.props.navigation.getParam("type", "default") === "email" ?
          <View style={STYLE.subContainer}>
            <Input
              placeholder="Novo Email..."
              inputStyle={STYLE.input}
              inputContainerStyle={STYLE.inputContainer2}
              containerStyle={STYLE.inputContainer1}
              underlineColorAndroid='transparent'
              onChangeText={(value) => this.setState({ newEmail: value.trim() })}
            />
            <Input
              placeholder="Sua senha..."
              inputStyle={STYLE.input}
              inputContainerStyle={STYLE.inputContainer2}
              containerStyle={STYLE.inputContainer1}
              underlineColorAndroid='transparent'
              secureTextEntry={true}
              onChangeText={(value) => this.setState({ currentPassword: value })}
            />
            <TouchableHighlight
              style={STYLE.registerButton}
              onPress={() => this.changeEmail()}>
              <Text style={STYLE.textButton}> Alterar </Text>
            </TouchableHighlight>
          </View>
          :
          <View style={STYLE.subContainer}>
            <Input
              placeholder="Senha Atual..."
              inputStyle={STYLE.input}
              inputContainerStyle={STYLE.inputContainer2}
              containerStyle={STYLE.inputContainer1}
              underlineColorAndroid='transparent'
              secureTextEntry={true}
              onChangeText={(value) => this.setState({ currentPassword: value })}
            />
            <Input
              placeholder="Nova Senha..."
              inputStyle={STYLE.input}
              inputContainerStyle={STYLE.inputContainer2}
              containerStyle={STYLE.inputContainer1}
              underlineColorAndroid='transparent'
              secureTextEntry={true}
              onChangeText={(value) => this.setState({ newPassword: value })}
            />
            <TouchableHighlight
              style={STYLE.registerButton}
              onPress={() => this.changePassword()}>
              <Text style={STYLE.textButton}> Alterar </Text>
            </TouchableHighlight>
          </View>
        }
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
    justifyContent: "flex-start"
  },

  subContainer: {
    width: "100%",
    height: "100%",
    textAlign: "center",
    alignItems: "center",
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
    paddingLeft: 20,
    fontSize: 15
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
    width: "85%",
    backgroundColor: COLOR.buttonColor,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30
  },

  textButton: {
    color: "#FFFFFF",
    fontSize: 18,
  },
})

export default EditPassAndEmail