import {Contract, getDefaultProvider, ethers, utils} from 'ethers';
import ERC20_ABI from '../assets/erc20_abi.json';
import axios from 'axios';

class TenderlyFork {
  constructor(tenderlyKey, tenderlyAccount, tenderlyProject, fork_id,) {
    this.tenderlyKey = tenderlyKey;
    this.tenderlyAccount = tenderlyAccount;
    this.tenderlyProject = tenderlyProject;
    if (fork_id || fork_id !='') this.fork_id = fork_id;
    this.tenderly = axios.create({
      baseURL: "https://api.tenderly.co/api/v1/",
      headers: {
        "X-Access-Key": this.tenderlyKey,
      },
    });
  }
  async init(forkNetworkId, chainId) {
    console.log(`Creating fork for ${forkNetworkId} on ${chainId}`);
    try {
      const response = await this.tenderly.post(
          `account/${this.tenderlyAccount}/project/${this.tenderlyProject}/fork`,
          {
            network_id: forkNetworkId,
            chain_config: { chain_id: Number(chainId) },
          }
      );
      this.fork_id = response.data.simulation_fork.id;
    }catch (e) {
      throw new Error(`Failed to create fork: ${error.message}`);
    }
  }
//'0x21e19e0c9bab2400000'
  async add_base_token(address, amount) {
    if (!this.fork_id) throw new Error('Fork not initialized!');
    console.log(`amount string: ${amount.toString()}`)
    const tokenAmount = ethers.BigNumber.from(amount);
    const tokenDecimals = ethers.BigNumber.from(18);
    const tokenAmountInWei = tokenAmount.mul(ethers.BigNumber.from(10).pow(tokenDecimals));
    console.log('tokenAmountInWei ' + tokenAmountInWei)
    const hexString = '0x' + tokenAmountInWei.toHexString().replace(/^0x/, '').padStart(16, '0');
    console.log(hexString); // Output: 0x21e19e0c9bab2400000
    try {
      axios({
        url: this.get_rpc_url(),
        method: 'post',
        headers: { 'content-type': 'text/plain' },
        data: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tenderly_setBalance',
          params: [address, `${hexString}`],
          id: '1234',
        }),
      });
    } catch (e) {
      throw new Error(`Failed to set balance: ${e.message}`);
    }
  }


  async getERC20Token({walletAddress, tokenAddress, donorAddress, tokenCount, decimalValue}) {
    console.log('walletAddress ' + walletAddress)
    console.log('tokenAddress ' + tokenAddress)
    console.log('donorAddress ' + donorAddress)
    console.log('tokenCount ' + tokenCount)
    console.log('decimalValue ' + decimalValue)
    if (!this.fork_id) throw new Error('Fork not initialized!');
    const tokenAmount = ethers.BigNumber.from(tokenCount);
    const tokenDecimals = ethers.BigNumber.from(decimalValue);
    const tokenAmountInWei = tokenAmount.mul(ethers.BigNumber.from(10).pow(tokenDecimals));
    let TOP_HOLDER_ADDRESS;
    const _url = this.get_rpc_url();
    const provider = getDefaultProvider(_url);
    // if (donorAddress) {
    //   TOP_HOLDER_ADDRESS = donorAddress;
    // } else {
    //   TOP_HOLDER_ADDRESS = await this.getTopHolder(tokenAddress);
    // }
    console.log('111 ' + utils.parseEther(tokenCount.toString()))
    console.log('222 ' + tokenAmountInWei)
    const topHolderSigner = await provider.getSigner(donorAddress);
    const token = new Contract(tokenAddress, ERC20_ABI, topHolderSigner);
    await token.transfer(walletAddress, tokenAmountInWei);
  }

  async getTopHolder(token) {
    const res = (
        await axios.get(`https://api.ethplorer.io/getTopTokenHolders/${token}?apiKey=freekey`)
    ).data.holders[0].address;
    return res;
  }

  get_rpc_url() {
    if (!this.fork_id) throw new Error("Fork not initialized!");
    return `https://rpc.tenderly.co/fork/${this.fork_id}`;
  }

  get_rpc_id() {
    if (!this.fork_id) throw new Error("Fork not initialized!");
    return `${this.fork_id}`;
  }

  async deleteFork() {
    if (!this.fork_id) throw new Error("Fork not initialized!");
    await this.tenderly.delete(
        `account/${this.tenderlyAccount}/project/${this.tenderlyProject}/fork/${this.fork_id}`
    );
    console.log(`Fork Deleted!`)
  }
}

export { TenderlyFork };
