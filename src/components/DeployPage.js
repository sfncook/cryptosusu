import React, { Component } from 'react'
import contract from 'truffle-contract'

import SusuOrigContract from '../../build/contracts/SusuOrig.json'
import getWeb3 from '../utils/getWeb3'

import '../App.css'
import SusuContract from "../../build/contracts/Susu";

class DeployPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      isLoading: false,
      susuContract: null,
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
    const susuContract = contract(SusuContract);
    const provider = new this.state.web3.providers.HttpProvider("http://127.0.0.1:7545");
    susuContract.setProvider(provider);
    this.setState({susuContract: susuContract});
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
    this.state.susuContract.deployed().then((instance)=>{
      const options = { from: this.state.web3.eth.accounts[0], gas: 1000000 }
      return instance.createSusu('key1', 2, 'name', 1, options);
    }).then((result)=>{console.log('result:',result);});
  }

  getSusu(e) {
    e.preventDefault();
    this.state.susuContract.deployed().then((instance)=>{
      return instance.getSusu.call('key1');
    }).then((result)=>{console.log('result:',result);});
  }

  getSusuName(e) {
    e.preventDefault();
    this.state.susuContract.deployed().then((instance)=>{
      return instance.getGroupName.call('key1');
    }).then((result)=>{console.log('result:',result);});
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
