const { printAssets } = require('@algo-builder/algob');

async function run (runtimeEnv, deployer) {
  // Get AppInfo from checkpoints.
  const appInfo = deployer.getApp('StatefulSmartContract');
  console.log("appInfo", appInfo);
  
  console.log("StatefulSmartContract assets");
  await printAssets(deployer, appInfo.applicationAccount);
}

module.exports = { default: run };
