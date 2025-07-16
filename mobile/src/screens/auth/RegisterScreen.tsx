import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  Surface,
  useTheme,
  Checkbox,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { RootState } from '../../store/store';
import { registerUser } from '../../store/slices/authSlice';
import { useAuth } from '../../contexts/AuthContext';

export const RegisterScreen: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Error states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [termsError, setTermsError] = useState('');

  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { register } = useAuth();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Password must be at least 8 characters with at least one number and one letter
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = (): boolean => {
    let isValid = true;

    // Reset errors
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setTermsError('');

    // First name validation
    if (!firstName.trim()) {
      setFirstNameError('First name is required');
      isValid = false;
    } else if (firstName.trim().length < 2) {
      setFirstNameError('First name must be at least 2 characters');
      isValid = false;
    }

    // Last name validation
    if (!lastName.trim()) {
      setLastNameError('Last name is required');
      isValid = false;
    } else if (lastName.trim().length < 2) {
      setLastNameError('Last name must be at least 2 characters');
      isValid = false;
    }

    // Email validation
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Password validation
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters with at least one letter and one number');
      isValid = false;
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    }

    // Terms acceptance validation
    if (!acceptTerms) {
      setTermsError('You must accept the Terms and Conditions');
      isValid = false;
    }

    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const success = await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (success) {
        Alert.alert(
          'Registration Successful',
          'Welcome to SerenityAI! Your account has been created successfully.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Registration Failed', 'Unable to create account. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'An error occurred during registration');
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary]}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Title style={[styles.title, { color: theme.colors.onPrimary }]}>
                Join SerenityAI
              </Title>
              <Paragraph style={[styles.subtitle, { color: theme.colors.onPrimary }]}>
                Create your account and start your healing journey
              </Paragraph>
            </View>

            {/* Registration Form */}
            <Surface style={styles.formContainer}>
              <Card.Content style={styles.cardContent}>
                <Text variant="headlineSmall" style={styles.formTitle}>
                  Create Account
                </Text>

                {/* Name Fields */}
                <View style={styles.nameRow}>
                  <View style={styles.nameField}>
                    <TextInput
                      label="First Name"
                      value={firstName}
                      onChangeText={setFirstName}
                      mode="outlined"
                      autoCapitalize="words"
                      autoComplete="given-name"
                      error={!!firstNameError}
                      style={styles.input}
                      left={<TextInput.Icon icon="account" />}
                    />
                    {firstNameError ? (
                      <Text style={[styles.errorText, { color: theme.colors.error }]}>
                        {firstNameError}
                      </Text>
                    ) : null}
                  </View>

                  <View style={styles.nameField}>
                    <TextInput
                      label="Last Name"
                      value={lastName}
                      onChangeText={setLastName}
                      mode="outlined"
                      autoCapitalize="words"
                      autoComplete="family-name"
                      error={!!lastNameError}
                      style={styles.input}
                    />
                    {lastNameError ? (
                      <Text style={[styles.errorText, { color: theme.colors.error }]}>
                        {lastNameError}
                      </Text>
                    ) : null}
                  </View>
                </View>

                {/* Email Input */}
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  error={!!emailError}
                  style={styles.input}
                  left={<TextInput.Icon icon="email" />}
                />
                {emailError ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {emailError}
                  </Text>
                ) : null}

                {/* Password Input */}
                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                  error={!!passwordError}
                  style={styles.input}
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                {passwordError ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {passwordError}
                  </Text>
                ) : null}

                {/* Confirm Password Input */}
                <TextInput
                  label="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password-new"
                  error={!!confirmPasswordError}
                  style={styles.input}
                  left={<TextInput.Icon icon="lock-check" />}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                />
                {confirmPasswordError ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {confirmPasswordError}
                  </Text>
                ) : null}

                {/* Terms and Conditions */}
                <View style={styles.termsContainer}>
                  <Checkbox
                    status={acceptTerms ? 'checked' : 'unchecked'}
                    onPress={() => setAcceptTerms(!acceptTerms)}
                  />
                  <Text style={styles.termsText}>
                    I agree to the{' '}
                    <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
                      Terms and Conditions
                    </Text>{' '}
                    and{' '}
                    <Text style={[styles.termsLink, { color: theme.colors.primary }]}>
                      Privacy Policy
                    </Text>
                  </Text>
                </View>
                {termsError ? (
                  <Text style={[styles.errorText, { color: theme.colors.error }]}>
                    {termsError}
                  </Text>
                ) : null}

                {/* Register Button */}
                <Button
                  mode="contained"
                  onPress={handleRegister}
                  loading={isLoading}
                  disabled={isLoading}
                  style={styles.registerButton}
                  contentStyle={styles.buttonContent}
                >
                  Create Account
                </Button>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <Divider style={styles.divider} />
                  <Text style={styles.dividerText}>or</Text>
                  <Divider style={styles.divider} />
                </View>

                {/* Login Link */}
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account?</Text>
                  <Button
                    mode="text"
                    onPress={navigateToLogin}
                    style={styles.loginButton}
                  >
                    Sign In
                  </Button>
                </View>

                {/* Error Message */}
                {error && (
                  <Text style={[styles.errorText, { color: theme.colors.error, textAlign: 'center' }]}>
                    {error}
                  </Text>
                )}
              </Card.Content>
            </Surface>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.9,
  },
  formContainer: {
    borderRadius: 16,
    elevation: 4,
    backgroundColor: 'white',
  },
  cardContent: {
    padding: 24,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameField: {
    flex: 1,
    marginHorizontal: 4,
  },
  input: {
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    marginBottom: 16,
    marginTop: -8,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  termsText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
  termsLink: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  buttonContent: {
    height: 48,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    opacity: 0.7,
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    opacity: 0.7,
  },
  loginButton: {
    marginLeft: 8,
  },
});
