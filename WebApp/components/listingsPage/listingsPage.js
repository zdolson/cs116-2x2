import React, { Component } from 'react'
import { Stylesheet } from '../stylesheet.js'
import sheet from './listingsPage.scss'
import Listing from '../listing/listing.js'

/**

@ Alec

@ 2/27/18

@ Purpose: Container providing dynamic spacing and sizing of the listings grid

TODO: do we need to add props logic?

**/

export class listingsPage extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {

    }
  }

  render () {
    return (
      <div class='listings'>
      <Listing />
      </div>
    )
  }
}

export default listingsPage;