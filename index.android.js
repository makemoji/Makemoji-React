/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ViewPagerAndroid,
  TouchableHighlight,
  ListView,
  TextInput,
  BackAndroid,
  NativeAppEventEmitter,
  NativeModules

} from 'react-native';
var MakemojiTextInput = require('./MakemojiRN/MakemojiTextInput');// MakemojiTextInput from './MakemojiRN/MakemojiTextInput'
import MakemojiEditTextAndroid from './MakemojiRN/MakemojiEditTextAndroid'
import MakemojiTextAndroid from './MakemojiRN/MakemojiTextAndroid'

const showDetatchControls = false; // enable to show example of detached input.
class MakemojiReactNative extends Component {

    constructor(props){
        super(props);

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {htmlMessages:[],
    dataSource:ds.cloneWithRows([]),
    outsideEditText:' ',
    textSize:17.0};
        BackAndroid.addEventListener('hardwareBackPress', () => {
            if (this.refs.mojiInput.canGoBack()){
                this.refs.mojiInput.onBackPressed();
                return true;//back handled
            }
            return false;
        });

    }
    componentDidMount(){
        //this.setState({outsideEditText:'topEditText'});

        this.subscription = NativeAppEventEmitter.addListener(
            'onHypermojiPress',
            (event) => console.log(event.url)
        );
    }
    componentWillUnmount(){
        this.subscription.remove();
    }
    componentWillMount(){
        NativeModules.MakemojiManager.init("yourKey");//ios only
    }
  render() {
    return (
      <View keyboardShouldPersistTaps={false} style={styles.container}>
          {showDetatchControls? <View>
          <MakemojiEditTextAndroid keyboardShouldPersistTaps={false} style={[styles.editText,{fontSize:this.state.textSize}]} finderTag={'topEditText'} ref={'topEditText'} onHtmlGenerated={this.sendPressed.bind(this)}/>

          <TouchableHighlight onPress={this.genHtml.bind(this)}>
             <Text style={styles.welcome} selectable={true}>
                  Grab Text from top edit text.
             </Text>
              </TouchableHighlight>

          <TouchableHighlight onPress={() =>this.setState({outsideEditText:'topEditText'})}>
            <Text style={styles.instructions}>
              Attatch Edit Text
            </Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.setState({outsideEditText:null})}>
              <Text style={styles.instructions}>
                  Detatch Edit Text
              </Text>
          </TouchableHighlight>
              </View> :null}
          <ListView style={{flex:1,alignSelf:'stretch'}}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) => <MakemojiTextAndroid onHyperMojiPress={this.log} style={styles.instructions} html={rowData}/>}
          />
        <MakemojiTextInput outsideEditText={this.state.outsideEditText} ref={'mojiInput'} style={styles.moji} minSendLength={0} alwaysShowEmojiBar={false}
                           onSendPress={this.sendPressed.bind(this)} onHyperMojiPress={this.log} onCameraPress={this.log}/>
      </View>
    );
  }
  genHtml(){
      this.refs.topEditText.requestHtml(true,true);//args:should clear input;should send text to analytics
  }
  sendPressed(sendObject){
      console.log('send pressed', sendObject);
      var htmlMessages = [...this.state.htmlMessages,sendObject.html];
      var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
      this.setState({htmlMessages:htmlMessages,dataSource:ds.cloneWithRows(htmlMessages)});
      //this.refs.topEditText.setText(sendObject.plaintext);
  }
  log(event){
      console.log('',event);
  }

}

const styles = StyleSheet.create({
    editText:{

        alignSelf: 'stretch',
    },
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
      fontSize:18,
      height:30
  },
  moji:{

      height:100,
      justifyContent: 'flex-end',
    alignSelf: 'stretch'
  }
});

AppRegistry.registerComponent('MakemojiReactNative', () => MakemojiReactNative);