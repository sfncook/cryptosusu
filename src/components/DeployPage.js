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
    const options = { from: this.state.web3.eth.accounts[0], data: unlinked_binary, gas: 10000000 }

    newContract.new(options, this.newContractCallback())
  }

  newContractCallback() {
    return (err, newContract) => {
      const { address } = newContract;
      if(typeof address !== 'undefined' ) {
        window.location.href = '/'+address;
        // console.log('#1 err:', err,' newContract:',newContract);
        // newContract.displayMessage.call((obj1, obj2, obj3)=>{
        //   console.log('obj1:',obj1,' obj2:', obj2, ' obj3:', obj3);
        // });
      }
    }
  }
}

DeployPage.defaultProps = {
};

export default DeployPage
