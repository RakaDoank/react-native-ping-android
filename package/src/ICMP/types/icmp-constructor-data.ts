export interface ICMPConstructorData {
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
