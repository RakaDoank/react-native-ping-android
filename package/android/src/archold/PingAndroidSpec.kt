package com.audira.lib.reactnative.pingandroid

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

abstract class PingAndroidSpec internal constructor(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {

	companion object {
		const val NAME = "RNPingAndroid"
	}

	override fun getName() = NAME

	abstract fun icmp(
		eventId: String,
		host: String,
		count: Double,
		packetSize: Double,
		timeout: Double,
		ttl: Double,
		interval: Double,
	)

	abstract fun icmpRemove(
		eventId: String,
	)

	abstract fun isReachable(
		host: String,
		timeout: Double?,
		promise: Promise,
	)

	abstract fun getHostName(
		host: String,
		promise: Promise,
	)

	protected fun emitPingListener(
		result: ReadableMap,
	) {
		reactApplicationContext
			.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
			.emit("PingListener", result)
	}

	@ReactMethod
	fun addListener(eventName: String) {
		// Keep: Required for RN built in Event Emitter Calls.
	}

	@ReactMethod
	fun removeListeners(count: Int) {
		// Keep: Required for RN built in Event Emitter Calls.
	}

}