import React, { Component } from 'react'

import '../App.css'

class ActionButtons extends Component {

  render() {
    let btns = [];
    let contributeBtn = <button key='contributeBtn' onClick={(e)=>{this.clickContribute(e)}} className="btn-contribute" type="button">Pay Your Share</button>;
    let leaveBtn = <button key='leaveBtn' onClick={(e)=>{this.clickLeave(e)}} className="btn-leave" type="button">Leave Group</button>;
    let payOutBtn = <button key='payOutBtn' onClick={(e)=>{this.clickPayOut(e)}} className="btn-pay" type="button">Pay Out</button>;
    let terminateBtn = <button key='terminateBtn' onClick={(e)=>{this.clickTerminate(e)}} className="btn-terminate" type="button">Terminate</button>;
    let joinBtn = <button key='joinBtn' onClick={(e)=>{this.clickJoin(e)}} className="btn-join" type="button">Join</button>;

    if(!this.props.isGroupFull && !this.props.isMember){
      btns.push(joinBtn);
    } else if(this.props.isGroupFull && !this.props.isMember) {
      btns.push(<h1 key='full'>Group is FULL</h1>);
    } else if(!this.props.isGroupFull && this.props.isMember) {
      btns.push(contributeBtn);
      btns.push(leaveBtn);
      if(this.props.isOwner) {
        btns.push(payOutBtn);
        btns.push(terminateBtn);
      }
    } else if(this.props.isGroupFull && this.props.isMember) {
      btns.push(contributeBtn);
      btns.push(leaveBtn);
      if(this.props.isOwner) {
        btns.push(payOutBtn);
        btns.push(terminateBtn);
      }
    }

    return (
      <div className="pure-u-1-1">
        {btns}
      </div>
    );
  }// render()

  clickContribute(e) {
    e.preventDefault();
    console.log('contribute clicked');
  }

  clickLeave(e) {
    e.preventDefault();
    console.log('leave clicked');
  }

  clickPayOut(e) {
    e.preventDefault();
    console.log('payout clicked');
  }

  clickTerminate(e) {
    e.preventDefault();
    console.log('terminate clicked');
  }

  clickJoin(e) {
    e.preventDefault();
    this.props.susuContract.joinGroup(
      {from:this.props.myAddress, gas:60000},
      (err, response)=>{console.log('err:',err,' response:',response);}
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
};

export default ActionButtons
