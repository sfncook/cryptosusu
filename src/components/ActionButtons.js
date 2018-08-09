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
    // let leaveBtn = <button key='leaveBtn' onClick={(e)=>{this.clickLeave(e)}} className="btn-leave" type="button">Leave Group</button>;
    let payOutBtn = <button key='payOutBtn' onClick={(e)=>{this.clickPayOut(e)}} className={this.props.isReadyToPayout ? 'btn-pay' : 'btn-pay btn-disabled'} disabled={!this.props.isReadyToPayout} type="button">Pay Out</button>;
    // let terminateBtn = <button key='terminateBtn' onClick={(e)=>{this.clickTerminate(e)}} className="btn-terminate" type="button">Terminate</button>;
    let joinBtn = <button key='joinBtn' onClick={(e)=>{this.clickJoin(e)}} className="btn-join" type="button">Join</button>;

    if(!this.props.isGroupFull && !this.props.isMember){
      btns.push(joinBtn);
    } else if(this.props.isGroupFull && !this.props.isMember) {
      btns.push(<h1 key='full'>Group is FULL</h1>);
    } else if(!this.props.isGroupFull && this.props.isMember) {
      btns.push(contributeBtn);
      // btns.push(leaveBtn);
      if(this.props.isOwner) {
        btns.push(payOutBtn);
        // btns.push(terminateBtn);
      }
    } else if(this.props.isGroupFull && this.props.isMember) {
      btns.push(contributeBtn);
      // btns.push(leaveBtn);
      if(this.props.isOwner) {
        btns.push(payOutBtn);
        // btns.push(terminateBtn);
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
        gas:60000
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

  clickLeave(e) {
    e.preventDefault();
    console.log('leave clicked');
  }

  clickPayOut(e) {
    e.preventDefault();
    this.setState({isLoading:true});
    this.props.susuContract.payOut(
      {from:this.props.myAddress, gas:100000},
      (err, response)=>{
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

  clickTerminate(e) {
    e.preventDefault();
    console.log('terminate clicked');
  }

  clickJoin(e) {
    e.preventDefault();
    this.setState({isLoading:true});
    this.props.susuContract.joinGroup(
      {from:this.props.myAddress, gas:60000},
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
}

ActionButtons.defaultProps = {
  isOwner: false,
  isGroupFull: false,
  isGroupTerminated: false,
  isMember: false,
  susuContract: null,
  myAddress: '',
  web3:null,
  contribAmt:0.0,
  myContrib:0.0,
  isReadyToPayout:false,
  isMemberToPayNext:false,
};

export default ActionButtons
