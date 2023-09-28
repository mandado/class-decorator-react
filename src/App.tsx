import { ClassicComponent, Component, FC, PureComponent, createElement, memo, useCallback, useMemo, useState } from "react";

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <MyComponent count={2} />
    </div>
  );
}


function Render(Component: any) {
  return function(klass) {
    return function (props) {
      // const instance = new klass(props);
      // const propsProxy = new Proxy(instance, {
      //   get(target, prop) {
      //     setTimeout(() => update(), 0)
      //     return target[prop]?.bind?.(target) ?? target[prop];
      //   },
      //   ownKeys(target) {
      //     // Reflect.ownKeys(target)
      //     // console.log(target)
      //     return Reflect.ownKeys(klass.prototype).filter(item => item != "constructor");
      //   },
      // });
      const [instance] = useState(() => new klass(props));
      const [propsProxy] = useState(() => new Proxy(instance, {
        get(target, prop) {
          setTimeout(() => update(), 0)
          return target[prop]?.bind?.(target) ?? target[prop];
        },
        ownKeys(target) {
          // Reflect.ownKeys(target)
          // console.log(target)
          return Reflect.ownKeys(klass.prototype).filter(item => item != "constructor");
        },
      }));
      const [count, setCount] = useState(1);
      const update = useCallback(() => setCount(s => s + 1), [count]);

      console.log(propsProxy)

      return useMemo(() => Component(propsProxy), [instance])
    };
  }
}


function ComponentMarkup(props: any) {
  console.log(props)
  return (
    <>
      <button onClick={() => props.inc()}>+</button>
      <div>{props.count}</div>
    </>
  )
}


// function Render(ComponentRender: any) {
//   return function(klass) {
//     return class extends Component {
//       state = { count: 1 }

//       constructor(props) {
//         super(props);
//         this.instance = new klass(props);
//         const update = () => this.setState(s => ({ count: s.count + 1 }));
//         this.propsProxy = new Proxy(this.instance, {
//           get(target, prop) {
//             update()
//             return target[prop]?.bind?.(target) ?? target[prop];
//           },

//           ownKeys(target) {
//             // Reflect.ownKeys(target)
//             // console.log(target)
//             return Reflect.ownKeys(klass.prototype).filter(item => item != "constructor");
//           },
//         });
//       }

//       render() {
//         return  ComponentRender(this.propsProxy)
//       }
//     };
//   }
// }

function arePropsEqual(oldProps, newProps) {
  console.log(oldProps, newProps)
  return true;
}

@Render(ComponentMarkup)
class MyComponent {
  #props = {};

  constructor(props) {
    console.log(props, 'props')
    this.#props = {...props};
  }

  inc() {
    console.log(this.#props)
    this.#props.count++;
  }

  get count() {
    return this.#props.count;
  }
}
