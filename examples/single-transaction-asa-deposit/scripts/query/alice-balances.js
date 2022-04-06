const { printAssets } = require('@algo-builder/algob');

async function run (runtimeEnv, deployer) {
  const alice = deployer.accountsByName.get('alice');

  console.log("Alice's assets");
  await printAssets(deployer, alice.addr);
}

module.exports = { default: run };
