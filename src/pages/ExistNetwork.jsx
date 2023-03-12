import React, {useState} from 'react';
import {Navigate} from "react-router-dom";
import { TenderlyFork } from '../utils/tenderly';
import './network.css';
import networkData from "../assets/networks.json";
import {ethers} from "ethers";

function ExistNetwork () {
    //init variables
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

    //component variables
    const [error, setError] = useState('');
    const [rpcUrl, setRpcUrl] = useState(``);
    const rpcID = rpcUrl.split("/").pop();
    const [walletAddress, setWalletAddress] = useState(`${testWalletAddress == null ? '' : testWalletAddress }`);
    const [baseTokenCount, setBaseTokenCount] = useState(1000);
    const [tokenAddress, setTokenAddress] = useState('');
    const [tokenAmount, setTokenAmount] = useState(1000);
    const [donorAddress, setDonorAddress] = useState('');
    const [tokenDecimalsValue, setDecimalsValue] = useState('18');
    //errors
    const [walletAddressError, setWalletAddressError] = useState(false);
    const [tokenAddressError, setTokenAddressError] = useState(false);
    const [donorWalletAddressError, setDonorWalletAddressError] = useState(false);

    const onRpcUrlChange = (event) => {
        setRpcUrl(event.target.value);
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
            const fork = new TenderlyFork(tenderlyKey, tenderlyAccount, tenderlyProject, rpcID);
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
            const fork = new TenderlyFork(tenderlyKey, tenderlyAccount, tenderlyProject, rpcID);
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
            <div className="flex flex-col w-full">
                <div className="form-control w-full">
                    <label className="input-group">
                        <span className={"bg-primary text-white"}>RPC</span>
                        <input type="text" value={rpcUrl} onChange={onRpcUrlChange} className="input input-bordered border-primary text-primary" />
                    </label>
                </div>
                <br/>
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
                <button className={"btn btn-outline btn-accent"} onClick={onGetBaseTokenClick} disabled={!rpcUrl || walletAddress == ''}>
                    Get Base Token
                </button>
                <div className="divider"></div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Token address</span>
                    </label>
                    <input type="text" value={tokenAddress} onChange={onTokenAddress} className="input input-bordered border-primary text-primary" />
                    <label className="label">
                        {tokenAddressError && <span className="label-text-alt text-error">Not valid address</span>}
                    </label>
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
                    <input type="text" value={donorAddress} onChange={onDonorAddress} className="input input-bordered border-primary text-primary" />
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
                    <button className={"btn btn-outline btn-primary"} onClick={onGetCustomToken} disabled={!rpcUrl || walletAddress == '' ||  tokenAddress == '' || donorAddress == ''}>
                        Get ERC20 Token
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ExistNetwork;