import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	Image,
	Dimensions,
	Text,
	TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import AsyncStorage from '@react-native-community/async-storage'
import axios from 'axios'
import { FIREBASE_DATABASE_URL } from '../../variables/firebaseConfig'
import Loader from '../../components/Loader/loader'
import LinearGradient from 'react-native-linear-gradient'

class Header extends Component {
	constructor(props) {
		super(props)

		this.state = {
			dataAnimal: null,
		}
	}

	// componentDidMount() {
	// 	this.getInfoAnimal()
	// }

	// async getInfoAnimal() {
	// 	try {
	// 		const getAnimal = await AsyncStorage.getItem('animal_selected')
	// 		const animalSelected = await JSON.parse(getAnimal)
	// 		this.setState({ dataAnimal: animalSelected })

	// 	} catch (e) {
	// 		console.log(e)
	// 	}
	// }

	render() {
		return (

			<LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
				colors={['rgb(15,175,233)', 'rgb(0,243,151)']} style={styles.background}>

				<View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: "center" }}>
					{/* Imagem do Animal */}
					<View style={styles.imageContainer}>
						<Image style={styles.image} source={this.props.petAvatar} />
					</View>

					{/* Iformações basicas do Animal */}
					<View style={styles.dataAnimal}>
						{/* <Text style={styles.name}>{this.state.dataAnimal.name}</Text> */}
						<Text style={styles.name}>{this.props.name}</Text>
						<Text style={styles.info}>{this.props.species + " - " + this.props.sex}</Text>
						<Text style={styles.info}>{`${this.props.weight.split('.').join(',')} kg - ${this.props.age} ${this.props.age === "1" ? " ano" : " anos"}`}</Text>
						<Text style={styles.info}>{this.props.breed}</Text>
					</View>
				</View>
				{/* Botão de editar dados do Animal */}
				<View style={styles.edit}>
					<TouchableOpacity onPress={this.props.onPress}>
						<Icon name='edit' color='white' size={30}></Icon>
					</TouchableOpacity>
				</View>
			</LinearGradient>
		)
	}
}

//Estilos
const styles = StyleSheet.create({
	background: {
		height: "auto",
		flexDirection: 'row',
		justifyContent: 'space-between',
		borderBottomWidth: 0,
		borderBottomColor: '#ddd',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.8,
		shadowRadius: 2,
		elevation: 2,
		alignContent: "center"
	},
	// animalInfo: {
	// 	flex: 0.3,
	// 	flexDirection: 'row',
	// 	justifyContent: 'space-between'
	// },
	image: {
		width: 90,
		height: 90,
		margin: 5,
		marginLeft: 10,
		borderRadius: 100,
		borderWidth: 2,
		borderColor: 'white',
	},
	imageContainer: {
		justifyContent: 'center',
		alignItems: 'flex-end'
	},
	dataAnimal: {
		flexDirection: 'column',
		justifyContent: 'center',
		marginTop: 24,
		margin: 5,
	},
	edit: {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		marginRight: 10,
		marginBottom: 10
	},
	name: {
		color: 'white',
		fontFamily: 'big_noodle_titling',
		fontWeight: '300',
		fontSize: 25
	},
	info: {
		color: 'white',
		fontFamily: 'big_noodle_titling',
		fontWeight: '300',
		fontSize: 15
	},
});

Header.navigationOptions = {
	header: null,
}

export default Header