import { extendConfig } from "hardhat/config";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { DEFAULT_DEPLOYED_DIR } from "./constants";

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

// Import tasks
import "./tasks/deployed-init";
import "./tasks/deployed-add";
import "./tasks/deployed-migrate";
import "./tasks/deployed-list";

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    // read user config
    const deployedDir =
      userConfig.deployedRecords?.deployedDir ?? DEFAULT_DEPLOYED_DIR;
    const ignoreContracts = userConfig.deployedRecords?.ignoreContracts ?? [];

    // inject config fields
    config.deployedRecords = { deployedDir, ignoreContracts };
  },
);
