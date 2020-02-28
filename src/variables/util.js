function emailValidation(value, data) {
  var dataInfos = data
  dataInfos["email"] = value.trim()
  var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (emailRex.test(value.trim())) {
    dataInfos["emailState"] = "has-success";
  } else {
    dataInfos["emailState"] = "has-danger";
  }
  //this.setState({ dataInfos });
  return dataInfos
}

function passwordValidation(value, data) {
  var dataInfos = data;
  dataInfos["password"] = value;
  if (value.length >= 6) {
    dataInfos["passwordState"] = "has-success";
    if (value === dataInfos.confirmPassword)
      dataInfos["confirmPasswordState"] = "has-success"
    else if (value !== dataInfos.confirmPassword && dataInfos.confirmPassword.length >= 6)
      dataInfos["confirmPasswordState"] = "has-danger"
  } else {
    dataInfos["passwordState"] = "has-danger";
  }
  return dataInfos
}

function confirmPasswordValidation(value, data) {
  var dataInfos = data;
  dataInfos["confirmPassword"] = value;
  if (value === dataInfos.password && value.length >= 6) {
    dataInfos["confirmPasswordState"] = "has-success";
  } else {
    dataInfos["confirmPasswordState"] = "has-danger";
  }
  return dataInfos
}

function nameValidation(value, data) {
  var dataInfos = data;
  dataInfos["name"] = value;
  if (value.length >= 3) {
    dataInfos["nameState"] = "has-success";
  } else {
    dataInfos["nameState"] = "has-danger";
  }
  return dataInfos
}

function lastNameValidation(value, data) {
  var dataInfos = data;
  dataInfos["lastName"] = value;

  return dataInfos
}

function cpfValidation(value, data) {
  var dataInfos = data;
  dataInfos["cpf"] = value

  if (value.length === 14)
    dataInfos["cpfState"] = "has-success"
  else
    dataInfos["cpfState"] = "has-danger"

  return dataInfos
}

function phoneValidation(value, data) {
  var dataInfos = data;

  dataInfos["phone"] = value

  if (value.length === 14 || value.length === 15)
    dataInfos["phoneState"] = "has-success"
  else
    dataInfos["phoneState"] = "has-danger"

  return dataInfos
}

function dateOfBirthValidation(value, data) {
  var dataInfos = data;

  dataInfos["dateOfBirth"] = value

  if (value.length === 10)
    dataInfos["dateOfBirthState"] = "has-success"
  else
    dataInfos["dateOfBirthState"] = "has-danger"

  return dataInfos
}

function addressValidation(value, data) {
  var dataInfos = data;
  dataInfos["address"] = value;
  if (value.length >= 3) {
    dataInfos["addressState"] = "has-success";
  } else {
    dataInfos["addressState"] = "has-danger";
  }
  return dataInfos
}

function cepValidation(value, data) {
  var dataInfos = data;
  dataInfos["cep"] = value

  if (value.length === 9) {
    dataInfos["cepState"] = "has-success"
  }
  else
    dataInfos["cepState"] = "has-danger"

  return dataInfos
}

function ufValidation(value, data) {
  var dataInfos = data;
  dataInfos["uf"] = value;
  if (value.length === 2) {
    dataInfos["ufState"] = "has-success";
  } else {
    dataInfos["ufState"] = "has-danger";
  }
  return dataInfos
}

function cityValidation(value, data) {
  var dataInfos = data;
  dataInfos["city"] = value;
  if (value.length >= 3) {
    dataInfos["cityState"] = "has-success";
  } else {
    dataInfos["cityState"] = "has-danger";
  }
  return dataInfos
}

function countryValidation(value, data) {
  var dataInfos = data;
  dataInfos["country"] = value;
  if (value.length >= 3) {
    dataInfos["countryState"] = "has-success";
  } else {
    dataInfos["countryState"] = "has-danger";
  }
  return dataInfos
}

export default {
  emailValidation,
  passwordValidation,
  confirmPasswordValidation,
  nameValidation,
  lastNameValidation,
  cpfValidation,
  phoneValidation,
  dateOfBirthValidation,
  addressValidation,
  cepValidation,
  ufValidation,
  cityValidation,
  countryValidation,
}