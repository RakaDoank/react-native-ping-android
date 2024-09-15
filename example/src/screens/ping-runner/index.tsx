import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'

import {
	Pressable,
	StyleSheet,
	Text,
	useColorScheme,
	View,
	VirtualizedList,
	type VirtualizedListProps,
} from 'react-native'

import {
	NOECHO_RTT,
	PingStatus,
	useICMP,
} from 'react-native-ping-android'

import {
	type NavigationType,
} from '@/types'

import type {
	DataStateInterface,
	ItemRendererDataInterface,
} from './types'

export function PingRunnerScreen({
	route,
}: NavigationType.ScreenPropsInterface<'ping_runner'>) {

	const
		ref =
			useRef<{
				initialRun: boolean,
				isRunning: boolean,
				virtualizedList: VirtualizedList<ItemRendererDataInterface> | null,
			}>({
				initialRun: false,
				isRunning: false,
				virtualizedList: null,
			}),

		[data, setData] =
			useState<DataStateInterface[]>([]),

		{ isRunning, result, start, stop }
			= useICMP()

	const setVirtualizedListRef: React.RefCallback<VirtualizedList<ItemRendererDataInterface>>
		= useCallback(_ref => {
			ref.current.virtualizedList = _ref
		}, [])

	const startHandler = useCallback(() => {
		console.log('startHandler: ', route.params)
		start(route.params)
	}, [
		start,
		route.params,
	])

	useEffect(() => {
		/**
		 * Cannot depends on the falsy of `isRunning` since it will be re-invoked the `startHandler` again when isRunning == false
		 */
		// if(!isRunning) {}

		if(!ref.current.initialRun) {
			console.log('initialRun')
			ref.current.initialRun = true
			startHandler()
		}
	}, [
		startHandler,
	])

	useEffect(() => {
		ref.current.isRunning = isRunning
	}, [
		isRunning,
	])

	useEffect(() => {
		if(result && ref.current.isRunning) {
			setData(_data => _data.concat({ ...result }))
		}
	}, [
		result,
	])

	const onContentSizeChange = useCallback(() => {
		ref.current.virtualizedList?.scrollToEnd({
			animated: true,
		})
	}, [])

	const toggleHandler = useCallback(() => {
		if(isRunning) {
			stop()
		} else {
			startHandler()
		}
	}, [
		isRunning,
		stop,
		startHandler,
	])

	const itemGetter: NonNullable<NonNullable<VirtualizedListProps<ItemRendererDataInterface>>['getItem']>
		= useCallback((_data, index) => {
			return {
				host: route.params.host,
				...data[index] as DataStateInterface,
			}
		}, [
			data,
			route.params.host,
		])

	const keyExtractorHandler: NonNullable<NonNullable<VirtualizedListProps<ItemRendererDataInterface>>['keyExtractor']>
		= useCallback((_item, index) => {
			return index.toString() // it's safe just to use the index as key
		}, [])

	return (
		<View
			style={ Styles.page }
		>
			<View
				style={ Styles.hug }
			>
				<VirtualizedList
					data={ data }
					getItem={ itemGetter }
					getItemCount={ () => data.length }
					keyExtractor={ keyExtractorHandler }
					renderItem={ itemRenderer }
					onContentSizeChange={ onContentSizeChange }
					ref={ setVirtualizedListRef }
				/>

				<Pressable style={ Styles.button }
					onPress={ toggleHandler }
				>
					<Text style={ Styles.buttonText }>
						{ isRunning ? 'Stop' : 'Start' }
					</Text>
				</Pressable>
			</View>
		</View>
	)

}

const Styles = StyleSheet.create({
	page: {
		padding: 16,
		flex: 1,
	},
	hug: {
		flex: 1,
		width: '100%',
		maxWidth: 480,
		alignSelf: 'center',
		justifyContent: 'space-between',
	},
	button: {
		marginTop: 8,
		padding: 4,
		backgroundColor: 'blue',
		borderRadius: 4,
		overflow: 'hidden',
		alignSelf: 'stretch',
	},
	buttonText: {
		fontSize: 16,
		lineHeight: 24,
		color: 'white',
		fontWeight: '600',
		textAlign: 'center',
	},

	item: {
		flexGrow: 0,
		flexShrink: 1,
		flexBasis: 'auto',
		flexDirection: 'row',
		width: '100%',
	},
	itemCol: {
		flex: 1,
	},
	itemText: {
		fontSize: 14,
		lineHeight: 20,
	},
	itemTextLight: {
		color: '#EEEEEE',
	},
	itemTextDark: {
		color: '#111111',
	},
	itemTextAlignRight: {
		textAlign: 'right',
	},
	mr2: {
		marginRight: 8,
	},
})

const itemRenderer: NonNullable<VirtualizedListProps<ItemRendererDataInterface>>['renderItem']
	= itemProps => {

		return (
			<Item
				{ ...itemProps.item }
			/>
		)

	}

interface ItemPropsInterface extends ItemRendererDataInterface {
}
function Item({
	host,
	rtt,
	status,
}: ItemPropsInterface) {

	const
		colorScheme =
			useColorScheme(),

		textStyle =
			colorScheme === 'dark'
				? Styles.itemTextLight
				: Styles.itemTextDark

	return (
		<View
			style={ Styles.item }
		>
			<View style={[Styles.itemCol, Styles.mr2]}>
				<Text style={[Styles.itemText, textStyle]}>
					{ host }
				</Text>
			</View>
			<View style={ Styles.itemCol }>
				<Text style={[Styles.itemText, textStyle, Styles.itemTextAlignRight]}>
					{ rtt > NOECHO_RTT ? rtt : mapStatusToText[status] }
				</Text>
			</View>
		</View>
	)

}

const mapStatusToText: Record<number, string> = {
	[PingStatus.TIMEDOUT]: 'Timed Out',
	[PingStatus.INVALID_ARG]: 'Invalid',
	[PingStatus.UNKNOWN_FAILURE]: 'Unknown Failure',
	[PingStatus.UNKNOWN_HOST]: 'Unknown Host',
	[PingStatus.CANCELLED]: 'Cancelled',
}