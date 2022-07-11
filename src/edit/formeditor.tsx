import { Button, Drawer, Form, Input } from 'antd'
import './formeditor.css'

import { FormItemConfig } from './types'
import { getComponentConfig } from './ComponentRegistry'
import React, { PropsWithChildren } from 'react'
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons'
import { SortableList } from './SortableList'

const { Component } = React

class FormItem extends Component<FormItemConfig> {
  constructor(props: FormItemConfig) {
    super(props)
  }

  render() {
    return getComponentConfig(this.props.type).getComponent(this.props)
  }
}

class PreviewFormItemContainer extends Component<
  PropsWithChildren<{
    onDelete: (e: React.MouseEvent) => void
    onCopy: (e: React.MouseEvent) => void
    onClick: () => void
    selected: boolean
  }>
> {
  render() {
    return (
      <div
        className={
          this.props.selected
            ? 'form-item-container selected'
            : 'form-item-container'
        }
        onClick={this.props.onClick}
      >
        {this.props.children}
        <div className="action-group">
          <a className="copy" onClick={(e) => this.props.onCopy(e)}>
            <i style={{ color: 'inherit' }}>
              <CopyOutlined />
            </i>
          </a>
          <a className="delete" onClick={this.props.onDelete}>
            <i style={{ color: 'inherit' }}>
              <DeleteOutlined />
            </i>
          </a>
        </div>
      </div>
    )
  }
}

class FormEditor extends Component {
  state: {
    components: FormItemConfig[]
    visible: boolean
    selected?: FormItemConfig
  } = {
    components: [],
    visible: false,
  }
  idGenerator = 1

  requireFieldId = () => {
    return this.idGenerator++
  }

  addFormItem = (type: string, event?: React.MouseEvent) => {
    event?.stopPropagation()
    let components = this.state.components
    let config: FormItemConfig = {
      labelName: getComponentConfig(type).defaultLabel,
      formItemId: this.requireFieldId(),
      required: false,
      type: type,
      selected: false,
      props: getComponentConfig(type).defaultProps,
    }

    components.push(config)
    this.setState({
      components: components,
    })
  }
  deleteFormItem = (formItemId: number, event?: React.MouseEvent) => {
    event?.stopPropagation()
    let components = this.state.components
    components = components.filter((l) => l.formItemId !== formItemId)
    this.setState({
      components: components,
    })
  }

  setSelected = (formItemId: number) => {
    let components = this.state.components
    let selected: FormItemConfig | undefined = undefined
    components.forEach((x) => {
      x.selected = x.formItemId === formItemId
      if (x.selected) {
        selected = x
      }
    })
    this.setState({
      components: components,
      visible: true,
      selected: selected,
    })
  }

  onCloseEdit = () => {
    this.setState({ visible: false })
  }

  render() {
    return (
      <div className="form-editor">
        <div className="component-list">
          <Button onClick={() => this.addFormItem('input')}>Input</Button>
        </div>
        <div className="preview">
          <div style={{ display: 'inline', width: '100%', maxWidth: '900px' }}>
            <Form className="dynamic-form" layout="vertical">
              {this.state.components.length === 0 ? (
                <div className="add-hint">add components</div>
              ) : (
                <div>
                  <SortableList
                    items={this.state.components.map((x) => ({
                      id: x.formItemId,
                      item: (
                        <PreviewFormItemContainer
                          onCopy={(e) => this.addFormItem(x.type, e)}
                          onDelete={(e) => this.deleteFormItem(x.formItemId, e)}
                          selected={x.selected}
                          onClick={() => {
                            this.setSelected(x.formItemId)
                          }}
                        >
                          {React.createElement(FormItem, x)}
                        </PreviewFormItemContainer>
                      ),
                    }))}
                  />
                </div>
              )}
            </Form>
          </div>
        </div>
        <Drawer
          title="Component Editor"
          placement="right"
          onClose={this.onCloseEdit}
          mask={false}
          forceRender={true}
          visible={this.state.visible}
        >
          <Input placeholder={this.state.selected?.formItemId.toString()} />
        </Drawer>
      </div>
    )
  }
}

export default FormEditor
