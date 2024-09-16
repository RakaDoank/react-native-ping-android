import type {
	NavigatorScreenParams,
} from '@react-navigation/native'

import type {
	NativeStackScreenProps,
} from '@react-navigation/native-stack'

import type {
	UseICMPStartParamsInterface,
} from 'react-native-ping-android'

import type * as NestSample from './nest-sample'

export type {
	NestSample,
}

export type NavigationStacks = {
	ping_controller?: never,
	ping_runner: UseICMPStartParamsInterface,

	/**
	 * Just an example how to strict type the navigation argument
	 */
	// ping_runner?: {
	//	iLoveYou: boolean,
	// 	host: string,
	// 	ttl?: number,
	// 	interval?: number,
	// 	timeout?: number,
	// },

	/**
	 * Nested navigation example
	 */
	nest_sample?: NavigatorScreenParams<NestSample.NavigationStacks>,
}

export interface ScreenPropsInterface<Key extends Exclude<
	keyof NavigationStacks,
	/**
	 * Exclude the nesting stacks. You should use their own NavigationStacks directly to get annotate the props screen.
	 * This is just an example
	 */
	'nest_sample'
>> extends NativeStackScreenProps<NavigationStacks, Key> {
}