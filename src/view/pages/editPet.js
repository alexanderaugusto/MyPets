import React, { Component } from 'react'
import { Alert, Text, ScrollView, View, TouchableHighlight, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Input, Avatar } from 'react-native-elements'
import { COLOR, SPECIES_SELECT, BREED_SELECT, SEX_SELECT } from '../../variables/general'
import { FIREBASE_DATABASE_URL } from '../../variables/firebaseConfig'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Loader from '../../components/Loader/loader'
import RNPickerSelect from 'react-native-picker-select'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'
import CameraIcon from '../../assets/img/camera-icon.png'
import ImagePicker from 'react-native-image-picker'

export default class EditPet extends Component {
	static navigationOptions = {
		title: "Editar Pet",
		headerStyle: {
			backgroundColor: COLOR.headerBackground,
		},
		headerTintColor: COLOR.headerText
	}

	constructor(props) {
		super(props)

		this.state = {
			dataInfos: this.props.navigation.getParam('pet_data'),
			loadingVisible: false,
			alert: null
		}

		this.inputRefs = {}
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
						this.props.navigation.navigate("AnimalInformation", { animal_selected: this.state.dataInfos })
					}}>Ok</SCLAlertButton>
				</SCLAlert>
		})

		let interval = setTimeout(async function(){

			try {
				this.setState({ alert: null })
				await AsyncStorage.setItem('animal_selected', JSON.stringify(this.state.dataInfos))
				this.props.navigation.navigate("AnimalInformation", { animal_selected: this.state.dataInfos })
			} catch (err) {
				console.log(err)
			}

		}, 2500)
	}

	hideAlert(interval) {
		this.setState({ alert: null })
		clearInterval(interval)
	}

	onInputChange(type, value) {
		let dataInfos = this.state.dataInfos
		dataInfos[type] = value
		this.setState({ dataInfos })
	}

	async handleClick() {
		if (this.state.dataInfos.name !== '' && this.state.dataInfos.species !== null
			&& this.state.dataInfos.breed !== null && this.state.dataInfos.sex !== null
			&& this.state.dataInfos.age !== '' && this.state.dataInfos.weight !== ''
			&& this.state.dataInfos.petAvatar !== 13) {
			this.setState({ loadingVisible: true })
			try {
				const userId = await AsyncStorage.getItem('user_id')
				const getAnimal = await AsyncStorage.getItem('animal_selected')
				const animalId = this.state.dataInfos.id

				let data = {
					name: this.state.dataInfos.name,
					species: this.state.dataInfos.species,
					breed: this.state.dataInfos.breed,
					sex: this.state.dataInfos.sex,
					age: this.state.dataInfos.age,
					weight: this.state.dataInfos.weight,
					petAvatar: this.state.dataInfos.petAvatar
				}
				await axios.put(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/pets/" + animalId + ".json", data)
					.then(res => {
						this.successAlert("MyPets", "Informações alteradas com sucesso!")
					})
					.catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
			} catch (e) {
				console.log(e)
			}
			this.setState({ loadingVisible: false })
		}
		else {
			this.errorAlert("Dados Inválido!", "Por favor, preencha os campos de forma correta.")
		}
	}

	uploadAvatar() {
		const options = {
			title: 'Selecionar Avatar',
			takePhotoButtonTitle: "Tirar uma foto",
			chooseFromLibraryButtonTitle: "Escolher da galeria",
			// customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
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

				let dataInfos = this.state.dataInfos
				dataInfos.petAvatar = source

				this.setState({ dataInfos })
			}
		})
	}

	render() {
		return (
			<ScrollView contentContainerStyle={STYLES.container}>
				<Loader
					loading={this.state.loadingVisible} />
				{this.state.alert}

				<View style={{ marginTop: "10%", alignItems: "center" }}>
					<Avatar
						rounded
						source={this.state.dataInfos.petAvatar}
						onPress={() => this.uploadAvatar()}
						size="xlarge"
					/>
				</View>

				<Input
					placeholder="Nome..."
					inputStyle={STYLES.input}
					inputContainerStyle={STYLES.inputContainer2}
					containerStyle={STYLES.inputContainer1}
					underlineColorAndroid='transparent'
					onChangeText={value => this.onInputChange("name", value)}
					value={this.state.dataInfos.name}
				/>

				<RNPickerSelect
					placeholder={{
						label: 'Espécie do animal...',
						value: null,
						color: "grey"
					}}
					items={SPECIES_SELECT}
					onValueChange={value => this.onInputChange("species", value)}
					onUpArrow={() => { this.inputRefs.name.focus() }}
					onDownArrow={() => { this.inputRefs.picker2.togglePicker() }}
					style={{ ...pickerSelectStyles }}
					value={this.state.dataInfos.species}
					ref={(el) => { this.inputRefs.picker = el }}
				/>

				<RNPickerSelect
					placeholder={{
						label: 'Raça do animal...',
						value: null,
						color: "grey"
					}}
					items={BREED_SELECT[this.state.dataInfos.species]}
					onValueChange={value => this.onInputChange("breed", value)}
					onUpArrow={() => { this.inputRefs.name.focus() }}
					onDownArrow={() => { this.inputRefs.picker2.togglePicker() }}
					style={{ ...pickerSelectStyles }}
					value={this.state.dataInfos.breed}
					ref={(el) => { this.inputRefs.picker = el }}
				/>

				<RNPickerSelect
					placeholder={{
						label: 'Sexo do animal...',
						value: null,
						color: "grey"
					}}
					items={SEX_SELECT}
					onValueChange={value => this.onInputChange("sex", value)}
					onUpArrow={() => { this.inputRefs.name.focus() }}
					onDownArrow={() => { this.inputRefs.picker2.togglePicker() }}
					style={{ ...pickerSelectStyles }}
					value={this.state.dataInfos.sex}
					ref={(el) => { this.inputRefs.picker = el }}
				/>

				<Input
					placeholder="Idade..."
					inputStyle={STYLES.input}
					inputContainerStyle={STYLES.inputContainer2}
					containerStyle={STYLES.inputContainer1}
					underlineColorAndroid='transparent'
					onChangeText={value => this.onInputChange("age", value)}
					value={this.state.dataInfos.age}
					rightIcon={<Text style={{ color: "grey" }}> anos </Text>}
				/>

				<Input
					placeholder="Peso..."
					inputStyle={STYLES.input}
					inputContainerStyle={STYLES.inputContainer2}
					containerStyle={STYLES.inputContainer1}
					underlineColorAndroid='transparent'
					onChangeText={value => this.onInputChange("weight", value)}
					value={this.state.dataInfos.weight}
					rightIcon={<Text style={{ color: "grey" }}> kg </Text>}
				/>

				<TouchableHighlight
					style={STYLES.registerButton}
					onPress={() => this.handleClick()}>
					<Text style={STYLES.textButton}> Salvar </Text>
				</TouchableHighlight>
			</ScrollView>
		)
	}
}

