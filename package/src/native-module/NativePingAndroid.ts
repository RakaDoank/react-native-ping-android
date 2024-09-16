import {
	TurboModuleRegistry,
	type TurboModule,
} from 'react-native'

import type {
	Int32,
} from 'react-native/Libraries/Types/CodegenTypes'

import type {
	ICMPResultInterface,
} from '../ICMP/types'

export interface Spec extends TurboModule {
	icmpStart: (
		eventId: string,
		host: string,
		// count: Int32,
		/**
		 * In bytes
		 */
		packetSize: Int32,
		timeout: Int32,
		ttl: Int32,
	) => Promise<ICMPResultInterface>,
	icmpStop: (
		eventId: string,
	) => void,

	isReachable: (
		host: string,
		timeout?: Int32,
	) => Promise<boolean | null>,
	getHostName: (
		host: string,
	) => Promise<string | null>,
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNPingAndroid')