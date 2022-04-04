# [Algo Builder Web](https://algobuilder.dev/)

`@algo-builder/web` package allows you to interact with contracts easily. It is designed to be used with web dapps as well as scripts and user programs.

This package provides a class `WebMode` which has variety of high level functions like, [`waitForConfirmation`](algobuilder.dev/api/web/classes/web.html#waitForConfirmation), [`executeTx`](<(algobuilder.dev/api/web/classes/web.html#executeTx)>), [`signTransaction`](<(algobuilder.dev/api/web/classes/web.html#signTransaction)>), etc. These functions help sending transactions and building dapps.

You can use `@algo-builder/web` with [pipeline UI](https://www.pipeline-ui.com/docs/algocomponents/algobutton) to easily integrate with web wallets.

### Relation to algob

`algob` uses `@algo-builder/web` package. However It is not possible to use `algob` directly in a web app, because `algob` uses nodejs file system. Therefore we created a lightweight `@algo-builder/web` package to provide common functionality and support dapp development.

In the `@algo-builder/web` package we pass transaction [parameters](https://github.com/scale-it/algo-builder/blob/master/docs/guide/execute-transaction.md) in the same way as we do in `algob`.

## Wallets supported
- AlgoSigner
- My Algo Connect
- Wallet Connect

## Important links

- [Home Page](https://algobuilder.dev/)
- [Web API Docs](https://algobuilder.dev/api/web/index.html)
- [User Docs](https://algobuilder.dev/guide/README)

## Using Web

`@algo-builder/web` can be included as a library using `yarn add @algo-builder/web` and then import it using `import * from '@algo-builder/web'`.

### Example

To use `web` package in your react app, first you need to create an instance of the `WebMode` class by passing `AlgoSigner` and the chain name.

    const web = new WebMode(AlgoSigner, CHAIN_NAME);

Now you can use it to execute a transaction:

    const txParams = {
      type: types.TransactionType.TransferAlgo,
      sign: types.SignType.SecretKey,
      fromAccountAddr: fromAddress,
      toAccountAddr: toAddress,
      amountMicroAlgos: amount,
      payFlags: {},
    };
    let response = await web.executeTx(txParams);

This code will make the transaction, let the user sign it using algosigner and send it to the network.

You can also use `web.sendTransaction()` or `web.signTransaction()` in a react app.

### deployApp
`deployer.deployApp` deploys stateful smart contract.
### Parameters:
- approvalProgram:  approval program filename (must be present in assets folder)
- clearProgram:  clear program filename (must be present in assets folder)
- flags:  AppDeploymentFlags
- payFlags:  Transaction Parameters
- scTmplParams:  Smart contract template parameters (used only when compiling PyTEAL to TEAL). This is an optional parameter.
- appName: name of the app to deploy. This name (if passed) will be used as
the checkpoint "key", and app information will be stored agaisnt this name. This is an optional parameter.

### deployApp example
```js
// deployment
const daoAppInfo = await deployer.deployApp(
	"dao-app-approval.py",
	"dao-app-clear.py",
	{
		sender: creator,
		localInts: 9,
		localBytes: 7,
		globalInts: 4,
		globalBytes: 2,
		appArgs: appArgs,
	},
	{},
	{},
	"DAO App"
); // app name passed here

// now during querying, you only need this app name
const appInfo = deployer.getApp("DAO App");
```

**Note:** We don't support checkpoints yet. Currently `deployASA`, `deployApp` functions don't work. User should directly pass assetIndex, appIndex instead of asaName, appName.
