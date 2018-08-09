import React, { Component } from 'react'

import '../App.css'

class PartnerRow extends Component {

  render() {
    return (
      <tr>
        <td>{this.props.myAddress===this.props.partnerAddress?'(me) ':''}{this.props.isOwner ? 'Owner' : 'Partner'}</td>
        <td>{this.props.partnerAddress}</td>
        <td className={this.getTdContribColor(this.props.partnerContrib)}>
          {this.props.partnerContrib} ether
        </td>
        <td>{this.props.isMemberToPayNext?'(next) ':''}</td>
      </tr>
    );
  }// render()

  getTdContribColor(memberContrib) {
    if(this.props.contractContrib <= memberContrib) {
      return 'td-contrib-green';
    } else if(this.props.contractContrib > memberContrib && 0 < memberContrib) {
      return 'td-contrib-yellow';
    } else {
      return 'td-contrib-red';
    }
  }
}

PartnerRow.defaultProps = {
  myAddress: 'myAddress - not set',
  partnerAddress: 'partnerAddress - not set',
  isOwner: false,
  partnerContrib: 0.0,
  contractContrib: 1.0,
  isMemberToPayNext:false,
};

export default PartnerRow
