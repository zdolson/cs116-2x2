import React, { Component } from 'react'
import { Stylesheet } from '../../stylesheet.js'
import sheet from './moreInfoListingBottom.scss'
import MoreInfoListingSpec from './moreInfoListingSpec/moreInfoListingSpec.js'
import MoreInfoListingItem from './moreInfoListingItem/moreInfoListingItem.js'

/**

@ Alec

@ 3/09/18

Purpose: Component for spacing of bottom of moreInfoListingPage

**/

class MoreInfoListingBottom extends Component {
  constructor(props, context) {
    super(props, context)
    this.State = {

    }
  }

  render () {
    return (
      <div className='moreInfoListingBottom'>
        <MoreInfoListingItem />
        <MoreInfoListingSpec />
        <Stylesheet sheet={sheet} />
      </div>
    )
  }
}

export default MoreInfoListingBottom
