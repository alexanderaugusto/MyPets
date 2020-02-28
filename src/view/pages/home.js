import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  RefreshControl,
  BackHandler
} from 'react-native'
import { Avatar, Overlay, ListItem, Image, Header, CheckBox } from 'react-native-elements'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons' // https://materialdesignicons.com
import { COLOR } from '../../variables/general'
import { FlatGrid } from 'react-native-super-grid';
import ActionButton from 'react-native-action-button';
import { LIST_USER_OPTIONS } from '../../variables/general'
import dogIcon from '../../assets/img/dog_1.png'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { FIREBASE_DATABASE_URL } from '../../variables/firebaseConfig'
import Loader from '../../components/Loader/loader'
import UserAvatar from 'react-native-user-avatar'
import { withNavigationFocus } from 'react-navigation'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import ImagePicker from 'react-native-image-picker'

class Home extends Component {
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props)

    this.state = {
      userOptionsVisible: false,
      optionsVisible: false,
      userAnimals: null,
      loadingVisible: true,
      userInfo: '',
      animalSelectedIndex: [],
      selectedChecked: false,
      alert: null,
      refreshing: false,
      userId: ""
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
          <SCLAlertButton theme="success" onPress={() => this.hideAlert(interval)}>Ok</SCLAlertButton>
        </SCLAlert>
    })

    let interval = setTimeout(() => this.setState({ alert: null }), 2500)
  }

  warningAlert(title, subtitle) {
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
            this.deleteAnimal()
            this.setState({ alert: null })
          }}>Excluir</SCLAlertButton>
          <SCLAlertButton theme="danger" onPress={() => this.setState({ alert: null })}>Cancelar</SCLAlertButton>
        </SCLAlert>
    })
  }

  hideAlert(interval) {
    this.setState({ alert: null })
    clearInterval(interval)
  }

  componentDidMount() {
    const { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => {
      if (this.props.navigation.state.params.status === 'reload') {
        this.props.navigation.setParams({ status: null })
        this.getListItem()
        this.getUserInfo()
      }
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        this.setState({ userOptionsVisible: false })
        this.setState({ animalSelectedIndex: [] })
        return true
      })
    })
  }

  componentWillUnmount() {
    this.focusListener.remove()
  }

  async getListItem() {
    try {
      const userId = await AsyncStorage.getItem('user_id')
      await axios.get(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/pets.json")
        .then(res => {
          if (res.data !== null) {
            const data = Object.entries(res.data).map((value) => ({ [value[0]]: value[1] }))
            this.setListItem(data)
          } else {
            this.setState({ userAnimals: [] })
          }
        })
        .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
    } catch (e) {
      console.log(e)
    }
    this.setState({ loadingVisible: false })
  }

  setListItem(data) {
    let gridAux1 = 0
    let gridAux2 = 2
    let userAnimals = []


    data.forEach((element, index) => {
      Object.entries(element).map((value) => {
        userAnimals.push({
          petAvatar: value[1].petAvatar,
          name: value[1].name,
          breed: value[1].breed,
          age: value[1].age,
          sex: value[1].sex,
          weight: value[1].weight,
          species: value[1].species,
          color: "",
          id: value[0]
        })
      })

      if (index === 0) {
        userAnimals[index].color = COLOR.flatGridColor1
      }

      else if (gridAux1 === 2) {
        userAnimals[index].color = COLOR.flatGridColor1
        gridAux2++
        if (gridAux2 === 2)
          gridAux1 = 0
      }

      else if (gridAux2 === 2) {
        userAnimals[index].color = COLOR.flatGridColor2
        gridAux1++
        if (gridAux1 === 2)
          gridAux2 = 0
      }
    })

    this.setState({ userAnimals })
  }

  async getUserInfo() {
    try {
      const userId = await AsyncStorage.getItem('user_id')
      const adresses = await AsyncStorage.getItem('user_adresses')
      
      this.setState({ userId })
      await axios.get(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/user/info.json")
        .then(res => {
          this.setState({ userInfo: res.data })
        })
        .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
    } catch (e) {
      console.log(e)
    }
    this.setState({ loadingVisible: false })
  }

  onListClick(index) {
    this.setState({ userOptionsVisible: false })
    if (index === 0) {
      this.backHandler.remove()
      this.props.navigation.navigate("Adresses")
    }
    else if (index === 1) {
      this.backHandler.remove()
      this.props.navigation.navigate("UserInfo")
    }
  }

  async onAnimalClick(animal, index) {
    let animalSelectedIndex = this.state.animalSelectedIndex
    if (animalSelectedIndex.length !== 0) {
      if (animalSelectedIndex.includes(index)) {
        animalSelectedIndex = animalSelectedIndex.filter((value) => value != index)
      } else {
        animalSelectedIndex.push(index)
      }
      this.setState({ animalSelectedIndex })
    } else {
      try {
        this.backHandler.remove()
        await AsyncStorage.setItem('animal_selected', JSON.stringify(animal))
        this.props.navigation.navigate("AnimalInformation", { animal_selected: animal })
      } catch (e) {
        console.log(e)
      }
    }
  }

  onAnimalSelect(index) {
    this.setState({ selectedChecked: false })
    let animalSelectedIndex = this.state.animalSelectedIndex
    animalSelectedIndex.push(index)
    this.setState({ animalSelectedIndex })
  }

  onCheckClick() {
    if (this.state.selectedChecked === true) {
      this.setState({ selectedChecked: false })
      this.setState({ animalSelectedIndex: [] })
    } else {
      this.setState({ selectedChecked: true })
      let animalSelectedIndex = this.state.animalSelectedIndex
      animalSelectedIndex = []
      for (let i = 0; i < this.state.userAnimals.length; i++) {
        animalSelectedIndex.push(i)
      }
      this.setState({ animalSelectedIndex })
    }
  }

  async deleteAnimal() {
    let userAnimals = this.state.userAnimals
    let newUserAnimal = []

    this.setState({ loadingVisible: true })
    try {
      const userId = await AsyncStorage.getItem('user_id')

      await userAnimals.forEach((element, index) => {
        if (this.state.animalSelectedIndex.includes(index)) {
          axios.delete(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/pets/" + element.id + ".json")
            .then(res => {
              console.log('deu bom')
            })
            .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
        } else {
          newUserAnimal.push(element)
        }
      })
      this.successAlert("MyPets", "Pet(s) deletado(s) com sucesso!")
      this.setState({ userAnimals: newUserAnimal })
      this.setState({ loadingVisible: false })
      this.setState({ animalSelectedIndex: [] })
    } catch (e) {
      console.log(e)
    }
  }

  async logout() {
    try {
      this.backHandler.remove()
      await AsyncStorage.clear()
      this.props.navigation.navigate("Login")
    } catch{
      err => console.log(err)
    }
  }

  async onRefresh() {
    this.setState({ refreshing: true })

    await this.getListItem()
    await this.getUserInfo()

    this.setState({ refreshing: false })
  }

  async uploadUserAvatar() {
    const options = {
      title: 'Selecionar Avatar',
      takePhotoButtonTitle: "Tirar uma foto",
      chooseFromLibraryButtonTitle: "Escolher da galeria",
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri }

        let userInfo = this.state.userInfo
        userInfo.userAvatar = source

        this.setState({ userInfo })


        let data = {
          userAvatar: this.state.userInfo.userAvatar,
          name: this.state.userInfo.name,
          lastName: this.state.userInfo.lastName,
          cpf: this.state.userInfo.cpf,
          phone: this.state.userInfo.phone,
          dateOfBirth: this.state.userInfo.dateOfBirth
        }

        axios.put(FIREBASE_DATABASE_URL + "/app/accounts/" + this.state.userId + "/user/info.json", data)
          .then(res => {
            console.log('success')
          })
          .catch(err => console.log('error'))
      }
    })
  }

  render() {
    return (
      <View style={STYLES.gridView}>
        <Header containerStyle={{
          borderBottomWidth: 0,
          borderBottomColor: '#ddd',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 2,
        }}
          backgroundColor={this.state.animalSelectedIndex.length === 0 ? COLOR.headerBackground : "rgba(8, 174, 234, 0.9)"}
          placement="left"
          centerComponent={{
            text: this.state.animalSelectedIndex.length === 0 ? 'MyPets' :
              <CheckBox
                title={this.state.animalSelectedIndex.length + ' Selecionado(s)'}
                checked={this.state.selectedChecked}
                onPress={() => this.onCheckClick()}
                textStyle={{ color: COLOR.headerText }}
                containerStyle={STYLES.checkBoxContainer}
              />,
            style: { color: COLOR.headerText, fontSize: 25 }
          }}
          rightComponent={
            this.state.animalSelectedIndex.length === 0 ?
              <Icon
                style={{ marginRight: 15, fontSize: 30, }}
                onPress={() => this.setState({ userOptionsVisible: true })}
                name="account-circle"
                color={COLOR.headerText}
              />
              :
              <View style={{ flexDirection: 'row' }}>
                <Icon
                  style={{ marginRight: 15, fontSize: 30, }}
                  onPress={() => this.warningAlert("Deseja mesmo excluir?",
                    "Você não conseguirá recuperar as informações do pet.")}
                  name="delete"
                  color={COLOR.headerText}
                />
              </View>}
          leftComponent={this.state.animalSelectedIndex.length === 0 ? null :
            <Icon
              style={{ fontSize: 25, width: 40 }}
              onPress={() => this.setState({ animalSelectedIndex: [] })}
              name="chevron-left"
              color={COLOR.headerText}
            />}
        />

        <Loader
          loading={this.state.loadingVisible} />
        {this.state.alert}

        <Overlay
          isVisible={this.state.userOptionsVisible}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor={COLOR.overlayColor}
          overlayStyle={STYLES.overlayStyle}
        >
          <View>
            <Icon
              style={STYLES.overlayIconClose}
              name='window-close'
              size={30}
              color='red'
              onPress={() => this.setState({ userOptionsVisible: false })}
            />
            <View style={{ alignItems: "center", borderBottomWidth: 1, paddingBottom: 10 }}>
              <TouchableOpacity activeOpacity={0.9} onPress={() => this.uploadUserAvatar()}>
                <UserAvatar
                  size="130"
                  name={this.state.userInfo.name + " " + this.state.userInfo.lastName}
                  src={this.state.userInfo !== "" ? (this.state.userInfo.userAvatar !== "" ? this.state.userInfo.userAvatar.uri : null) : null}
                />
              </TouchableOpacity>

              <Text style={STYLES.itemName}> {this.state.userInfo.name + " " + this.state.userInfo.lastName} </Text>
            </View>
            <View style={{ borderBottomWidth: 1, backgroundColor: COLOR.overlayColor }}>
              {
                LIST_USER_OPTIONS.map((item, i) => (
                  <ListItem
                    contentContainerStyle={{ backgroundColor: COLOR.overlayColor }}
                    containerStyle={{ backgroundColor: COLOR.overlayColor }}
                    key={i}
                    title={item.title}
                    leftIcon={{ name: item.icon }}
                    rightIcon={{ name: 'keyboard-arrow-right' }}
                    onPress={() => this.onListClick(i)}
                  />
                ))
              }
            </View>
            <View style={{ alignItems: "center", marginTop: 10, height: "auto" }}>
              <TouchableHighlight style={STYLES.logoutButton} underlayColor='#042417' onPress={() => this.logout()}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", flex: 1 }}>
                  <Icon
                    name="logout"
                    size={15}
                    color="#FFFFFF"
                  />
                  <Text style={STYLES.textLogoutButton}> Sair </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </Overlay>

        {this.state.userAnimals === null ?
          null
          :
          (
            this.state.userAnimals.length !== 0 ?
              <View style={{ flex: 1, alignContent: "flex-end", justifyContent: "flex-end" }}>
                <ScrollView style={{ flex: 1, alignContent: "flex-start" }}
                  refreshControl={
                    <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={() => this.onRefresh()}
                    />
                  }>
                  <FlatGrid
                    itemDimension={130}
                    items={this.state.userAnimals}
                    renderItem={({ item, index }) => (
                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={[STYLES.itemContainer, {
                          backgroundColor: this.state.animalSelectedIndex.includes(index) ?
                            item.color === "rgba(153, 250, 241, 1)" ? "rgba(153, 250, 241, 0.3)" : "rgba(166, 245, 2, 0.3)"
                            : item.color
                        }]}
                        onPress={() => this.onAnimalClick(item, index)}
                        onLongPress={() => this.onAnimalSelect(index)}
                        delayLongPress={5000}>
                        <Avatar
                          activeOpacity={1}
                          rounded
                          source={item.petAvatar}
                          containerStyle={STYLES.itemAvatarContainer}
                          avatarStyle={STYLES.itemAvatar}
                          overlayContainerStyle={STYLES.itemAvatarOverlay}
                        />
                        <Text style={STYLES.itemName}>{item.name}</Text>
                        <View style={STYLES.containerBottom} >
                          <Text style={STYLES.itemRaca} >{item.breed}</Text>
                          <Text style={STYLES.itemIdade}>{item.age + (item.age === "1" ? " ano" : " anos")}</Text>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                </ScrollView>
                <ActionButton
                  buttonColor={COLOR.buttonColor}
                  onPress={() => {
                    this.backHandler.remove()
                    this.props.navigation.navigate("AddPet")
                  }}
                  buttonTextStyle={STYLES.actionButtonStyle}
                />
              </View>
              :
              <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: "40%" }}>
                <Image
                  source={dogIcon}
                  style={{ width: 100, height: 100 }}
                />
                <Text style={STYLES.textNoPet}> Você ainda não cadastrou nenhum Pet! Clique no botão abaixo para fazer isso. </Text>
                <TouchableHighlight style={STYLES.buttonAddPet} underlayColor='#042417' onPress={() => {
                  this.backHandler.remove()
                  this.props.navigation.navigate("AddPet")
                }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", height: "70%" }}>
                    <Icon
                      name="plus"
                      size={15}
                      color="#FFFFFF"
                    />
                    <Text style={STYLES.textLogoutButton}> Adicionar Pet </Text>
                  </View>
                </TouchableHighlight>

              </View>)}
      </View>
    )
  }
}

