import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableHighlight, Alert } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen"
import { Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import { COLOR } from '../../../variables/general'
import { FIREBASE_DATABASE_URL } from '../../../variables/firebaseConfig'
import axios from 'axios'
import AsyncStorage from '@react-native-community/async-storage'
import Loader from '../../../components/Loader/loader'
import Util from '../../../variables/util'
import { TextInputMask } from 'react-native-masked-text'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'

class RegisterEnd extends Component {
	static navigationOptions = {
		title: "Finalizar Cadastro",
		headerStyle: {
			backgroundColor: COLOR.headerBackground,
		},
		headerTintColor: COLOR.headerText
	}

	constructor(props) {
		super(props)

		this.state = {
			dataInfos: {
				name: '',
				lastName: '',
				cpf: '',
				phone: '',
				dateOfBirth: '',
				nameState: '',
				lastNameState: '',
				cpfState: '',
				phoneState: '',
				dateOfBirthState: ''
			},
			loadingVisible: false,
			alert: null
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
					<SCLAlertButton theme="success" onPress={() => {
						this.hideAlert(interval)
						this.props.navigation.navigate("InsertAddress", {screen: "home"})
					}}>Ok</SCLAlertButton>
				</SCLAlert>
		})

		let interval = setTimeout(() => {
			this.setState({ alert: null })
			this.props.navigation.navigate("InsertAddress", {screen: "home"})
		}, 2500)
	}

	hideAlert(interval){
    this.setState({ alert: null })
    clearInterval(interval)
	}
	
	onInputChange(type, value) {
		let dataInfos = this.state.dataInfos
		dataInfos[type] = value
		this.setState({ dataInfos })
	}

	async handleClick() {
		if (this.state.dataInfos.nameState === 'has-success' &&
			this.state.dataInfos.cpfState === 'has-success' && this.state.dataInfos.phoneState === 'has-success' &&
			this.state.dataInfos.dateOfBirthState === 'has-success') {
			this.setState({ loadingVisible: true })
			try {
				const userId = await AsyncStorage.getItem('user_id')
				let data = {
					userAvatar: "",
					name: this.state.dataInfos.name,
					lastName: this.state.dataInfos.lastName,
					cpf: this.state.dataInfos.cpf,
					phone: this.state.dataInfos.phone,
					dateOfBirth: this.state.dataInfos.dateOfBirth
				}
				await axios.put(FIREBASE_DATABASE_URL + "/app/accounts/" + userId + "/user/info.json", data)
					.then(res => {
						this.successAlert("MyPets", "Cadastro Finalizado!")
					})
					.catch(err => this.errorAlert("Erro inesperado!", "Por favor, tentar novamente."))
			} catch (e) {
				console.log(e)
			}

			this.setState({ loadingVisible: false })
		}
		else {
			this.errorAlert("Dados Inválido!", "Por favor, preencha todos os campos de forma válida.")
		}
	}

	render() {
		return (
			<ScrollView contentContainerStyle={STYLE.container}>
				<Loader
					loading={this.state.loadingVisible} />
				{this.state.alert}
				<Input
					placeholder="Nome..."
					inputStyle={STYLE.input}
					inputContainerStyle={STYLE.inputContainer2}
					containerStyle={STYLE.inputContainer1}
					underlineColorAndroid='transparent'
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.nameValidation(value, this.state.dataInfos)
					})}
				/>
				<Input
					placeholder="Sobrenome..."
					inputStyle={STYLE.input}
					inputContainerStyle={STYLE.inputContainer2}
					containerStyle={STYLE.inputContainer1}
					underlineColorAndroid='transparent'
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.lastNameValidation(value, this.state.dataInfos)
					})}
				/>
				{/* <Input
					maxLength={14}
					placeholder="CPF..."
					inputStyle={STYLE.input}
					inputContainerStyle={STYLE.inputContainer2}
					containerStyle={STYLE.inputContainer1}
					underlineColorAndroid='transparent'
					onChangeText={(value) => this.setState({
            dataInfos:
              Util.cpfValidation(value, this.state.dataInfos)
					})}
					value={this.state.dataInfos.cpf}
				/> */}
				<TextInputMask
					style={STYLE.maskedInput}
					type={'cpf'}
					value={this.state.dataInfos.cpf}
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.cpfValidation(value, this.state.dataInfos)
					})}
					placeholder='CPF...'
				/>
				{/* <Input
					placeholder="Telefone..."
					inputStyle={STYLE.input}
					inputContainerStyle={STYLE.inputContainer2}
					containerStyle={STYLE.inputContainer1}
					underlineColorAndroid='transparent'
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.phoneValidation(value, this.state.dataInfos)
					})}
					value={this.state.dataInfos.phone}
				/> */}
				<TextInputMask
					style={STYLE.maskedInput}
					type={'cel-phone'}
					options={{
						maskType: 'BRL',
						withDDD: true,
						dddMask: '(99) '
					}}
					value={this.state.dataInfos.phone}
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.phoneValidation(value, this.state.dataInfos)
					})}
					placeholder='Telefone...'
				/>
				{/* <Input
					placeholder="Data de Nascimento..."
					inputStyle={STYLE.input}
					inputContainerStyle={STYLE.inputContainer2}
					containerStyle={STYLE.inputContainer1}
					underlineColorAndroid='transparent'
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.dateOfBirthValidation(value, this.state.dataInfos)
					})}
				/> */}
				<TextInputMask
					style={STYLE.maskedInput}
					type={'datetime'}
					options={{
						format: 'DD/MM/YYYY'
					}}
					value={this.state.dataInfos.dateOfBirth}
					onChangeText={(value) => this.setState({
						dataInfos:
							Util.dateOfBirthValidation(value, this.state.dataInfos)
					})}
					placeholder='Data de Nascimento...'
				/>
				<TouchableHighlight
					style={STYLE.registerButton}
					onPress={() => this.handleClick()}>
					<Text style={STYLE.textButton}> Finalizar Cadastro </Text>
				</TouchableHighlight>
			</ScrollView>
		)
	}
}

const STYLE = StyleSheet.create({

	container: {
		flexGrow: 1,
		backgroundColor: COLOR.screenBackground,
		textAlign: "center",
		alignItems: "center",
		justifyContent: "center"
	},

	iconSideBar: {
		marginLeft: 15,
		fontSize: 30,
	},

	input: {
		width: "90%",
		borderRadius: 25,
		marginTop: "10%",
		backgroundColor: "#FFFFFF",
		paddingLeft: 20,
		fontSize: 15
	},

	maskedInput: {
		width: "87%",
		borderRadius: 25,
		marginTop: "10%",
		backgroundColor: "#FFFFFF",
		paddingLeft: 20,
	},

	inputDanger: {
		width: "90%",
		borderColor: "rgba(255,0,0, 0.8)",
		borderWidth: 2,
		borderRadius: 25,
		marginTop: "10%",
		backgroundColor: "#FFFFFF",
		paddingLeft: 20,
		paddingRight: 0
	},

	inputContainer1: {
		alignItems: "center",
	},

	inputContainer2: {
		borderBottomWidth: 0,
		width: "90%"
	},

	registerButton: {
		marginTop: 40,
		height: 50,
		width: "85%",
		backgroundColor: COLOR.buttonColor,
		borderRadius: 25,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 30
	},

	textButton: {
		color: "#FFFFFF",
		fontSize: 18,
	},
})

export default RegisterEnd