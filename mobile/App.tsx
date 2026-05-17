import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootNavigator from './src/navigation/RootNavigator';
import { ToastProvider } from './src/components/Toast';

export default function App() {
  return (
    <ToastProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#F2F2F7" />
        <RootNavigator />
      </NavigationContainer>
    </ToastProvider>
  );
}
