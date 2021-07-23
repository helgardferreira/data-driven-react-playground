import React, { useState } from "react";

import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  decrement,
  increment,
  // incrementByAmount,
  // incrementAsync,
  // incrementIfOdd,
  selectCount,
} from "./counterSlice";
import styles from "./Counter.module.css";
import * as IonComponents from "@ionic/react";
import { RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";

type IonComponentName = keyof typeof IonComponents;
type StateFieldName = keyof RootState;

interface IComponent {
  type: string;
  id: string;
  props: any;
}

interface IField {
  name: string;
  type: "string" | "number" | "boolean";
  value: any;
}

interface IViewData {
  path: string;
  fields: IField[];
  components: IComponent[];
}

function isIonComponentName(name: string): name is IonComponentName {
  return !!IonComponents[name as IonComponentName];
}

function generateDataDrivenComponent(
  data: IComponent
): React.FunctionComponent | void {
  const { type, props } = data;

  if (isIonComponentName(type)) {
    const Component = IonComponents[type] as React.ComponentType;

    const { className, children, field, ...rest } = props;

    if (children && typeof children === "string") {
      // TODO
    }

    if (field) {
      return () => {
        const dispatch = useDispatch();
        const value = useSelector((state: any) => state[field].value);
        console.log(value);

        return (
          <Component
            className={styles[className]}
            children={children}
            value={value}
            {...rest}
          />
        );
      };
    }

    return () => (
      <Component className={styles[className]} children={children} {...rest} />
    );
  }
}

function generateView(viewData: IViewData) {
  return class extends React.Component<any, any> {
    constructor(props: any) {
      super(props);

      this.state = viewData.fields.reduce((acc: any, curr) => {
        acc[curr.name] = curr.value;
        return acc;
      }, {});
    }

    render() {
      return (
        <>
          {viewData.components.map((componentData) => {
            const Component = generateDataDrivenComponent(componentData);

            return Component ? <Component key={componentData.id} /> : null;
          })}
        </>
      );
    }
  };
}

const viewData: { views: IViewData[] } = {
  views: [
    {
      path: "/",
      fields: [{ name: "counter", type: "number", value: 2 }],
      components: [
        {
          type: "IonInput",
          // nanoId in this case
          id: "9tYwJdXy7jgDBHqeRgygs",
          props: {
            className: "textbox",
            "aria-label": "Set increment amount",
            type: "number",
            field: "counter",
            // "value": {counter}
            // "onIonChange":{(e) => setIncrementAmount(e.detail.value!)}
          },
        },
        {
          type: "IonButton",
          id: "WazaITqAMh3Ce1VyyFw-h",
          props: {
            children: "Add Amount",
          },
        },
        {
          type: "IonButton",
          id: "4Ktcfvr8ZVaJACkXETPIZ",
          props: {
            children: "Add Async",
          },
        },
        {
          type: "IonButton",
          id: "zw9UXKf-uyVb6t9PU9BCZ",
          props: {
            children: "Add If Odd",
          },
        },
      ],
    },
  ],
};

export function Counter() {
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();
  // const [incrementAmount, setIncrementAmount] = useState("2");

  // const incrementValue = Number(incrementAmount) || 0;

  const View = generateView(viewData.views[0]);

  return (
    <div>
      <div className={styles.row}>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
        >
          -
        </button>
        <span className={styles.value}>{count}</span>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
        >
          +
        </button>
      </div>
      <div className={styles.row}>
        <View />
        {/* <button
          className={styles.button}
          onClick={() => dispatch(incrementByAmount(incrementValue))}
        >
          Add Amount
        </button>
        <button
          className={styles.asyncButton}
          onClick={() => dispatch(incrementAsync(incrementValue))}
        >
          Add Async
        </button>
        <button
          className={styles.button}
          onClick={() => dispatch(incrementIfOdd(incrementValue))}
        >
          Add If Odd
        </button> */}
      </div>
    </div>
  );
}
