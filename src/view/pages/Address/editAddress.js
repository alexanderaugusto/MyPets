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
import cep from 'cep-promise'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'

class EditAddress extends Component {
  static navigationOptions = {
    title: "Editar Endereço",
    headerStyle: {
      backgroundColor: COLOR.headerBackground,
    },
    headerTintColor: COLOR.headerText
  }

  constructor(props) {
    super(props)

    this.state = {
      dataInfos: {
        cep: '',
        address: '',
        city: '',
        uf: '',
        country: '',
        cepState: 'has-success',
        addressState: 'has-success',
        cityState: 'has-success',
        ufState: 'has-success',
        countryState: 'has-success'
      },
      loadingVisible: true,
      alert: null
    }

    this.getAddressInfo()
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

  async getAddressInfo() {
    let dataInfos = this.state.dataInfos

    try {
      const userId = await AsyncStorage.getItem('user_id')
      const addressId = await AsyncStorage.getItem('address_id')

      await axios.get(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/adresses/" + addressId + ".json")
        .then(res => {
          dataInfos.cep = res.data.cep
          dataInfos.address = res.data.address
          dataInfos.city = res.data.city
          dataInfos.uf = res.data.uf
          dataInfos.country = res.data.country
        })
        .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
    } catch (e) {
      console.log(e)
    }

    this.setState({ dataInfos })
    this.setState({ loadingVisible: false })
  }

  onInputChange(type, value) {
    let dataInfos = this.state.dataInfos
    dataInfos[type] = value
    this.setState({ dataInfos })
  }

  async handleClick() {
    if (this.state.dataInfos.cepState === 'has-success' && this.state.dataInfos.addressState === 'has-success'
      && this.state.dataInfos.cityState === 'has-success' && this.state.dataInfos.ufState === 'has-success' &&
      this.state.dataInfos.countryState === 'has-success') {
      this.setState({ loadingVisible: true })

      try {
        const userId = await AsyncStorage.getItem('user_id')
        const addressId = await AsyncStorage.getItem('address_id')
        let data = {
          address: this.state.dataInfos.address,
          cep: this.state.dataInfos.cep,
          city: this.state.dataInfos.city,
          uf: this.state.dataInfos.uf,
          country: this.state.dataInfos.country,
        }

        let userAdresses = await AsyncStorage.getItem("user_adresses")
        userAdresses = JSON.parse(userAdresses)
        userAdresses.map((value, index) => {
          if(value.id === addressId){
            userAdresses[index].info = data
          }
        })

        AsyncStorage.setItem('user_adresses', JSON.stringify(userAdresses))

        await axios.put(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/adresses/" + addressId + ".json", data)
          .then(res => {
            this.successAlert("MyPets", "Dados alterados com sucesso!")
          })
          .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
      } catch (e) {
        console.log(e)
      }
      this.setState({ loadingVisible: false })
    }
    else {
      this.errorAlert("Dados Inválido!", "Preencha os campos de forma correta para enviar.")
    }
  }

  findInfoCep(cepInput) {
    let dataInfos = this.state.dataInfos

    try {
      cep(cepInput)
        .then(res => {
          dataInfos["cepState"] = "has-success"
          dataInfos["city"] = res.city
          dataInfos["cityState"] = "has-success"
          dataInfos["uf"] = res.state
          dataInfos["ufState"] = "has-success"
          if (res.street !== undefined) {
            dataInfos["address"] = res.street
            dataInfos["addressState"] = "has-success"
          }
          this.setState({ dataInfos })
        })
        .catch(err => {
          console.log(err)
          dataInfos["cepState"] = "has-danger"
        })
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={STYLE.container}>
        <Loader
          loading={this.state.loadingVisible} />
        {this.state.alert}
        <TextInputMask
          style={STYLE.maskedInput}
          type={'zip-code'}
          value={this.state.dataInfos.cep}
          onChangeText={(value) => {
            this.setState({ dataInfos: Util.cepValidation(value, this.state.dataInfos) })
            value.length === 9 ? this.findInfoCep(value) : null
          }}
          placeholder='CEP...'
        />
        <Input
          placeholder="Endereço..."
          inputStyle={STYLE.input}
          inputContainerStyle={STYLE.inputContainer2}
          containerStyle={STYLE.inputContainer1}
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({
            dataInfos:
              Util.addressValidation(value, this.state.dataInfos)
          })}
          value={this.state.dataInfos.address}
        />
        <Input
          placeholder="Cidade..."
          inputStyle={STYLE.input}
          inputContainerStyle={STYLE.inputContainer2}
          containerStyle={STYLE.inputContainer1}
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({
            dataInfos:
              Util.cityValidation(value, this.state.dataInfos)
          })}
          value={this.state.dataInfos.city}
        />
        <Input
          placeholder="Estado..."
          inputStyle={STYLE.input}
          inputContainerStyle={STYLE.inputContainer2}
          containerStyle={STYLE.inputContainer1}
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({
            dataInfos:
              Util.ufValidation(value, this.state.dataInfos)
          })}
          value={this.state.dataInfos.uf}
        />
        <Input
          placeholder="País..."
          inputStyle={STYLE.input}
          inputContainerStyle={STYLE.inputContainer2}
          containerStyle={STYLE.inputContainer1}
          underlineColorAndroid='transparent'
          onChangeText={(value) => this.setState({
            dataInfos:
              Util.countryValidation(value, this.state.dataInfos)
          })}
          value={this.state.dataInfos.country}
        />
        <TouchableHighlight
          style={STYLE.registerButton}
          onPress={() => this.handleClick()}>
          <Text style={STYLE.textButton}> Salvar </Text>
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
    paddingLeft: 20,
    fontSize: 15
  },

  maskedInput: {
    width: "87%",
    borderRadius: 25,
    marginTop: "10%",
    backgroundColor: "#FFFFFF",
    paddingLeft: 20,
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

export default EditAddress