const { printAssets } = require("@algo-builder/algob");

async function run(runtimeEnv, deployer) {
	const john = deployer.accountsByName.get("john");

  console.log("John's assets");
  await printAssets(deployer, john.addr);
}

module.exports = { default: run };
