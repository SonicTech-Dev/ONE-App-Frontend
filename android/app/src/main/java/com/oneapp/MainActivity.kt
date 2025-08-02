package com.oneapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.oneapp.RTSPStreamReader
import android.util.Log

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "ONEApp"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: android.os.Bundle?) {
    super.onCreate(savedInstanceState)
    Log.d("MainActivity", "onCreate triggered")

    val reader = RTSPStreamReader(this)
    reader.startStream()
  }
}
