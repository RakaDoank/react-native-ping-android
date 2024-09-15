import {
	useNavigation as _useNavigation,
} from '@react-navigation/native'

import type {
	NativeStackNavigationProp,
} from '@react-navigation/native-stack'

import {
	type NavigationType,
} from '@/types'

export function useNavigation() {

	const
		navigation =
			_useNavigation<NativeStackNavigationProp<NavigationType.NavigationStacks>>()

	return navigation

}