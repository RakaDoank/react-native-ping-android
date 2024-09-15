import type {
	ICMPResultInterface,
} from 'react-native-ping-android'

export interface DataStateInterface extends ICMPResultInterface {
}

export interface ItemRendererDataInterface extends DataStateInterface {
	host: string,
}