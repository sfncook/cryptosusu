import React, { Component } from 'react'
import contract from 'truffle-contract'

import getWeb3 from '../utils/getWeb3'

import '../App.css'
import SusuParentContract from "../../build/contracts/SusuParent";
import SusuOrigContract from "../../build/contracts/SusuOrig";
import SusuContract from "../../build/contracts/Susu";
import {BigNumber} from "bignumber.js";

class DeployPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      isLoading: false,
      susuParentContract: null,
      susuContract: null,
      key:'',
    }
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        this.instantiateSusuContract();
      })
      .catch(() => {
        console.log('Error finding web3.');
      })
  }

  instantiateSusuContract() {
    const contract = require("truffle-contract");
    const susuParentContract = contract(SusuParentContract);
    const provider = new this.state.web3.providers.HttpProvider("http://127.0.0.1:7545");
    susuParentContract.setProvider(provider);
    this.setState({susuParentContract: susuParentContract});
  }

  render() {
    const disabled = this.state.isLoading ? 'btn-disabled' : '';
    const btnClasses = `${disabled} btn-contribute`;
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1" style={{paddingTop:'15px'}}>
            <button onClick={(e)=>{this.createSusu(e)}} className="btn-join" type="button">CREATE SUSU PARENT</button>
            <button onClick={(e)=>{this.getSusu(e)}} className="btn-join" type="button">GET SUSU</button>
            <button onClick={(e)=>{this.getSusuName(e)}} className="btn-join" type="button">GET SUSU NAME</button>
            <button onClick={(e)=>{this.getManyMembers(e)}} className="btn-join" type="button">getManyMembers</button>
            <table className="groupTable">
              <tbody>
              <tr id="memberTemplate">
                <th>Group Name:</th>
                <td><input id={'group_name'}/></td>
              </tr>
              <tr id="memberTemplate">
                <th>Many Partners:</th>
                <td><input id={'group_size'}/></td>
              </tr>
              <tr id="memberTemplate">
                <th>Contribution Amt (eth):</th>
                <td><input id={'contrib_amt'}/></td>
              </tr>
              </tbody>
            </table>

            <div className="pure-u-1-1">
              <button onClick={(e)=>{this.clickCreate(e)}} className={btnClasses} type="button" data-id="0" hidden={this.state.isLoading}>Create New Susu Group</button>
            </div>
            <h1 hidden={!this.state.isLoading} className={"please-wait"}>Deploying Contract.  Please wait</h1>
          </div>
        </div>
      </main>
    );
  }// render()


  createSusu(e) {
    e.preventDefault();
    this.state.susuParentContract.deployed().then((instance)=>{
      const milliseconds = (new Date()).getTime();
      const key = 'key_'+milliseconds;
      const name = 'name_'+milliseconds;
      console.log('key:',key);
      this.setState({key: key});
      const options = { from: this.state.web3.eth.accounts[0], gas: 1000000 }
      return instance.createSusu(key, 2, name, 1, options);
    }).then((result)=>{console.log('result:',result);});
  }

  getSusu(e) {
    e.preventDefault();
    this.state.susuParentContract.deployed().then((instance)=>{
      return instance.getSusu.call(this.state.key);
    }).then((susuContractAddress)=>{
      console.log('susuContractAddress:',susuContractAddress);
      const susuContract = this.state.web3.eth.contract(SusuContract.abi).at(susuContractAddress);
      this.setState({susuContract: susuContract});
    });
  }

  getSusuName(e) {
    e.preventDefault();
    this.state.susuContract.getGroupName((err, groupName)=>{
      console.log('err:',err, ' groupName:', groupName);
    });
  }

  getManyMembers(e) {
    e.preventDefault();
    this.state.susuContract.getManyMembers((err, getManyMembersBig)=>{
      let bigNumber = new BigNumber(getManyMembersBig);
      const getManyMembers = bigNumber.toNumber();
      console.log('err:',err, ' getManyMembers:', getManyMembers);
    });
  }

  clickCreate(e) {
    e.preventDefault();
    this.setState({isLoading:true});
    const susuContract = contract(SusuOrigContract);
    const { unlinked_binary, abi } = susuContract;
    const newContract = this.state.web3.eth.contract(abi)
    const options = { from: this.state.web3.eth.accounts[0], data: unlinked_binary, gas: 2000000 }

    const groupSize = document.getElementById('group_size').value;
    const groupName = document.getElementById('group_name').value;
    const contribAmtEth = document.getElementById('contrib_amt').value;
    const contribAmtWei = this.state.web3.toWei(contribAmtEth, 'ether');
    newContract.new(groupSize, groupName, contribAmtWei, options, this.newContractCallback())
  }

  newContractCallback() {
    return (err, newContract) => {
      const { address } = newContract;
      if(typeof address !== 'undefined' ) {
        window.location.href = '/'+address;
      }
    }
  }
}

DeployPage.defaultProps = {
};

export default DeployPage
