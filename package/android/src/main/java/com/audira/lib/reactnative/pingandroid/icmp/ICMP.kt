package com.audira.lib.reactnative.pingandroid.icmp

import com.facebook.react.bridge.Promise

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.cancel
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking

import java.io.BufferedReader
import java.io.InputStreamReader

private const val STR_END = "END"
private const val STR_ERR = "ERR"

class ICMP(
	host: String,

	/**
	 * in bytes
	 */
	packetSize: Int = 56,

	/**
	 * in milliseconds
	 */
	private val timeout: Long = 1000,

	ttl: Int = 54,
	private val promise: Promise,
) {

	private var coroutineScope: CoroutineScope = CoroutineScope(Dispatchers.Main)
	private var timeoutJob: Job? = null
	private val processBuilder = ProcessBuilder(
		"/system/bin/ping",
		"-s", "$packetSize",
		"-c", "1",
		"-w", "${(timeout / 1000).let { if(it < 1) 1 else it }}",
		"-t", "$ttl",
		host,
	)
	private var process: Process? = null

	private fun pingExecute(): Flow<String> {
		return callbackFlow {
			val log = StringBuilder()

			try {
				process = processBuilder.start()
				val reader = BufferedReader(
					InputStreamReader(process!!.inputStream)
				)
				val readerErr = BufferedReader(
					InputStreamReader(process!!.errorStream)
				)
				while(
					!reader.readLine().also {
						if(!it.isNullOrBlank()) {
							log.append("$it\n")
						}
					}.isNullOrBlank()
				) {
					// nothing
				}
				while(
					!readerErr.readLine().also {
						if(!it.isNullOrBlank()) {
							log.append("$STR_ERR $it\n")
						}
					}.isNullOrBlank()
				) {
					// nothing
				}
			} finally {
				process?.destroy()
				log.append(STR_END)
				trySend(log.toString())
				close()
			}

			awaitClose {
				process?.destroy()
			}
		}
			.flowOn(Dispatchers.IO)
	}

	fun ping(
		onFinish: () -> Unit,
	) {
		coroutineScope.launch {
			pingExecute()
				.first {
					if (it.slice(STR_END.indices) == STR_END) {
						// the string are only `END`
						promise.resolve(
							resultUnknownFailure()
						)
					} else if (it.slice(STR_ERR.indices) == STR_ERR) {
						// the string started with `ERR` (Error Stream)
						promise.resolve(
							createResultFromErrorLine(it)
						)
					} else {
						promise.resolve(
							createResultFromLine(it)
						)
					}
					timeoutJob?.cancel()
					cancel()
					onFinish()
					true
				}
		}

		runBlocking {
			timeoutJob = launch {
				delay(timeout)
				try {
					coroutineScope.cancel()
					promise.resolve(
						resultTimedOut()
					)
				} finally {
					onFinish()
				}
			}
		}
	}

	fun cancel(
		onCancel: () -> Unit,
	) {
		timeoutJob?.cancel()
		try {
			coroutineScope.cancel()
			promise.resolve(
				resultCancelled()
			)
		} finally {
			onCancel()
		}
	}

}