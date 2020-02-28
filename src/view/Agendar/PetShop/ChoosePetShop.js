import React, { Component } from 'react'
import {
	StyleSheet,
	View,
	ScrollView,
	FlatList,
	RefreshControl,
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import List from '../../../components/List/ChoosePetShopList'
import LinearGradient from 'react-native-linear-gradient'
import Header from '../../../components/header/header'
import axios from 'axios'
import { FIREBASE_DATABASE_URL } from '../../../variables/firebaseConfig'
import Loader from '../../../components/Loader/loader'
import { COLOR } from '../../../variables/general'

/* 
Dados esperados vindo do Banco
    id: Identificador unico
    name: Nome da PetShop
    serviceType: Tipo de atendimento disponivel
    place: Localização
    vet: Nome do Veterinario
*/

class ChoosePetShop extends Component {
	constructor(props) {
		super(props)

		this.state = {
			petShops: [],
			petShopsSearch: [],
			refreshing: false,
			loadingVisible: true,
			searchText: ""
		}
	}

	componentDidMount() {
		this.getPetShops()
	}

	async getPetShops() {
		let petShops = []

		await axios.get(FIREBASE_DATABASE_URL + "/Login.json")
			.then(res => {
				const data = Object.entries(res.data).map((value) => ({ [value[0]]: value[1] }))
				console.log(data)
				data.forEach((element, index) => {
					Object.entries(element, index).map((value) => {
						petShops.push({
							id: value[0],
							name: value[1].Dados.nome,
							serviceType: "Consult",
							place: value[1].Dados.cidade,
							evaluations: 5,
							vet: value[1].Dados.telefone,
						})
					})
				})
			})

		console.log(petShops)
		this.setState({ petShops })
		this.setState({ loadingVisible: false })
	}

	async onRefresh() {
		this.setState({ refreshing: true })

		await this.getPetShops()

		this.setState({ refreshing: false })
	}

	updateSearch(searchText) {
		this.setState({ searchText })
		let petShopsSearch = this.state.petShops

		petShopsSearch = petShopsSearch.filter(value => {
			return value.place.toLowerCase().includes(searchText.toLowerCase()) || value.name.toLowerCase().includes(searchText.toLowerCase())
		})

		this.setState({ petShopsSearch })
	}

	render() {
		const type = this.props.navigation.getParam('type')

		return (
			<View style={styles.gridView}>
				<Loader
					loading={this.state.loadingVisible} />
				<SearchBar
					placeholder="Pesquisar..."
					onChangeText={(searchText) => this.updateSearch(searchText)}
					value={this.state.searchText}
					containerStyle={styles.searchContainer}
					inputContainerStyle={{ backgroundColor: "white" }}
				/>

				<ScrollView style={[styles.container]}
					refreshControl={
						<RefreshControl
							refreshing={this.state.refreshing}
							onRefresh={() => this.onRefresh()}
						/>
					}>
					{/* Listagem */}
					<FlatList
						data={this.state.searchText === "" ? this.state.petShops : this.state.petShopsSearch}
						// style={{ marginBottom: "30%" }}
						keyExtractor={item => item.id.toString()}
						onEndReachedThreshold={0.5}
						renderItem={({ item }) => {
							return (
								<List {...item}
									navigation={this.props.navigation}
									type={type}
								/>
							)
						}}
					>
					</FlatList>
				</ScrollView>
			</View>
		)
	}
}

//Estilos
const styles = StyleSheet.create({
	gridView: {
		flex: 1,
	},
	background: {
		flexGrow: 1,
		justifyContent: 'center',
	},
	container: {
		// flex: 0.8,
		backgroundColor: 'rgba(255,255,255,0.92)',
		// borderTopRightRadius: 10,
		// borderTopLeftRadius: 10,
		// justifyContent: 'center',
		paddingHorizontal: 20,
	},
	searchContainer: {
		backgroundColor: COLOR.screenBackground,
		borderBottomWidth: 0,
		borderTopWidth: 0,
	}
});

ChoosePetShop.navigationOptions = {
	header: null,
}

export default ChoosePetShop