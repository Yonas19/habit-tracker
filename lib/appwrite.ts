import { Account, Client } from "react-native-appwrite";
export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setPlatform(EXPO_PUBLIC_APPWRITE_PLATFORM!);
export default client;
export const account = new Account(client);
