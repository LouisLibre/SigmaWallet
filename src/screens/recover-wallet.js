import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {ErgoLibContext} from './../contexts/ergo-lib-context';

const COLORS = {
  background: '#121212',
  cardBackground: '#1E1E1E',
  primary: '#F05941',
  primaryDark: '#FF6200',
  textPrimary: '#FFFFFF',
  textSecondary: '#E0E0E0',
  textMuted: '#9E9E9E',
  inactive: '#333333',
};

const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const FONT = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 28,
  },
  weight: {
    regular: '400',
    medium: '500',
    bold: '700',
  },
};

const styles = StyleSheet.create({
  // Layout styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  contentScroll: {
    flexGrow: 1,
  },
  safeBottom: {
    paddingBottom: SPACING.lg,
  },

  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.lg,
  },
  backButton: {
    padding: SPACING.sm,
    paddingRight: SPACING.xs,
    paddingLeft: 0,
    borderRadius: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  backText: {
    fontSize: FONT.size.lg,
    fontWeight: FONT.weight.bold,
    color: COLORS.primary,
    marginLeft: 0,
  },

  // Content styles
  screenTitle: {
    fontSize: FONT.size.xl,
    fontWeight: FONT.weight.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  wordCount: {
    fontSize: FONT.size.xs,
    color: COLORS.textMuted,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },

  // Input styles
  inputContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.inactive,
    marginBottom: SPACING.md,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
  },
  textInput: {
    fontSize: FONT.size.md,
    color: COLORS.textPrimary,
    padding: SPACING.md,
    minHeight: 120,
    textAlignVertical: 'top',
  },

  // Button styles
  buttonContainer: {
    marginTop: SPACING.md,
  },
  button: {
    paddingVertical: SPACING.md,
    borderRadius: SPACING.sm,
    alignItems: 'center',
    backgroundColor: COLORS.inactive,
  },
  buttonActive: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.medium,
    color: COLORS.textMuted,
  },
  buttonTextActive: {
    color: COLORS.textPrimary,
  },
});

const BackIcon = ({color = COLORS.primary}) => (
  <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"
      fill={color}
    />
  </Svg>
);

const RecoverWalletScreen = ({navigation}) => {
  const [mnemonic, setMnemonic] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const {sendMessage} = useContext(ErgoLibContext);

  const wordCount = mnemonic.trim() ? mnemonic.trim().split(/\s+/).length : 0;
  const isValidWordCount = wordCount >= 12 && wordCount <= 24;
  const isButtonActive = isValidWordCount;

  const handleContinue = async () => {
    if (isButtonActive) {
      console.log('Recovering wallet with mnemonic:', mnemonic);
      const seed = await sendMessage('secretSeedFromMnemonic', [mnemonic]);
      console.log('Received seed:', seed);
      // Add your wallet recovery logic here
      // For demo purposes, show success message
      Alert.alert(
        'Wallet Recovery',
        'Your wallet is being recovered. Please wait...',
        [{text: 'OK'}],
      );
    } else if (wordCount > 0 && !isValidWordCount) {
      Alert.alert(
        'Invalid Seed Phrase',
        'Please enter a valid BIP39 seed phrase (12-24 words).',
        [{text: 'OK'}],
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          style={styles.contentContainer}
          contentContainerStyle={styles.contentScroll}
          keyboardShouldPersistTaps="handled">
          {/* Header with back button */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              accessibilityLabel="Go back">
              <BackIcon />
            </TouchableOpacity>
            <Text style={styles.backText}>Back</Text>
          </View>

          {/* Main content */}
          <Text style={styles.screenTitle}>Recover Wallet</Text>
          <Text style={styles.sectionTitle}>Mnemonic</Text>

          {/* Mnemonic TextInput */}
          <View
            style={[
              styles.inputContainer,
              inputFocused && styles.inputContainerFocused,
            ]}>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder="Enter your BIP39 seed phrase, separated by spaces"
              placeholderTextColor={COLORS.textMuted}
              value={mnemonic}
              onChangeText={setMnemonic}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
            />
          </View>

          <Text style={styles.wordCount}>
            {wordCount} {wordCount === 1 ? 'word' : 'words'}
            {wordCount < 24 && ' (12-24 words required)'}
          </Text>

          {/* Continue button */}
          <View style={[styles.buttonContainer, styles.safeBottom]}>
            <TouchableOpacity
              style={[styles.button, isButtonActive && styles.buttonActive]}
              onPress={handleContinue}
              disabled={!isButtonActive}>
              <Text
                style={[
                  styles.buttonText,
                  isButtonActive && styles.buttonTextActive,
                ]}>
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RecoverWalletScreen;
