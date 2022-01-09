import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, GroupsScreen, MessagesScreen } from './src/screens';
import routes from './src/config/routes';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name={routes.LOGIN} component={LoginScreen} />
          <Stack.Screen name={routes.GROUPS} component={GroupsScreen} />
          <Stack.Screen name={routes.MESSAGES} component={MessagesScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