const STYLES = StyleSheet.create({
  gridView: {
    // marginTop: 20,
    flex: 1,
    backgroundColor: COLOR.screenBackground
  },
  itemContainer: {
    justifyContent: 'flex-start',
    borderRadius: 10,
    padding: 10,
    height: "auto",
    // backgroundColor: COLOR.flatGridColor,
    alignItems: "center"
  },
  itemAvatar: {
    borderRadius: 90,
  },
  itemAvatarContainer: {
    width: 130,
    height: 130,
  },
  itemAvatarOverlay: {
    backgroundColor: "transparent",
  },
  itemName: {
    fontSize: 22,
    color: 'rgba(28,28,28,0.9)',
    fontWeight: '600',
    marginBottom: 20
  },
  containerBottom: {
    flex: 1,
    justifyContent: "flex-end",
    textAlign: "left",
    width: "100%"
  },
  itemRaca: {
    fontWeight: '500',
    fontSize: 15,
    color: 'rgba(28,28,28,0.7)',
  },
  itemIdade: {
    fontWeight: '500',
    fontSize: 13,
    color: 'rgba(128,128,128,1)'
  },
  actionButtonStyle: {
    fontSize: 25,
  },
  overlayStyle: {
    borderRadius: 20,
    width: "80%",
    height: "auto"
  },

  overlayIconClose: {
    textAlign: "right",
    marginRight: 10
  },

  textLogoutButton: {
    color: "#FFFFFF",
    fontSize: 15,
    marginLeft: 5
  },

  logoutButton: {
    backgroundColor: "rgba(42 ,245, 152, 1)",
    borderRadius: 20,
    height: 40,
    width: "50%",
    marginTop: 5,
    marginBottom: 10
  },

  buttonAddPet: {
    backgroundColor: COLOR.buttonColor,
    borderRadius: 25,
    height: 50,
    width: "45%",
    marginTop: "20%",
    marginBottom: 15,
    alignItems: "center",
    alignContent: "center",
  },
  textNoPet: {
    width: "50%",
    textAlign: "center",
    fontSize: 15,
    color: "#363636"
  },
  checkBoxContainer: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
});

export default withNavigationFocus(Home)