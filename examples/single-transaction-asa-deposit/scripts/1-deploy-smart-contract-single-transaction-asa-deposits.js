/**
 * Description:
 * This script deploys a stateful smart contract. The contract allows
 * to deposit custom ASA tokens using a single transaction with rekeyTo authorization.
 */
const { executeTx } = require("@algo-builder/algob");


async function run(runtimeEnv, deployer) {
  const alice = deployer.accountsByName.get("alice");

  try {
    const statefulContractInfo = deployer.getApp("StatefulSmartContract");
    console.log("statefulContractInfo", statefulContractInfo);
  } catch (e) {
    console.log(e.errorDescriptor.description);
    console.log("The StatefulSmartContract was not deployed yet.")
  }

  // Deploy Stateful Smart Contract
  const appInfo = await deployer.deployApp(
    '2-single-transaction-asa-deposit-contract.py', // PyTEAL approval program
    '2-clear.py', // PyTEAL clear program
    {
      sender: alice,
      localInts: 0,
      localBytes: 0,
      globalInts: 1,
      globalBytes: 1
    }, {}, {}, "StatefulSmartContract");

  console.log(appInfo);

}

module.exports = { default: run };
