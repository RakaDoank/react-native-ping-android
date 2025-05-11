import {
	isTurboModuleCompat,
} from './is-turbo-module-compat'

import type {
	Spec,
} from './NativePingAndroid'

const LINKING_ERROR =
	"The package 'react-native-ping-android' doesn't seem to be linked. Make sure: \n\n" +
	'- You rebuilt the app after installing the package\n' +
	'- You are not using Expo Go\n'

const module = isTurboModuleCompat()
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	? require('./NativePingAndroid').default
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	: require('react-native').NativeModules.RNPingAndroid

const NativeModule = module
	? module
	: new Proxy(
		{},
		{
			get() {
				throw new Error(LINKING_ERROR);
			},
		},
	)

export default NativeModule as Spec
