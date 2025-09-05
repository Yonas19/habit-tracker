import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-paper";
import { useAuth } from "@/lib/auth-context";

const index = () => {
  const { signOut } = useAuth();
  return (
    <View>
      <Text>index</Text>

      <Button mode="text" onPress={signOut} icon={"logout"}>
        Sign out {" "}
      </Button>
    </View>
  );
};

export default index;
