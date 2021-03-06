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
    NativeModules,
    processColor,
findNodeHandle

} from 'react-native';
var MakemojiTextInput = require('./MakemojiRN/MakemojiTextInput');
var MakemojiReactions = require('./MakemojiRN/MakemojiReactions');

const NativeEventEmitter = require('NativeEventEmitter');
import MakemojiTextCelliOS from './MakemojiRN/MakemojiTextCelliOS'

var ReactNative = require('ReactNative');
const showDetatchControls = true; // not avaible on ios currently
class MakemojiReactNative extends Component {

  constructor(props){
    super(props);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var subscription;
    this.state = {htmlMessages:[],
      dataSource:ds.cloneWithRows([]),
      detatchedInputId:null,
      showReactions:false,
      textSize:17.0};


      NativeModules.MakemojiManager.init("key");

  }
  componentDidMount(){
    var emitter = new NativeEventEmitter(NativeModules.MakemojiManager);
    this.subscription = emitter.addListener(
        'onHypermojiPress',
        (event) => console.log(event.url)
    );
      this.wallSubscription = emitter.addListener(
          'onEmojiWallSelect',
          (event) => console.log(event)
      );
  }
  componentWillMount(){
  }
  componentWillUnmount(){
      this.subscription.remove();
      this.wallSubscription.remove();
  }
  render() {
    return (
        <View keyboardShouldPersistTaps={false} style={styles.container}>

          {showDetatchControls? <View style={{flexDirection:'row'}}>
            <TouchableHighlight onPress={() => NativeModules.MakemojiManager.openWall()}>
              <Text style={[{marginTop:20},styles.instructions]}>
                  Wall
              </Text>
          </TouchableHighlight>
              <TouchableHighlight onPress={() => this.setState({showReactions:!this.state.showReactions})}>
                  <Text style={[{marginTop:20,marginLeft:30},styles.instructions]}>
                      {this.state.showReactions?'-Reactions':'+Reactions'}
                  </Text>
              </TouchableHighlight>
          </View> :null}
          <ListView style={{flex:1,alignSelf:'stretch',marginTop:50}}
                    dataSource={this.state.dataSource}
                    enableEmptySections={true}
                    renderRow={(rowData) => <View style={{flexDirection:'column'}}>
                        <MakemojiTextCelliOS style={styles.stretch} html={rowData}/>
                       {this.state.showReactions? <MakemojiReactions style={styles.reaction} contentId={rowData}/> :null}
                    </View>}
          />
          <MakemojiTextInput style={styles.moji} onSendPress={this.sendPressed.bind(this)}
                             onHypermojiPress={this.log} onHyperlinkPress={this.log}
                             sendButtonVisible={true} cameraVisible={true} onCameraPress={this.log}
          />
        </View>
    );
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
    reaction:{
        height:30,
        alignSelf: 'stretch',
    },
  editText:{
    height:50,
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
  },
  stretch:{
    alignSelf: 'stretch',
    height:30
  }
});

AppRegistry.registerComponent('MakemojiReactNative', () => MakemojiReactNative);
