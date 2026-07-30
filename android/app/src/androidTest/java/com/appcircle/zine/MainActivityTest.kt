package com.appcircle.zine

import android.content.pm.ActivityInfo
import androidx.lifecycle.Lifecycle
import androidx.test.core.app.ActivityScenario
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith

/**
 * Emülatör/cihazda çalışan smoke testleri.
 * Appcircle'da `./gradlew connectedDebugAndroidTest` ya da
 * APK çifti (app + androidTest) ile Espresso test adımı olarak koşar.
 */
@RunWith(AndroidJUnit4::class)
class MainActivityTest {

  @Test
  fun appContextHasExpectedPackageName() {
    val context = ApplicationProvider.getApplicationContext<android.content.Context>()
    assertEquals("com.appcircle.zine", context.packageName)
  }

  @Test
  fun mainActivityLaunchesAndResumes() {
    ActivityScenario.launch(MainActivity::class.java).use { scenario ->
      scenario.moveToState(Lifecycle.State.RESUMED)
      assertEquals(Lifecycle.State.RESUMED, scenario.state)
    }
  }

  @Test
  fun mainActivityForcesPortraitOrientation() {
    ActivityScenario.launch(MainActivity::class.java).use { scenario ->
      scenario.onActivity { activity ->
        assertEquals(
            ActivityInfo.SCREEN_ORIENTATION_PORTRAIT,
            activity.requestedOrientation,
        )
      }
    }
  }
}
