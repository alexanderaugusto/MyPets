import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import LinearGradient from 'react-native-linear-gradient'
import Header from '../../components/header/header'

class Agendar extends Component {

  constructor(props) {
    super(props)

    this.state = {

    }
  }


  render() {

    return (

      <View style={styles.mainContainer}>

        <View style={styles.fistContainer}>

          {/* Container Vacina */}
          <TouchableOpacity style={styles.vaccine}
            onPress={() => this.props.navigation.navigate('ChoosePetShop', { type: 'Vaccine' })}
          >
            <Icon name='syringe' color='white' size={30} style={styles.icon}></Icon>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.text}>VACINAS</Text>
            </View>
          </TouchableOpacity>

          {/* Container Consulta */}
          <TouchableOpacity style={styles.consult}
            onPress={() => this.props.navigation.navigate('ChoosePetShop', { type: 'Consult' })}>
            <Icon name='notes-medical' color='white' size={30} style={styles.icon}></Icon>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.text}>CONSULTAS</Text>
            </View>
          </TouchableOpacity>

        </View>

        <View style={styles.secondContainer}>

          {/* Container Higiene */}
          <TouchableOpacity style={styles.hygiene}
            onPress={() => this.props.navigation.navigate('ChoosePetShop', { type: 'Hygiene' })}>
            <Image style={styles.image} source={require('../../assets/img/Brendhon/Ativo.png')} />
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.text}>HIGIENE</Text>
            </View>
          </TouchableOpacity>

          {/* Container Medicamentos */}
          {/* <TouchableOpacity style={styles.medicines}
            onPress={() => this.props.navigation.navigate('ChoosePetShop', { type: 'Medicines' })}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Icon name='briefcase-medical' color='white' size={30} style={styles.icon}></Icon>
              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text style={styles.text}>MEDICAMENTOS</Text>
              </View>
            </View>
          </TouchableOpacity> */}

        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  image: {
    width: 50,
    height: 50,
    margin: 10,
  },
  mainContainer: {
    flex: 0.8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    // borderTopRightRadius: 10,
    // borderTopLeftRadius: 10,
    justifyContent: 'center',
    // padding: 20
  },
  fistContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  secondContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20
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
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 45,
    marginRight: 20
  },
  consult: {
    backgroundColor: 'rgb(137,215,235)',
    borderRadius: 20,
    padding: 20,
    paddingHorizontal: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20
  },
  hygiene: {
    backgroundColor: 'rgb(115,243,210)',
    borderRadius: 20,
    padding: 20,
    paddingHorizontal: 40,
    marginRight: 20
  },
  medicines: {
    backgroundColor: 'rgb(0,243,151)',
    borderRadius: 20,
    padding: 20,
    marginLeft: 20
  },
});

Agendar.navigationOptions = {
  header: null,
}

export default Agendar;