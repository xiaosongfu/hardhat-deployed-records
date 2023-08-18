import { HardhatRuntimeEnvironment } from "hardhat/types";

export async function parseArtifacts(
  hre: HardhatRuntimeEnvironment,
  ignoreContracts: string[],
): Promise<{
  contracts: { name: string; path: string[] }[];
}> {
  const fullNames = await hre.artifacts.getAllFullyQualifiedNames();
  console.log(fullNames);
  // examples:
  // [
  //   '@openzeppelin/contracts/access/Ownable.sol:Ownable',
  //   '@openzeppelin/contracts/utils/math/SignedMath.sol:SignedMath',
  //   'contracts/IBar.sol:IBar',
  //   'contracts/MMERC20.sol:MMERC20',
  //   'contracts/MMERC20.sol:Bar',
  //   'contracts/mock/foo/Foo.sol:Foo',
  //   'contracts/mock/foo/Foo.sol:Foo2'
  // ]

  let contracts: { name: string; path: string[] }[] = [];
  for (const fullName of fullNames) {
    // skip third-party dependencies
    if (!fullName.startsWith("contracts/")) continue;

    // get sourceName and contractName
    let {
      sourceName: source,
      contractName: name,
      bytecode,
    } = await hre.artifacts.readArtifact(fullName);
    console.log("~~~~", source, name);
    // examples:
    // ~~~~ contracts/IBar.sol IBar
    // ~~~~ contracts/MMERC20.sol MMERC20
    // ~~~~ contracts/MMERC20.sol Bar
    // ~~~~ contracts/mock/foo/Foo.sol Foo
    // ~~~~ contracts/mock/foo/Foo.sol Foo2

    // skip solidity interface
    if (bytecode === "0x") continue;

    // skip ignored contracts
    if (ignoreContracts.includes(name)) continue;

    // `contracts/MMERC20.sol MMERC20` -> `MMERC20` -> `["MMERC20"]`
    // `contracts/MMERC20.sol Bar` -> `MMERC20` -> `["Bar"]`
    // `contracts/mock/foo/Foo.sol Foo` -> `mock/foo/Foo` -> `["mock", "foo", "Foo"]`
    // `contracts/mock/foo/Foo.sol Foo2` -> `mock/foo/Foo` -> `["mock", "foo", "Foo2"]`
    let path = source.slice(10, source.length - 4).split("/");
    path[path.length - 1] = name; // !! IMPORTANT: replace last element with contract name

    console.log("---- ", name, path);
    // examples:
    // ----  MMERC20 [ 'MMERC20' ]
    // ----  Bar [ 'Bar' ]
    // ----  Foo [ 'mock', 'foo', 'Foo' ]
    // ----  Foo2 [ 'mock', 'foo', 'Foo2' ]

    contracts.push({ name, path });
  }

  return new Promise((resolve) => {
    resolve({
      contracts,
    });
  });
}

export function paths2json(
  existsJson: any,
  contracts: { name: string; path: string[] }[],
  defaultValue: string,
): string {
  const result: any = {};
  for (const contract of contracts) {
    if (contract.path.length == 1) {
      const key = contract.name;
      result[key] = existsJson[key] == null ? defaultValue : existsJson[key];
    } else {
      // reset value at each loop
      let current = result;
      let currentExists = existsJson;

      for (let i = 0; i < contract.path.length; i++) {
        if (i == contract.path.length - 1) {
          const key = contract.name;
          current[key] =
            currentExists[key] == null ? defaultValue : currentExists[key];
        } else {
          const key = contract.path[i];
          current[key] = current[key] == null ? {} : current[key];
          current = current[key];

          currentExists = currentExists[key] == null ? {} : currentExists[key];
        }
      }
    }
  }

  return JSON.stringify(result, null, 2);
}
