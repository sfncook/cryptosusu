import React, { Component } from 'react'

// import SusuOrigContract from '../../build/contracts/SusuOrig.json'
import getWeb3 from '../utils/getWeb3'
import {BigNumber} from 'bignumber.js';

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import PartnerRow from "./PartnerRow";
import GroupInfo from "./GroupInfo";
import ActionButtons from "./ActionButtons";
import PartnerRowEmpty from "./PartnerRowEmpty";
import SusuParentContract from "../../build/contracts/SusuParent";
import SusuContract from "../../build/contracts/Susu";

class GroupPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      susuContract: null,
      susuParentContract: null,
      myAddress: '',
      contribAmt: 0,
      payoutFrequency: 'monthly',
      manyMembers: 0,
      groupSize: 0,
      ownerAddress: '',
      partnerObjects: [],
      groupName: props.match.params.groupName,
      myContrib:0.0,
      memberAddrToPayNext:0,
      susuContractAddress: '',
      susuContractVersion: '',
    }
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        this.instantiateContract();
      })
      .catch((err) => {
        console.log('Error finding web3. err:',err);
      })
  }

  instantiateContract() {
    const contract = require("truffle-contract");
    const susuParentContract = contract(SusuParentContract);
    const provider = new this.state.web3.providers.HttpProvider("http://127.0.0.1:7545");
    susuParentContract.setProvider(provider);
    this.setState({susuParentContract: susuParentContract});

    this.state.susuParentContract.deployed().then((instance)=>{
      return instance.getSusu.call(this.state.groupName);
    }).then((susuContractAddress)=>{
      const susuContract = this.state.web3.eth.contract(SusuContract.abi).at(susuContractAddress);
      this.setState({susuContract: susuContract});
      this.setState({susuContractAddress: susuContractAddress});
      this.initState();
    });
  }

  initState() {
    let _this = this;
    this.state.web3.eth.getAccounts(function(error, accounts) {
      const myAddress = accounts[0];
      _this.setState({myAddress: myAddress});
      _this.state.susuContract.getContributionForMember(myAddress, (err, contribAmtWei)=>{
        let bigNumber = new BigNumber(contribAmtWei);
        const contribAmt = _this.state.web3.fromWei(bigNumber, 'ether').toNumber();
        _this.setState({myContrib:contribAmt});
      });
    });

    // init partner objects array
    for(let i=0; i<this.state.groupSize; i++) {
      let partnerObjects = this.state.partnerObjects;
      partnerObjects.push({});
      this.setState({ partnerObjects: partnerObjects });
    }

    this.state.susuContract.groupName((err, groupName)=>{
      this.setState({groupName:groupName});
    });

    this.state.susuContract.version((err, susuContractVersion)=>{
      this.setState({susuContractVersion:susuContractVersion});
    });

    this.state.susuContract.memberIdxToPayNext((err, memberIdxToPayNextBig)=>{
      let bigNumber = new BigNumber(memberIdxToPayNextBig);
      const memberIdxToPayNext = bigNumber.toNumber();

      this.state.susuContract.getMemberAtIndex(memberIdxToPayNext, (err, memberAddrToPayNext)=>{
        this.setState({memberAddrToPayNext:memberAddrToPayNext});
      });
    });

    this.state.susuContract.contribAmtWei((err, contribAmtWei)=>{
      let bigNumber = new BigNumber(contribAmtWei);
      const contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
      this.setState({contribAmt:contribAmt});
    });

    this.state.susuContract.owner((err, ownerAddress)=>{
      this.setState({ownerAddress:ownerAddress});
      this.state.susuContract.getManyMembers((err, manyMembersBig)=>{
        let bigNumber = new BigNumber(manyMembersBig);
        const manyMembers = bigNumber.toNumber();
        this.setState({manyMembers:manyMembers});

        this.state.susuContract.groupSize((err, groupSizeBig)=>{
          let bigNumber = new BigNumber(groupSizeBig);
          const groupSize = bigNumber.toNumber();
          this.setState({groupSize:groupSize});

          for(var i=0; i<this.state.manyMembers; i++) {
            let newPartnerObj = {};
            let partnerObjects = this.state.partnerObjects;
            partnerObjects.push(newPartnerObj);
            this.setState({partnerObjects:partnerObjects});
            this.state.susuContract.getMemberAtIndex(i, this.setMemberAddressCallback(i));
          }
        });
      });
    });
  }

  render() {
    let isOwner = this.state.ownerAddress===this.state.myAddress;
    let isGroupFull = this.isGroupFull();
    let isGroupTerminated = false;
    let isMember = this.isMember();
    let isMemberToPayNext = this.state.memberAddrToPayNext===this.state.myAddress;
    let contractAddress = this.state.susuContractAddress;
    let contractVersion = this.state.susuContractVersion;

    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1" style={{paddingTop:'15px'}}>
            <GroupInfo groupName={this.state.groupName} contribAmt={this.state.contribAmt} contractAddress={contractAddress} contractVersion={contractVersion}/>
            <table className="memberTable">
              <tbody>
              {this.createPartnerRows()}
              {this.createEmptyPartnerRows()}
              </tbody>
            </table>
          </div>

          <ActionButtons
            isOwner={isOwner}
            isGroupFull={isGroupFull}
            isGroupTerminated={isGroupTerminated}
            isMember={isMember}
            susuContract={this.state.susuContract}
            susuParentContract={this.state.susuParentContract}
            myAddress={this.state.myAddress}
            web3={this.state.web3}
            contribAmt={this.state.contribAmt}
            myContrib={this.state.myContrib}
            isReadyToPayout={this.isReadyToPayout()}
            isMemberToPayNext={isMemberToPayNext}
            groupName={this.state.groupName}
          />

        </div>
      </main>
    );
  }// render()

  isReadyToPayout() {
    if(this.state.manyMembers===this.state.groupSize) {
      for(let partnerObj of this.state.partnerObjects) {
        if(partnerObj.contrib<this.state.contribAmt) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  setMemberAddressCallback(partnerIndex){
    return (err, partnerAddress)=>{
      let partnerObjects = this.state.partnerObjects;
      partnerObjects[partnerIndex].address = partnerAddress;
      this.setState({partnerObjects:partnerObjects});
      this.state.susuContract.getContributionForMember(partnerAddress, this.setMemberContribCallback(partnerIndex));
    }
  }

  setMemberContribCallback(partnerIndex){
    return (err, partnerContribWei)=>{
      let bigNumber = new BigNumber(partnerContribWei);
      const contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
      let partnerObjects = this.state.partnerObjects;
      partnerObjects[partnerIndex].contrib = contribAmt;
      this.setState({partnerObjects:partnerObjects});
    }
  }

  createPartnerRows() {
    let rows = [];

    let keyId = 1;
    for(let partnerObj of this.state.partnerObjects) {
      rows.push(
        <PartnerRow
          key={keyId++} // Required for ES6/React(?) array items
          myAddress={this.state.myAddress}
          partnerAddress={partnerObj.address}
          isOwner={this.state.ownerAddress===partnerObj.address}
          partnerContrib={partnerObj.contrib}
          contractContrib={this.state.contribAmt}
          isMemberToPayNext={this.state.memberAddrToPayNext===partnerObj.address}
        />
      );
    }
    return rows;
  }
  createEmptyPartnerRows() {
    let rows = [];

    for(var i=0; i<(this.state.groupSize - this.state.manyMembers); i++) {
      rows.push(
        <PartnerRowEmpty
          key={i} // Required for ES6/React(?) array items
        />
      );
    }
    return rows;
  }

  isGroupFull() {
    return this.state.manyMembers >= this.state.groupSize;
  }

  isMember() {
    for(let partnerObj of this.state.partnerObjects) {
      if(partnerObj.address ===  this.state.myAddress) {
        return true;
      }
    }
    return false;
  }
}

GroupPage.defaultProps = {
};

export default GroupPage
