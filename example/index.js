import {
	AppRegistry,
} from 'react-native';

import {
	AppBootstrap,
} from './src/bootstraps/app';

import {
	name as appName,
} from './app.json';

AppRegistry.registerComponent(appName, () => AppBootstrap);