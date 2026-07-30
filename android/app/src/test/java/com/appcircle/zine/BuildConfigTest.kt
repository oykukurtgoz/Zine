package com.appcircle.zine

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * JVM'de çalışan hızlı sanity testleri (Appcircle'da `./gradlew testReleaseUnitTest`).
 * Cihaz/emülatör gerektirmez.
 */
class BuildConfigTest {

  @Test
  fun applicationIdIsCorrect() {
    assertEquals("com.appcircle.zine", BuildConfig.APPLICATION_ID)
  }

  @Test
  fun versionCodeIsPositive() {
    assertTrue("versionCode must be > 0", BuildConfig.VERSION_CODE > 0)
  }

  @Test
  fun versionNameLooksLikeSemver() {
    assertTrue(
        "versionName '${BuildConfig.VERSION_NAME}' should look like x.y or x.y.z",
        BuildConfig.VERSION_NAME.matches(Regex("""\d+\.\d+(\.\d+)?""")),
    )
  }
}
