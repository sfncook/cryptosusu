import React, { Component } from 'react'
import contract from 'truffle-contract'

import SusuContract from '../../build/contracts/Susu.json'
import getWeb3 from '../utils/getWeb3'

import '../App.css'

class DeployPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null
    }
  }

  componentWillMount() {
    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });
      })
      .catch(() => {
        console.log('Error finding web3.');
      })
  }

  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1" style={{paddingTop:'15px'}}>
            <table className="groupTable">
              <tbody>
              <tr id="memberTemplate">
                <th>Group Name:</th>
                <td><input/></td>
              </tr>
              <tr id="memberTemplate">
                <th>Many Partners:</th>
                <td><input/></td>
              </tr>
              <tr id="memberTemplate">
                <th>Payout Frequency:</th>
                <td><input/></td>
              </tr>
              <tr id="memberTemplate">
                <th>Contribution Amt (eth):</th>
                <td><input/></td>
              </tr>
              </tbody>
            </table>

            <div className="pure-u-1-1">
              <button onClick={(e)=>{this.clickCreate(e)}} className="btn-contribute" type="button" data-id="0">Create New Susu Group</button>
            </div>
          </div>
        </div>
      </main>
    );
  }// render()

  clickCreate(e) {
    e.preventDefault();
    console.log('create clicked');
    console.log('web3.eth:',this.state.web3.eth);
    const susuContract = contract(SusuContract);
    const { unlinked_binary, abi } = susuContract;
    const newContract = this.state.web3.eth.contract(abi)
    const options = { from: this.state.web3.eth.accounts[0], data: unlinked_binary, gas: 10000000 }

    newContract.new(options, this.newContractCallback())
  }

  newContractCallback() {
    return (err, contract) => {
      const { address } = contract;
      if(typeof address !== 'undefined' ) {
        console.log('#1 err:', err,' contract:',contract);
        contract.displayMessage.call((obj1, obj2, obj3)=>{
          console.log('obj1:',obj1,' obj2:', obj2, ' obj3:', obj3);
          return 'asdf';
        });
        
        // console.log('#1 err:', err,' contract:',contract);
        // console.log('#2 address:',address);
        // this.state.web3.eth.getTransaction(transactionHash, (err, transaction) => {
        //   console.log('#3 err:', err,' transaction:',transaction);
        // })
      }
    }
  }
}

DeployPage.defaultProps = {
};

export default DeployPage
