import React, { Component } from 'react'
import contract from 'truffle-contract'

import getWeb3 from '../utils/getWeb3'

import '../App.css'
import SusuParentContract from "../../build/contracts/SusuParent";
import SusuOrigContract from "../../build/contracts/SusuOrig";
import SusuContract from "../../build/contracts/Susu";
// import {BigNumber} from "bignumber.js";

class DeployPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      isLoading: false,
      susuParentContract: null,
      susuContract1: null,
      susuContract2: null,
      key:'key',
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

    console.log('accounts:',this.state.web3.eth.accounts);
  }

  render() {
    const disabled = this.state.isLoading ? 'btn-disabled' : '';
    const btnClasses = `${disabled} btn-contribute`;
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1" style={{paddingTop:'15px'}}>
            <button onClick={(e)=>{this.createSusu(e)}} className="btn-join" type="button">createSusu</button>
            <button onClick={(e)=>{this.setSusu1(e)}} className="btn-join" type="button">setSusu1</button>
            <button onClick={(e)=>{this.upgradeSusu(e)}} className="btn-join" type="button">upgradeSusu</button>
            <button onClick={(e)=>{this.setSusu2(e)}} className="btn-join" type="button">setSusu2</button>
            <button onClick={(e)=>{this.version1(e)}} className="btn-join" type="button">version1</button>
            <button onClick={(e)=>{this.version2(e)}} className="btn-join" type="button">version2</button>
            {/*<button onClick={(e)=>{this.createSusu(e)}} className="btn-join" type="button">CREATE SUSU PARENT</button>*/}
            {/*<button onClick={(e)=>{this.setSusu(e)}} className="btn-join" type="button">SET SUSU CONTRACT</button>*/}
            {/*<button onClick={(e)=>{this.setSusu_old(e)}} className="btn-join" type="button">setSusu_old</button>*/}
            {/*<button onClick={(e)=>{this.groupName(e)}} className="btn-join" type="button">groupName</button>*/}
            {/*<button onClick={(e)=>{this.getManyMembers(e)}} className="btn-join" type="button">getManyMembers</button>*/}
            {/*<button onClick={(e)=>{this.getMemberAtIndex0(e)}} className="btn-join" type="button">getMemberAtIndex0</button>*/}
            {/*<button onClick={(e)=>{this.getMemberAtIndex1(e)}} className="btn-join" type="button">getMemberAtIndex1</button>*/}
            {/*<button onClick={(e)=>{this.owner(e)}} className="btn-join" type="button">owner</button>*/}
            {/*<button onClick={(e)=>{this.amIOwner(e)}} className="btn-join" type="button">amIOwner</button>*/}
            {/*<button onClick={(e)=>{this.joinGroup(e)}} className="btn-join" type="button">joinGroup</button>*/}
            {/*<button onClick={(e)=>{this.getContributionForMember(e)}} className="btn-join" type="button">getContributionForMember</button>*/}
            {/*<button onClick={(e)=>{this.foo(e)}} className="btn-join" type="button">foo</button>*/}
            {/*<button onClick={(e)=>{this.version_old(e)}} className="btn-join" type="button">version_old</button>*/}
            {/*<button onClick={(e)=>{this.version_new(e)}} className="btn-join" type="button">version_new</button>*/}
            {/*<button onClick={(e)=>{this.upgradeSusu(e)}} className="btn-join" type="button">upgradeSusu</button>*/}
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
      const options = { from: this.state.web3.eth.accounts[0], gas: 2000000 };
      return instance.createSusu(this.state.key, 2, name, 1, options);
    }).then((result)=>{console.log('createSusu result:',result);});
  }

  setSusu1(e) {
    e.preventDefault();
    this.state.susuParentContract.deployed().then((instance)=>{
      return instance.getSusu.call(this.state.key);
    }).then((susuContractAddress)=>{
      console.log('susuContractAddress:',susuContractAddress);
      const susuContract = this.state.web3.eth.contract(SusuContract.abi).at(susuContractAddress);
      this.setState({susuContract1: susuContract});
    });
  }

  upgradeSusu(e) {
    e.preventDefault();
    this.state.susuParentContract.deployed().then((instance)=>{
      const options = { from: this.state.web3.eth.accounts[0], gas: 2000000 };
      return instance.createSusu(this.state.key, 2, name, 1, options);
    }).then((result)=>{console.log('createSusu result:',result);});
  }

  setSusu2(e) {
    e.preventDefault();
    this.state.susuParentContract.deployed().then((instance)=>{
      return instance.getSusu.call(this.state.key);
    }).then((susuContractAddress)=>{
      console.log('susuContractAddress:',susuContractAddress);
      const susuContract = this.state.web3.eth.contract(SusuContract.abi).at(susuContractAddress);
      this.setState({susuContract2: susuContract});
    });
  }

  // foo(e) {
  //   e.preventDefault();
  //   this.state.susuContract.foo((err, foo)=>{
  //     console.log('err:',err, ' foo:', foo);
  //   });
  // }

  version1(e) {
    e.preventDefault();
    this.state.susuContract1.version((err, version1)=>{
      console.log('err:',err, ' version1:', version1);
    });
  }

  version2(e) {
    e.preventDefault();
    this.state.susuContract2.version((err, version2)=>{
      console.log('err:',err, ' version2:', version2);
    });
  }

  // groupName(e) {
  //   e.preventDefault();
  //   this.state.susuContract.groupName((err, groupName)=>{
  //     console.log('err:',err, ' groupName:', groupName);
  //   });
  // }
  //
  // getManyMembers(e) {
  //   e.preventDefault();
  //   this.state.susuContract.getManyMembers((err, getManyMembersBig)=>{
  //     let bigNumber = new BigNumber(getManyMembersBig);
  //     const getManyMembers = bigNumber.toNumber();
  //     console.log('err:',err, ' getManyMembers:', getManyMembers);
  //   });
  // }
  //
  // getContributionForMember(e) {
  //   e.preventDefault();
  //   this.state.susuContract.getContributionForMember(this.state.web3.eth.accounts[0], (err, getContributionForMemberBig)=>{
  //     let bigNumber = new BigNumber(getContributionForMemberBig);
  //     const getContributionForMember = bigNumber.toNumber();
  //     console.log('err:',err, ' getContributionForMember:', getContributionForMember);
  //   });
  // }
  //
  // getMemberAtIndex0(e) {
  //   e.preventDefault();
  //   this.state.susuContract.getMemberAtIndex(0, (err, memberAddress)=>{
  //     console.log('err:',err, ' memberAddress0:', memberAddress);
  //   });
  // }
  //
  // getMemberAtIndex1(e) {
  //   e.preventDefault();
  //   this.state.susuContract.getMemberAtIndex(1, (err, memberAddress)=>{
  //     console.log('err:',err, ' memberAddress1:', memberAddress);
  //   });
  // }
  //
  // owner(e) {
  //   e.preventDefault();
  //   const options = {from: this.state.web3.eth.accounts[0]};
  //   this.state.susuContract.owner(options, (err, owner)=>{
  //     console.log('err:',err, ' owner:', owner, ' =?me', (owner===this.state.web3.eth.accounts[0]));
  //   });
  // }
  //
  // amIOwner(e) {
  //   e.preventDefault();
  //   const options = {from: this.state.web3.eth.accounts[0]};
  //   this.state.susuContract.amIOwner(options, (err, amIOwner)=>{
  //     console.log('err:',err, ' amIOwner:', amIOwner);
  //   });
  // }
  //
  // joinGroup(e) {
  //   e.preventDefault();
  //   const options = {from: this.state.web3.eth.accounts[0], gas: 2000000};
  //   this.state.susuContract.joinGroup(options, (err, resp)=>{console.log('err:',err, ' resp:', resp);});
  // }

  clickCreate(e) {
    e.preventDefault();
    this.setState({isLoading:true});
    const susuContract = contract(SusuOrigContract);
    const { unlinked_binary, abi } = susuContract;
    const newContract = this.state.web3.eth.contract(abi);
    const options = { from: this.state.web3.eth.accounts[0], data: unlinked_binary, gas: 2000000 };

    const groupSize = document.getElementById('group_size').value;
    const groupName = document.getElementById('group_name').value;
    const contribAmtEth = document.getElementById('contrib_amt').value;
    const contribAmtWei = this.state.web3.toWei(contribAmtEth, 'ether');
    newContract.new(groupSize, groupName, contribAmtWei, options, this.newContractCallback());
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
