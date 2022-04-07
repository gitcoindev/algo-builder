# Custom ASA Token deployment and single transaction ASA deposit to a smart contract using [Algo Builder](https://github.com/scale-it/algo-builder/)

This project shows how to create Algorand Standard Asset (ASA) and deposit it to a stateful smart contract using a single call transaction with rekeyTo field set to smart contract's address.

## Demo

[![Single Transaction ASA deposit demo](https://asciinema.org/a/484905.svg)](https://asciinema.org/a/484905)

## Dependencies

Please follow the [setup](../README.md) instructions to install dependencies and update the config.
This example is using PyTEAL, so make sure to follow the Python3 setup described above.

## Usage

Transfers can be executed by executing `algob run scripts/transfer/`.
Balances can be queried by executing `algob run scripts/query/`.

### Demo instructions

The demo presented above can be reproduced using the following commands:

```
yarn algob deploy

yarn algob run scripts/query/john-balances.js
yarn algob run scripts/query/smart-contract-balances.js

yarn algob run scripts/transfer/direct/alice-custom-asa-token-to-john.js 
yarn algob run scripts/transfer/direct/master-algo-token-to-john.js
yarn algob run scripts/transfer/contract/john-pay-algo-to-contract.js 

yarn algob run scripts/query/john-balances.js
yarn algob run scripts/query/smart-contract-balances.js

yarn algob run scripts/transfer/contract/john-single-deposit-asa-to-contract.js

yarn algob run scripts/query/john-balances.js
yarn algob run scripts/query/smart-contract-balances.js
```

### Implementation

Currently the implementation is based on the develop branch of [Algo Builder](https://github.com/scale-it/algo-builder/) as the support for TEAL v6 is ongoing.
After the next release this example should work correctly with master branch.

Differences to the upstream can be observed at https://github.com/scale-it/algo-builder/compare/develop...gitcoindev:develop

### Possible improvements

The example could be enhanced by tests, after Algo Builder runtime package https://www.npmjs.com/package/@algo-builder/runtime TEAL v6 changes are supported by Algo Builder and merged to master. Also currently the smart contract automatically OPTs-in to the token. The logic on this could be smarter, but this is a minor thing. Apart from this, feel free to play with this example and improve it yourself!

---
Note: The example project is not audited and should not be used in a production environment.
