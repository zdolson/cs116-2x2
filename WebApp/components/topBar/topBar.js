import React, { Component } from 'react'
import {Stylesheet} from '../stylesheet.js'
import sheet from './topBar.scss'
import LogoIcon from '../assets/Logo.svg'
import SearchIcon from '../assets/SearchIcon.svg'

/**

@ Alec

@ 2/22/18

Purpose: TopBar component; Provides template for top nav bar

**/

export class TopBar extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {

    }
    this.zachFunc = this.zachFunc.bind(this);
  }

  zachFunc = () => {
    console.log("press me zach");
  }

  render () {
    return (
      <div className="topnav">
        <LogoIcon className="logo" />
        <div className="zachBtn" onClick={this.zachFunc}>
          Property of Zach
        </div>
        <div className="search">
          <SearchIcon className="searchicon" />
          <div className="searchbubble">
            search...
          </div>
        </div>
        <Stylesheet sheet={sheet} />
      </div>
    )
  }
}

export default TopBar
