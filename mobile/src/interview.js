import React, { Component, Children } from 'react';
import ReactDOM from 'react-dom';

class Remark extends Component {
    state = {remark: null}

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                remark: '测试说明'
            });
        }, 3000)
    }

    constructor(props) {
        super(props);
    }

    shouldComponentUpdate() {
        // return false; // this is used to disable component to update its state.
        return true;
    }

    render() {
        return this.props.children(this.state.remark);
    }
}

class App extends Component {
    render() {
        console.log(this.state.counts, 'render');
        return (
            <div>
                <span>{this.state.counts}</span>
                <button onClick={this.handleClick}>增加 {this.props.increment}</button>
                <Remark>
                    {remark => remark === null ? <span>Loading...</span> : <span>说明:&nbsp;{remark}</span>}
                </Remark>
                {
                    this.props.list.map((obj, index) => {
                        return (<div key={index}>{obj.name}</div>);
                    })
                }
            </div>
        );
    }

    handleClick() {
        this.setState((prevState, props) => {
            return {counts: prevState.counts + parseInt(props.increment, 10)};
        });
        // setState asynchronously invoked by reactjs.
        console.log(this.state.counts, 'handleClick');
    }

    windowResizeHandler() {
        console.log(this === window);
    }

    constructor(props) {
        super(props);
        // here, we use bind to create context for handleClick function.
        // under this circumstatnce, React won't spend extra time to create a new function by just attaching current Class context to its component.
        // every time it RE-RENDER its own component.
        this.handleClick = this.handleClick.bind(this);
        this.windowResizeHandler = this.windowResizeHandler.bind(window);
        this.state = {
            counts: 0
        };
    }

    componentDidMount() {
        console.log(this.state.counts, 'didMount');
        window.addEventListener('resize', this.windowResizeHandler);
    }

    componentWillMount () {
        console.log('component will mount');
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeHandler)
    }
}

Component.defaultProps = {
    increment: 1,
    list: [
        {
            name: 'Alex',
            gender: 'Male'
        },
        {
            name: 'Carol',
            gender: 'Female'
        }
    ]
}

ReactDOM.render(<App />, document.getElementById('root'));