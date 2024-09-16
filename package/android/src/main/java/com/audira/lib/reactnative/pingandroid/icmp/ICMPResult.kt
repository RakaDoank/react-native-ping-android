package com.audira.lib.reactnative.pingandroid.icmp

import com.audira.lib.reactnative.pingandroid.C_NO_ECHO_RTT
import com.audira.lib.reactnative.pingandroid.C_STATUS_ECHO
import com.audira.lib.reactnative.pingandroid.C_STATUS_ECHOING
import com.audira.lib.reactnative.pingandroid.C_STATUS_TIMEDOUT
import com.audira.lib.reactnative.pingandroid.C_STATUS_CANCELLED
import com.audira.lib.reactnative.pingandroid.C_STATUS_UNKNOWN_FAILURE
import com.audira.lib.reactnative.pingandroid.C_STATUS_INVALID_ARG
import com.audira.lib.reactnative.pingandroid.C_STATUS_UNKNOWN_HOST

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.WritableMap

typealias Result = WritableMap

private const val C_NO_ECHO_TTL = -1

/**
 * Initially, it was using Data Class which is a better readability with namespace-like and
 * resolve the promise with WritableMap with another function
 * But for the performance sake or any app size topic, just write the map directly
 */
fun createResult(rtt: Double, ttl: Int, status: Int): Result {
	val map = Arguments.createMap()
	map.putDouble("rtt", rtt)
	map.putInt("ttl", ttl)
	map.putInt("status", status)
	return map
}

fun resultEcho(rtt: Double, ttl: Int): Result {
	return createResult(rtt, ttl, C_STATUS_ECHO)
}

fun resultEchoing(): Result {
	return createResult(
		rtt = C_NO_ECHO_RTT,
		ttl = C_NO_ECHO_TTL,
		status = C_STATUS_ECHOING,
	)
}

fun resultTimedOut(): Result {
	return createResult(
		rtt = C_NO_ECHO_RTT,
		ttl = C_NO_ECHO_TTL,
		status = C_STATUS_TIMEDOUT,
	)
}

fun resultCancelled(): Result {
	return createResult(
		rtt = C_NO_ECHO_RTT,
		ttl = C_NO_ECHO_TTL,
		status = C_STATUS_CANCELLED,
	)
}

fun resultUnknownFailure(): Result {
	return createResult(
		rtt = C_NO_ECHO_RTT,
		ttl = C_NO_ECHO_TTL,
		status = C_STATUS_UNKNOWN_FAILURE,
	)
}

fun resultInvalidArg(): Result {
	return createResult(
		rtt = C_NO_ECHO_RTT,
		ttl = C_NO_ECHO_TTL,
		status = C_STATUS_INVALID_ARG,
	)
}

fun resultUnknownHost(): Result {
	return createResult(
		rtt = C_NO_ECHO_RTT,
		ttl = C_NO_ECHO_TTL,
		status = C_STATUS_UNKNOWN_HOST,
	)
}

/**
 * -----
 */

private val regexEcho = Regex("ttl=(\\d+).*time=(.+)\\sms")
private val regexTimeout = Regex("timed out|timedout|timeout", RegexOption.IGNORE_CASE)

private val regexInvalidArg = Regex("invalid|illegal.*packet size|bad wait time|ttl.*out of range", RegexOption.IGNORE_CASE)
private val regexUnknownHost = Regex("unknown host|name or service not known", RegexOption.IGNORE_CASE)

fun createResultFromLine(line: String): Result {
	val echo = regexEcho.find(line)
	if(echo != null) {
		return try {
			val (ttl, time) = echo.destructured
			resultEcho(
				rtt = time.toDouble(),
				ttl = ttl.toInt(),
			)
		} catch(err: NumberFormatException) {
			return resultUnknownFailure()
		}
	}

	val timeout = regexTimeout.find(line)
	if(timeout != null) {
		return resultTimedOut()
	}

	return resultUnknownFailure()
}

fun createResultFromErrorLine(line: String): Result {
	if(regexUnknownHost.find(line) != null) {
		return resultUnknownHost()
	}

	if(regexInvalidArg.find(line) != null) {
		return resultInvalidArg()
	}

	return resultUnknownFailure()
}

/**
 * -----
 */