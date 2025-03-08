import React from 'react';
import {View} from 'react-native';
import {WebView} from 'react-native-webview';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ErgoLibProvider} from './contexts/ergo-lib-context';

import RecoverWalletScreen from './screens/recover-wallet';
import HomeScreen from './screens/home-screen';

const Stack = createNativeStackNavigator();
const webContent = require('./ergo-lib-wrapper'); // Use require for the CommonJS export from webContent.js

// ...
const App = () => {
  const webViewRef = React.useRef(null);
  const [input, setInput] = React.useState('');
  const [output, setOutput] = React.useState('');

  const handleMessage = event => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'log') {
      setOutput(prev => `${prev}\nLog: ${JSON.stringify(data.data)}`);
    } else if (data.type === 'response') {
      setOutput(prev => `${prev}\nResponse: ${JSON.stringify(data.result)}`);
    } else if (data.type === 'error') {
      setOutput(prev => `${prev}\nError: ${data.error}`);
    } else {
      setOutput(prev => `${prev}\nUnknown message: ${JSON.stringify(data)}`);
    }
  };

  const sendMessage = () => {
    if (webViewRef.current) {
      const message = JSON.stringify({
        type: 'call',
        className: '',
        methodName: 'secretSeedFromMnemonic',
        args: ['change me do not use me change me do not use me'],
        id: Date.now(),
      });
      webViewRef.current.postMessage(message);
      setInput('');
    }
  };

  return (
    <ErgoLibProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="RecoverWallet" component={RecoverWalletScreen} />
          {/* Add future screens here */}
          {/*<Stack.Screen name="CreateWallet" component={CreateWalletScreen} />*/}
          {/*<Stack.Screen name="MainWallet" component={MainWalletScreen} />*/}
        </Stack.Navigator>
      </NavigationContainer>
      {/*<ImportWalletScreen ergoLibRef={webViewRef} /> */}
      <View style={{width: 0, height: 0}}>
        <WebView
          ref={webViewRef}
          source={{html: webContent}}
          style={{
            width: 0,
            height: 0,
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          originWhitelist={['*']}
          onMessage={handleMessage}
        />
      </View>
    </ErgoLibProvider>
  );
};

export default App;
