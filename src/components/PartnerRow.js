import React, { Component } from 'react'

import '../App.css'

class PartnerRow extends Component {

  render() {
    console.log('PartnerRow props:', this.props);
    return (
      <tr className={(this.props.myAddress===this.props.partnerAddress?'tr-my-account':'')}>
        <td>{this.props.isOwner ? 'Owner' : ''}</td>
        <td>{this.props.partnerAddress}</td>
        <td className={this.getTdContribColor(this.props.partnerContrib)}>
          {this.props.partnerContrib} ether
        </td>
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
  contractContrib: 1.0
};

export default PartnerRow
