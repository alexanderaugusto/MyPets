import React, { Component } from "react"
import { View, Text, FlatList, TouchableHighlight, StyleSheet } from "react-native"
import { USER_LIST, COLOR } from '../../../variables/general'
import Icon from 'react-native-vector-icons/FontAwesome'
import { SCLAlert, SCLAlertButton } from 'react-native-scl-alert'

let self = null

class UserInfo extends Component {

  static navigationOptions = {
    title: "Confirgurações da Conta",
    headerStyle: {
      backgroundColor: COLOR.headerBackground,
    },
    headerTintColor: COLOR.headerText
  }

  constructor(props) {
    super(props)

    this.state = {
      userOptionsVisible: false,
      userAnimals: [],
      loadingVisible: true,
      userInfo: '',
      alert: null
    }

    self = this
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
          <SCLAlertButton theme="success" onPress={() => this.hideAlert(interval)}>Ok</SCLAlertButton>
        </SCLAlert>
    })

    let interval = setTimeout(() => this.setState({ alert: null }), 2500)

  }
  
  warningAlert(title, subtitle) {
    this.setState({
      alert:
        <SCLAlert
          theme="warning"
          show={true}
          title={title}
          subtitle={subtitle}
          onRequestClose={() => console.log('warning')}
        >
          <SCLAlertButton theme="warning" onPress={() => {
            this.deleteAnimal()
            this.setState({ alert: null })
          }}>Excluir</SCLAlertButton>
          <SCLAlertButton theme="danger" onPress={() => this.hideAlert(interval)}>Cancelar</SCLAlertButton>
        </SCLAlert>
    })

    let interval = setTimeout(() => this.setState({ alert: null }), 2500)
  }
  
  hideAlert(interval){
    this.setState({ alert: null })
    clearInterval(interval)
  }

  renderItem = ({ item }) => (
    <View style={STYLES.itemContainer}>
      <View style={{width: "50%", borderRightWidth: 1, borderRightColor: "grey"}}>
        <Text style={STYLES.itemTitle}> {item.title} </Text>
        <Text style={STYLES.itemBody}> {item.body} </Text>
      </View>
      <View style={{width: "50%", flex: 1, justifyContent: "flex-end", alignItems: "center"}}>
        <Icon
          style={{ fontSize: item.icon === "mobile" ? 35 : 25, marginBottom: 10}}
          name={item.icon}
          color={COLOR.headerBackground}
        />
        <TouchableHighlight style={STYLES.itemButton} onPress={() => this.props.navigation.navigate(item.action, item.params)}>
          <Text style={STYLES.itemButtonText}> {item.buttonText} </Text>
        </TouchableHighlight>
      </View>
    </View>
  )

  render() {
    return (
      <View style={STYLES.container}>
        {this.state.alert}
        <FlatList
          contentContainerStyle={STYLES.list}
          data={USER_LIST}
          keyExtractor={item => item._id}
          renderItem={this.renderItem}
          onEndReachedThreshold={0.1}
        />
      </View>
    )
  }
}

const STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.screenBackground
  },

  list: {
    padding: 10,
  },

  itemContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    height: 150
  },

  itemTitle: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold"
  },


  itemBody: {
    fontSize: 15,
    color: "#A9A9A9",
    marginTop: 5,
    lineHeight: 24
  },


  itemButton: {
    height: 40,
    borderRadius: 25,
    backgroundColor:  COLOR.buttonColor,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    width: "70%"
  },


  itemButtonText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontWeight: "bold"
  }
})

export default UserInfo