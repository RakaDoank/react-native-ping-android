import type {
	ICMPResult,
} from '../../../ICMP/types'

export interface UseICMP {
	isRunning: boolean,
	result: ICMPResult | undefined,
	start: () => void,
	stop: () => void,
}
