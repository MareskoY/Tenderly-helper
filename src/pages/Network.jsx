import React, {useEffect, useMemo, useState} from 'react';
import {useLocation, Navigate} from "react-router-dom";
import { TenderlyFork } from '../utils/tenderly';
import './network.css';
import networkData from "../assets/networks.json";
import { FaSearch } from 'react-icons/fa';
import {ethers} from "ethers";

function Network () {
    //init variables
    const networkKey = useLocation().state.id;
    const networkName = useLocation().state.network;
    const tenderlyKey = localStorage.getItem('tenderlyKey');
    const tenderlyAccount = localStorage.getItem('tenderlyAccount');
    const tenderlyProject = localStorage.getItem('tenderlyProject');
    const testWalletAddress = localStorage.getItem(`testWalletAddress`);

    //redirect if not configured
    if(tenderlyKey == null || tenderlyKey == undefined){
        return (
            <Navigate to="/settings" replace={true} />
        )
    }

    //get history
    const savedRpcUrl = localStorage.getItem(`${networkKey}-rpcUrl`);
    const savedRpcId = localStorage.getItem(`${networkKey}-rpcId`);
    const savedNetworkId = localStorage.getItem(`${networkKey}-networkId`);
    const forkChainId = localStorage.getItem('forkChainId') || '3030'

    //fork
    const fork = useMemo(() => {
        return  new TenderlyFork(tenderlyKey, tenderlyAccount, tenderlyProject, savedRpcId);
    }, [tenderlyKey, tenderlyAccount, tenderlyProject, savedRpcId])

    //component variables
    const [error, setError] = useState('');
    const [rpcUrl, setRpcUrl] = useState(`${savedRpcUrl}`);
    const [rpcId, setRpcId] = useState(`${savedRpcId}`);
    const [networkId, setNetworkId] = useState(`${savedNetworkId}`)
    const [walletAddress, setWalletAddress] = useState(`${testWalletAddress}`);
    const [baseTokenCount, setBaseTokenCount] = useState(1000);
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenAmount, setTokenAmount] = useState(1000);
    const [donorAddress, setDonorAddress] = useState('');
    const [tokenDecimalsValue, setDecimalsValue] = useState('18');
    //errors
    const [walletAddressError, setWalletAddressError] = useState(false);
    const [tokenAddressError, setTokenAddressError] = useState(false);
    const [donorWalletAddressError, setDonorWalletAddressError] = useState(false);

    const onCreateForkClick = async () => {
        try {
            await fork.init(networkData[networkKey].chainID, forkChainId);
            setRpcUrl(fork.get_rpc_url());
            setRpcId(fork.get_rpc_id());
            setNetworkId(forkChainId);
            // Save rpc and networkId to local storage
            localStorage.setItem(`${networkKey}-rpcUrl`, fork.get_rpc_url());
            localStorage.setItem(`${networkKey}-networkId`, forkChainId);
            localStorage.setItem(`${networkKey}-rpcId`, fork.get_rpc_id());
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const onDeleteForkClick = async () => {
        try {
            await fork.deleteFork();
            setRpcUrl('');
            setRpcId('');
            setNetworkId('');
            localStorage.removeItem(`${networkKey}-rpcUrl`);
            localStorage.removeItem(`${networkKey}-networkId`);
            localStorage.removeItem(`${networkKey}-rpcId`);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    const onWalletAddressChange = (event) => {
        setWalletAddress(event.target.value);
        setWalletAddressError(false);
        if(event.target.value !== ''){
            if(!ethers.utils.isAddress(event.target.value))
                setWalletAddressError(true);
        }
    };

    const onBaseTokenCount = (event) => {
        setBaseTokenCount(event.target.value);
    };

    const onGetBaseTokenClick = async () => {
        localStorage.setItem(`testWalletAddress`, walletAddress);
        try {
            await fork.add_base_token(walletAddress,baseTokenCount);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }

    const onTokenAddress = (event) => {
        setTokenAddress(event.target.value);
        setTokenAddressError(false);
        if(event.target.value !== ''){
            if(!ethers.utils.isAddress(event.target.value))
                setTokenAddressError(true);
        }
    };

    const onTokenAmount = (event) => {
        setTokenAmount(event.target.value);
    };

    const onDonorAddress = (event) => {
        setDonorAddress(event.target.value);
        setDonorWalletAddressError(false);
        if(event.target.value !== ''){
            if(!ethers.utils.isAddress(event.target.value))
                setDonorWalletAddressError(true);
        }
    };

    const onDecimalsTypeChange = (event) => {
        setDecimalsValue(event.target.value);
    };

    const onGetCustomToken = async (event) => {
        console.log(event.target.value)
        localStorage.setItem(`testWalletAddress`, walletAddress);
        try{
            await fork.getERC20Token({
                walletAddress,
                tokenAddress,
                donorAddress,
                tokenCount: tokenAmount,
                decimalValue: tokenDecimalsValue
            });
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }

    const lookHolders = () => {
        window.open(`${networkData[networkKey].holderScanner}/${tokenAddress}${networkData[networkKey].holderEnder}`);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const aaveRPCSetup = `
        localStorage.setItem('forkEnabled', 'true');
        localStorage.setItem('forkBaseChainId', ${networkData[networkKey].chainID});
        localStorage.setItem('forkNetworkId', ${forkChainId});
        localStorage.setItem("forkRPCUrl", "${rpcUrl}");
                                 `

    return (
        <div className={"network-page"}>
            {error}
            {error != '' &&
                <div>
                    <div className="alert alert-error shadow-lg">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span>{error}</span>
                        </div>
                    </div>
                    <br/>
                </div>
            }
            <div className="flex w-full">
                <div className="grid flex-grow card place-items-center rounded-box h-18 network-button-card">
                    <button className="btn btn-success btn-block network-setup-button" onClick={onCreateForkClick} disabled={!!savedRpcUrl}>
                        Create New
                    </button>
                </div>
                <div className="divider divider-horizontal"></div>
                <div className="grid flex-grow card place-items-center rounded-box h-18 network-button-card">
                    <button className="btn btn-error btn-block network-setup-button" onClick={onDeleteForkClick} disabled={!savedRpcUrl}>
                        Delete Fork
                    </button>
                </div>
            </div>
            <br/>
            {!!savedRpcUrl &&
                <div tabIndex={1} className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box">
                    <input type="checkbox"/>
                    <div className="collapse-title text-sm font-bold">
                        RPC DETAILS
                    </div>
                    <div tabIndex={1} className={"collapse-content result-of-create"}>
                        <div className={"simple-result"}>
                            <div className="form-control">
                                <label className="input-group">
                                    <span>URL</span>
                                    <input type="text" className="input input-bordered w-max" disabled value={rpcUrl}/>
                                    <button className="btn btn-active btn-ghost"
                                            onClick={() => copyToClipboard(rpcUrl)}>Copy
                                    </button>
                                </label>
                                <br></br>
                                <label className="input-group">
                                    <span>ID&nbsp;&nbsp;&nbsp;</span>
                                    <input type="text" className="input input-bordered w-max" disabled
                                           value={networkId}/>
                                    <button className="btn btn-active btn-ghost"
                                            onClick={() => copyToClipboard(networkId)}>Copy
                                    </button>
                                </label>
                            </div>
                        </div>
                        <br/>
                        <div tabIndex={0}
                             className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box">
                            <input type="checkbox"/>
                            <div className="collapse-title text-sm font-normal">
                                For AAVE UI
                            </div>
                            <div tabIndex={0} className="collapse-content">
                                <div className={"rounded-md mockup-code bg-base-200 text-black"}>
                                    <pre><code className={"text-black"}>localStorage.setItem('forkEnabled', 'true');</code></pre>
                                    <pre><code className={"text-black"}>localStorage.setItem('forkBaseChainId', {networkData[networkKey].chainID});</code></pre>
                                    <pre><code className={"text-black"}>localStorage.setItem('forkNetworkId', {forkChainId});</code></pre>
                                    <pre><code className={"text-black"}>localStorage.setItem("forkRPCUrl", "{rpcUrl}");</code></pre>
                                </div>
                                <br/>
                                <button className="btn btn-ghost btn-active w-full" onClick={() => copyToClipboard(aaveRPCSetup)}>Copy</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
            <br/>
            <div className="flex flex-col w-full">
                <div className="form-control w-full">
                    <label className="input-group">
                        <span className={"bg-primary text-white"}>WALLET</span>
                        <input type="text" value={walletAddress} onChange={onWalletAddressChange} className="input input-bordered border-primary text-primary" />
                    </label>
                    <label className="label">
                        {walletAddressError && <span className="label-text-alt text-error">Not valid address</span>}
                    </label>
                </div>
                <div className="divider"></div>
                <div className="form-control w-full">
                    <label className="input-group">
                        <span className={"bg-accent"}>COUNT</span>
                        <input type="number" value={baseTokenCount} onChange={onBaseTokenCount}  className="input input-bordered border-accent text-accent" />
                    </label>
                </div>
                <br/>
                <button className={"btn btn-outline btn-accent"} onClick={onGetBaseTokenClick} disabled={!savedRpcUrl || walletAddress == ''}>
                    Get Base Token
                </button>
                <div className="divider"></div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Token address</span>
                    </label>
                    <input type="text" value={tokenAddress} onChange={onTokenAddress} className="input input-bordered border-primary text-primary" />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Count of tokens</span>
                    </label>
                    <input type="number" value={tokenAmount} onChange={onTokenAmount} className="input input-bordered border-primary text-primary" />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Donor address</span>
                    </label>

                    <label className="input-group">
                        <input type="text" value={donorAddress} onChange={onDonorAddress} className="input input-bordered border-primary text-primary" />
                        <button className="btn btn-active btn-ghost"
                                onClick={lookHolders} disabled={tokenAddress == ''}><FaSearch />
                        </button>
                    </label>
                    <label className="label">
                        {donorWalletAddressError && <span className="label-text-alt text-error">Not valid address</span>}
                    </label>
                </div>
                <div className={"form-control"}>
                    <label className="label">
                        <span className="label-text">Token decimals value:</span>
                    </label>
                    <div className="btn-group">
                        <input type="radio" name="options" data-title="18" className="btn" value="18" checked={tokenDecimalsValue === '18'} onChange={onDecimalsTypeChange}/>
                        <input type="radio" name="options" data-title="8" className="btn" value="8" checked={tokenDecimalsValue === '8'} onChange={onDecimalsTypeChange}/>
                        <input type="radio" name="options" data-title="6" className="btn" value="6" checked={tokenDecimalsValue === '6'} onChange={onDecimalsTypeChange} />
                        <input type="radio" name="options" data-title="2" className="btn" value="2" checked={tokenDecimalsValue === '2'} onChange={onDecimalsTypeChange}/>
                    </div>
                    <br/>
                    <button className={"btn btn-outline btn-primary"} onClick={onGetCustomToken} disabled={!savedRpcUrl || walletAddress == '' ||  tokenAddress == '' || donorAddress == ''}>
                        Get ERC20 Token
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Network;