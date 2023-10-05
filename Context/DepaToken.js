import React, {useState, useEffect, useContext} from 'react';
import Web3Modal from "web3modal";
import { ethers } from "ethers";


import {depaTokenAddress, depaTokenABI} from "./constant";

const fetchContractERC20 = (signerOrProvider) => new ethers.Contract(depaTokenAddress, depaTokenABI, signerOrProvider);

export const ERC20ICOContext = React.createContext();

export const ERC20Provider = ({ children })=> {
  const depaToken  = "Power your dream with dependable transparent finance service $ securities.";

  //User accounts

  const [holderArray, setHOlderArray] = useState([]);
  const [account, setAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [userId, setUserId] = useState("");

  //Tokin info
  const [NoOfToken, setNoOfToken] = useState("");
  const [TokenName, setTokenName] = useState("");
  const [TokenStandard, setTokenStandard] = useState("");
  const [TokenSymbol, setTokenSymbol] = useState("");
  const [TokenOwner, setTokenOwner] = useState("");
  const [TokenOwnerBal, setTokenOwnerBal] = useState("");

  //Connecting wallet to application
  const checkConnection = async()=>{
    try {
      if(!window.ethereum) return console.log("Install MetaMask");

      const accounts = await window.ethereum.request({method: "eth_accounts"});
      setAccount(accounts[0]);

      //Creating connection to contaract and fetch data.
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContractERC20(signer);

      //Get all token holders.
      const allTokenHolder = await contract.tokenBalance(accounts[0]);
      setAccountBalance(allTokenHolder.toNumber());

      const totalHolders = await contract._userId();
      setUserId(totalHolders.toNumber());


    }catch(error){
      console.log("Unable to connect to application")
    }
  };

  //ERC20 Token Contract
  const ERC20DepaToken = async () =>{
    try{

      //contract connection.
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
      const contract = fetchContractERC20(signer);

      //Supplying Tokens.
      const supply = await contract.totalSupply();
      const totalSupply = supply.toNumber();
      setNoOfToken(totalSupply);

      //get token Name.
      const name = await contract.name();
      setTokenName(name);

      //Token symbol
      const symbol = await contract.symbol();
      setTokenSymbol(symbol);

      //Token standard.
      const standard = await contract.standard();
      setTokenStandard(standard);

      //Token owner'scontract.
      const ownerOfContract = await contract.ownerOfContract();
      setTokenOwner(ownerOfContract);

      //Owners token balance.
      const balanceOfToken = await contract.tokenBalance("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
      setTokenOwnerBal(balanceOfToken.toNumber());

    } catch (error){
      console.log("Errors in ERC20 token");
    }
  };

  //Transfering Token.
  const transferToken = async () =>{
    try {
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContractERC20(signer);

      //Tranfer functions.
      const transfer = await contract.transfer(address, BigInt(value * 1));
      transfer.wait();

      window.location.wait();


    }catch (error) {
      console.log("oops something went wrong while transfering token");
    }
  };

  //Getting token holders datas.
  const tokenHolderData = async()=>{
    try{
      const web3modal = new Web3Modal();
      const connection = await web3modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();
      const contract = fetchContractERC20(signer);

      const allTokenholder = await contract.getTokenHolder();

      allTokenholder.map(async (el) => {
        const singleholderData = await contract.getTokenHolderData(el);
        holderArray.push(singleholderData);
        console.log(holderArray);
      });


    } catch (error){
      console.log("something went wrong while fetching data");
    }
  };


  return(
    <ERC20ICOContext.Provider value={{
      depaToken, checkConnection,
      ERC20DepaToken, transferToken,
      tokenHolderData, account,
      accountBalance, userId,
      NoOfToken, TokenName,
      TokenStandard, TokenSymbol,
      TokenOwner, TokenOwnerBal, holderArray
      }}
    >
      {children}
    </ERC20ICOContext.Provider>

  );
};