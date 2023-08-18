import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HardhatPluginError } from "hardhat/plugins";
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import fs from "fs";
import { PLUGIN_NAME, CONTRACTS_JSON_FILE } from "../constants";
import { parseArtifacts, paths2json } from "./helpers";

task("deployed-add", "Add new network deployed").setAction(
  async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // run `compile` task before all operations
    await hre.run(TASK_COMPILE);

    // read configs from `hardhat.config.ts`
    const configs = hre.config.deployedRecords;

    // get network name
    const network = hre.network.name; // default value is `hardhat`

    // if the network folder already exists, throw an error
    if (fs.existsSync(`${configs.deployedDir}/${network}`)) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        "Already added, you can migrate it by using 'deployed-migrate' task",
      );
    }

    const { contracts } = await parseArtifacts(hre, configs.ignoreContracts);

    // create <network> folder
    fs.mkdirSync(`${configs.deployedDir}/${network}`);
    // write `<network>/contracts.json` file
    const data = paths2json({}, contracts, "_");
    fs.writeFileSync(
      `${configs.deployedDir}/${network}/${CONTRACTS_JSON_FILE}`,
      data,
      {
        flag: "a+",
      },
    );
  },
);
