import React from 'react';
import { Alert } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { HStack, useTheme, IconButton } from 'native-base';
import {
  SkipBack,
  Pause,
  GameController,
  Scroll,
  FinnTheHuman,
  UsersThree,
  SignOut,
} from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';

import AppHeader from '../components/AppHeader';
import HomeStack from '../modules/HomeStack';
import Profile from '../screens/Profile';
import Inventory from '../screens/Inventory';
import Friends from '../screens/Friends';
import { useAppSelector } from '../store';
import { stateDrawerHeader } from '../store/slices/navigation-slice';

const { Navigator, Screen } = createDrawerNavigator();

const AppRoutes = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const showDrawerHeader = useAppSelector(state => stateDrawerHeader(state));

  const handleLogout = () => {
    Alert.alert(
      'D:',
      'Tem certeza que deseja sair? Qualquer progresso não salvo será perdido',
      [
        {
          text: 'Sim',
          onPress: () => disconnectUser(),
        },
        {
          text: 'Não',
          style: 'cancel',
        },
      ],
    );
  };

  const disconnectUser = async () => {
    try {
      await auth().signOut();
    } catch (err) {
      Alert.alert('>.<', 'Não foi possível encerrar sua sessão');
    }
  };

  return (
    <Navigator
      initialRouteName="homestack"
      screenOptions={{
        drawerPosition: 'right',
        drawerType: 'front',
        headerStyle: {
          backgroundColor: colors.gray[600],
        },
        headerTitleAlign: 'center',
        drawerStyle: {
          backgroundColor: colors.gray[600],
        },
        headerShown: showDrawerHeader,
      }}
      drawerContent={props => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Sair"
              onPress={handleLogout}
              labelStyle={{ color: colors.white }}
              style={{ backgroundColor: colors.red[500] }}
              icon={() => <SignOut color={colors.gray[200]} size={24} />}
            />
          </DrawerContentScrollView>
        );
      }}>
      <Screen
        name="homestack"
        component={HomeStack}
        options={{
          headerTitle: () => <AppHeader title="Home" />,
          headerLeft: () => <></>,
          headerRight: () => (
            <HStack
              w="full"
              bg="gray.600"
              alignItems="center"
              justifyContent="center"
              h="full">
              <IconButton
                icon={<Pause color={colors.gray[200]} size={24} />}
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
              />
            </HStack>
          ),
          drawerIcon: () => <Scroll color={colors.gray[200]} size={24} />,
          drawerActiveTintColor: colors.secondary[700],
          drawerInactiveTintColor: colors.gray[100],
        }}
      />
      <Screen
        name="inventory"
        component={Inventory}
        options={{
          headerTitle: () => <AppHeader title="Inventory" />,
          headerLeft: () => (
            <HStack
              w="full"
              bg="gray.600"
              alignItems="center"
              justifyContent="center"
              h="full">
              <IconButton
                icon={<SkipBack color={colors.gray[200]} size={24} />}
                onPress={() => navigation.goBack()}
              />
            </HStack>
          ),
          headerRight: () => (
            <HStack
              w="full"
              bg="gray.600"
              alignItems="center"
              justifyContent="center"
              h="full">
              <IconButton
                icon={<Pause color={colors.gray[200]} size={24} />}
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
              />
            </HStack>
          ),
          drawerIcon: () => (
            <GameController color={colors.gray[200]} size={24} />
          ),
          drawerActiveTintColor: colors.secondary[700],
          drawerInactiveTintColor: colors.gray[100],
        }}
      />
      <Screen
        name="profile"
        component={Profile}
        options={{
          headerTitle: () => <AppHeader title="Stats" />,
          headerLeft: () => (
            <HStack
              w="full"
              bg="gray.600"
              alignItems="center"
              justifyContent="center"
              h="full">
              <IconButton
                icon={<SkipBack color={colors.gray[200]} size={24} />}
                onPress={() => navigation.goBack()}
              />
            </HStack>
          ),
          headerRight: () => (
            <HStack
              w="full"
              bg="gray.600"
              alignItems="center"
              justifyContent="center"
              h="full">
              <IconButton
                icon={<Pause color={colors.gray[200]} size={24} />}
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
              />
            </HStack>
          ),
          drawerIcon: () => <FinnTheHuman color={colors.gray[200]} size={24} />,
          drawerActiveTintColor: colors.secondary[700],
          drawerInactiveTintColor: colors.gray[100],
        }}
      />
      <Screen
        name="party"
        component={Friends}
        options={{
          headerTitle: () => <AppHeader title="Party" />,
          headerLeft: () => (
            <HStack
              w="full"
              bg="gray.600"
              alignItems="center"
              justifyContent="center"
              h="full">
              <IconButton
                icon={<SkipBack color={colors.gray[200]} size={24} />}
                onPress={() => navigation.goBack()}
              />
            </HStack>
          ),
          headerRight: () => (
            <HStack
              w="full"
              bg="gray.600"
              alignItems="center"
              justifyContent="center"
              h="full">
              <IconButton
                icon={<Pause color={colors.gray[200]} size={24} />}
                onPress={() =>
                  navigation.dispatch(DrawerActions.toggleDrawer())
                }
              />
            </HStack>
          ),
          drawerIcon: () => <UsersThree color={colors.gray[200]} size={24} />,
          drawerActiveTintColor: colors.secondary[700],
          drawerInactiveTintColor: colors.gray[100],
        }}
      />
    </Navigator>
  );
};

export default AppRoutes;
