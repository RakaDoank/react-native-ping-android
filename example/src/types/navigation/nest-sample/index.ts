/**
 * This is just an example
 */

import type {
	NativeStackScreenProps,
} from '@react-navigation/native-stack'

export type NavigationStacks = {
	step_1?: never,
	step_2?: {
		foo: boolean,
		bar: number,
		someMessage: string,
	},
	success?: never,
}

export interface ScreenPropsInterface<Key extends keyof NavigationStacks> extends NativeStackScreenProps<NavigationStacks, Key> {
}