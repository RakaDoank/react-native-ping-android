import {
	Button,
	View,
	Text,
} from 'react-native'

import {
	NavigationHooks,
} from '@/hooks'

import type {
	NavigationType,
} from '@/types'

export function Step1(_props: NavigationType.NestSample.ScreenPropsInterface<'step_1'>): React.JSX.Element {

	const
		navigation =
			NavigationHooks.useNavigation()

	const navigateToStep2 = () => {
		navigation.navigate(
			'nest_sample',
			{
				screen: 'step_2',
				params: {
					foo: true,
					bar: 0,
					someMessage: 'i love you',
				},
			},
		)
	}

	return (
		<View>
			<Text>
				Step 1
			</Text>
			<Button
				title="Navigate to Step 2"
				onPress={ navigateToStep2 }
			/>
		</View>
	)

}