import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePicker from "react-native-modal-datetime-picker"
import MultiSelect from 'react-native-multiple-select'
import LinearGradient from 'react-native-linear-gradient'
import Header from '../../../components/header/header'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import Loader from '../../../components/Loader/loader'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { FIREBASE_DATABASE_URL } from '../../../variables/firebaseConfig'
import { VACCINE_LIST, RADIO_PROPS } from '../../../variables/general'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import { FlatGrid } from 'react-native-super-grid'
import { Overlay } from 'react-native-elements'

//Cor comum da Pagina
const commun = {
  color: 'rgb(15,175,233)'
}

class Vaccine extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isDateTimePickerVisible: false, //Variavel para deixar ou não o DateTimePicker visivel
      date: '', //Variavel que irá receber a Data
      time: '', //Variavel que irá receber o Timer
      selectedItems: [], //Array para armazenar as escolhas
      alert: null,
      loadingVisible: false,
      petShopSelected: this.props.navigation.getParam('petShopSelected'),
      overlayVisible: false,
      timeIndex: null,
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

  /**
   * Deixar DateTimePicker visivel
   */
  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true })

  /**
   * Deixar DateTimePicker invisivel
   */
  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false })

  /**
   * Salva a data, hora, minuto no estado
   * @param date Dados resultantes da escolha do Proprietário
   */
  handleDatePicked = date => this.setState({ date: this.getDate(date) }, this.hideDateTimePicker())

  /**
   * @param date Dados resultantes da escolha do Proprietário
   * @returns A data correspondente a escolha
   */
  getDate = date => {

    let day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
    let monthIndex = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : `0${(date.getMonth() + 1)}`
    let year = date.getFullYear()

    return day + '/' + monthIndex + '/' + year
  }

  /**
   * @param date Dados resultantes da escolha do Proprietário
   * @returns A Timer correspondente a escolha
   */
  getTime = date => {

    var hour = date.getHours()
    var minute = date.getMinutes()

    return hour + ':' + minute
  }

  /**
   * Salva os dados no Banco
   */
  async save() {
    let selecteds = {
      v8: this.state.selectedItems.includes("V8") ? "yes" : "no",
      v10: this.state.selectedItems.includes("V10") ? "yes" : "no",
      v12: this.state.selectedItems.includes("V12") ? "yes" : "no",
      gripeCanina: this.state.selectedItems.includes("Gripe Canina") ? "yes" : "no",
      glardia: this.state.selectedItems.includes("Glárdia") ? "yes" : "no",
      raivaCanina: this.state.selectedItems.includes("Raiva Canina") ? "yes" : "no",
      leishmaniose: this.state.selectedItems.includes("Leishmaniose") ? "yes" : "no"
    }

    this.props.navigation.navigate("ScheduleEnd", {
      scheduleProps: {
        type: "Vaccine",
        date: this.state.date,
        time: this.state.time,
        selecteds: selecteds,
        petShopSelected: this.state.petShopSelected,
        communColor: commun.color
      }
    })

  }

  /**
   * Alert que irá avisar que os campos não foram preenchidos
   */
  warning = () => this.errorAlert("MyPets", "Por favor, todos os campos são necessários para o agendamento.")

  /**
   * @returns JSX correspondente se os dados foram válidos 
   */
  confirm = () => {

    //Verificação se os campos não estão vazios
    if (this.state.selectedItems[0] && this.state.date && this.state.time) {
      return (
        <TouchableOpacity style={styles.schedule} onPress={() => this.save()}>
          <Text style={{ color: 'white', fontSize: 40, fontWeight: '400', fontFamily: 'big_noodle_titling' }}>Agendar</Text>
        </TouchableOpacity>
      )

    } else {
      return (
        <TouchableOpacity style={styles.schedule} onPress={this.warning}>
          <Text style={{ color: 'white', fontSize: 40, fontWeight: '400', fontFamily: 'big_noodle_titling' }}>Agendar</Text>
        </TouchableOpacity>
      )
    }
  }

  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  };

  timeSelect(time, timeIndex) {
    this.setState({ time })
    this.setState({ timeIndex })
  }

  // async handleEmail() {
  //   try {
  //     let userId = await AsyncStorage.getItem("user_id")

  //     await axios.get(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/user/auth.json")
  //       .then(res => {
  //         let email = res.data.email

  //         const to = [email] // string or array of email addresses
  //         email(to, {
  //           // cc: ['bazzy@moo.com', 'doooo@daaa.com'],
  //           // bcc: 'mee@mee.com',
  //           subject: 'MyPets - Agendamento',
  //           body: 'Obrigado!'
  //         }).catch(console.error)
  //       })
  //       .catch(err => console.log(err))
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  render() {

    return (
      <ScrollView style={styles.mainContainer}>
        {this.state.alert}
        <Loader
          loading={this.state.loadingVisible} />
        <View style={styles.secondContainer}>

          <TouchableOpacity style={styles.calendar}
            onPress={this.showDateTimePicker}>
            <View style={{ justifyContent: 'center', width: '70%' }}>

              {this.state.date ?
                <TextInput style={styles.input}
                  placeholder='Selecionar data...'
                  placeholderTextColor='white'
                  value={this.state.date}
                  editable={false}></TextInput> :
                <Text style={styles.date}>Selecionar data...</Text>}

            </View>

            <View style={{ justifyContent: 'center' }}>
              <Icon name='caret-down' size={20} color='white' style={{ marginRight: 20 }} />
            </View>

          </TouchableOpacity>

          <DateTimePicker
            titleStyle={{ marginLeft: 20 }}
            is24Hour={true}
            mode='date'
            locale='pt-br'
            minimumDate={new Date()}
            isVisible={this.state.isDateTimePickerVisible}
            onConfirm={this.handleDatePicked}
            onCancel={this.hideDateTimePicker}
          />

        </View>

        {this.state.date !== '' ?
          <View style={styles.secondContainer}>
            <TouchableOpacity style={styles.calendar}
              onPress={() => this.setState({ overlayVisible: true })}>
              <View style={{ justifyContent: 'center', width: '70%' }}>
                <TextInput style={styles.input}
                  placeholder='Escolher horário...'
                  placeholderTextColor='white'
                  value={this.state.time}
                  editable={false}></TextInput>
              </View>

              <View style={{ justifyContent: 'center' }}>
                <Icon name='caret-down' size={20} color='white' style={{ marginRight: 20 }} />
              </View>

              {/* </View> */}
            </TouchableOpacity>
          </View>
          : null}
        <Overlay
          isVisible={this.state.overlayVisible}
          windowBackgroundColor="rgba(255, 255, 255, .5)"
          overlayBackgroundColor={"#FFFFFF"}
          overlayStyle={{ width: "90%", borderRadius: 20, height: "auto" }}
        >
          <View style={{ marginTop: 20, width: "100%", aligItems: "center", alignContent: "center", textAlign: "center" }}>
            <Text style={{ textAlign: "center", marginBottom: 20 }}> Horários Disponíveis: </Text>
            <RadioForm
              style={{ aligItems: "center", alignContent: "center", textAlign: "center" }}
              formHorizontal={true}
              animation={true}
            >
              <FlatGrid
                itemDimension={130}
                items={RADIO_PROPS}
                renderItem={({ item, index }) => (
                  <RadioButton labelHorizontal={true} key={index} >
                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                    <RadioButtonInput
                      style={{ width: "80%", alignContent: "space-between" }}
                      obj={item}
                      index={index}
                      isSelected={this.state.timeIndex === index}
                      onPress={(time) => this.timeSelect(time, index)}
                      borderWidth={1}
                      buttonInnerColor={commun.color}
                      buttonOuterColor={commun.color}
                      buttonSize={18}
                      buttonOuterSize={18}
                      buttonStyle={{}}
                    // buttonWrapStyle={{ marginLeft: 5 }}
                    />
                    <RadioButtonLabel
                      obj={item}
                      index={index}
                      labelHorizontal={true}
                      onPress={(time) => this.timeSelect(time, index)}
                      labelStyle={{ fontSize: 14, color: commun.color }}
                      labelWrapStyle={{}}
                    />
                  </RadioButton>
                )}
              />
            </RadioForm>
            <View style={{ alignItems: "center", alignContent: "center" }}>
              <TouchableHighlight style={{
                backgroundColor: commun.color,
                borderRadius: 20,
                height: 40,
                width: "50%",
                marginTop: 5,
                marginTop: 20,
                justifyContent: "center"
              }}
                onPress={() => this.setState({ overlayVisible: false })}>
                <Text style={{ color: "#FFFFFF", textAlign: "center", textAlignVertical: "center" }}> Finalizar </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Overlay>

        {/* Entrada de dados da descrição */}
        <View style={{ justifyContent: 'center', marginTop: 20 }}>

          <View style={styles.fistContainer} >

            {/* Área de escolha da Vacina */}

            <View style={{ justifyContent: 'center', width: '80%' }}>

              <MultiSelect
                selectText="selecionado(s)"
                hideDropdown
                hideSubmitButton
                hideTags
                placeholderTextColor='white'
                altFontFamily="HelveticaNeueLight"
                items={VACCINE_LIST} //Lista
                uniqueKey="id" //Chave
                ref={(component) => { this.multiSelect = component }}
                onSelectedItemsChange={this.onSelectedItemsChange}
                selectedItems={this.state.selectedItems}
                selectText='     Selecione as opções'
                styleSelectorContainer={{ borderRadius: 10, backgroundColor: commun.color }}
                styleListContainer={{ backgroundColor: commun.color }} //Colorir a Lista de Itens
                searchInputPlaceholderText=""
                styleInputGroup={{ borderRadius: 8, backgroundColor: commun.color }} //Colorir a 'Pesquisa...'
                styleDropdownMenuSubsection={{ borderRadius: 8, backgroundColor: commun.color }}
                textColor='white' //Colorir o 'Selecione as opções'
                styleTextDropdownSelected={{ borderRadius: 8, backgroundColor: commun.color }}
                itemTextColor='white'
                displayKey="name"
                searchInputStyle={{ color: 'white' }}
                submitButtonColor={commun.color} //Cor do botão
                submitButtonText="OK"
                tagBorderColor='white'
                tagTextColor='white'
                selectedItemIconColor='white' //Cor do icone selecionado
                selectedItemTextColor='white' //cor do texto do icone selecionado
                tagRemoveIconColor='white'
                placeholderTextColor='white'
                styleRowList={{ borderTopWidth: 0.5, borderColor: 'white' }}
                searchIcon={<Icon name='search' size={15} color='white' />}
                fixedHeight={true}
              />
            </View>
          </View>
          {/* Botão de confirmação */}
          <View style={styles.confirm}>
            {this.confirm()}
          </View>

        </View>

      </ScrollView>
    );
  }
}

