import {
	NativeModules,
} from 'react-native'

import type {
	Spec,
} from './NativePingAndroid'

const LINKING_ERROR =
	"The package 'react-native-ping-android' doesn't seem to be linked. Make sure: \n\n" +
	'- You rebuilt the app after installing the package\n' +
	'- You are not using Expo Go\n'

// @ts-expect-error - Not an error. See this reference: https://github.com/react-native-community/RNNewArchitectureLibraries/blob/feat/back-turbomodule/example-library/src/index.js
const isTurboModuleEnabled = global.__turboModuleProxy != null

const module = isTurboModuleEnabled
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	? require('./NativePingAndroid').default
	: NativeModules.RNPingAndroid

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