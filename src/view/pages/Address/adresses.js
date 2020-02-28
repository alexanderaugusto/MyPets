import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native'
import { ListItem } from 'react-native-elements'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLOR } from '../../../variables/general'
import { FIREBASE_DATABASE_URL } from '../../../variables/firebaseConfig'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import TouchableScale from 'react-native-touchable-scale'
import LinearGradient from 'react-native-linear-gradient'
import ActionButton from 'react-native-action-button'
import Loader from '../../../components/Loader/loader'
import { withNavigationFocus } from 'react-navigation'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'

class Adresses extends Component {
  static navigationOptions = {
    title: "Seus Endereços",
    headerStyle: {
      backgroundColor: COLOR.headerBackground,
    },
    headerTintColor: COLOR.headerText
  }

  constructor(props) {
    super(props)

    this.state = {
      listAddress: [],
      loadingVisible: true,
      selectedChecked: false,
      alert: null
    }

    // this.getListItem()
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
          <SCLAlertButton theme="success" onPress={() => this.hideAlert(interval)}>Ok</SCLAlertButton>
        </SCLAlert>
    })

    let interval = setTimeout(() => this.setState({ alert: null }), 2500)
  }
  
  warningAlert(title, subtitle, index) {
    this.setState({
      alert:
        <SCLAlert
          theme="warning"
          show={true}
          title={title}
          subtitle={subtitle}
          onRequestClose={() => console.log('warning')}
        >
          <SCLAlertButton theme="warning" onPress={() => {
            this.deleteAddress(index)
            this.hideAlert(interval)
          }}>Excluir</SCLAlertButton>
          <SCLAlertButton theme="danger" onPress={() => this.setState({ alert: null })}>Cancelar</SCLAlertButton>
        </SCLAlert>
    })
  }

  hideAlert(interval){
    this.setState({ alert: null })
    clearInterval(interval)
  }
  
  componentDidMount() {
    const { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => {
      this.getListItem()
    })
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  async getListItem() {
    this.setState({ loadingVisible: true })
    let listAddress = []

    try {
      const userId = await AsyncStorage.getItem('user_id')
      this.setState({ userId })
      await axios.get(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/adresses.json")
        .then(res => {
          const data = Object.entries(res.data).map((value) => ({ [value[0]]: value[1] }))
          data.forEach((element, index) => {
            Object.entries(element).map((value) => {
              listAddress.push({
                address: value[1].address,
                cep: value[1].cep,
                city: value[1].city,
                uf: value[1].uf,
                country: value[1].country,
                id: value[0]
              })
            })
          })

        })
        .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
    } catch (e) {
      console.log(e)
    }

    this.setState({ listAddress })
    this.setState({ loadingVisible: false })
  }

  onListClick(item) {
    try {
      AsyncStorage.setItem('address_id', item.id)
      this.props.navigation.navigate("EditAddress")
    } catch (e) {
      console.log(e)
    }
  }

  async deleteAddress(index) {
    let listAddress = this.state.listAddress
    this.setState({ loadingVisible: true })

    try {
      const userId = await AsyncStorage.getItem('user_id')

      await axios.delete(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/adresses/" + this.state.listAddress[index].id + ".json")
        .then(res => {
          this.successAlert("MyPets", "Endereço deletado com sucesso!")
          listAddress.splice(index)
          this.setState({ listAddress })
        })
        .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))

      this.setState({ loadingVisible: false })
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
      <View contentContainerStyle={STYLE.container}>
        <Loader
          loading={this.state.loadingVisible} />
        {this.state.alert}
        <View style={{ alignContent: "center", alignItems: "center", backgroundColor: COLOR.screenBackground, height: "100%" }}>
          {
            this.state.listAddress.map((item, i) => (
              <ListItem
                contentContainerStyle={{ width: "90%" }}
                containerStyle={{ width: "90%", marginTop: 20, borderRadius: 18 }}
                key={i}
                Component={TouchableScale}
                friction={90} //
                tension={100} // These props are passed to the parent component (here TouchableScale)
                activeScale={0.95} //
                linearGradientProps={{
                  colors: COLOR.listAddressColor,
                  // start: [1, 0],
                  // end: [0.2, 0],
                }}
                ViewComponent={LinearGradient} // Only if no expo
                // leftAvatar={{ rounded: true, source: { uri: avatar_url } }}
                title={item.address}
                titleStyle={{ color: 'white', fontWeight: 'bold' }}
                subtitleStyle={{ color: 'white' }}
                subtitle={item.city + " - " + item.uf}
                chevronColor="white"
                chevron
                onPress={() => this.onListClick(item)}
                onLongPress={() => this.warningAlert("Deseja mesmo excluir?", "Você não conseguirá recuperar as informações.", i)}
                delayLongPress={1000}
              />
            ))
          }
        </View>
        <ActionButton
          buttonColor={COLOR.buttonColor}
          onPress={() => this.props.navigation.navigate("InsertAddress", { screen: "adresses" })}
          buttonTextStyle={STYLE.actionButtonStyle}
        />
      </View>
    )
  }
}

const STYLE = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLOR.screenBackground,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%"
  },

  actionButtonStyle: {
    fontSize: 25,
  },
})

export default withNavigationFocus(Adresses)