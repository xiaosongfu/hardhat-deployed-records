## Hardhat Deployed Records

Recording deployed contracts address.

#### Install

```
npm install --save-dev hardhat-deployed-records
# or
yarn add --dev hardhat-deployed-records
```

#### Included Commands

- `npx hardhat deployed-init`: Initializes the deployed folder
- `npx hardhat deployed-add --netwrok <network>`: Add new network deployed
- `npx hardhat deployed-migrate`: Migrate the deployed folder

Commonly, you need execute `npx hardhat deployed-init` task first, and then:
- when you want to deploy contracts to a new network, you need to execute `npx hardhat deployed-add --netwrok <network>` task
- when you add new contracts or delete contracts you need to execute `npx hardhat deployed-migrate` task to keep deployed folder is the latest.

for `npx hardhat deployed-init` task, you can pass `--netwrok <network>` parameter to specify the network you want to deploy to, default value is `hardhat` from Hardhat framework.
for `npx hardhat deployed-add` task, you must pass `--netwrok <network>` parameter to specify the network you want to add.
for `npx hardhat deployed-migrate` task, no parameters needed.

#### Usage

Load plugin in Hardhat config:

```
require('hardhat-deployed-records');
# or
import 'hardhat-deployed-records';
```

Add configuration under `deployedRecords` key:

| option            | description                                                       | optional | default            |
|-------------------|-------------------------------------------------------------------|----------|--------------------|
| `deployedDir`     | path to generated `deployed` directory (relative to Hardhat root) | true     | `scripts/deployed` |
| `ignoreContracts` | which contracts wants to igonre                                   | true     | `[]`               |

example:

```
deployedRecords: {
    deployedDir: "scripts/deployed",
    ignoreContracts: ["MockERC20", "Foo"],
}
```

when you execute `npx hardhat deployed-init` task, it will generate default `scripts/deployed` directory(if you not set a different `deployedDir` value in `hardhat.config.ts` config file).

example:

![](demo.png)

so, in your deploy scripts, you can use `getXxxContract()` function to get contract's address; and use `setXxxContract(addr)` function to set contract's address.
