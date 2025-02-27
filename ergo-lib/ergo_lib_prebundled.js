import {
  ExtSecretKey,
  DerivationPath,
  NetworkAddress,
  NetworkPrefix,
  Mnemonic,
} from './ergo_lib_wasm.js';

// Function to convert a string to a Uint8Array (browser-compatible)
function stringToUint8Array(str) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

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
