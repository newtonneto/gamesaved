import React from 'react';
import { Alert } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useTheme } from 'native-base';
import {
  GameController,
  Scroll,
  FinnTheHuman,
  UsersThree,
  SignOut,
} from 'phosphor-react-native';
import auth from '@react-native-firebase/auth';

import AppHeader from '@components/AppHeader';
import BackButton from '@components/BackButton';
import DrawerButton from '@components/DrawerButton';
import HomeStack from '@modules/HomeStack';
import InventoryStack from '@modules/InventoryStack';
import PartyStack from '@modules/PartyStack';
import ProfileDetails from '@screens/ProfileDetails';
import { useAppSelector } from '@src/store';
import { stateDrawerHeader, stateTitle } from '@store/slices/navigation-slice';
import { ICON_NORMAL } from '@utils/constants';

const { Navigator, Screen } = createDrawerNavigator();

const AppRoutes = () => {
  const { colors } = useTheme();
  const showDrawerHeader = useAppSelector(state => stateDrawerHeader(state));
  const title = useAppSelector(state => stateTitle(state));

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
      initialRouteName="Home"
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
              icon={() => (
                <SignOut color={colors.gray[200]} size={ICON_NORMAL} />
              )}
            />
          </DrawerContentScrollView>
        );
      }}>
      <Screen
        name="Home"
        component={HomeStack}
        options={{
          headerTitle: () => <AppHeader title={title} />,
          headerLeft: () => (title !== 'Home' ? <BackButton /> : <></>),
          headerRight: () => <DrawerButton />,
          drawerIcon: () => (
            <Scroll color={colors.gray[200]} size={ICON_NORMAL} />
          ),
          drawerActiveTintColor: colors.secondary[700],
          drawerInactiveTintColor: colors.gray[100],
        }}
      />
      <Screen
        name="Inventory"
        component={InventoryStack}
        options={{
          headerTitle: () => <AppHeader title={title} />,
          headerLeft: () => <BackButton />,
          headerRight: () => <DrawerButton />,
          drawerIcon: () => (
            <GameController color={colors.gray[200]} size={ICON_NORMAL} />
          ),
          drawerActiveTintColor: colors.secondary[700],
          drawerInactiveTintColor: colors.gray[100],
        }}
      />
      <Screen
        name="Stats"
        component={ProfileDetails}
        options={{
          headerTitle: () => <AppHeader title={title} />,
          headerLeft: () => <BackButton />,
          headerRight: () => <DrawerButton />,
          drawerIcon: () => (
            <FinnTheHuman color={colors.gray[200]} size={ICON_NORMAL} />
          ),
          drawerActiveTintColor: colors.secondary[700],
          drawerInactiveTintColor: colors.gray[100],
        }}
      />
      <Screen
        name="Party"
        component={PartyStack}
        options={{
          headerTitle: () => <AppHeader title={title} />,
          headerLeft: () => <BackButton />,
          headerRight: () => <DrawerButton />,
          drawerIcon: () => (
            <UsersThree color={colors.gray[200]} size={ICON_NORMAL} />
          ),
          drawerActiveTintColor: colors.secondary[700],
          drawerInactiveTintColor: colors.gray[100],
        }}
      />
    </Navigator>
  );
};

export default AppRoutes;
