import React from 'react';
import { StyleSheet, Text, View, Button,TextInput,ActivityIndicator } from 'react-native';

export default class Login extends React.Component {

  constructor(props)
  {
    super(props);
    this.state= {
      activity:false,
      badCredentials:false,
      username:'',
      password:'',
      token:'',
    };

    this.handleClick = this.handleClick.bind(this);
    this.getUsername = this.getUsername.bind(this);
    this.getPassword = this.getPassword.bind(this);
    this.sendCredentials = this.sendCredentials.bind(this);
    this.checkLogin = this.checkLogin.bind(this);
  }


  checkLogin(token) {
    this.setState({token:token});
    console.log("CHECK LOGIN");
    console.log("token"+this.state.token);
      if (this.state.token !== '') {
          this.setState({activity: false,badCredentials:false});
          this.props.navigation.navigate("Listpage");
      }
      else
        this.setState({activity: false,badCredentials:true});
  }


  handleClick(){
    this.setState({activity:true});
    this.sendCredentials();
  }

  getUsername(user){
    this.setState({username:user})
  }

  getPassword(pass){
    this.setState({password:pass})
  }


  sendCredentials(){

      fetch('http://192.168.0.101:8080/getList/validateLogin', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              "name":this.state.username,
              "password": this.state.password,
          }),

      }).then((response) =>
          this.checkLogin(response._bodyInit)
        );


      console.log("done fetch");
  }

  render() {

    let activityComponent = this.state.activity ?
                                                <ActivityIndicator size="small" color="#0080ff"
                                                                    />
                                                :null;

    let error = this.state.badCredentials ?
                                           <Text style={styles.errorMessage}> Credentiale gresite </Text>
                                           : null;

    return (

      <View style={{flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',}}>
        <View style={styles.container}>
          <Text style={styles.title}>Log In</Text>
          <TextInput style={styles.usernameField}
                    placeholder = "username"
                    onChangeText ={(text) => this.getUsername(text)} />
          <TextInput style={styles.passwordField}
                     placeholder = {"password"}
                     textContentType = {"password"}
                     secureTextEntry={true}
                     onChangeText ={(text) => this.getPassword(text)} />
          <Button style={styles.buton}
                     title="Log in"
                     onPress={this.handleClick}
                     />
          {error}
        </View>
        <View>
          {activityComponent}
        </View>
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },


  title: {
    fontSize:32,
    fontWeight:'bold',
    margin:30,
  },

  usernameField:{
    width:170,
    margin:15,
    paddingLeft:10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1
  },

  passwordField:{
    width:170,
    margin:15,
    marginBottom:40,
    paddingLeft:10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },

  errorMessage:{
    color:'red',
    marginTop:10,
  }


});
