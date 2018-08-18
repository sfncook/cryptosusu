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
            <th>Contribution Amt (eth):</th>
            <td>{this.props.contribAmt}</td>
          </tr>
          <tr>
            <th>Contract Address:</th>
            <td>{this.props.contractAddress}</td>
          </tr>
          <tr>
            <th>Contract Version:</th>
            <td>{this.props.contractVersion}</td>
          </tr>
          <tr>
            <th>Contract Balance:</th>
            <td>{this.props.contractBalance}</td>
          </tr>
        </tbody>
      </table>
    );
  }// render()

}

GroupInfo.defaultProps = {
  groupName: 'groupName not set',
  contribAmt: -1,
  contractAddress: 'contractAddress not set',
  contractVersion: 'contractVersion not set',
  contractBalance: 0,
};

export default GroupInfo
