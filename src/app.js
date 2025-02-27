import React from 'react';
import {SafeAreaView, StyleSheet, Button, Text} from 'react-native';
import {WebView} from 'react-native-webview';
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
    <SafeAreaView>
      <WebView
        ref={webViewRef}
        source={{html: webContent}}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        originWhitelist={['*']}
        onMessage={handleMessage}
      />
      <Button title="Send Message" onPress={sendMessage} />
      <Text>{output}</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  webview: {
    width: 0,
    height: 0,
  },
});

export default App;
