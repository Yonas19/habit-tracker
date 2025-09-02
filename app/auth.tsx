import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { useRouter } from "expo-router";
import { View, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const router = useRouter();

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
  };
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all the fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    setError(null);
    if (isSignUp) {
      const signUpError = await signUp(email, password);
      if (signUpError) {
        setError(signUpError);
        return
      }
    } else {
      const signInError = await signIn(email, password);
      if (signInError) {
        setError(signInError);
        return
      }
      router.replace('/')
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome back !"}
        </Text>


        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          mode="outlined"
          placeholder="example@gmail.com"
          onChangeText={setEmail}
          value={email}
        />

        <TextInput
          label="Password"
          autoCapitalize="none"
          keyboardType="default" // ✅ fixed typo (was email-adress)
          mode="outlined"
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
        />

        <Button mode="contained" onPress={handleAuth}>
          {isSignUp ? "Signup" : "Sign In"}
        </Button>
        {error && <Text style={{ color: theme.colors.error, textAlign:'center' }}>{error}</Text>}

        <Button mode="text" onPress={handleSwitchMode}>
          {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Signup"}
        </Button>            
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  content: {
    gap: 16,
    padding: 1,
    justifyContent: "center",
  },
  title: {
    marginTop: 12,
    textAlign: "center",
  },
  input: {
    marginTop: 8,
  },
  button: {
    marginBottom: 6,
  },
});
export default AuthScreen;
