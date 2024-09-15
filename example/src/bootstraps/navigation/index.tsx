import {
	useColorScheme,
} from 'react-native'

import {
	NavigationContainer,
} from '@react-navigation/native'

import {
	createNativeStackNavigator,
} from '@react-navigation/native-stack'

import {
	PingControllerScreen,
	PingRunnerScreen,
} from '@/screens'

import {
	type NavigationType,
} from '@/types'

import NestSampleNavigator from './_nest-sample'

const
	Stack =
		createNativeStackNavigator<NavigationType.NavigationStacks>()

export function NavigationBootstrap(): React.JSX.Element {

	const colorScheme = useColorScheme()

	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName="ping_controller"
				screenOptions={{
					headerShown: false,
					contentStyle: {
						backgroundColor: colorScheme === 'dark'
							? '#111111'
							: '#EEEEEE',
					},
				}}
			>
				<Stack.Screen
					name="ping_controller"
					component={ PingControllerScreen }
				/>

				<Stack.Screen
					name="ping_runner"
					component={ PingRunnerScreen }
				/>

				<Stack.Screen
					name="nest_sample"
					component={ NestSampleNavigator }
				/>
			</Stack.Navigator>
		</NavigationContainer>
	)

}