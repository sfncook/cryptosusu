import React, { Component } from 'react'

import '../App.css'

class ActionButtons extends Component {

  render() {
    return (
      <div className="pure-u-1-1">
        <button onClick={(e)=>{this.clickContribute(e)}} className="btn-contribute" type="button" data-id="0">Contribute</button>
        <button onClick={(e)=>{this.clickLeave(e)}} className="btn-leave" type="button" data-id="0">Leave Group</button>
        <button onClick={(e)=>{this.clickPayOut(e)}} className={(this.props.isOwner)?'btn-pay':'btn-disabled'} type="button" data-id="0" disabled={!this.props.isOwner}>Pay Out</button>
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
}

ActionButtons.defaultProps = {
  isOwner: false,
  isGroupFull: false,
  isGroupTerminated: false,
  amIMember: false,
};

export default ActionButtons
