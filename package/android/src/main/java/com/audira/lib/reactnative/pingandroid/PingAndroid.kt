package com.audira.lib.reactnative.pingandroid

import com.audira.lib.reactnative.pingandroid.icmp.ICMP
import com.audira.lib.reactnative.pingandroid.icmp.resultEchoing as ICMP_resultEchoing

import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod

import java.net.InetAddress

class PingAndroid (
	reactContext: ReactApplicationContext,
) : PingAndroidSpec(reactContext) {

	private val mapICMP
		: MutableMap<String/* Event ID */, ICMP>
		= mutableMapOf()

	private val lifecycleEventListener =
		object : LifecycleEventListener {

			private fun icmpCancel() {
				try {
					val last = mapICMP.entries.last()
					mapICMP[last.key]?.cancel()
					mapICMP.remove(last.key)
				} catch(err: NoSuchElementException) {
					// do nothing
				}
			}

			override fun onHostDestroy() {
				icmpCancel()
			}

			override fun onHostPause() {
				icmpCancel()
			}

			override fun onHostResume() {
			}

		}

	init {
		reactContext.addLifecycleEventListener(lifecycleEventListener)
	}

	@ReactMethod
	override fun icmpStart(
		eventId: String,
		host: String,
		packetSize: Double,
		timeout: Double,
		ttl: Double,
		promise: Promise,
	) {
		if(mapICMP[eventId] == null) {
			mapICMP[eventId] = ICMP(
				host = host,
				packetSize = packetSize.toInt(),
				timeout = timeout.toLong() - 50L,
				ttl = ttl.toInt(),
				promise = promise,
			)
			mapICMP[eventId]!!.ping {
				mapICMP.remove(eventId)
			}
		} else {
			promise.resolve(
				ICMP_resultEchoing()
			)
		}
	}

	@ReactMethod
	override fun icmpStop(
		eventId: String,
	) {
		mapICMP[eventId]?.cancel()
	}

	@ReactMethod
	override fun isReachable(
		host: String,
		timeout: Double?,
		promise: Promise,
	) {
		try {
			val bool = InetAddress.getByName(host).isReachable(timeout?.toInt() ?: 10000)
			promise.resolve(bool)
		} finally {
			promise.resolve(null)
		}
	}

	@ReactMethod
	override fun getHostName(
		host: String,
		promise: Promise,
	) {
		try {
			val hostName = InetAddress.getByName(host).hostName
			promise.resolve(hostName)
		} finally {
			promise.resolve(null)
		}
	}

}