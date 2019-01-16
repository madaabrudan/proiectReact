import React from 'react';
import { StyleSheet, Text,TextInput, View, Button} from 'react-native';
import email from 'react-native-email'

export default class AddPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            nr:'',
            route:'',
            hour:''
        };

        this.getNr = this.getNr.bind(this);
        this.getRoute = this.getRoute.bind(this);
        this.getHour = this.getHour.bind(this);
        this.addToList = this.addToList.bind(this);
    }


    getNr(n){
        this.setState({nr:n});
    }

    getRoute(ro){
        this.setState({route:ro});
    }

    getHour(cre){
        this.setState({hour:cre});
    }


    addToList(){

        fetch('http://192.168.0.101:8080/getList/addFlight', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "number": this.state.nr,
                "route": this.state.route,
                "hour": this.state.hour
            }),

        }).then(this.props.navigation.goBack());

    }

    handleEmail = () => {
        const to = ['abrudanmada28@gmail.com']
        email(to, {

            subject: 'Informatii',
            body: 'Informatii : Zborul va alea loc la data ' + new Date() + ' . Cod confirmare: '+parseInt(Math.random()*10000)
        }).catch(console.error)
    }




    render(){
        return(


            <View style={styles.container}>
                <View>


                    <Text style={styles.title}>
                        Add flight to the list
                    </Text>
                    <Text>Enter a number</Text>
                    <TextInput style={styles.field}
                               placeholder = "Number"
                               onChangeText ={(text) => this.getNr(text)} />
                    <Text>Enter route</Text>
                    <TextInput style={styles.field}
                               placeholder = "Route"
                               onChangeText ={(text) => this.getRoute(text)} />
                    <Text>Enter a hour</Text>
                    <TextInput style={styles.field}
                               placeholder = "Hour"
                               onChangeText ={(text) => this.getHour(text)} />

                    <Button style={styles.buton}
                            onPress={this.addToList}
                            title={'Done'}/>
                    <Button title="Send Mail with flight" onPress={this.handleEmail} />

                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    title:{
        margin:30,
        marginBottom:45,
        fontWeight:'300',
        fontSize:30
    },

    field:{
        paddingLeft:5,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        marginBottom:15,
    },

    buton:{
        margin:10,
        width:80,
    },



});