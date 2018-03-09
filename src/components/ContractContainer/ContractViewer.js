import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ContractViewer.css';
import GameView from '../GameView';
import Abi from './contractAbi.json';
import StockView from '../StockView';


var Web3 = require('web3');

class ContractViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ContractInstance: {},
            price: 0,
            contractBalance: 0,
            tokenSupply: 0,
        };
        this.getBuyPrice =  this.getBuyPrice.bind(this);
        this.buy = this.buy.bind(this);
        this.sell = this.sell.bind(this);
        this.reinvest = this.reinvest.bind(this);
        this.withdraw = this.withdraw.bind(this);
        this.getout = this.getout.bind(this);
      }

    componentDidMount () { // Replace current shit with new contracts/event listeners
        if (typeof Web3 != 'undefined') {
          console.log("Using web3 detected from external source like Metamask");
          web3 = new Web3(window.web3.currentProvider); // This is where it listens to metamask
        }else{
          console.log('use metamask!');
          this.web3 = new Web3(new web3.providers.HttpProvider("http://localhost:8545")); // Not to be used.
        }
        
        const MyContract = web3.eth.contract(Abi);
        
        var ContractInstance = MyContract.at(this.props.contractAddress);
        
        console.log(ContractInstance);
        // var newGameEvent = ContractInstance.newGame({},{fromBlock: 0, toBlock: 'latest'});
        
        this.setState({
            ownerAccount: web3.eth.accounts[0]
        });
        
        this.getBuyPrice(ContractInstance);
        }
        
    getBuyPrice(ContractInstance) { //Returns total number (not -1)
        let answer;
        this.setState({ContractInstance});
       
            ContractInstance.buyPrice({from: this.state.ownerAccount}, function(error, result) {
                if (error) {
                console.error(error);
                }
                else {
                    //console.log('price: ', web3.toWei(result.c[1]));
                this.setState({ price: web3.fromWei(result.c[1]) })
                }
            }.bind(this));
            
            ContractInstance.balanceOf(web3.eth.accounts[0], {from: this.state.ownerAccount}, function(error, result) {
                if (error) {
                console.error(error);
                }
                else {
                    //console.log('balance: ', result.c[0])
                this.setState({ contractBalance: result.c[0] })
                }
            }.bind(this));

            ContractInstance.totalSupply({from: this.state.ownerAccount}, function(error, result) {
                if (error) {
                console.error(error);
                }
                else {
                    //console.log('token: ', result.c[0])
                this.setState({ tokenSupply: result.c[0] })
                }
            }.bind(this));
    }
    
  buy() {
    let _amountToSendInWei = web3.toWei(0.000001);
    web3.eth.contract(Abi).at(this.props.contractAddress).fund({from: this.state.ownerAccount, value: _amountToSendInWei}, function(error, result) {
        if (error) {
        console.error(error);
        }
        else {
        console.log('result: ', result);
        }
    });
  }

  sell() { // No parameter, sells all. Must withdraw() to get ether. GetMeOutOfHere is sell->withdraw
    let _amountToSendInWei = web3.toWei(0.000001);
    web3.eth.contract(Abi).at(this.props.contractAddress).sellMyTokens({from: this.state.ownerAccount}, function(error, result) {
        if (error) {
        console.error(error);
        }
        else {
        console.log('result: ', result);
        }
    });
  }

  reinvest() {
    let _amountToSendInWei = web3.toWei(0.000001);
    web3.eth.contract(Abi).at(this.props.contractAddress).reinvestDividends({from: this.state.ownerAccount}, function(error, result) {
        if (error) {
        console.error(error);
        }
        else {
        console.log('result: ', result);
        }
    });
  }

  withdraw() {
    let _amountToSendInWei = web3.toWei(0.000001);
    web3.eth.contract(Abi).at(this.props.contractAddress).withdraw({from: this.state.ownerAccount}, function(error, result) {
        if (error) {
        console.error(error);
        }
        else {
        console.log('result: ', result);
        }
    });
  }

  getout() {
    let _amountToSendInWei = web3.toWei(0.000001);
    web3.eth.contract(Abi).at(this.props.contractAddress).getMeOutOfHere({from: this.state.ownerAccount}, function(error, result) {
        if (error) {
        console.error(error);
        }
        else {
        console.log('result: ', result);
        }
    });
  }

  render() {
      var outerWrapper = {
        height: '500px',
        display: 'block',
        position: 'relative',
      };
      
    return ( // This is where we put stocks. Will be dynamic very soon.
      <div style={outerWrapper}>
        <StockView buy={this.buy} price= {this.state.price} stockName={this.props.stockName} shares={this.state.price} tokenSupply={this.state.tokenSupply} />
      </div>
    );
  }
}

export default withStyles(s)(ContractViewer);