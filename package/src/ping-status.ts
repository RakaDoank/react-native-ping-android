export enum PingStatus {
	ECHO					= 2,
	ECHOING					= 1,
	TIMEDOUT				= 0,
	CANCELLED				= -1,
	UNKNOWN_HOST			= -2,
	INVALID_ARG				= -3,
	UNKNOWN_FAILURE			= -4,
}
