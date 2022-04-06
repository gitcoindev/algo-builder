/**
 * Description:
 * Basic Custom ASA Token transfer from Alice to John
 */

const { executeTx, balanceOf } = require('@algo-builder/algob');
const { types } = require('@algo-builder/web');

async function run (runtimeEnv, deployer) {
  // query ASA from deployer (using checkpoint information),
  const customASAToken = deployer.asa.get("CustomASAToken");
  if (customASAToken === undefined) {
    console.error('CustomASAToken was not deployed. You must run `algob deploy` first.');
    return;
  }

  // query accounts from config
  const john = deployer.accountsByName.get('john');
  const alice = deployer.accountsByName.get('alice');

  // execute asset transfer transaction
  await executeTx(deployer, {
    type: types.TransactionType.TransferAsset,
    sign: types.SignType.SecretKey,
    fromAccount: alice,
    toAccountAddr: john.addr,
    amount: 1,
    assetID: customASAToken.assetIndex,
    payFlags: { totalFee: 1000 }
  });

  console.log("John's CustomASAToken Balance: ", await balanceOf(deployer, john.addr, customASAToken.assetIndex));
  console.log("CustomASAToken Asset index: ", customASAToken.assetIndex);
}

module.exports = { default: run };
