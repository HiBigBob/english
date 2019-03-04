
import React, { Component } from 'react'
import ContentEditable from 'react-contenteditable'

export class KeyBoard extends Component {
    constructor(props) {
        super(props)

        const widthByLetter = 13;

        this.state = {
            iterator: 0,
            randomLetterAnswer: this.getRandomLetterAnswer(props.practice.answer),
            html: "",
            answer: [{
                letter: 'h',
                isCorrect: true
            }],
            widthByLetter,
            answerWidth: `${props.practice.answer.length * widthByLetter}px`
        }

        console.log('answerWidth', this.state.answerWidth);
        this.contentEditable = React.createRef();
    }

    handleChange = evt => {
        console.log('html', this.state.html);
        console.log('new', evt.target.value);

        // this.setState({html: evt.target.value});
    }

    handleChangeKeyDown = e => {
        e.preventDefault();
        const charCode = e.keyCode || e.which;
        const charStr = String.fromCharCode(charCode).toLowerCase();

        const { answer, randomLetterAnswer } = this.state;
        const { practice } = this.props;
        const elem = document.getElementsByTagName('article')[0];
        const pos = elem.innerText.length;
        const isCorrect = practice.answer.charAt(pos - 1) === charStr;
        const sel = window.getSelection();
        const position = sel.anchorOffset;

        if (sel.rangeCount) {
            let range = sel.getRangeAt(0);
            let caretPos;
            if (range.commonAncestorContainer.parentNode == elem) {
                caretPos = range.endOffset;
            }

            console.log('range', range);
            console.log('caretPos', caretPos);
        }

        console.log('down charCode', charCode);
        console.log('down charStr', charStr);
        console.log('down length', pos);
        console.log('charAt', practice.answer.charAt(pos - 1));
        console.log('isCorrect', isCorrect);
        console.log('selection', sel);
        console.log('position', position);


        if (charCode > 64 && charCode < 91) {
            answer.push({letter: charStr, isCorrect});

            let randowAnswer = randomLetterAnswer.filter((text) => {
                return charStr === text.key && text.pressed === false
            });

            if (randowAnswer.length > 0) {
                randowAnswer = randowAnswer[0];
                randowAnswer.pressed = true;

                this.setState({
                    randomLetterAnswer: randomLetterAnswer.map((item, index) => {
                        return index === randowAnswer.index ? randowAnswer : item;
                    })
                });
            }
        }

        if (charCode == 32) {
            answer.push({letter: '&nbsp;', isCorrect});
        }

        if (charCode == 8) {
            answer.pop();
        }

        const html = answer.map((letter, index) => {
            const color = letter.isCorrect ? 'black' : 'red';
            return `<span style="color: ${color}">${letter.letter}</span>`;
        }).join('');

        this.setState({
            answer,
            html
        });
    }

