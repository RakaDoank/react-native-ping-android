import {
	type Double,
} from 'react-native/Libraries/Types/CodegenTypes'

import {
	PingStatus,
} from '../ping-const'

export interface ICMPResultInterface {
	rtt: Double,
	ttl: number,
	status: PingStatus,
}

export interface ICMPConstructorDataInterface {
	host: string,
	/**
	 * in bytes
	 */
	packetSize?: number | null,
	/**
	 * in milliseconds
	 */
	timeout?: number | null,
	ttl?: number | null,
}