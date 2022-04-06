const { types } = require("@algo-builder/web");
const { executeTx, balanceOf, printAssets, convert } = require("@algo-builder/algob");


async function run(runtimeEnv, deployer) {
	const john = deployer.accountsByName.get("john");
	const assetID = deployer.asa.get("CustomASAToken").assetIndex;
	const appInfo = deployer.getApp("StatefulSmartContract");
	const deposit_amount = 1;

	try {
		await deployer.optInAccountToApp(john, appInfo.appID, {}, {});
	} catch (e) {
		console.log(e.response.body.message);
	}

	console.log("Before single transaction deposit");
	console.log("John's CustomASAToken holdings: ", await balanceOf(deployer, john.addr, assetID));
	console.log("Smart contract's assets:");
	await printAssets(deployer, appInfo.applicationAccount);

	const appArgs = [convert.stringToBytes("asa_deposit"), `int:${assetID}`, `int:${deposit_amount}`];

	await executeTx(deployer, {
		type: types.TransactionType.CallApp,
		sign: types.SignType.SecretKey,
		fromAccount: john,
		appID: appInfo.appID,
		foreignAssets: [assetID],
		appArgs: appArgs,
		payFlags: { rekeyTo: appInfo.applicationAccount, totalFee: 3000 },
	});

	console.log("After single transaction deposits");
	console.log("John's asset holdings: ", await balanceOf(deployer, john.addr, assetID));
	await printAssets(deployer, appInfo.applicationAccount);
}

module.exports = { default: run };
