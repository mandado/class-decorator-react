import { ClassicComponent, Component, FC, createElement } from "react";


type AConstructorTypeOf<T> = new (...args: any[]) => T;

function Render<C extends FC, T extends AConstructorTypeOf<T>>(Comp: C) {
  return function (Klass: T) {
    // console.log(Klass, Comp);
    Klass.prototype.render = function () {
      let props = Object.assign({}, this.state, this.props);
      // console.log(Klass.prototype)

      const instanceOnlyMethods = Object.getOwnPropertyNames(Klass.prototype)
        .filter(prop => prop != "constructor" && prop != "render");

      for (const item of instanceOnlyMethods) {
        props[item] = Klass.prototype[item].bind(this);
      }
      // console.log(props)
      return createElement(Comp, props);
    }


    return new Proxy(Klass, {
      get(target, prop) {
        return target[prop as keyof typeof prop];
      },
    })
  };
}

function ComponentMarkup(props: { count: number, inc: () => void }) {
  // console.log(props);
  return (
    <div className="App">
      <button onClick={props.inc}>+</button>
      <h1>{props.count}</h1>
    </div>
  );
}

@Render(ComponentMarkup, { inject: ['props'] })
class Test extends Component<{ count?: number }> {
  state = { count: 1 }

  inc() {
    console.log(this)
    this.setState({ count: this.state.count + 1 });
  }
}

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Test  />
    </div>
  );
}
