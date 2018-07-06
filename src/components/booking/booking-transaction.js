import React from "react";
import ReactDOM from "react-dom";
import Select from "react-select";

import { Row, Col, Table } from "@sketchpixy/rubix";
import AppUtil from "../../common/util.js";

export default class BookingTransaction extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: this.props.transactions
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      transactions: nextProps.transactions
    });
  }

  render() {
    let { transactions } = this.state;
    let transactionsExist = transactions && typeof transactions.map == "function";
    return (
      <Row>
        <Col md={12}>
          <h4 className="section-form-title">Transactions</h4>
        </Col>
        <Col sm={3} />
        <Col sm={9}>
          <Table bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Transaction Date</th>
              </tr>
            </thead>
            <tbody>
              {transactionsExist &&
                transactions.map((transaction, index) => {
                  return (
                    <tr key={index}>
                      <td>{transaction.id}</td>
                      <td>
                        {(() => {
                          if (transaction.source == "stripe") {
                            return "···· " + transaction.card_last4;
                          } else {
                            return transaction.source;
                          }
                        })()}
                      </td>
                      <td className="text-right">{AppUtil.currencyFormatter().format(transaction.amount)}</td>
                      <td>{transaction.description}</td>
                      <td>{transaction.created_at}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </Col>
      </Row>
    );
  }
}
