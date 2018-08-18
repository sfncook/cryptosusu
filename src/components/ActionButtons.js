import React, { Component } from 'react'

import '../App.css'

class ActionButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading:false,
      isError:false,
    }
  }

  render() {
    const iOwe = this.props.myContrib < this.props.contribAmt;
    let btns = [];
    let contributeBtn = <button key='contributeBtn' onClick={(e)=>{this.clickContribute(e)}} className={iOwe ? 'btn-contribute' : 'btn-contribute btn-disabled'} type="button" disabled={!iOwe}>Pay Your Share</button>;
    let pullPayOutBtn = <button key='pullPayOutBtn' onClick={(e)=>{this.clickPullPayOut(e)}} className={this.props.isReadyToPayout ? 'btn-pay' : 'btn-pay btn-disabled'} disabled={!this.props.isReadyToPayout} type="button">Pull Pay Out</button>;
    let joinBtn = <button key='joinBtn' onClick={(e)=>{this.clickJoin(e)}} className="btn-join" type="button">Join</button>;
    let upgradeBtn = <button key='upgradeBtn' onClick={(e)=>{this.clickUpgrade(e)}} className="btn-join" type="button">Upgrade Susu Contract</button>;

    if(!this.props.isGroupFull && !this.props.isMember){
      btns.push(joinBtn);
    } else if(this.props.isGroupFull && !this.props.isMember) {
      btns.push(<h1 key='full'>Group is FULL</h1>);
    } else if(this.props.isMember) {
      btns.push(contributeBtn);
      if(this.props.isMemberToPayNext) {
        btns.push(pullPayOutBtn);
      }
      if(this.props.isOwner) {
        btns.push(upgradeBtn);
      }
    }

    return (
      <div className="pure-u-1-1">
        <h1 hidden={!this.state.isLoading} className={"please-wait"}>Please wait</h1>
        <h1 hidden={!this.state.isError} className={'error'}>ERRORS exist! Please checkout JS console</h1>
        <div>{btns}</div>
      </div>
    );
  }// render()

  clickContribute(e) {
    e.preventDefault();
    this.setState({isLoading:true});

    this.props.web3.eth.sendTransaction(
      {
        from:this.props.myAddress,
        to:this.props.susuContract.address,
        value:this.props.web3.toWei(this.props.contribAmt, "ether"),
        gas:2000000
      },
      (err)=>{
        this.setState({isLoading:false});
        if(typeof err === 'undefined' || !err) {
          location.reload();
        } else {
          this.setState({isError:true});
          console.error(err);
        }
      });
  }

  clickPullPayOut(e) {
    e.preventDefault();
    this.setState({isLoading:true});
    this.props.susuContract.pullPayOut(
      {from:this.props.myAddress, gas:100000},
      (err)=>{
        this.setState({isLoading:false});
        if(typeof err === 'undefined' || !err) {
          location.reload();
        } else {
          this.setState({isError:true});
          console.error(err);
        }
      }
    );
  }

  clickJoin(e) {
    e.preventDefault();
    this.setState({isLoading:true});
    this.props.susuContract.joinGroup(
      {from:this.props.myAddress, gas:200000},
      (err)=>{
        this.setState({isLoading:false});
        if(typeof err === 'undefined' || !err) {
          location.reload();
        } else {
          this.setState({isError:true});
          console.error(err);
        }
      }
    );
  }

  clickUpgrade(e) {
    e.preventDefault();
    this.setState({isLoading:true});
    this.props.susuParentContract.deployed().then((instance)=>{
      const options = { from: this.props.myAddress, gas: 2000000 };
      return instance.upgradeSusu(this.props.groupName, options);
    }).then((a,b)=>{
      location.reload();
    });
  }
}

ActionButtons.defaultProps = {
  isOwner: false,
  isGroupFull: false,
  isGroupTerminated: false,
  isMember: false,
  susuContract: null,
  susuParentContract: null,
  myAddress: '',
  web3:null,
  contribAmt:0.0,
  myContrib:0.0,
  isReadyToPayout:false,
  isMemberToPayNext:false,
  groupName: '',
};

export default ActionButtons
