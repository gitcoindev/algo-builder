const { types } = require("@algo-builder/web");
const { balanceOf } = require("@algo-builder/algob");
const { executeTx, mkParam } = require("../common");

async function run(runtimeEnv, deployer) {
	const john = deployer.accountsByName.get("john");
	const appInfo = deployer.getApp('StatefulSmartContract');

	// execute ALGO transfer transaction
	await executeTx(deployer, {
		type: types.TransactionType.TransferAlgo,
		sign: types.SignType.SecretKey,
		fromAccount: john,
		toAccountAddr: appInfo.applicationAccount,
		amountMicroAlgos: 2e5,  // 0.2 ALGO
		payFlags: { totalFee: 1000 },
	});

}

module.exports = { default: run };
