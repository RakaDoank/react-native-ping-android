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
	NOECHO_RTT,
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
				intervalHandler: ReturnType<typeof setInterval> | null,
			}>({
				icmp: null,
				counter: 0,
				counterLimit: 1,
				intervalHandler: null,
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
				ref.current.counter === ref.current.counterLimit
			) {
				if(ref.current.intervalHandler) {
					clearInterval(ref.current.intervalHandler)
					ref.current.intervalHandler = null
				}
				ref.current.icmp = null
				ref.current.counter = 0
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
					rtt: NOECHO_RTT,
					ttl: ICMP.NOECHO_TTL,
					status: PingStatus.INVALID_ARG,
				})
				setIsRunning(false)
			} else if(!ref.current.icmp && !ref.current.intervalHandler) {
				ref.current.icmp = new ICMP(icmpData)
				ref.current.counterLimit = count ?? 1
				setIsRunning(true)
				if(typeof interval === 'number') {
					ref.current.intervalHandler = setInterval(ping, interval)
				} else {
					ping()
				}
			}
		}, [
			ping,
		])

	const stop: UseICMPInterface['stop']
		= useCallback(() => {
			if(ref.current.icmp && ref.current.intervalHandler) {
				ref.current.icmp.cancel()
				clearInterval(ref.current.intervalHandler)
				ref.current.icmp = null
				ref.current.counter = 0
				ref.current.intervalHandler = null
				setIsRunning(false)
			}
		}, [])

	useEffect(() => {
		const { intervalHandler } = ref.current

		return () => {
			if(intervalHandler) {
				clearInterval(intervalHandler)
			}
		}
	}, [])

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