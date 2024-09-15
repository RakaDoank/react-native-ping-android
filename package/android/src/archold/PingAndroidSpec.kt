package com.audira.lib.reactnative.pingandroid

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule

abstract class PingAndroidSpec internal constructor(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

	companion object {
		const val NAME = "RNPingAndroid"
	}

	override fun getName() = NAME

	abstract fun icmpStart(
		eventId: String,
		host: String,
		packetSize: Double,
		timeout: Double,
		ttl: Double,
		promise: Promise,
	)

	abstract fun icmpStop(
		eventId: String,
	)

}