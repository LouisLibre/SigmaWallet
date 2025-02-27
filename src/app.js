import React from 'react';
import {SafeAreaView, StyleSheet, Alert} from 'react-native';
import {WebView} from 'react-native-webview';
const webContent = require('./ergo-lib-wrapper'); // Use require for the CommonJS export from webContent.js

// ...
const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <WebView
        source={{html: webContent}}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        allowFileAccess={true}
        originWhitelist={['*']}
        onMessage={event => {
          console.log('Message received from JS: ', event.nativeEvent.data);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default App;
