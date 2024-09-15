package com.audira.lib.reactnative.pingandroid

/**
 * Intentionally not using enum for statuses
 * https://developer.android.com/topic/performance/reduce-apk-size#remove-enums
 *
 * Also intentionally not using the object class only for a namespace
 * talk about namespace feature here https://www.youtube.com/watch?v=0FF19HJDqMo&t=568s
 * but since then, it was(?) never discussed anymore
 */

const val C_STATUS_ECHO					= 2
const val C_STATUS_ECHOING				= 1
const val C_STATUS_TIMEDOUT				= 0
const val C_STATUS_CANCELLED			= -1
const val C_STATUS_UNKNOWN_HOST			= -2
const val C_STATUS_INVALID_ARG			= -3
const val C_STATUS_UNKNOWN_FAILURE		= -4

/**
 * -----
 */

const val C_NOECHO_RTT = -1e0