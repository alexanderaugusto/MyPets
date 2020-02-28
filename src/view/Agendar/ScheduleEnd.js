import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Icons from 'react-native-vector-icons/Fontisto'
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePicker from "react-native-modal-datetime-picker"
import LinearGradient from 'react-native-linear-gradient'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import Loader from '../../components/Loader/loader'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { FIREBASE_DATABASE_URL } from '../../variables/firebaseConfig'
import { RADIO_PROPS, COLOR } from '../../variables/general'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import { FlatGrid } from 'react-native-super-grid'
import { Overlay, ListItem } from 'react-native-elements'

class ScheduleEnd extends Component {

  constructor(props) {
    super(props)

    this.state = {
      alert: null,
      loadingVisible: false,
      overlayVisible: false,
      navigationOptions: this.props.navigation.getParam("scheduleProps"),
      listOptions: [],
      buscar: 0,
      adresses: [],
      selectedAddress: null,
    }
  }

  componentDidMount() {
    let listOptions = [
      {
        title: "Data",
        rightTitle: this.state.navigationOptions.date,
        icon: <Icon name="clock" />
      },
      {
        title: "Horário",
        rightTitle: this.state.navigationOptions.time.substring(0, 5),
        icon: <Icon name="calendar" />
      }
    ]

    this.setState({ listOptions })

    this.getUserAdresses()
  }

