import * as ergo_lib_wasm from './ergo_lib_wasm.js';

const originalConsoleLog = console.log;
console.log = function (...args) {
  originalConsoleLog.apply(console, args);
  const message = JSON.stringify({type: 'log', data: args});
  if (window.ReactNativeWebView) {
    window.ReactNativeWebView.postMessage(message);
  }
};

const bridgeFunctions = {
  secretSeedFromMnemonic: mnemonic => {
    console.log('secretSeedFromMnemonic:', mnemonic);
    return ergo_lib_wasm.Mnemonic.to_seed(mnemonic, new Uint8Array(0));
  },
  // Add more bridge functions as needed:
  // bridge_anotherFunction: (...args) => { ... },
  // bridge_yetAnotherFunction: (...args) => { ... },
};

window.addEventListener('message', event => {
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'call') {
      const {className, methodName, args, id, instanceId} = data;
      let result;
      console.log('call');

      try {
        if (!instanceId) {
          // Static method or function call
          if (className && methodName) {
            console.log('className && methodName');
            const Class = ergo_lib_wasm[className];
            if (Class && typeof Class[methodName] === 'function') {
              result = Class[methodName].apply(Class, args || []);
            } else {
              throw new Error(
                `Static method ${className}.${methodName} not found`,
              );
            }
          } else if (methodName) {
            console.log('methodName');
            if (bridgeFunctions[methodName]) {
              result = bridgeFunctions[methodName](...(args || []));
            } else if (
              ergo_lib_wasm[methodName] &&
              typeof ergo_lib_wasm[methodName] === 'function'
            ) {
              result = ergo_lib_wasm[methodName].apply(
                ergo_lib_wasm,
                args || [],
              );
            } else {
              throw new Error(`Function ${methodName} not found`);
            }
          } else if (className) {
            const Class = ergo_lib_wasm[className];
            if (Class && typeof Class === 'function') {
              const instance = new Class(...(args || []));
              const newInstanceId = generateInstanceId();
              if (!window.ergoInstances) window.ergoInstances = {};
              window.ergoInstances[newInstanceId] = instance;
              result = {instanceId: newInstanceId};
            } else {
              throw new Error(`Class ${className} not found`);
            }
          }
        } else {
          // Instance method call
          if (!window.ergoInstances || !window.ergoInstances[instanceId]) {
            throw new Error(`Instance with ID ${instanceId} not found`);
          }
          const instance = window.ergoInstances[instanceId];
          if (typeof instance[methodName] !== 'function') {
            throw new Error(`Instance method ${methodName} not found`);
          }
          result = instance[methodName].apply(instance, args || []);
        }

        const response = JSON.stringify({type: 'response', id, result});
        window.ReactNativeWebView.postMessage(response);
      } catch (error) {
        const errorResponse = JSON.stringify({
          type: 'error',
          id,
          error: error.message,
        });
        window.ReactNativeWebView.postMessage(errorResponse);
      }
    } else if (data.type === 'destroy') {
      // Cleanup instance
      const {instanceId} = data;
      if (window.ergoInstances && window.ergoInstances[instanceId]) {
        delete window.ergoInstances[instanceId];
        const response = JSON.stringify({
          type: 'response',
          id: data.id,
          result: 'destroyed',
        });
        window.ReactNativeWebView.postMessage(response);
      }
    }
  } catch (error) {
    console.error('Error parsing message:', error);
  }
});

function generateInstanceId() {
  return 'instance_' + Math.random().toString(36).substr(2, 9);
}

console.log('WASM BRIDGE LAODED!');

/*
// Function to generate a secret seed from a mnemonic
const secretSeedFromMnemonic = mnemonic => {
  return Mnemonic.to_seed(mnemonic, new Uint8Array(0)); // Pass the string directly
};

// Function to derive master secret key from seed
const masterSecretFromSeed = seed => ExtSecretKey.derive_master(seed);

// Function to derive a secret key from a root secret and derivation path
const deriveSecretKey = (rootSecret, path) => rootSecret.derive(path);

// Function to get the next derivation path
const nextPath = (rootSecret, lastPath) =>
  rootSecret.derive(lastPath).path().next();

// Main function to generate addresses
const main = () => {
  try {
    window.ReactNativeWebView.postMessage('WASM module loaded!');

    const mnemonic = 'change me do not use me change me do not use me';

    // Generate seed from mnemonic
    const seed = secretSeedFromMnemonic(mnemonic);
    const rootSecret = masterSecretFromSeed(seed);

    // Use EIP-3 pathing: m/44'/429'/0'/0/0
    // First param is 0' (account) and the last 0 (address index)
    let changePath = DerivationPath.new(0, new Uint32Array([0]));
    const changeSecretKey = deriveSecretKey(rootSecret, changePath);
    const changePubKey = changeSecretKey.public_key();
    const changeAddress = NetworkAddress.new(
      NetworkPrefix.Mainnet,
      changePubKey.to_address(),
    );

    console.log(`Change address: ${changeAddress.to_base58()}`);

    // Re-create changePath since it might be freed in the previous step
    changePath = DerivationPath.new(0, new Uint32Array([0]));
    const firstPath = nextPath(rootSecret, changePath);
    console.log(`First derived path: ${firstPath}`);

    const firstSecretKey = deriveSecretKey(rootSecret, firstPath);
    const firstPubkey = firstSecretKey.public_key();
    const firstAddress = NetworkAddress.new(
      NetworkPrefix.Mainnet,
      firstPubkey.to_address(),
    );

    console.log(`First derived address: ${firstAddress.to_base58()}`);
  } catch (error) {
    console.error('Error in main:', error);
  }
};

// Run the main function
main();
*/