const STYLES = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: COLOR.screenBackground,
		textAlign: "center",
		alignItems: "center",
		justifyContent: "flex-start",
	},

	pickerContainer: {
		width: "86%",
		height: 50,
		borderColor: "rgba(105,105,105, 0.8)",
		borderWidth: 3,
		borderRadius: 25,
		marginTop: "10%",
		backgroundColor: "#FFFFFF",
		paddingLeft: 20,
		paddingTop: 6
	},
	innerContainer: {
		flexDirection: 'row',
		alignItems: 'stretch',
		borderRadius: 25,
	},
	text: {
		fontSize: 18
	},
	optionContainer: {
		flex: 1,
		flexDirection: 'row',
		padding: 10,
		borderBottomColor: 'grey',
		borderBottomWidth: 1,
		marginLeft: 5,
		marginRight: 5

	},
	pickerModal: {
		borderRadius: 25
	},

	input: {

	},

	inputContainer1: {
		alignItems: "center",
		marginTop: "10%",
	},

	inputContainer2: {
		borderBottomWidth: 0,
		width: "90%",
		backgroundColor: "#FFFFFF",
		paddingLeft: 20,
		paddingRight: 20,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
	},

	registerButton: {
		marginTop: 40,
		height: 50,
		width: "85%",
		height: 50,
		backgroundColor: COLOR.buttonColor,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
		marginLeft: 15,
		marginRight: 15,
		marginBottom: 30
	},

	textButton: {
		color: "#FFFFFF",
		fontSize: 18,
	},
})

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		// color: 'white',
		// paddingTop: 13,
		// paddingHorizontal: 10,
		// paddingBottom: 12,
		color: "black"
	},
	inputAndroid: {
		// color: 'white',
		// width: "90%",
		// backgroundColor: "#FFFFFF",
		// borderRadius: 25,
		// borderWidth: 1
		color: "black"
	},
	viewContainer: {
		borderRadius: 25,
		width: "85%",
		backgroundColor: "#FFFFFF",
		marginTop: "10%",
		paddingLeft: 20,
		marginLeft: "7%",
		marginRight: "8%",
	},
	underline: { borderTopWidth: 0 },
})
