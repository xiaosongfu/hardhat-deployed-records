import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HardhatPluginError } from "hardhat/plugins";
import { TASK_COMPILE } from "hardhat/builtin-tasks/task-names";
import fs from "fs";
import Mustache from "mustache";
import {
  PLUGIN_NAME,
  INDEX_TS_FILE,
  CONTRACTS_JSON_FILE,
  DEFAULT_DEPLOYED_ADDRESS,
} from "../constants";
import { paths2json } from "./helpers";
import { parseArtifacts } from "./helpers";
import { indexFile } from "./templates";

task("deployed-migrate", "Migrate the deployed folder").setAction(
  async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
    // run `compile` task before all operations
    await hre.run(TASK_COMPILE);

    // read configs from `hardhat.config.ts`
    const configs = hre.config.deployedRecords;

    // if the deployed folder not exists, throw an error
    if (!fs.existsSync(configs.deployedDir)) {
      throw new HardhatPluginError(
        PLUGIN_NAME,
        "Please initialize first by executing 'deployed-init' task",
      );
    }

    const { contracts } = await parseArtifacts(hre, configs.ignoreContracts);

    // write new `index.ts` file
    const code = Mustache.render(indexFile, { contracts });
    fs.writeFileSync(`${configs.deployedDir}/${INDEX_TS_FILE}`, code, {
      flag: "w",
    });

    // migrate `<network>/contracts.json` file with:
    //    1. contracts changes(no change, added, removed)
    //    2. has deployed contract addresses
    fs.readdirSync(configs.deployedDir, { recursive: false }).forEach(
      (network) => {
        const manifest = `${configs.deployedDir}/${network}/${CONTRACTS_JSON_FILE}`;
        // NOTICE: `fs.existsSync('scripts/deployed/index.ts/contracts.json')` will be `false`
        if (fs.existsSync(manifest)) {
          // read old `contracts.json` file
          const content = fs.readFileSync(manifest, "utf-8");
          const existsJson = JSON.parse(content);

          // write new `contracts.json` file
          const data = paths2json(
            existsJson,
            contracts,
            DEFAULT_DEPLOYED_ADDRESS,
          );
          fs.writeFileSync(manifest, data, {
            flag: "w",
          });
        }
      },
    );
  },
);
