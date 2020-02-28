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
import Icons from 'react-native-vector-icons/Fontisto'
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import DateTimePicker from "react-native-modal-datetime-picker"
import LinearGradient from 'react-native-linear-gradient'
import Header from '../../../components/header/header'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import Loader from '../../../components/Loader/loader'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { FIREBASE_DATABASE_URL } from '../../../variables/firebaseConfig'
import { RADIO_PROPS } from '../../../variables/general'
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button'
import { FlatGrid } from 'react-native-super-grid'
import { Overlay } from 'react-native-elements'

//Cor comum da Pagina
const commun = {
  color: 'rgb(137,215,235)'
}

class Consult extends Component {

  constructor(props) {
    super(props)

    this.state = {
      description: '', //Variavel onde a descrição será salva
      isDateTimePickerVisible: false, //Variavel para deixar ou não o DateTimePicker visivel
      time: '',
      date: '',
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
  handleDatePicked = date => {
    this.setState({ date: this.getDate(date) }, this.hideDateTimePicker())
  }

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
    this.props.navigation.navigate("ScheduleEnd", {
      scheduleProps: {
        type: "Consult",
        date: this.state.date,
        time: this.state.time,
        description: this.state.description,
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
    if (this.state.description && this.state.date && this.state.time) {

      return (

        <TouchableOpacity style={styles.schedule}
          onPress={() => this.save()}
        >
          <Text style={{ color: 'white', fontSize: 40, fontWeight: '400', fontFamily: 'big_noodle_titling' }}>Agendar</Text>
        </TouchableOpacity>

      )

    } else {

      return (

        <TouchableOpacity style={styles.schedule}
          onPress={this.warning}
        >
          <Text style={{ color: 'white', fontSize: 40, fontWeight: '400', fontFamily: 'big_noodle_titling' }}>Agendar</Text>
        </TouchableOpacity>

      )
    }
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
            onPress={this.showDateTimePicker}>
            <View style={{ justifyContent: 'center', width: '70%' }}>

              {this.state.date ?
                <TextInput style={styles.inputDate}
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
                <TextInput style={styles.inputDate}
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
        <View style={{ justifyContent: 'center' }}>

          <View style={styles.fistContainer} >

            <View style={{ justifyContent: 'center', alignItems: 'center', width: '80%' }}>
              <TextInput style={styles.input}
                placeholder='Descreva os sintomas...'
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
    borderColor: commun.color,
    borderWidth: 2,
    fontFamily: 'HelveticaNeueLight',
    justifyContent: 'flex-start',
    alignItems: "flex-start",
    textAlignVertical: "top",
    color: '#363636',
    width: '100%',
    borderRadius: 5,
    paddingLeft: 20,
    height: 130
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

Consult.navigationOptions = {
  header: null,
}

export default Consult