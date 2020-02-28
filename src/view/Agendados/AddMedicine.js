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
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import DateTimePicker from "react-native-modal-datetime-picker"
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import Loader from '../../components/Loader/loader'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { FIREBASE_DATABASE_URL } from '../../variables/firebaseConfig'
import { RADIO_PROPS } from '../../variables/general'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import { FlatGrid } from 'react-native-super-grid'
import { Overlay } from 'react-native-elements'

//Cor comum da Pagina
const commun = {
  color: 'rgb(0,243,151)'
}

class AddMedicine extends Component {
  constructor(props) {
    super(props)

    this.state = {
      description: '', //Variavel onde a descrição será salva
      isDateTimePickerVisibleStart: false, //Variavel para deixar ou não o DateTimePicker visivel
      isDateTimePickerVisibleEnd: false, //Variavel para deixar ou não o DateTimePicker visivel
      isTimePickerVisible: false, //Variavel para deixar ou não o DateTimePicker visivel
      dateStart: '', //Variavel que irá receber a Data de Inicio
      dateEnd: '', //Variavel que irá receber a Data de Fim
      time: '', //Variavel que irá receber o Timer
      alert: null,
      loadingVisible: false,
      overlayVisible: false,
      timeIndex: null,
      minimumDate: new Date()
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
            this.props.navigation.goBack(null)
          }}>Ok</SCLAlertButton>
        </SCLAlert>
    })
  }

  /**
   * Deixar DateTimePicker visivel
   */
  showDateTimePickerStart = () => this.setState({ isDateTimePickerVisibleStart: true })

  showDateTimePickerEnd = () => this.setState({ isDateTimePickerVisibleEnd: true })

  showTimePicker = () => this.setState({ isTimePickerVisible: true })
  /**
   * Deixar DateTimePicker invisivel
   */
  hideDateTimePickerStart = () => this.setState({ isDateTimePickerVisibleStart: false })

  hideDateTimePickerEnd = () => this.setState({ isDateTimePickerVisibleEnd: false })

  hideTimePicker = () => this.setState({ isTimePickerVisible: false })

  /**
   * Salva a data, hora, minuto no estado
   * @param date Dados resultantes da escolha do Proprietário
   */
  handleDatePickedStart = date => this.setState({ dateStart: this.getDate(date), minimumDate: date }, this.hideDateTimePickerStart())

  handleDatePickedEnd = date => this.setState({ dateEnd: this.getDate(date) }, this.hideDateTimePickerEnd())

  handleTimePicked = date => this.setState({ time: this.getTime(date) }, this.hideTimePicker())

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
    var hour = date.getHours() < 10 ? "0"+date.getHours() : date.getHours() 
    var minute = date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()

    return hour + ':' + minute
  }

  /**
   * Salva os dados no Banco
   */
  async save() {
    if (this.state.dateStart !== '' && this.state.dateEnd !== '' && this.state.time !== '') {
      this.setState({ loadingVisible: true })
      try {
        const userId = await AsyncStorage.getItem('user_id')
        const getAnimal = await AsyncStorage.getItem('animal_selected')
        const animalSelected = await JSON.parse(getAnimal)

        let data = {
          description: this.state.description,
          dateStart: this.state.dateStart,
          dateEnd: this.state.dateEnd,
          time: this.state.time,
        }

        await axios.post(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/pets/" + animalSelected.id + "/medicamentos.json", data)
          .then(res => {
            this.successAlert("MyPets", "Medicamento inserido!")
          })
          .catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
      } catch (e) {
        console.log(e)
      }
      this.setState({ loadingVisible: false })
    }else{
      this.warning()
    }

  }

  /**
   * Alert que irá avisar que os campos não foram preenchidos
   */
  warning = () => this.errorAlert("MyPets", "Por favor, todos os campos são necessários para o agendamento.")

  /**
   * @returns JSX correspondente se os dados foram válidos 
   */
  confirm = () => {

    return (

      <TouchableOpacity style={styles.schedule}
        onPress={() => this.save()}
      >
        <Text style={{ color: 'white', fontSize: 40, fontWeight: '400', fontFamily: 'big_noodle_titling' }}>Agendar</Text>
      </TouchableOpacity>

    )
  }

  timeSelect(time, timeIndex) {
    this.setState({ time })
    this.setState({ timeIndex })
  }

  render() {
    return (

      <ScrollView style={styles.mainContainer}>
        {this.state.alert}
        <Loader
          loading={this.state.loadingVisible} />
        <View style={styles.secondContainer}>

          <TouchableOpacity style={styles.calendar}
            onPress={this.showDateTimePickerStart}>
            <View style={{ justifyContent: 'center', width: '70%' }}>
              {this.state.dateStart ?
                <TextInput style={styles.inputDate}
                  placeholder='Data de Início...'
                  placeholderTextColor='white'
                  value={this.state.dateStart}
                  editable={false}></TextInput> :
                <Text style={styles.date}>Data de Início...</Text>}
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Icon name='caret-down' size={20} color='white' style={{ marginRight: 20 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.calendar, { marginTop: 20 }]}
            onPress={this.showDateTimePickerEnd}>
            <View style={{ justifyContent: 'center', width: '70%' }}>
              {this.state.dateEnd ?
                <TextInput style={styles.inputDate}
                  placeholder='Data final...'
                  placeholderTextColor='white'
                  value={this.state.dateEnd}
                  editable={false}></TextInput> :
                <Text style={styles.date}>Data final...</Text>}
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Icon name='caret-down' size={20} color='white' style={{ marginRight: 20 }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.calendar, { marginTop: 20 }]}
            onPress={this.showTimePicker}>
            <View style={{ justifyContent: 'center', width: '70%' }}>
              {this.state.time ?
                <TextInput style={styles.inputDate}
                  placeholder='De quantas em quantas horas?'
                  placeholderTextColor='white'
                  value={this.state.time}
                  editable={false}></TextInput> :
                <Text style={styles.date}>De quantas em quantas horas?</Text>}
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
            isVisible={this.state.isDateTimePickerVisibleStart}
            onConfirm={this.handleDatePickedStart}
            onCancel={this.hideDateTimePickerStart}
          />

          <DateTimePicker
            titleStyle={{ marginLeft: 20 }}
            is24Hour={true}
            mode='date'
            locale='pt-br'
            minimumDate={this.state.minimumDate}
            isVisible={this.state.isDateTimePickerVisibleEnd}
            onConfirm={this.handleDatePickedEnd}
            onCancel={this.hideDateTimePickerEnd}
          />

          <DateTimePicker
            titleStyle={{ marginLeft: 20 }}
            is24Hour={true}
            mode='time'
            locale='pt-br'
            isVisible={this.state.isTimePickerVisible}
            onConfirm={this.handleTimePicked}
            onCancel={this.hideTimePicker}
            minuteInterval={30}
          />

        </View>

        {/* Entrada de dados da descrição */}
        <View style={{ justifyContent: 'center' }}>

          <View style={styles.fistContainer} >
            <View style={{ justifyContent: 'center', alignItems: 'center', width: '80%' }}>
              <TextInput style={styles.input}
                placeholder='Descreva o medicamento e o que achar necessário.'
                placeholderTextColor='grey'
                value={this.state.description}
                onChangeText={description => this.setState({ description })}
                multiline={true}
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
  inputDate: {
    backgroundColor: commun.color,
    fontFamily: 'HelveticaNeueLight',
    justifyContent: 'flex-start',
    color: 'white',
    width: '100%',
    borderRadius: 5,
    paddingLeft: 20,
  },
  input: {
    // backgroundColor: commun.color,
    borderColor: commun.color,
    borderWidth: 2,
    fontFamily: 'HelveticaNeueLight',
    justifyContent: 'flex-start',
    color: '#363636',
    width: '100%',
    borderRadius: 5,
    paddingLeft: 20,
    height: 130,
    alignItems: "flex-start",
    textAlignVertical: "top",
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
    marginBottom: "20%"
  }
});

AddMedicine.navigationOptions = {
  header: null,
}

export default AddMedicine