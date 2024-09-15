/**
 * Just an example of how to use nested navigation
 */

import {
	createNativeStackNavigator,
} from '@react-navigation/native-stack'

import type {
	NavigationType,
} from '@/types'

import {
	NestSampleScreen,
} from '@/screens'

const
	NestSampleStack =
		createNativeStackNavigator<NavigationType.NestSample.NavigationStacks>()

export default function NestSampleNavigator(): React.JSX.Element {

	return (
		<NestSampleStack.Navigator
			initialRouteName="step_1"
		>
			<NestSampleStack.Screen
				name="step_1"
				component={ NestSampleScreen.Step1 }
			/>
			<NestSampleStack.Screen
				name="step_2"
				component={ NestSampleScreen.Step2 }
			/>
			<NestSampleStack.Screen
				name="success"
				component={ NestSampleScreen.Success }
			/>
		</NestSampleStack.Navigator>
	)

}