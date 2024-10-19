import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'

import {
	ICMP,
	type ICMPConstructorDataInterface,
} from '../ICMP'

import type {
	ICMPResultInterface,
} from '../ICMP/types'

import {
	PingStatus,
} from '../ping-const'

export interface UseICMPStartParamsInterface extends ICMPConstructorDataInterface {
	count?: number,
	/**
	 * In milliseconds
	 */
	interval?: number,
}

export interface UseICMPInterface {
	isRunning: boolean,
	result: ICMPResultInterface | undefined,
	start: (params: UseICMPStartParamsInterface) => void,
	stop: () => void,
}

export function useICMP(): UseICMPInterface {

	const
		ref =
			useRef<{
				icmp: ICMP | null,
				counter: number,
				counterLimit: number,
				intervalValue: number | null,
				intervalID: ReturnType<typeof setInterval> | null,
			}>({
				icmp: null,
				counter: 0,
				counterLimit: 1,
				intervalValue: null,
				intervalID: null,
			}),

		[result, setResult] =
			useState<UseICMPInterface['result']>(undefined),

		[isRunning, setIsRunning] =
			useState(false)

	const ping = useCallback(async () => {
		if(ref.current.icmp) {
			ref.current.counter++

			const res = await ref.current.icmp.ping()
			setResult(res)

			if(
				intervalInterruptStatuses.indexOf(res.status) > -1 ||
				ref.current.counter === ref.current.counterLimit ||
				ref.current.intervalValue === null
			) {
				setIsRunning(false)
			}
		}
	}, [])

	const start: UseICMPInterface['start']
		= useCallback(({
			count,
			interval,
			...icmpData
		}) => {
			if(
				(
					// Validate Count
					typeof count === 'number' &&
					count <= 0
				) ||
				(
					// Validate Interval
					typeof interval === 'number' &&
					(
						interval <= 0 ||

						// Interval cannot be smaller than timeout
						interval < (icmpData.timeout ?? 1000) // 1000 = default ICMP timeout
					)
				)
				// Rest validations are done by the native module
			) {
				setResult({
					rtt: ICMP.NO_ECHO_RTT,
					ttl: ICMP.NO_ECHO_TTL,
					status: PingStatus.INVALID_ARG,
				})
				setIsRunning(false)
			} else if(!ref.current.icmp) {
				ref.current.icmp = new ICMP(icmpData)
				ref.current.counterLimit = count ?? 1
				if(typeof interval === 'number') {
					ref.current.intervalValue = interval
				}
				setIsRunning(true)
			} else {
				setResult({
					rtt: ICMP.NO_ECHO_RTT,
					ttl: ICMP.NO_ECHO_TTL,
					status: PingStatus.ECHOING,
				})
			}
		}, [])

	const stop: UseICMPInterface['stop']
		= useCallback(() => {
			if(ref.current.icmp && ref.current.intervalID) {
				setIsRunning(false)
			}
		}, [])

	useEffect(() => {
		let id: ReturnType<typeof setInterval> | null = null

		if(isRunning && typeof ref.current.intervalValue === 'number') {
			id = setInterval(ping, ref.current.intervalValue)
		} else if(isRunning) {
			ping()
		} else {
			ref.current.icmp?.cancel()
			ref.current.icmp = null
			ref.current.counter = 0
			if(id) {
				clearInterval(id)
				id = null
			}
		}

		ref.current.intervalID = id

		return () => {
			if(id) {
				clearInterval(id)
			}
		}
	}, [
		ping,
		isRunning,
	])

	return {
		isRunning,
		result,
		start,
		stop,
	}

}

const intervalInterruptStatuses = [
	PingStatus.INVALID_ARG,
	PingStatus.UNKNOWN_HOST,
	PingStatus.UNKNOWN_FAILURE,
]