// src/contexts/ErgoBridgeContext.js

import React, {createContext, useRef} from 'react';
import {WebView} from 'react-native-webview';
import {View} from 'react-native';
import webContent from '../ergo-lib-wrapper';

export const ErgoLibContext = createContext();

export const ErgoLibProvider = ({children}) => {
  const webViewRef = useRef(null);
  const pendingRequests = useRef({});

  const sendMessage = (methodName, args, className = '', instanceId = null) => {
    return new Promise((resolve, reject) => {
      // Generate a unique ID for the message
      const id = Date.now().toString() + Math.random().toString(36);
      const message = JSON.stringify({
        type: 'call',
        className,
        methodName,
        args,
        id,
        instanceId,
      });

      // Store the pending request
      pendingRequests.current[id] = {resolve, reject};

      // Send the message to the WebView
      if (webViewRef.current) {
        webViewRef.current.postMessage(message);
      } else {
        reject(new Error('WebView not loaded'));
      }
    });
  };

  const handleMessage = event => {
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch (e) {
      console.error('Failed to parse message from WebView:', e);
      return;
    }

    const {type, id, result, error} = data;
    if (type === 'response' || type === 'error') {
      const pendingRequest = pendingRequests.current[id];
      if (pendingRequest) {
        if (type === 'response') {
          pendingRequest.resolve(result);
        } else {
          pendingRequest.reject(new Error(error));
        }
        delete pendingRequests.current[id];
      }
    } else if (type === 'log') {
      console.log('WebView log:', ...data.data);
    } else {
      console.warn('Unknown message type from WebView:', data);
    }
  };

  return (
    <ErgoLibContext.Provider value={{sendMessage}}>
      {children}
      <View style={{width: 0, height: 0}}>
        <WebView
          ref={webViewRef}
          source={{html: webContent}}
          style={{width: 0, height: 0}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          originWhitelist={['*']}
          onMessage={handleMessage}
        />
      </View>
    </ErgoLibContext.Provider>
  );
};
