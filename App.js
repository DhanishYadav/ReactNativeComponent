import React, { useEffect } from "react";
import { hide } from "react-native-bootsplash";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { LogBox, StyleSheet } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/store";
import { networkService } from "@/networking";
import { RootNavigator } from "@/navigation";
import { StripeProvider } from "@stripe/stripe-react-native"; // Import StripeProvider
import { NotificationServices } from "./helpers/NotificationServices";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export function App() {
  LogBox.ignoreAllLogs();

  const handleStoreRehydration = () => {
    const accessToken = store.getState().user?.token?.access_token;
    const userData = store.getState().user?.data;
    //console.log("accessToken=" + accessToken);
    if (userData) {
      if (accessToken) {
        networkService.setAccessToken(accessToken);
      }
    }

    hide();
  };

  return (
    <Provider store={store}>
      <PersistGate onBeforeLift={handleStoreRehydration} persistor={persistor}>
        <GestureHandlerRootView style={styles.container}>
          <StripeProvider publishableKey="your-publishable-key">
            <RootNavigator />
            {/* Include PaymentScreen wherever appropriate in your navigation flow */}
          </StripeProvider>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  );
}
