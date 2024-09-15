package com.audira.lib.reactnative.pingandroid

import com.facebook.react.TurboReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class PingAndroidPackage : TurboReactPackage() {

	override fun getModule(
		name: String,
		reactContext: ReactApplicationContext,
	): NativeModule? {
		return if(name == PingAndroidSpec.NAME) {
			PingAndroid(reactContext)
		} else {
			null
		}
	}

	override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
		return ReactModuleInfoProvider {
			mapOf(
				PingAndroidSpec.NAME to ReactModuleInfo(
					PingAndroidSpec.NAME,
					PingAndroidSpec.NAME,
					false,
					false,
					true,
					false,
					BuildConfig.IS_NEW_ARCHITECTURE_ENABLED,
				)
			)
		}
	}

}