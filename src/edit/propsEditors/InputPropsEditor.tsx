import { Checkbox, Form, Input } from 'antd'
import React from 'react'

const { Component } = React
const { Item } = Form

export class InputPropsEditor<
  D extends {
    onEditProp: (prop: string, value: any) => void
    onEditComponentProp: (prop: string, value: any) => void
  }
> extends Component<D> {
  state: any = {
    ...this.props,
  }

  componentWillReceiveProps(nextProps: any) {
    this.setState({
      ...nextProps,
    })
  }

  onValueChange = (value: any, prop: string) => {
    let state = {
      [prop]: value,
    }
    this.setState(state)
    this.props.onEditProp(prop, value)
  }

  onCompValueChange = (value: any, prop: string) => {
    let state = {
      [prop]: value,
    }
    this.setState(state)
    this.props.onEditComponentProp(prop, value)
  }

  render() {
    return (
      <>
        <Form>
          <Item label={'提示'}>
            <Input
              value={this.state.placeholder}
              onChange={(e) =>
                this.onValueChange(e.target.value, 'placeholder')
              }
            />
          </Item>
          <Item label={'标题'}>
            <Input
              value={this.state.labelName}
              onChange={(e) =>
                this.onCompValueChange(e.target.value, 'labelName')
              }
            />
          </Item>
          <Item label={'是否必填'}>
            <Checkbox
              checked={this.state.required}
              onChange={(e) =>
                this.onCompValueChange(e.target.checked, 'required')
              }
            />
          </Item>
        </Form>
      </>
    )
  }
}
