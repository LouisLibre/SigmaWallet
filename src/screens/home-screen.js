import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  Stop,
  Circle,
  Rect,
  Line,
} from 'react-native-svg';

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
  xsm: 12,
  md: 16,
  xmd: 18,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const FONT = {
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    xmd: 18,
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Logo and title styles
  logo: {
    marginBottom: SPACING.lg,
  },
  appTitle: {
    fontSize: FONT.size.xl,
    fontWeight: FONT.weight.bold,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  appTagline: {
    fontSize: FONT.size.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
  },

  // Button styles
  buttonContainer: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xmd,
    borderRadius: SPACING.sm,
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.xmd,
    alignItems: 'center',
    marginBottom: SPACING.xsm,
  },
  primaryButtonText: {
    color: COLORS.textPrimary,
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    textTransform: 'uppercase',
  },
  secondaryButtonText: {
    color: COLORS.primary,
    fontSize: FONT.size.md,
    fontWeight: FONT.weight.bold,
    textTransform: 'uppercase',
  },

  // Bottom indicator
  bottomIndicator: {
    height: 5,
    width: 134,
    backgroundColor: '#000',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: SPACING.md,
  },
});
const SigmaLogo = () => (
  <Svg width={120} height={120} viewBox="0 0 120 120">
    {/* Sigma Symbol with reduced left corner radius */}
    <Path
      d="
        M35 35
        H85
        V43
        H45
        L75 60
        L45 77
        H85
        V85
        H35
        C34 85 32 83 32 80
        V40
        C32 37 34 35 35 35
        Z
      "
      fill="#FF6200"
    />
  </Svg>
);

const HomeScreen = ({navigation}) => {
  const handleCreateWallet = () => {
    console.log('Create new wallet');
    // navigation.navigate('CreateWallet');
  };

  const handleRecoverWallet = () => {
    console.log('Recover existing wallet');
    // navigation.navigate('RecoverWallet');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.contentContainer}>
        <View style={styles.logoSection}>
          <View style={styles.logo}>
            <SigmaLogo />
          </View>
          <Text style={styles.appTagline}>Sigma Wallet for Ergo.</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleRecoverWallet}>
            <Text style={styles.secondaryButtonText}>
              Recover Existing Wallet
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleCreateWallet}>
            <Text style={styles.primaryButtonText}>Create New Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
