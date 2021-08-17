import { useState, useEffect } from 'react';

import './App.css';
import Web3  from 'web3';
import BigNumber from 'bignumber.js';

import MOCKTOKEN_ABI from './abi/mock2.json';
import { MOCK_TOKEN1, MOCK_TOKEN2 } from './constant';

function App() {
  const [signedAccounts, setSignedAccounts] = useState();
  const web3Provider = window.ethereum;
  const web3Instance = new Web3(web3Provider);
  
  useEffect(() => {
    const connectMetaMask = async () => {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3Provider.request({ method: 'eth_accounts' });
      setSignedAccounts(accounts);
    }
    connectMetaMask();
  }, []);

  const testSingleTransactionHandler = async () => {   
    const contract1 = new web3Instance.eth.Contract(MOCKTOKEN_ABI, MOCK_TOKEN1);
    const contract2 = new web3Instance.eth.Contract(MOCKTOKEN_ABI, MOCK_TOKEN2);
    console.log('[start]');

    const balanceBefore1 = await contract1.methods.balanceOf(signedAccounts[0]).call()
    console.log('[balanceBefore1]', balanceBefore1);

    const balanceBefore = await contract2.methods.balanceOf(signedAccounts[0]).call()
    console.log('[balanceBefore]', balanceBefore);

    await contract1.methods.approve(MOCK_TOKEN2, new BigNumber(10000000).times(new BigNumber(10e18))).send({
      from: signedAccounts[0],
      gasPrice: web3Instance.utils.toWei('40', 'gwei')
    });


    const allowance = await contract1.methods.allowance(signedAccounts[0], MOCK_TOKEN2);
    console.log('approved', allowance.toString());
    
    await contract2.methods.getMock(MOCK_TOKEN1, new BigNumber(10000).times(new BigNumber(1e18))).send({
      from: signedAccounts[0],
      gasPrice: web3Instance.utils.toWei('40', 'gwei')
    });

    const balanceAfter = await contract2.methods.balanceOf(signedAccounts[0]).call()
    console.log('[balanceAfter]', balanceAfter);
  }

  const testMultiTransactionHandler = async () => {
    const batch = new web3Instance.BatchRequest();
    const contract1 = new web3Instance.eth.Contract(MOCKTOKEN_ABI, MOCK_TOKEN1);
    const contract2 = new web3Instance.eth.Contract(MOCKTOKEN_ABI, MOCK_TOKEN2);
    console.log('[start]');

    const balanceBefore = await contract2.methods.balanceOf(signedAccounts[0]).call()
    console.log('[balanceBefore]', balanceBefore);

    batch.add(contract1.methods.approve(MOCK_TOKEN2, new BigNumber(10000000).times(new BigNumber(10e18)))
      .send
      .request({from: signedAccounts[0], gasPrice: web3Instance.utils.toWei('40', 'gwei')}, function(val) {
      console.log('batch callback 1', val);
    }));
    batch.add(contract2.methods.getMock(MOCK_TOKEN1, new BigNumber(10000).times(new BigNumber(1e18)))
      .send
      .request({from: signedAccounts[0], gasPrice: web3Instance.utils.toWei('40', 'gwei')}, function(val) {
      console.log('batch callback 2', val);
      const getBalanceAfter = async () => {
        const balanceAfter = await contract2.methods.balanceOf(signedAccounts[0]).call();
        console.log('[balanceAfter]', balanceAfter);
      }
     
      getBalanceAfter();
    }));

    batch.execute();

    const balanceAfter = await contract2.methods.balanceOf(signedAccounts[0]).call()
    console.log('[balanceAfter]', balanceAfter);
  }
  

  return (
    <div className="App">
      <div>
        <button onClick={testSingleTransactionHandler}>Single Test</button>
      </div>
      <div>
        <button onClick={testMultiTransactionHandler}>Multi Test1</button>
      </div>
      <div>
        <button onClick={testMultiTransactionHandler}>Multi Test2</button>
      </div>
    </div>
  );
}

export default App;
