package com.audira.lib.reactnative.pingandroid.icmp

import com.facebook.react.bridge.Promise

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.flow.takeWhile
import kotlinx.coroutines.launch

import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader

private const val STR_END = "END"
private const val STR_ERR = "ERR"

class ICMP(
	private val host: String,

	/**
	 * in bytes
	 */
	private val packetSize: Int = 56,

	/**
	 * in milliseconds
	 */
	private val timeout: Long = 1000L,

	private val ttl: Int = 54,
	private val promise: Promise,
) {

	private var coroutineScope: CoroutineScope? = null
	private var reader: BufferedReader? = null
	private var readerErr: BufferedReader? = null
	private var process: Process? = null

	private fun pingExecute(): Flow<String> {
		return flow {
			if(process == null && reader == null && readerErr == null) {
				val log = StringBuilder()

				try {
					process = Runtime.getRuntime().exec(
						"/system/bin/ping -s $packetSize -c 1 -w ${timeout.toInt() / 1000} -t ${ttl.toInt()} $host"
					)
					reader = BufferedReader(
						InputStreamReader(process!!.inputStream)
					)
					readerErr = BufferedReader(
						InputStreamReader(process!!.errorStream)
					)
					reader!!.forEachLine {
						log.append("$it\n")
					}
					readerErr!!.forEachLine {
						log.append("$STR_ERR $it\n")
					}
					process!!.waitFor()

					log.append(STR_END)
					reader = null
					readerErr = null
					process = null
					emit(log.toString())
				} catch(e: IOException) {
					process?.destroy()
					reader?.close()
					readerErr?.close()
					process = null
					reader = null
					readerErr = null
					log.append(STR_END)
					emit(log.toString())
				}
			}
		}
			.flowOn(Dispatchers.IO)
	}

	private fun clear() {
		process?.destroy()
		reader?.close()
		readerErr?.close()

		process = null
		reader = null
		readerErr = null
		coroutineScope = null
	}

	fun ping(
		onFinish: () -> Unit,
	) {
		if(coroutineScope == null) {
			coroutineScope = CoroutineScope(Dispatchers.IO)
			coroutineScope!!.launch {
				pingExecute()
					.takeWhile {
						it.slice(it.length - 3..<it.length) == STR_END
					}
					.collect {
						if(it.slice(STR_END.indices) == STR_END) {
							// the string are only `END`
							promise.resolve(
								resultUnknownFailure()
							)
						} else if(it.slice(STR_ERR.indices) == STR_ERR) {
							// the string started with `ERR` (Error Stream)
							promise.resolve(
								createResultFromErrorLine(it)
							)
						} else {
							promise.resolve(
								createResultFromLine(it)
							)
						}
						coroutineScope!!.cancel() // cancel? this coroutine to cancel the delay
						clear()
						onFinish()
					}

				delay(timeout)
				promise.resolve(
					resultTimedOut()
				)
				clear()
				onFinish()
			}
		}
	}

	fun cancel() {
		if(coroutineScope != null) {
			coroutineScope!!.cancel()
			clear()
			promise.resolve(
				resultCancelled()
			)
		}
	}

}