    getRandomLetterAnswer(answer) {
        return answer.toLowerCase().split('').sort(() => 0.5 - Math.random()).map((letter, index) => ({
            id: index,
            key: letter, 
            pressed: false
        }));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.practice !== this.props.practice) {
            this.setState({
                randomLetterAnswer: this.getRandomLetterAnswer(nextProps.practice.answer),
                answerWidth: nextProps.practice.answer.length * this.state.widthByLetter
            });
        }
    }

    componentDidMount() {
	    if (typeof window !== 'undefined') {
            var el = document.getElementsByTagName('article')[0];
            var range = document.createRange();
            var sel = window.getSelection();

            range.setStart(el, 0);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);
            el.focus();

            console.log('did mount');
        }
    }

    handleKeyDown(e) {
        e.preventDefault();
        e = e || window.event;
        var charCode = e.keyCode || e.which;
        var charStr = String.fromCharCode(charCode);

        const { practice } = this.props

        if (charCode > 64 && charCode < 91 && !practice.completed) {
            // document.getElementById(charCode).classList.toggle("pressed");
        }
    }

    handleKeyUp(e) {
        e.preventDefault();
        e = e || window.event;
        let charCode = e.keyCode || e.which;
        let charStr = String.fromCharCode(charCode).toLowerCase();

        const { iterator, randomLetterAnswer } = this.state;
        const { practice } = this.props;
        const { answer } = practice;

        if (answer == null) {
            return;
        }

        console.log('charStr', charStr);
        console.log('charCode', charCode);

        if (charCode > 64 && charCode < 91) {
            let answerTmp = randomLetterAnswer.filter((text) => {
                return charStr === text.key && text.pressed === false
            });

            if (answerTmp.length > 0) {
                answerTmp = answerTmp[0];
                answerTmp.pressed = true;

                this.setState({
                    randomLetterAnswer: randomLetterAnswer.map((item, index) => {
                        return index === answerTmp.index ? answerTmp : item;
                    })
                });
            }
        }
        
        var $content = document.getElementById("write");
        if (charCode == 8 && this.iterator > 0) {
            $content.removeChild($content.lastChild);
            this.setState({
                iterator: this.state.iterator - 1 
            });
            return;
        }

        if (charCode == 32) {
            var space = document.createTextNode(" ");
            $content.appendChild(space);
        }

        if (answer.length <= iterator) {
            return;
        }

        if (charCode > 64 && charCode < 91) {
            var char = document.createTextNode(charStr);
            var tmp;
            if(answer.charAt(iterator) == charStr) {
                tmp = char;
            } else {
                var $span = document.createElement("span");
                $span.style.color = "red";
                $span.appendChild(char);
                tmp = $span;
            }
            $content.appendChild(tmp);

            this.setState({
                iterator: this.state.iterator + 1 
            });
        }
    }

    componentDidUpdate() {
        const { practice } = this.props;
        const { iterator } = this.state;

        if (iterator == 0) {
            var $content = document.getElementById("write");
            if ($content) {
                while ($content.firstChild) {
                    $content.removeChild($content.firstChild);
                }
            }
        }

	    if (typeof window !== 'undefined') {
            // const el = document.getElementsByTagName('article')[0];
            // const pos = el.innerText.length;
//
            // const range = document.createRange();
            // const sel = window.getSelection();
//
            // range.setStart(el, pos);
            // range.collapse(true);
//
            // sel.removeAllRanges();
            // sel.addRange(range);
            // el.focus();

            // console.log('did update');
        }
    }

    componentWillMount() {
	    if (typeof window !== 'undefined') {
            // document.addEventListener("keydown", this.handleKeyDown.bind(this), false);
			// document.addEventListener("keyup", this.handleKeyUp.bind(this), false);
		}
    }

    componentWillUnmount() {
	    if (typeof window !== 'undefined') {
			// document.removeEventListener("keydown", this.handleKeyDown.bind(this), false);
            // document.removeEventListener("keyup", this.handleKeyUp.bind(this), false);
		}
    }    

    render() {
        const { practice } = this.props;
        const { randomLetterAnswer, answerWidth } = this.state;

        return (
            <div >
                <div className="practice">
                    <div id="read">{practice.ask}</div>
                    <div id="write"></div>
                    <div className="clear"></div>
                    <ContentEditable
                      innerRef={this.contentEditable}
                      onKeyUp={this.handleChangeKeyDown} // handle innerHTML change
                      html={this.state.html} // innerHTML of the editable div
                      disabled={false}       // use true to disable editing
                      onChange={this.handleChange} // handle innerHTML change
                      tagName='article' // Use a custom HTML tag (uses a div by default)
                      spellCheck="false"
                      style={{
                          outline: 'none',
                          borderBottom: '2px solid green',
                          position: 'absolute',
                          whiteSpace: 'nowrap',
                          width: answerWidth
                      }}
                    />
                </div>
                <div className="letter">
                    {randomLetterAnswer.length > 0 && 
                        randomLetterAnswer.map((letter, index) => (
                            <span key={index} className="letterChoice" style={{
                                color: letter.pressed ? 'red' : '#233e53'
                            }}>{letter.key}</span>
                        ))
                    }
                </div>
            </div>
        )
  	}
}

