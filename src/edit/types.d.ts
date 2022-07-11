import { PropsWithChildren } from "react";

interface FormItemConfig extends PropsWithChildren {
  formItemId: number;
  selected: boolean;
  labelName: string;
  required: boolean;
  type: string;
  props: any;
}
