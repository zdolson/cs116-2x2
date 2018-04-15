import React, { Component } from 'react'
import { Stylesheet } from '../../../../stylesheet.js'
import sheet from './listingContentButton.scss'

/**

@ Alec

@ 2/27/18

Purpose: Reusable component for a button with listingContent

TODO: props logic to dynamically assign button content

*/

class ListingContentButton extends Component {
  constructor(props, context) {
    super(props, context)
    this.State = {

    }
  }

  render () {
    var price = this.props.price;
    return (
      <div className='listingContentButton'>
        {price} NEO
        <Stylesheet sheet={sheet} />
      </div>
    )
  }
}

export default ListingContentButton;