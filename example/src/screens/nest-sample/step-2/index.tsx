import {
	View,
	Text,
} from 'react-native'

import type {
	NavigationType,
} from '@/types'

export function Step2(props: NavigationType.NestSample.ScreenPropsInterface<'step_2'>): React.JSX.Element {

	return (
		<View>
			<Text>
				Step 2 - Message: { props.route.params?.someMessage || '-' }
			</Text>
		</View>
	)

}