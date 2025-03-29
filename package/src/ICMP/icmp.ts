import type {
	EventSubscription,
} from 'react-native'

import NativeModule from '../native-module'

import {
	NO_ECHO_RTT,
} from '../const/no-echo-rtt'

import {
	PingStatus,
} from '../PingStatus'

import type {
	ICMPConstructorData,
	ICMPResult,
} from './types'

export class ICMP {

	private eventId: string = new Date().getTime().toString() + Math.random().toString()
	readonly host: string
	readonly count: number = 0
	readonly packetSize: number = 56
	readonly timeout: number = 1000
	readonly ttl: number = 54
	readonly interval: number = 1000

	static NO_ECHO_RTT = NO_ECHO_RTT
	static NO_ECHO_TTL = -1

	private pingEventSubscription: EventSubscription | null = null
	private pingEventHandler: ((result: ICMPResult) => void) | null = null

	constructor(data: ICMPConstructorData) {
		this.host = data.host
		this.count = data.count ?? this.count
		this.packetSize = data.packetSize ?? this.packetSize
		this.timeout = data.timeout ?? this.timeout
		this.ttl = data.ttl ?? this.ttl
		this.interval = data.interval ?? this.interval
	}

	ping(
		onPing: (
			result: ICMPResult,
		) => void,
	) {
		if(!this.pingEventHandler) {
			NativeModule.icmp(
				this.eventId,
				this.host,
				this.count,
				this.packetSize,
				this.timeout,
				this.ttl,
				this.interval,
			)

			this.pingEventHandler = onPing
			/* eslint-disable @typescript-eslint/no-unsafe-member-access */
			this.pingEventSubscription = NativeModule.pingListener((
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				result: any,
			) => {
				this.pingEventHandler?.({
					rtt: result.rtt,
					status: result.status,
					ttl: result.ttl,
					isEnded: result.isEnded,
				})

				if(result.isEnded) {
					this.stop()
				}
			})
			/* eslint-enable @typescript-eslint/no-unsafe-member-access */
		} else {
			onPing({
				rtt: NO_ECHO_RTT,
				ttl: ICMP.NO_ECHO_TTL,
				status: PingStatus.ECHOING,
				isEnded: true,
			})
		}
	}

	stop() {
		if(this.pingEventHandler) {
			NativeModule.icmpRemove(this.eventId)
			this.pingEventSubscription?.remove()
			this.pingEventHandler = null
		}
	}

	isRunning() {
		return !!this.pingEventHandler
	}

}
