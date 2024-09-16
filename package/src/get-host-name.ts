import NativeModule from './native-module'

export const getHostName: typeof NativeModule.getHostName = host => {
	return NativeModule.getHostName(host)
}