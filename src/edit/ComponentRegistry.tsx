import React, {
  ComponentClass,
  FunctionComponent,
  ReactComponentElement,
} from 'react'
import { Form, Input } from 'antd'
import { FormItemConfig } from './types'
import { InputPropsEditor } from './propsEditors/InputPropsEditor'

const { Item } = Form
type d = {
  onEditProp: (prop: string, value: any) => void
  onEditComponentProp: (prop: string, value: any) => void
}
const componentsRegistry: {
  [index: string]: {
    defaultProps: {}
    defaultLabel: string
    getComponent: (props: any) => ReactComponentElement<any>
    propsEditor: FunctionComponent<d> | ComponentClass<d>
  }
} = {}

interface ComponentRegisterEntry<P extends {}> {
  name: string
  component: FunctionComponent<P> | ComponentClass<P>
  propsEditor: FunctionComponent<d> | ComponentClass<d>
  defaultProps: P
  extraStyle: { [index: string]: string & {} }
  extraProps: { [index: string]: any }
  defaultLabel: string
}

export function getComponentConfig(type: string) {
  return componentsRegistry[type]
}

export function registerComponent<P extends {}>(
  registerEntry: ComponentRegisterEntry<P>
) {
  componentsRegistry[registerEntry.name] = {
    defaultProps: registerEntry.defaultProps,
    defaultLabel: registerEntry.defaultLabel,
    getComponent: (config: FormItemConfig) => {
      let props = Object.assign({}, config.props, registerEntry.extraProps)
      props.style = Object.assign({}, props.style, registerEntry.extraStyle)
      return (
        <Item
          label={config.labelName}
          required={config.required}
          className={'dynamic-form-item'}
          style={props}
        >
          {React.createElement(registerEntry.component, props)}
        </Item>
      )
    },
    propsEditor: registerEntry.propsEditor,
  }
}

registerComponent({
  name: 'input',
  component: Input,
  propsEditor: InputPropsEditor,
  defaultProps: { placeholder: '请输入' },
  defaultLabel: '文本',
  extraStyle: {
    backgroundColor: '#FFFFFF',
    cursor: 'auto',
  },
  extraProps: {
    disabled: true,
  },
})
