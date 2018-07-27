import React, { Component } from 'react'
import contract from 'truffle-contract'

import SusuContract from '../../build/contracts/Susu.json'
import getWeb3 from '../utils/getWeb3'

import '../App.css'

class DeployPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      isLoading: false,
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
    const disabled = this.state.isLoading ? 'btn-disabled' : '';
    const btnClasses = `${disabled} btn-contribute`;
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1" style={{paddingTop:'15px'}}>
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

  clickCreate(e) {
    e.preventDefault();
    this.setState({isLoading:true});
    const susuContract = contract(SusuContract);
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
