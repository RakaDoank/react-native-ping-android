import {
	SafeAreaProvider,
} from 'react-native-safe-area-context'

import {
	NavigationBootstrap,
} from '../navigation'

export function AppBootstrap(): React.JSX.Element {

	return (
		<SafeAreaProvider>
			<NavigationBootstrap/>
		</SafeAreaProvider>
	)

}