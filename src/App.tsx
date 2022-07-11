import './App.css'
import React from 'react'
import { FormEditor } from './edit'

class App extends React.Component {
  constructor(props: any) {
    super(props)
  }

  render() {
    return <FormEditor />
  }
}

export default App
