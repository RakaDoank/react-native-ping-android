import {
	AppRegistry,
} from 'react-native'

import {
	Example,
} from './src/example'

import {
	name as appName,
} from './app.json';

AppRegistry.registerComponent(appName, () => Example);
