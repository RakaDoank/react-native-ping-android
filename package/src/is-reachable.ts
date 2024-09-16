import NativeModule from './native-module'

export const isReachable: typeof NativeModule.isReachable = (host, timeout) => {
	return NativeModule.isReachable(host, timeout)
}