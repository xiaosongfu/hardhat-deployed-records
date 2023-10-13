import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HardhatPluginError } from "hardhat/plugins";
import fs from "fs";
import { DEFAULT_DEPLOYED_ADDRESS, PLUGIN_NAME } from "../constants";
import { blockchainExplorer } from "./list";
import { flatJson } from "./helpers";

task("deployed-list", "List deployed of one network")
  .addOptionalParam(
    "explorer",
    "blockchain's block explorer,such as 'https://etherscan.io/tx/'",
  )
  .setAction(
    async (taskArgs: { explorer: string }, hre: HardhatRuntimeEnvironment) => {
      // read configs from `hardhat.config.ts`
      const configs = hre.config.deployedRecords;

      // get network name
      const network = hre.network.name; // default value is `hardhat`
      // `31337` is the chainId of default `localhost` network. Reference: https://hardhat.org/hardhat-network/docs/reference#chainid
      // `localhost` network's chainId is not explicitly configured in `hardhat.config.ts`
      // so we use `31337` as default value
      const chainId = hre.network.config.chainId ?? 31337;

      // get block explorer
      const explorer =
        taskArgs.explorer != null
          ? taskArgs.explorer
          : blockchainExplorer(chainId);
      if (explorer == "") {
        throw new HardhatPluginError(
          PLUGIN_NAME,
          "chain not support, please specify block explorer manually by using '--explorer https://etherscan.io/tx/'",
        );
      }

      // if manifest file not exists, throw an error
      const manifest = `${configs.deployedDir}/${network}/contracts.json`;
      if (!fs.existsSync(manifest)) {
        throw new HardhatPluginError(
          PLUGIN_NAME,
          `'${manifest}' file not found`,
        );
      }

      const content = fs.readFileSync(manifest, "utf-8");
      let json = JSON.parse(content);

      const list: {}[] = flatJson(json).map((element) => {
        return {
          Contract: element[0],
          Address: element[1],
          "Blockchain Explorer":
            element[1] == DEFAULT_DEPLOYED_ADDRESS ? "" : explorer + element[1],
        };
      });
      console.table(list);
    },
  );
