const {
  withAndroidManifest,
  withMainApplication,
  withPlugins,
  withProjectBuildGradle,
} = require('@expo/config-plugins');

const androiManifestPlugin = (expoConfig) =>
  withAndroidManifest(expoConfig, (content) => {
    content.modResults.manifest = {
      ...content.modResults.manifest,
      $: {
        ...content.modResults.manifest.$,
        'android:enableOnBackInvokedCallback': 'true',
      },
    };
    return content;
  });

const androidBuildGradle = (expoConfig) =>
  withProjectBuildGradle(expoConfig, (content) => {
    const PATTERN = "maven { url 'https://www.jitpack.io' }";

    content.modResults.contents = content.modResults.contents.replace(
      PATTERN,
      `${PATTERN}
        maven { url "https://raw.github.com/iadvize/iadvize-android-sdk/master" }`,
    );

    return content;
  });

const androidMainApplication = (expoConfig) =>
  withMainApplication(expoConfig, (content) => {
    const PATTERN_PACKAGE = 'import com.facebook.soloader.SoLoader';
    const ONCREATE_PATTERN = 'super.onCreate()';

    content.modResults.contents = content.modResults.contents
      .replace(
        PATTERN_PACKAGE,
        `${PATTERN_PACKAGE}\nimport com.iadvize.conversation.sdk.IAdvizeSDK`,
      )
      .replace(
        ONCREATE_PATTERN,
        `${ONCREATE_PATTERN}
    IAdvizeSDK.initiate(this)
      `,
      );

    return content;
  });

const withIadvize = (expoConfig) => {
  const plugins = [
    androidBuildGradle,
    androidMainApplication,
    androiManifestPlugin,
  ];
  return withPlugins(expoConfig, plugins);
};

module.exports = withIadvize