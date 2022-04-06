const { executeTx } = require("@algo-builder/algob");
const { mkParam } = require("../common");

async function run(runtimeEnv, deployer) {
	const masterAccount = deployer.accountsByName.get("master-account");
	const john = deployer.accountsByName.get("john");

	// fund John's account with 1 Algo
	await executeTx(deployer, mkParam(masterAccount, john.addr, 1e6, { note: "1 ALGO PAID TO JOHN" }));
}

module.exports = { default: run };
