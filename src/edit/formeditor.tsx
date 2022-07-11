import { Button, Drawer, Form, Input } from 'antd'
import './formeditor.css'
import update from 'immutability-helper'
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

interface FormEditorState {
  components: FormItemConfig[]
  visible: boolean
  selected?: FormItemConfig
}

class FormEditor extends Component {
  state: FormEditorState = {
    components: [],
    visible: false,
  }
  idGenerator = 1

  requireFieldId = () => {
    return this.idGenerator++
  }

  addFormItem = (
    sourceConfig: Partial<FormItemConfig>,
    event?: React.MouseEvent
  ) => {
    event?.stopPropagation()
    let components = this.state.components
    const { type } = sourceConfig
    if (!type) {
      return
    }
    let config: FormItemConfig = {
      labelName:
        sourceConfig.labelName || getComponentConfig(type).defaultLabel,
      formItemId: this.requireFieldId(),
      required: sourceConfig.required || false,
      type: type,
      selected: true,
      props: Object.assign(
        {},
        sourceConfig.props || getComponentConfig(type).defaultProps
      ),
    }
    components.forEach((x) => {
      x.selected = false
    })
    components.push(config)

    this.setState({
      components: components,
      selected: config,
    })
  }
  deleteFormItem = (formItemId: number, event?: React.MouseEvent) => {
    event?.stopPropagation()
    let components = this.state.components
    components = components.filter((l) => l.formItemId !== formItemId)
    let isSelected = formItemId === this.state.selected?.formItemId

    this.setState({
      components: components,
      visible: this.state.visible && !isSelected,
      selected: isSelected ? null : this.state.selected,
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
  updateProps = (id: number, prop: string, value: any) => {
    let components = this.state.components
    components.forEach((x) => {
      if (x.selected) {
        x.props[prop] = value
      }
    })
    this.setState(components)
  }
  updateComponentProp = (id: number, prop: string, value: any) => {
    let components = this.state.components
    components.forEach((x: any) => {
      if (x.selected) {
        x[prop] = value
      }
    })
    this.setState(components)
  }

  renderDrawer = () => {
    if (!this.state.selected) {
      return undefined
    }
    const selected = this.state.selected
    return React.createElement(getComponentConfig(selected.type).propsEditor, {
      ...selected,
      ...selected.props,
      onEditProp: (prop: string, value: any) => {
        this.updateProps(selected.formItemId, prop, value)
      },
      onEditComponentProp: (prop: string, value: any) => {
        this.updateComponentProp(selected.formItemId, prop, value)
      },
    })
  }

  onCloseEdit = () => {
    this.setState({ visible: false })
  }

  render() {
    return (
      <div className="form-editor">
        <div className="component-list">
          <Button onClick={() => this.addFormItem({ type: 'input' })}>
            Input
          </Button>
        </div>
        <div
          className={this.state.visible ? 'preview drawer-opened' : 'preview'}
        >
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
                          onCopy={(e) => this.addFormItem(x, e)}
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
                    onMoveCard={(dragIndex: number, hoverIndex: number) => {
                      this.setState((s: FormEditorState) => ({
                        components: update(s.components, {
                          $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, s.components[dragIndex]],
                          ],
                        }),
                      }))
                    }}
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
          {this.renderDrawer()}
        </Drawer>
      </div>
    )
  }
}

export default FormEditor
