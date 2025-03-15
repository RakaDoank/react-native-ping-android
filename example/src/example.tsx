import {
	SafeAreaProvider,
} from 'react-native-safe-area-context'

import {
	NavigationBootstrap,
} from '@/bootstraps'

export function Example() {

	return (
		<SafeAreaProvider>
			<NavigationBootstrap/>
		</SafeAreaProvider>
	)

}
