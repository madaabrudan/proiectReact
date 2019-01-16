import React from 'react';
import { StyleSheet, Text, View,FlatList,AsyncStorage } from 'react-native';
import {List, ListItem, Icon } from 'react-native-elements';
import PureChart from 'react-native-pure-chart'
import ToggleSwitch from 'toggle-switch-react-native'

export default class Login extends React.Component {


    constructor(props) {
        super(props);
        var lisst = [];
        this.state = {
            data: [],
            currentPageData:'',
            mesaj: 'initial',
            listSize: 0,
            nrOfPages: 0,
            nrPerPage:7,
            currentPage: 1,
            check:0,
            mainComponentIsList:true,
        };

        this.getCurrentListData = this.getCurrentListData.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
        this. swipeToAddPage = this.swipeToAddPage.bind(this);
        this.getList = this.getList.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.switchMainComponent = this.switchMainComponent.bind(this);
    }




    swipeToAddPage(){
        this.props.navigation.navigate("AddToListpage", {
            onNavigateBack: this.handleOnNavigateBack})

    }

    getCurrentListData() {

        let start = (this.state.currentPage - 1) * this.state.nrPerPage + 1;
        let finish = start + this.state.nrPerPage;
        if (finish > this.state.listSize) {
            finish = this.state.listSize;
        }


        let list = [];
        for (let i = start-1; i < finish; i++) {
            list.push(this.state.data[i]);
        }
         lisst = list;

    }


    handleOnNavigateBack = () => {
        console.log("");
    };

    componentWillMount() {
        this.getList();
    }

    componentDidMount(){
        setInterval(() => this.getList(), 5000);
    }


    onLoad = async () =>{
        try{
            let storedData = await AsyncStorage.getItem('listaFlight');
            
            this.setState({data: JSON.parse(storedData)})
        }
        catch(error){
            console.error(error)
        }
    };

    onSave = async () => {

        let data = this.state.data;
        try{
            await AsyncStorage.setItem('listaFlight', JSON.stringify('data'));
            console.log("Succes saved");
        }
        catch(error){
            console.log(error)
        }
    };


    getList() {

        this.setState({check:0});
        try{
            fetch('http://192.168.0.101:8080/getList')
                .then((response) => response.json())
                .then((responseJson) => {

                    let nr,route,hou;
                    let lista = [];
                    for(let i=0; i<responseJson.length; i++) {
                        nr = responseJson[i].number;
                        route = responseJson[i].route;
                        hou = responseJson[i].hour;
                        let obj = {number:nr, route:route,hour:hou};
                        lista.push(obj);

                    }


                    let listSize = lista.length;
                    let nrOfPages = Math.floor(listSize / this.state.nrPerPage);
                    parseInt(nrOfPages);
                    if (listSize % this.state.nrPerPage)
                        nrOfPages++;

                    this.setState({
                        listSize: listSize,
                        nrOfPages: nrOfPages,
                        data:lista,
                        check:1
                    });
                    this.onSave();


                })
                .catch((error) => {
                    console.log("i" + error);
                        this.onLoad();
                });
        }
        catch (error){
            console.log("error");
            this.onLoad();

        }

    }


    previousPage()
    {
        console.log("current page" + this.state.currentPage);
        if (this.state.currentPage>1)
            this.setState({currentPage:this.state.currentPage -1})
    }

    nextPage()
    {
        if (this.state.currentPage<this.state.nrOfPages)
            this.setState({currentPage:this.state.currentPage+1})
    }

    switchMainComponent()
    {
        if(this.state.mainComponentIsList)
            this.setState({mainComponentIsList:false});
        else
            this.setState({mainComponentIsList:true});
    }


    render() {

        this.getCurrentListData();
            let sampleData =[];
            for(let i=0;i<lisst.length;i++){
                let obj = {"x":lisst[i].number,"y":lisst[i].hour}

                sampleData.push(obj);
        }

        let mainComponent = this.state.mainComponentIsList ?
            <List style={{marginTop:10}}>
                <FlatList
                    data={lisst}
                    renderItem={({item}) => (
                        <ListItem title={'Numar: '+item.number + 'Hour: ' + item.hour}
                                  subtitle={'Ruta: '+ item.route}/>
                    )}
                />
            </List>
            :
            <View style={styles.chart}>
                <PureChart data={sampleData} type='line'/>
            </View>;

        return (
            <View  style={{flex: 1}}>


                <View style={{position:'absolute',top:-7,alignSelf:'flex-end',zIndex:99}}>
                    <Icon
                        style={styles.addButton}
                        reverse
                        name='plus'
                        type='entypo'
                        color='#517fa4'
                        size={18}
                        onPress = {this.swipeToAddPage}
                    />
                </View>
                <View style={styles.toogleSwitch}>
                    <ToggleSwitch
                        isOn={!this.state.mainComponentIsList}
                        onColor='gray'
                        offColor='#517fa4'
                        label='List'
                        labelStyle={{color: 'black', fontWeight: '900'}}
                        size='small'
                        onToggle={ (isOn) => this.switchMainComponent() }
                    />
                </View>
                {mainComponent}


                <View style={styles.horizontalList}>
                    <Icon
                        reverse
                        name='chevron-left'
                        type='octicon'
                        color='#517fa4'
                        size={13}
                        onPress = {this.previousPage}
                    />
                    <Text style={{fontSize:18}}>{this.state.currentPage}</Text>
                    <Icon
                        reverse
                        name='chevron-right'
                        type='octicon'
                        color='#517fa4'
                        size={13}
                        onPress = {this.nextPage}
                    />
                </View>

            </View>

        );
    }

}

const styles = StyleSheet.create({
    horizontalList: {
        flexDirection:'row',
        position: 'absolute',
        bottom: 10,
        left:130,
        height: 60,
        alignItems: 'center',
    },

    addButton: {
        position:'absolute',
        top:0,
    },

    toogleSwitch:{
        margin:10,
    },

    chart:{
        marginTop:120,
    }
});

