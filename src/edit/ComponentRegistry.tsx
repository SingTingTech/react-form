import React, {
  ComponentClass,
  FunctionComponent,
  ReactComponentElement,
} from "react";
import { Form, Input } from "antd";
import { FormItemConfig } from "./types";

const { Item } = Form;

const componentsRegistry: {
  [index: string]: {
    defaultProps: {};
    defaultLabel: string;
    getComponent: (props: any) => ReactComponentElement<any>;
  };
} = {};

interface ComponentRegisterEntry<P extends {}> {
  name: string;
  component: FunctionComponent<P> | ComponentClass<P> | string;
  defaultProps: P;
  defaultLabel: string;
}

export function getComponentConfig(type: string) {
  return componentsRegistry[type];
}

export function registerComponent<P extends {}>(
  registerEntry: ComponentRegisterEntry<P>
) {
  componentsRegistry[registerEntry.name] = {
    defaultProps: registerEntry.defaultProps,
    defaultLabel: registerEntry.defaultLabel,
    getComponent: (config: FormItemConfig) => {
      return (
        <Item
          label={config.labelName}
          required={config.required}
          className={"dynamic-form-item"}
        >
          {React.createElement(registerEntry.component, config.props)}
        </Item>
      );
    },
  };
}

registerComponent({
  name: "input",
  component: Input,
  defaultProps: { placeholder: "请输入" },
  defaultLabel: "文本",
});
