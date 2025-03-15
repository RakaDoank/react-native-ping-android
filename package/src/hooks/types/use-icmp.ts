import type {
	ICMPResult,
} from '../../ICMP/types'

import type {
	UseICMPStartParams,
} from './use-icmp-start-params'

export interface UseICMP {
	isRunning: boolean,
	result: ICMPResult | undefined,
	start: (params: UseICMPStartParams) => void,
	stop: () => void,
}
