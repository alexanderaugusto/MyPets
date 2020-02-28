import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	FlatList,
} from 'react-native'
import List from '../../../components/List/HistoricMedicineList'
import LinearGradient from 'react-native-linear-gradient'
import Header from '../../../components/header/header'

export default class App extends Component {


	state = {
		historic: [], //Array de Historico
	}

	/**
	 * Chamando o Historico do Banco
	 */
	callHistoric = () => {

		//Clona o array ja existente
		const historics = [...this.state.historic]

		//Adiciona o historico gardado no banco
		historics.push({
			id: '', //Pegando um ID no Banco
			type: '', //Tipo de procedimento realizado
			petShop: '', //Qual PetShop foi realizado
			date: new Date() //Data da realização
		})

		//Setando o novo array de Historicos no estado
		this.setState({ historic: historics })
	}

	/**
	 * Função do proprio React... quando o componente for renderizado a callHistoric sera chamada 
	 */
	componentDidMount = () => {
		this.callHistoric()
	}

	render() {
		return (

				<View style={styles.mainContainer}>

					{/* Listando o Histórico */}
					<FlatList data={this.state.historic}
						keyExtractor={item => item.id.toString()}
						renderItem={({ item }) =>
							<List {...item}></List>}>
					</FlatList>

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
	animalInfo: {
		flex: 0.3,
		flexDirection: 'row',
		justifyContent: 'center'
	},
	image: {
		width: 130,
		height: 130,
		margin: 10,
		borderRadius: 40,
		borderWidth: 2,
		borderColor: 'white',
	},
	imageContainer: {
		justifyContent: 'flex-end',
		alignItems: 'flex-end'
	},
	mainContainer: {
		flex: 0.8,
		backgroundColor: 'rgba(255,255,255,0.92)',
		// borderTopRightRadius: 10,
		// borderTopLeftRadius: 10,
		justifyContent: 'center',
		paddingHorizontal: 20
	},
	dataAnimal: {
		flexDirection: 'column',
		justifyContent: 'flex-end',
		margin: 10
	},
	edit: {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
		margin: 10
	},
	name: {
		color: 'white',
		fontFamily: 'Bariol',
		fontWeight: '700',
		fontSize: 25
	},
	info: {
		color: 'white',
		fontFamily: 'Bariol',
		fontWeight: '400',
		fontSize: 15
	},
	text: {
		color: 'white',
		fontFamily: 'Bariol',
		fontWeight: '400',
		fontSize: 15,
	},
});

App.navigationOptions = {
	header: null
}