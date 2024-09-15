import NativeModule from '../native-module'

import type {
	ICMPConstructorDataInterface,
} from './types'

export type * from './types'

export class ICMP {

	private eventId: string = new Date().getTime().toString() + Math.random().toString()
	readonly host: string
	readonly packetSize: number = 56
	readonly timeout: number = 1000
	readonly ttl: number = 54

	static NOECHO_TTL = -1

	constructor(data: ICMPConstructorDataInterface) {
		this.host = data.host
		this.packetSize = data.packetSize ?? this.packetSize
		this.timeout = data.timeout ?? this.timeout
		this.ttl = data.ttl ?? this.ttl
	}

	ping() {
		return NativeModule.icmpStart(
			this.eventId,
			this.host,
			this.packetSize,
			this.timeout,
			this.ttl,
		)
	}

	cancel() {
		NativeModule.icmpStop(this.eventId)
	}

}