import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import PropTypes from 'prop-types'

class SelectInput extends Component {
  constructor(props) {
    super(props)

    this.state = {
      favColor: undefined,
      items: [
        {
          label: 'Red',
          value: 'red',
        },
        {
          label: 'Orange',
          value: 'orange',
        },
        {
          label: 'Blue',
          value: 'blue',
        },
      ],
    }

    this.inputRefs = {}
  }

  render() {
    return (
      <View style={{ flex: 1, alignContent: "center", alignItems: "center" }}>
        <RNPickerSelect
          placeholder={this.props.placeholder}
          items={this.props.items}
          onValueChange={this.props.onValueChange}
          onUpArrow={() => { this.inputRefs.name.focus() }}
          onDownArrow={() => { this.inputRefs.picker2.togglePicker() }}
          style={{ ...pickerSelectStyles }}
          value={this.props.value}
          ref={(el) => { this.inputRefs.picker = el }}
        />
      </View>
    )
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    // color: 'white',
    // paddingTop: 13,
    // paddingHorizontal: 10,
    // paddingBottom: 12,
  },
  inputAndroid: {
    // color: 'white',
    // width: "90%",
    // backgroundColor: "#FFFFFF",
    // borderRadius: 25,
    // borderWidth: 1
  },
  viewContainer: {
    borderRadius: 25,
    width: "85%",
    backgroundColor: "#FFFFFF",
    marginTop: "10%",
    paddingLeft: 20,
    marginLeft: "7%",
    marginRight: "8%"
  },
  underline: { borderTopWidth: 0 },
})

CardAuthor.propTypes = {
  // Where the user to be redirected on clicking the avatar
  placeholder: PropTypes.string,
  avatar: PropTypes.string,
  avatarAlt: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node])
}

export default SelectInput