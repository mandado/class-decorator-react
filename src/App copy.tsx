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

    return class Intercept extends Component {
      #target;
      #children;

      constructor(props) {
        super(props);

        this.#children = props.children;
        // const ProxiedKlass = new Proxy(Klass, {
        //   set(target, prop, value) {
        //     console.log(target, prop, value)
        //     target[prop as keyof typeof prop] = value;
        //     return true;
        //   }
        // });

        this.#target = new Klass()
      }

      render() {
        console.log(this.#target)
        const instanceMethods = Object.getOwnPropertyNames(Klass.prototype)
          .filter(prop => prop != "constructor" && prop != "render")
          .reduce((acc, item) => {
            acc[item] = Object.getPrototypeOf(this.#target)[item].bind(this.#target);
            return acc;
          }, {});

        const props = { ... this.#target, ...instanceMethods };

        console.log('here')

        return <Comp {...props} />//createElement(Comp, { instance: this.#target, ... this.#target }, this.#children);
      }
    }

    // new Proxy(Klass, {
    //   get(target, prop) {
    //     return target[prop as keyof typeof prop];
    //   },
    //   set(target, prop, value) {
    //     console.log(target, prop, value)
    //     target[prop as keyof typeof prop] = value;
    //     return true;
    //   }
    // });
  };
}

function ComponentMarkup(props: any) {
  console.log(props);
  return (
    <div className="App">
      <button onClick={props.inc}>+</button>
      <h1>{props.count}</h1>
      {props.children}
    </div>
  );
}

@Render(ComponentMarkup)
class Test {
  count = 1;
  // state = { count: 1 }

  inc() {
    console.log(this)

    this.count++;
    // this.setState({ count: this.state.count + 1 });
  }
}

export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <Test>
        testing
      </Test>
    </div>
  );
}
