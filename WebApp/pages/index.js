import React, { Component } from 'react'

import Stylesheet from '../components/stylesheet.js'
import sheet from '../components/base.scss'

import Child from '../components/child/child.js'

export class Index extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      loading: true,
      error: '',

      // Data from Firebase
      data: {}
    }
  }

  componentDidMount () {
    console.debug('Loaded')
    this.setState({ loading: false })
  }

  render () {
    if (this.state.loading) {
      return (
        <main>
          Just a second...
          <Stylesheet sheet={sheet} />
        </main>
      )
    } else if (this.state.error) {
      return (
        <main>
          <h1>That's bad. The following error occurred:</h1>
          <div className='error'>{this.state.error}</div>
          <Stylesheet sheet={sheet} />
        </main>
      )
    }

    return (
      <main>
        <h1>App title</h1>
        <Child data={this.state.data} />
        <Stylesheet sheet={sheet} />
      </main>
    )
  }
}

export default Index