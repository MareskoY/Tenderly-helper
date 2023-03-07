import React, { useState, useEffect } from 'react';
import './settings.css';

function Settings() {
    const [tenderlyKey, setTenderlyKey] = useState('');
    const [tenderlyAccount, setTenderlyAccount] = useState('');
    const [tenderlyProject, setTenderlyProject] = useState('');
    const [tenderlyKeyValid, setTenderlyKeyValid] = useState(true);
    const [tenderlyAccountValid, setTenderlyAccountValid] = useState(true);
    const [tenderlyProjectValid, setTenderlyProjectValid] = useState(true);
    const [walletAddress, setWalletAddress] = useState('');
    const [forkChainId, setForkChainId] = useState('');

    useEffect(() => {
        setTenderlyKey(localStorage.getItem('tenderlyKey'));
        setTenderlyAccount(localStorage.getItem('tenderlyAccount'));
        setTenderlyProject(localStorage.getItem('tenderlyProject'));
        setWalletAddress(localStorage.getItem('testWalletAddress'));
        setForkChainId(localStorage.getItem('forkChainId') || '3030');
    }, []);

    const handleSave = () => {
        // Validate inputs
        let isValid = true;
        if (!tenderlyKey) {
            setTenderlyKeyValid(false);
            isValid = false;
        } else {
            setTenderlyKeyValid(true);
        }

        if (!tenderlyAccount) {
            setTenderlyAccountValid(false);
            isValid = false;
        } else {
            setTenderlyAccountValid(true);
        }

        if (!tenderlyProject) {
            setTenderlyProjectValid(false);
            isValid = false;
        } else {
            setTenderlyProjectValid(true);
        }

        // Save the values to localStorage
        if (isValid) {
            localStorage.setItem('tenderlyKey', tenderlyKey)
            localStorage.setItem('tenderlyAccount', tenderlyAccount)
            localStorage.setItem('tenderlyProject', tenderlyProject)
            localStorage.setItem(
                'settings',
                JSON.stringify({
                    tenderlyKey,
                    tenderlyAccount,
                    tenderlyProject,
                })
            );
        }
    };

    const onWalletAddress = (event) => {
        setWalletAddress(event.target.value);
    };

    const onForkChainId = (event) => {
        setForkChainId(event.target.value);
    };

    const handleSaveAdditional = () =>{
        localStorage.setItem(`testWalletAddress`, walletAddress);
        localStorage.setItem(`forkChainId`, forkChainId);
    };
//zk1cD43hAaT0oFUCJsIi4ma9IGFVnp1x
    return (
        <div className="settings-page">
            <div className={"card shadow-xl setting-card"}>
                <div className={"card-body items-center text-center content-center items-center"}>
                    <h2 className="card-title">Main settings</h2>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Tenderly key:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            id="tenderly-key"
                            value={tenderlyKey}
                            onChange={(e) => setTenderlyKey(e.target.value)}
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                        <label className="label">
                            {(!tenderlyKeyValid && !tenderlyAccountValid && !tenderlyProjectValid) && <span className="label-text-alt text-error">TenderlyKey is required</span>}
                        </label>
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Tenderly Account:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            id="tenderly-key"
                            value={tenderlyAccount}
                            onChange={(e) => setTenderlyAccount(e.target.value)}
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                        <label className="label">
                            {(!tenderlyKeyValid && !tenderlyAccountValid && !tenderlyProjectValid)  && <span className="label-text-alt text-error">TenderlyAccount is required</span>}
                        </label>
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Tenderly Project:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            id="tenderly-key"
                            value={tenderlyProject}
                            onChange={(e) => setTenderlyProject(e.target.value)}
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                        <label className="label">
                            {(!tenderlyKeyValid && !tenderlyAccountValid && !tenderlyProjectValid)  && <span className="label-text-alt text-error">TenderlyProject is required</span>}
                        </label>
                    </div>
                    <button className="btn btn-primary btn-wide" onClick={handleSave}>Save</button>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div className={"card shadow-xl setting-card"}>
                <div className={"card-body items-center text-center content-center items-center"}>
                    <h2 className="card-title">Additional settings</h2>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Default test wallet:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            id="tenderly-key"
                            value={walletAddress}
                            onChange={onWalletAddress}
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                    </div>
                    <div className="form-control w-full max-w-xs">
                        <label className="label">
                            <span className="label-text">Default fork ID:</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Type here"
                            id="tenderly-key"
                            value={forkChainId}
                            onChange={onForkChainId}
                            className="input input-bordered input-primary w-full max-w-xs"
                        />
                        <label className="label">
                            {(!tenderlyKeyValid && !tenderlyAccountValid && !tenderlyProjectValid)  && <span className="label-text-alt text-error">TenderlyAccount is required</span>}
                        </label>
                    </div>
                    <button className="btn btn-primary btn-wide" onClick={handleSaveAdditional}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default Settings;
