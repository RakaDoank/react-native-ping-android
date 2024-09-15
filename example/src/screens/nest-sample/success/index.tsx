import {
	View,
	Text,
} from 'react-native'

import type {
	NavigationType,
} from '@/types'

export function Success(_props: NavigationType.NestSample.ScreenPropsInterface<'success'>): React.JSX.Element {

	return (
		<View>
			<Text>
				Voila
			</Text>
		</View>
	)

}