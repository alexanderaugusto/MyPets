import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import LinearGradient from 'react-native-linear-gradient'
import Header from '../../components/header/header'

export default class App extends Component {

  render() {
    
    return (

        <View style={styles.mainContainer}>

          {/* Container Consultas */}
          <View style={styles.consult}>
            <TouchableOpacity style={{ flexDirection: 'row' }}
              onPress={() => this.props.navigation.navigate('HConsult')}>
              <Icon name='notes-medical' color='white' size={30} style={styles.icon}></Icon>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.text}>HISTÓRICO DE CONSULTAS</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Container Medicamentros */}
          <View style={styles.medicines}>
            <TouchableOpacity style={{ flexDirection: 'row' }}
              onPress={() => this.props.navigation.navigate('HMedicines')}>
              <Icon name='briefcase-medical' color='white' size={30} style={styles.icon}></Icon>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.text}>HISTÓRICO DE MEDICAMENTOS</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Container Vacinas */}
          <View style={styles.vaccine}>
            <TouchableOpacity style={{ flexDirection: 'row' }}
              onPress={() => this.props.navigation.navigate('HVaccine')}>
              <Icon name='syringe' color='white' size={30} style={styles.icon}></Icon>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.text}>HISTÓRICO DE VACINAS</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
    );
  }
}

//Estilos
const styles = StyleSheet.create({
  background: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  mainContainer: {
    flex: 0.8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    // borderTopRightRadius: 10,
    // borderTopLeftRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10
  },
  text: {
    color: 'white',
    fontFamily: 'Bariol',
    fontWeight: '400',
    fontSize: 15,
  },
  vaccine: {
    backgroundColor: 'rgb(15,175,233)',
    borderRadius: 10,
    margin: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'

  },
  consult: {
    backgroundColor: 'rgb(137,215,235)',
    borderRadius: 10,
    margin: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  hygiene: {
    backgroundColor: 'rgb(115,243,210)',
    borderRadius: 10,
    margin: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  medicines: {
    backgroundColor: 'rgb(0,243,151)',
    borderRadius: 10,
    margin: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

App.navigationOptions = {
  header: null
}