  async getUserAdresses() {
    try {
      let userAdresses = await AsyncStorage.getItem("user_adresses")
      userAdresses = JSON.parse(userAdresses)

      // if (userAdresses !== null && userAdresses !== undefined) {
      //   userAdresses.map(element => {
      //     Object.entries(element).map((value) => {
      //       adresses.push({
      //         id: value[0],
      //         info: value[1],
      //         color: "grey"
      //       })
      //     })
      //   })
      // }
      this.setState({ adresses: userAdresses })

    } catch (err) {
      console.log(err)
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
          <SCLAlertButton theme="danger" onPress={() => this.setState({ alert: null })}>Ok</SCLAlertButton>
        </SCLAlert>
    })
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
            this.setState({ alert: null })
            this.props.navigation.navigate("Agendar")
          }}>Ok</SCLAlertButton>
        </SCLAlert>
    })
  }

  async vaccineSchedule() {
    this.setState({ loadingVisible: true })
    try {
      const userId = await AsyncStorage.getItem('user_id')
      let userInfo = await AsyncStorage.getItem('user_info')
      userInfo = JSON.parse(userInfo)
      const getAnimal = await AsyncStorage.getItem('animal_selected')
      const animalSelected = await JSON.parse(getAnimal)

      let data = {
        selecteds: this.state.navigationOptions.selecteds,
        date: this.state.navigationOptions.date,
        time: this.state.navigationOptions.time.substring(0, 5),
        petShop: {
          id: this.state.navigationOptions.petShopSelected.petId,
          petName: this.state.navigationOptions.petShopSelected.petName,
          petServiceType: this.state.navigationOptions.petShopSelected.serviceType,
          petPlace: this.state.navigationOptions.petShopSelected.petPlace,
          petVet: this.state.navigationOptions.petShopSelected.petVet
        },
        animal: {
          id: animalSelected.id,
          avatar: animalSelected.petAvatar,
          name: animalSelected.name,
          species: animalSelected.species,
          breed: animalSelected.breed,
          age: animalSelected.age,
          weight: animalSelected.weight,
          sex: animalSelected.sex
        },
        address: this.state.selectedAddress,
        userInfo: userInfo,
        userId: userId
      }

      console.log(data)

      await axios.post(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/agendamento/vacinas.json", data)
        .then(res => {
          axios.put(FIREBASE_DATABASE_URL + "/Login/" + this.state.navigationOptions.petShopSelected.petId + "/Agenda/Vacinas/" +
            this.state.navigationOptions.date.split("/").join("-") + "/" + this.state.navigationOptions.time.substring(0, 5) + ".json", data)
            .then(res => {
              this.successAlert("MyPets", "Sua consulta foi registrada, obrigado!")
            })
            .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
        })
        .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
    } catch (e) {
      console.log(e)
    }
    this.setState({ loadingVisible: false })
  }

  async hygieneSchedule() {
    this.setState({ loadingVisible: true })
    try {
      const userId = await AsyncStorage.getItem('user_id')
      let userInfo = await AsyncStorage.getItem('user_info')
      userInfo = JSON.parse(userInfo)
      const getAnimal = await AsyncStorage.getItem('animal_selected')
      const animalSelected = await JSON.parse(getAnimal)

      let data = {
        selecteds: this.state.navigationOptions.selecteds,
        date: this.state.navigationOptions.date,
        time: this.state.navigationOptions.time.substring(0, 5),
        petShop: {
          id: this.state.navigationOptions.petShopSelected.petId,
          petName: this.state.navigationOptions.petShopSelected.petName,
          petServiceType: this.state.navigationOptions.petShopSelected.serviceType,
          petPlace: this.state.navigationOptions.petShopSelected.petPlace,
          petVet: this.state.navigationOptions.petShopSelected.petVet
        },
        animal: {
          id: animalSelected.id,
          avatar: animalSelected.petAvatar,
          name: animalSelected.name,
          species: animalSelected.species,
          breed: animalSelected.breed,
          age: animalSelected.age,
          weight: animalSelected.weight,
          sex: animalSelected.sex
        },
        address: this.state.selectedAddress,
        userInfo: userInfo,
        userId: userId
      }

      console.log(data)
      await axios.post(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/agendamento/higiene.json", data)
        .then(res => {
          axios.put(FIREBASE_DATABASE_URL + "/Login/" + this.state.navigationOptions.petShopSelected.petId + "/Agenda/Higiene/" +
            this.state.navigationOptions.date.split("/").join("-") + "/" + this.state.navigationOptions.time.substring(0, 5) + ".json", data)
            .then(res => {
              this.successAlert("MyPets", "Sua consulta foi registrada, obrigado!")
            })
            .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
        })
        .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
    } catch (e) {
      console.log(e)
    }
    this.setState({ loadingVisible: false })
  }

  async consultSchedule() {
    this.setState({ loadingVisible: true })
    try {
      const userId = await AsyncStorage.getItem('user_id')
      let userInfo = await AsyncStorage.getItem('user_info')
      userInfo = JSON.parse(userInfo)
      const getAnimal = await AsyncStorage.getItem('animal_selected')
      const animalSelected = await JSON.parse(getAnimal)

      let data = {
        description: this.state.navigationOptions.description,
        date: this.state.navigationOptions.date,
        time: this.state.navigationOptions.time.substring(0, 5),
        petShop: {
          id: this.state.navigationOptions.petShopSelected.petId,
          petName: this.state.navigationOptions.petShopSelected.petName,
          petServiceType: this.state.navigationOptions.petShopSelected.serviceType,
          petPlace: this.state.navigationOptions.petShopSelected.petPlace,
          petVet: this.state.navigationOptions.petShopSelected.petVet
        },
        animal: {
          id: animalSelected.id,
          avatar: animalSelected.petAvatar,
          name: animalSelected.name,
          species: animalSelected.species,
          breed: animalSelected.breed,
          age: animalSelected.age,
          weight: animalSelected.weight,
          sex: animalSelected.sex
        },
        address: this.state.selectedAddress,
        userInfo: userInfo,
        userId: userId
      }

      console.log(data)

      await axios.post(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/agendamento/consulta.json", data)
        .then(res => {
          axios.put(FIREBASE_DATABASE_URL + "/Login/" + this.state.navigationOptions.petShopSelected.petId + "/Agenda/Consultas/" +
            this.state.navigationOptions.date.split("/").join("-") + "/" + this.state.navigationOptions.time.substring(0, 5) + ".json", data)
            .then(res => {
              this.successAlert("MyPets", "Sua consulta foi registrada, obrigado!")
            })
            .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
        })
        .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
    } catch (e) {
      console.log(e)
    }
    this.setState({ loadingVisible: false })
  }

  renderDateItem = ({ item, index }) => (
    <ListItem
      key={index}
      containerStyle={{ marginLeft: 15, marginRight: 15 }}
      title={item.title}
      rightTitle={item.rightTitle}
      bottomDivider
    />
  )

  renderHygiene = ({ item, index }) => (
    <ListItem
      key={index}
      containerStyle={{ marginLeft: 15, marginRight: 15 }}
      leftIcon={<Icon name="bath" size={20} color={this.state.navigationOptions.communColor} />}
      title={item}
      rightTitle={(index + 1).toString()}
      titleStyle={{ color: "grey" }}
    />
  )

  renderVaccine = ({ item, index }) => (
    <ListItem
      key={index}
      containerStyle={{ marginLeft: 15, marginRight: 15 }}
      leftIcon={<Icon name="syringe" size={20} color={this.state.navigationOptions.communColor} />}
      title={item}
      rightTitle={(index + 1).toString()}
      titleStyle={{ color: "grey" }}
    />
  )

  handleFinal() {
    if (this.state.buscar === 1) {
      if (this.state.selectedAddress !== null) {
        if (this.state.navigationOptions.type === "Vaccine")
          this.vaccineSchedule()
        else if (this.state.navigationOptions.type === "Consult")
          this.consultSchedule()
        else if (this.state.navigationOptions.type === "Hygiene")
          this.hygieneSchedule()
      } else {
        this.errorAlert("MyPets", "Selecione um dos seus endereços para busca em domicílio.")
      }
    } else {
      if (this.state.navigationOptions.type === "Vaccine")
        this.vaccineSchedule()
      else if (this.state.navigationOptions.type === "Consult")
        this.consultSchedule()
      else if (this.state.navigationOptions.type === "Hygiene")
        this.hygieneSchedule()
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        {this.state.alert}

        <Loader
          loading={this.state.loadingVisible} />

        <View style={styles.secondContainer}>
          <View style={{ height: "15%", backgroundColor: this.state.navigationOptions.communColor, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}> Dados Agendados </Text>
          </View>

          <View>
            <FlatList
              data={this.state.listOptions}
              renderItem={this.renderDateItem}
            />
          </View>

          {/* {this.state.navigationOptions.type === "Vaccine" ?
            <FlatList
              data={this.state.navigationOptions.selecteds}
              renderItem={this.renderVaccine}
            />
            :
            null}

          {this.state.navigationOptions.type === "Hygiene" ?
            <FlatList
              data={this.state.navigationOptions.selecteds}
              renderItem={this.renderHygiene}
            />
            : null}

          {this.state.navigationOptions.type === "Consult" ?
            <TextInput style={styles.input}
              placeholder='Descreva os sintomas...'
              placeholderTextColor='grey'
              value={this.state.navigationOptions.description}
              onChangeText={description => {
                let navigationOptions = this.state.navigationOptions
                navigationOptions.description = description
                this.setState({ navigationOptions })
              }}
              multiline={true}
            />
            : null} */}


          <View style={{ height: "15%", backgroundColor: this.state.navigationOptions.communColor, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}> Informações Adicionais </Text>
          </View>

          <ScrollView contentContainerStyle={styles.mainContainer}>
            <View style={{ alignItems: "center", width: "100%", marginTop: 5 }}>
              <Text style={styles.textBuscar}> Deseja que a PetShop busque seu animalzinho em casa? </Text>
              <RadioForm
                radio_props={[
                  { label: 'Não   ', value: 0 },
                  { label: 'Sim', value: 1 }
                ]}
                initial={0}
                formHorizontal={true}
                labelHorizontal={true}
                buttonColor={this.state.navigationOptions.communColor}
                animation={true}
                onPress={(value) => { this.setState({ buscar: value }) }}
              />
            </View>

            {this.state.buscar === 1 ?
              <View>
                <Text style={{ textAlign: "center", marginTop: 10, fontSize: 15 }}> Escolha um de seus endereços: </Text>
                {this.state.adresses.map((item, index) => {
                  return (
                    <ListItem
                      key={index}
                      containerStyle={{ marginLeft: 15, marginRight: 15, height: "auto" }}
                      leftIcon={<Icon name="map-marker-alt" size={20} color={this.state.navigationOptions.communColor} />}
                      rightIcon={<Icon name="check-double" size={13}
                        color={item.color} />}
                      title={item.info.city}
                      subtitle={item.info.address}
                      titleStyle={{ color: "grey" }}
                      onPress={() => {
                        this.setState({ selectedAddress: item })
                        let adresses = this.state.adresses
                        adresses.forEach((element, i) => {
                          if (i === index)
                            element.color = "#2AF598"
                          else
                            element.color = "grey"
                        })

                        this.setState({ adresses })
                      }}
                    />
                  )
                })}
              </View> :
              null}
          </ScrollView>
        </View>

        <View style={{ alignItems: "center", marginTop: "10%", height: "auto", width: "100%" }}>
          <TouchableHighlight style={styles.finalButton} onPress={() => this.handleFinal()}>
            <Text style={styles.textButton}> Finalizar Agendamento </Text>
          </TouchableHighlight>
        </View>

      </View>
    );
  }
}

//Estilos
const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    flexGrow: 1
    // borderTopRightRadius: 10,
    // borderTopLeftRadius: 10,
    // padding: 20
  },
  secondContainer: {
    // width: "100%",
    // height: "100%"
    flex: 1,
    justifyContent: "flex-start"
  },
  textBuscar: {
    textAlign: "center",
    marginBottom: "4%",
    fontSize: 16
  },
  finalButton: {
    marginBottom: 20,
    height: 55,
    backgroundColor: COLOR.buttonColor,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "70%"
  },
  textButton: {
    color: "#FFFFFF",
    fontSize: 15,
  },
  input: {
    borderColor: "white",
    borderWidth: 2,
    fontFamily: 'HelveticaNeueLight',
    justifyContent: 'flex-start',
    alignItems: "flex-start",
    textAlignVertical: "top",
    color: '#363636',
    width: '100%',
    borderRadius: 5,
    paddingLeft: 20,
    height: 110
  },
});

ScheduleEnd.navigationOptions = {
  header: null,
}

export default ScheduleEnd