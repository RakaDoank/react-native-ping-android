import type {
	ICMPConstructorData,
} from '../../ICMP'

export interface UseICMPStartParams extends ICMPConstructorData {
	count?: number,
	/**
	 * In milliseconds
	 */
	interval?: number,
}
