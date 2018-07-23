import React, { Component } from 'react'

import '../App.css'

class GroupInfo extends Component {

  render() {
    return (
      <table className="groupTable">
        <tbody>
          <tr>
            <th>Group Name:</th>
            <td>{this.props.groupName}</td>
          </tr>
          <tr>
            <th>Payout Frequency:</th>
            <td>{this.props.payoutFrequency}</td>
          </tr>
          <tr>
            <th>Contribution Amt (eth):</th>
            <td>{this.props.contribAmt}</td>
          </tr>
        </tbody>
      </table>
    );
  }// render()

}

GroupInfo.defaultProps = {
  groupName: 'groupName not set',
  payoutFrequency: 'payoutFrequency not set',
  contribAmt: -1,
};

export default GroupInfo
