var intervalImplementedByRequestAnimationFrame = function (func, delay) {
    var reqAnimFrame = (function () {
        return window.requestAnimationFrame || function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    })(),
        start = new Date().getTime(),
        obj = {};
    function loop() {
        obj.value = reqAnimFrame(loop);
        var current = new Date().getTime(),
            delta = current - start;
        if (delta >= delay) {
            func.call();
            start = new Date().getTime();
        }
    }
    obj.value = reqAnimFrame(loop);
    return obj;
};



// corresponding css styles
strong {
    background: red;
    color: white;
    font-weight: inherit;
}

class HighLight extends React.Component {
    constructor() {
        super();
        this.initialText = "Lorem ipsum dolor sit amet";
        this.state = {
            text: this.initialText,
            inputValue: ""
        };
    }
    handleInput = (e) => {
        let value = e.target.value;
        let txt = this.displayTextField.innerText;
        let idx = txt.indexOf(value);
        if (idx >= 0) {
            let newText = [txt.substring(0, idx), <strong>{txt.substring(idx, idx + value.length)}</strong>, txt.substring(idx + value.length)];
            this.setState({ inputValue: value, text: newText });
        } else {
            this.setState({ inputValue: value, text: this.initialText });
        }
    }
    render() {
        return (
            <div>
                <p ref={(el) => {this.displayTextField = el;} }>{this.state.text}</p>
                <input onChange={this.handleInput} value={this.state.inputValue} />
            </div>
        );
    }
}

ReactDOM.render(
  <HighLight />,
  document.getElementById('container')
);






function errorTable(p, m, f) {
    for (var j = 1; j <= m - 1; j++) {
        k = f[j - 1];
        while (k != -1 && p[j - 1] != p[k]) {
            k = f[k];
        }
        f[j] = k + 1;
    }
}

function kmp(s, n, p, m, f) {
    var i = 0;
    var j = 0;
    while (i < n) {
        while (j != -1 && s[i] != p[j]) {
            j = f[j];
        }
        if (j == m - 1) {
            return i - m + 1;
        } else {
            i++;
            j++;
        }
    }
    return -1;
}

var s = "BBC ABCDAB ABCDABCDABDE";
var n = s.length;
var p = "ABCDABD";
var m = p.length;
var f = [-1];

errorTable(p, m, f);
console.log(f, kmp(s, n, p, m, f));