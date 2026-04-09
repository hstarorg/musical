const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Expo config plugin: Xcode 26 compatibility for prebuilt React Native.
 *
 * Injects SWIFT_ENABLE_EXPLICIT_MODULES=NO into Podfile post_install
 * so it applies to all CocoaPods targets (not just the main app target).
 *
 * @see https://reactnative.dev/blog/2025/08/12/react-native-0.81
 */
module.exports = function withXcode26Fix(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
      let podfile = fs.readFileSync(podfilePath, 'utf8');

      const snippet = `
    # Xcode 26: disable Swift explicit modules for prebuilt RN compatibility
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |bc|
        bc.build_settings['SWIFT_ENABLE_EXPLICIT_MODULES'] = 'NO'
      end
    end
`;

      // Insert before the closing `end` of the post_install block
      const marker = '  end\nend';
      podfile = podfile.replace(marker, snippet + marker);

      fs.writeFileSync(podfilePath, podfile);
      return config;
    },
  ]);
};
