import {
	type Double,
} from 'react-native/Libraries/Types/CodegenTypes'

import {
	PingStatus,
} from '../../ping-status'

export interface ICMPResult {
	rtt: Double,
	ttl: number,
	status: PingStatus,
}
