package com.audira.lib.reactnative.pingandroid

import com.facebook.react.bridge.ReactApplicationContext

abstract class PingAndroidSpec internal constructor(context: ReactApplicationContext) : NativePingAndroidSpec(context) {

	companion object {
		const val NAME = NativePingAndroidSpec.NAME
	}

}