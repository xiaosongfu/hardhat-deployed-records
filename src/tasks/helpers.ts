import { HardhatRuntimeEnvironment } from "hardhat/types";

export async function parseArtifacts(
  hre: HardhatRuntimeEnvironment,
  ignoreContracts: string[],
): Promise<{
  sourceNames: string[];
  contracts: { contractName: string; attrs: string[] }[];
}> {
  const fullNames = await hre.artifacts.getAllFullyQualifiedNames();
  //console.log("~~~~", fullNames);
  // examples:
  // ~~~~ [
  //   '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol:OwnableUpgradeable',
  //   '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol:Initializable',
  //   '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol:ERC20Upgradeable',
  //   '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol:IERC20Upgradeable',
  //   '@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol:IERC20MetadataUpgradeable',
  //   '@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol:AddressUpgradeable',
  //   '@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol:ContextUpgradeable',
  //   'contracts/PepeForkToken.sol:PepeForkToken',
  //   'contracts/mock/MockERC20.sol:MockERC20'
  // ]

  let sourceNames: string[] = []; // ["PepeForkToken", "mock/MockERC20"]
  let contracts: { contractName: string; attrs: string[] }[] = []; // [{contractName: "MockERC20", attrs: ["mock", "MockERC2"]}, ...]
  for (const fullName of fullNames) {
    // skip libraries
    if (!fullName.startsWith("contracts/")) continue;

    // get sourceName and contractName
    let { sourceName, contractName } = await hre.artifacts.readArtifact(
      fullName,
    );
    //console.log("~~~~", sourceName, contractName);
    // examples:
    // ~~~~ contracts/PepeForkToken.sol PepeForkToken
    // ~~~~ contracts/mock/MockERC20.sol MockERC20
    // ~~~~ contracts/mock/foo/Foo.sol Foo

    // skip ignored contracts
    if (ignoreContracts.includes(contractName)) continue;

    // remove the prefix `contracts/` and the suffix `.sol`
    // `contracts/mock/MockERC20.sol` -> `mock/MockERC20`
    sourceName = sourceName.slice(10, sourceName.length - 4);
    //console.log("~~~~", sourceName);
    // examples:
    // ~~~~ PepeForkToken
    // ~~~~ mock/MockERC2
    // ~~~~ mock/foo/Foo

    // convert to array
    // `mock/MockERC2` -> `["mock", "MockERC2"]`
    const attrs = sourceName.split("/");
    //console.log("~~~~", attrs);
    // examples:
    // ~~~~ [ 'PepeForkToken' ]
    // ~~~~ [ 'mock', 'MockERC20' ]
    // ~~~~ [ 'mock', 'foo', 'Foo' ]

    sourceNames.push(sourceName);
    contracts.push({ contractName, attrs });
  }

  return new Promise((resolve) => {
    resolve({
      sourceNames,
      contracts,
    });
  });
}

// export function paths2json(paths: string[], defaultValue: string): string {
//   const result: any = {};
//   for (const path of paths) {
//     const arr = path.split("/");
//     if (arr.length == 1) {
//       result[path] = defaultValue;
//     } else {
//       let current = result;
//       for (let i = 0; i < arr.length; i++) {
//         const path = arr[i];
//         if (i == arr.length - 1) {
//           current[path] = defaultValue;
//         } else {
//           current[path] = current[path] == null ? {} : current[path];
//           current = current[path];
//         }
//       }
//     }
//   }

//   return JSON.stringify(result, null, 2);
// }

export function paths2json(
  existsJson: any,
  paths: string[],
  defaultValue: string,
): string {
  const result: any = {};
  for (const path of paths) {
    const arr = path.split("/");
    if (arr.length == 1) {
      result[path] = existsJson[path] == null ? defaultValue : existsJson[path];
    } else {
      // reset value at each loop
      let current = result;
      let currentExists = existsJson;

      for (let i = 0; i < arr.length; i++) {
        const name = arr[i];
        if (i == arr.length - 1) {
          current[name] =
            currentExists[name] == null ? defaultValue : currentExists[name];
        } else {
          current[name] = current[name] == null ? {} : current[name];
          current = current[name];

          currentExists =
            currentExists[name] == null ? {} : currentExists[name];
        }
      }
    }
  }

  return JSON.stringify(result, null, 2);
}
