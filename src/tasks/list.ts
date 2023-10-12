const explorers = new Map<number, string>()
  .set(1, "https://etherscan.io/address/")
  .set(5, "https://goerli.etherscan.io/address/")
  .set(11155111, "https://sepolia.etherscan.io/address/")
  .set(56, "https://bscscan.com/address/")
  .set(137, "https://polygonscan.com/address/")
  .set(1284, "https://moonscan.io/address/")
  .set(10, "https://optimistic.etherscan.io/address/")
  .set(59144, "https://lineascan.build/address/")
  .set(42161, "https://arbiscan.io/address/");

export function blockchainExplorer(chainId: number): string {
  return explorers.get(chainId) || "";
}