//Estilos
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 0.8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    // borderTopRightRadius: 10,
    // borderTopLeftRadius: 10,
    // padding: 20
  },
  fistContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    marginVertical: 20
  },
  secondContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
    marginTop: 20
  },
  containerAdicionais: {
    alignItems: "center"
  },
  input: {
    backgroundColor: commun.color,
    fontFamily: 'HelveticaNeueLight',
    justifyContent: 'flex-start',
    color: 'white',
    width: '100%',
    borderRadius: 5,
    paddingLeft: 20
  },
  date: {
    fontFamily: 'HelveticaNeueLight',
    color: 'white',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    marginLeft: 20
  },
  openDate: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5
  },
  calendar: {
    backgroundColor: commun.color,
    flexDirection: 'row',
    borderRadius: 5,
    justifyContent: "center",
    textAlignVertical: "center",
    height: 50,
  },
  noSchedule: {
    borderColor: commun.color,
    borderWidth: 5,
    borderRadius: 20,
    marginVertical: 20,
    padding: 10
  },
  schedule: {
    backgroundColor: commun.color,
    borderColor: commun.color,
    borderWidth: 5,
    borderRadius: 20,
    marginVertical: 20,
    padding: 10,
  },
  confirm: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 5,
  }
});

Vaccine.navigationOptions = {
  header: null,
}


export default Vaccine