// If your plugin extends types from another plugin, you should import the plugin here.

// To extend one of Hardhat's types, you need to import the module where it has been defined, and redeclare it.
import "hardhat/types/config";

declare module "hardhat/types/config" {
  export interface DeployedRecordsUserConfig {
    deployedDir?: string;

    ignoreContracts?: string[];
  }

  export interface DeployedRecordsConfig {
    deployedDir: string;

    ignoreContracts: string[];
  }

  export interface HardhatUserConfig {
    deployedRecords?: DeployedRecordsUserConfig;
  }

  export interface HardhatConfig {
    deployedRecords: DeployedRecordsConfig;
  }
}
