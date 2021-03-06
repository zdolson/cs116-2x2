  import React, { Component } from 'react'
  import { Stylesheet } from '../../stylesheet.js'
  import sheet from './checkOutTableItems.scss'
  import CheckOutTableItem from './checkOutTableItem/checkOutTableItem.js'

  /**

  @ Victoria/Nicholas

  @ 03/06/18

  @ Purpose: Item component for each checkOutItem.
             This would be the component where you list all of the items that are in checkout.
  **/

  export class CheckOutTableItems extends Component {
    constructor(props, context) {
      super(props, context)
      this.state = {

      }
    }

    render () {
      //Pass in values here to populate rest.
      var currCheckOutItem = this.props.currCheckOutItem
      var removeCartItem = this.props.removeCartItem
      var neoPrice = this.props.neoPrice

      return (
        <div className='checkoutItems'>
          <CheckOutTableItem currCheckOutItem={currCheckOutItem} neoPrice={neoPrice} removeCartItem={removeCartItem}/>
        </div>
      )
    }
  }

  export default CheckOutTableItems;
