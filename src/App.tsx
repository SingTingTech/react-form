import logo from '../logo.svg'
import './App.css'
import React from 'react'
import { FormEditor } from './edit'

class App extends React.Component {
  state = {
    count: 0,
  }

  constructor(props: any) {
    super(props)
  }

  render() {
    return <FormEditor />
  }
}

export default App
