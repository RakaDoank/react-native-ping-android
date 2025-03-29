import {
	TurboModuleRegistry,
	type TurboModule,
} from 'react-native'

import type {
	EventEmitter,
	Int32,
	UnsafeObject,
} from 'react-native/Libraries/Types/CodegenTypes'

export interface Spec extends TurboModule {
	icmp: (
		eventId: string,
		host: string,
		count: Int32,
		packetSize: Int32,
		timeout: Int32,
		ttl: Int32,
		interval: Int32,
	) => void,
	icmpRemove: (eventId: string) => void,
	readonly pingListener: EventEmitter<UnsafeObject>,

	isReachable: (
		host: string,
		timeout?: Int32,
	) => Promise<boolean | null>,
	getHostName: (
		host: string,
	) => Promise<string | null>,
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNPingAndroid')
