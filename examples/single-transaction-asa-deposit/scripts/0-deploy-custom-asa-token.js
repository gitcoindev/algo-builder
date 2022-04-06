const crypto = require("crypto");

const { executeTx, balanceOf } = require("@algo-builder/algob");
const { mkParam } = require("./transfer/common");
/*
  Create "algo-asa-token" Algorand Standard Asset (ASA).
  Accounts are loaded from config.
  To use ASA, accounts have to opt-in. Owner is opt-in by default.
*/

async function run (runtimeEnv, deployer) {
  console.log('[DeployCustomASAToken]: Script has started execution!');

  // extract account objects from the config
  const masterAccount = deployer.accountsByName.get('master-account');
  const alice = deployer.accountsByName.get('alice');
  const john = deployer.accountsByName.get('john');

  // Accounts can only be active if they poses minimum amont of ALGOs.
  // Here we fund the accounts with 3e6, 1e6 micro AlGOs (3 and 1 ALGO) respectively.
  const message = 'funding account';
  const promises = [
    executeTx(deployer, mkParam(masterAccount, alice.addr, 3e6, { note: message })),
    executeTx(deployer, mkParam(masterAccount, john.addr, 1e6, { note: message }))];
  await Promise.all(promises);

  // create an assetMetadataHash as Uint8Array
  const metadataHash = crypto.createHash('sha256').update('CustomASAToken').digest();

  const asaInfo = await deployer.deployASA('CustomASAToken', {
    creator: alice
  }, {
    metadataHash,
    reserve: john.addr, // override default value set in asa.yaml
    note: "CustomASAToken"
  });
  console.log(asaInfo);

  // to interact with an asset we need asset ID. We can get it from the returned object:
  const assetID = asaInfo.assetIndex;

  // we can inspect the balance of the alice. It should equal to the `total` value defined
  // in the asa.yaml.
  console.log('Balance: ', await balanceOf(deployer, alice.addr, assetID));

  console.log('[DeployCustomASAToken]: Script execution has finished! Asset was deployed with id', assetID);
}

module.exports = { default: run };
