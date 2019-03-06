
import React, { Component } from 'react'
import ContentEditable from 'react-contenteditable'

export class KeyBoard extends Component {
    constructor(props) {
        super(props)

        const widthByLetter = 13;

        this.state = {
            iterator: 0,
            cursorIterator: 0,
            randomLetterAnswer: this.getRandomLetterAnswer(props.practice.answer),
            html: "",
            answer: [],
            widthByLetter,
            answerWidth: `${props.practice.answer.length * widthByLetter}px`
        }

        this.contentEditable = React.createRef();
    }

    increaseCursor = () => {
        let { cursorIterator } = this.state;
        const limit = this.props.practice.answer.length;
        if (cursorIterator <= limit) {
            cursorIterator++;
            this.setState({ cursorIterator });
        }
    }

    decreaseCursor = () => {
        let { cursorIterator } = this.state;
        if (this.state.cursorIterator > 0) {
            cursorIterator--;
            this.setState({ cursorIterator });
        }
    }

    moveCursor = (position) => {
        const limit = this.props.practice.answer.length;

        if (typeof window !== 'undefined' && position <= limit) {
            var el = document.getElementsByTagName('article')[0];
            var range = document.createRange();
            var sel = window.getSelection();

            range.setStart(el, position);
            range.collapse(true);

            sel.removeAllRanges();
            sel.addRange(range);
            el.focus();
        }
    }

    handleKeyDown = e => {
        e.preventDefault();
    }

    handleKeyUp = e => {
        e.preventDefault();
        const charCode = e.keyCode || e.which;
        const charStr = String.fromCharCode(charCode).toLowerCase();

        const { answer, randomLetterAnswer, cursorIterator } = this.state;
        const { practice } = this.props;
        const elem = document.getElementsByTagName('article')[0];
        const isCorrect = practice.answer.charAt(cursorIterator) === charStr;
        const iterator = answer.length;

        if (charCode == 37) {
            this.decreaseCursor();
        }

        if (charCode == 39) {
            this.increaseCursor();
        }

        if (charCode == 8) {
            if (iterator > cursorIterator) {
                answer.splice(cursorIterator - 1, 1);
            } else {
                answer.pop();
            }
            this.decreaseCursor();
        }

        if (practice.answer.length <= answer.length) {
            return;
        }

        if (charCode > 64 && charCode < 91) {

            const elem = {letter: charStr, isCorrect};
            if (iterator > cursorIterator) {
                answer.splice(cursorIterator, 0, elem);
            } else {
                answer.push(elem);
            }

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

            this.increaseCursor();
        }

        if (charCode == 32) {
            answer.push({letter: '&nbsp;', isCorrect});
            this.increaseCursor();
        }

        const html = answer.map((letter, index) => {
            const color = letter.isCorrect ? 'black' : 'red';
            return `<span style="color: ${color}">${letter.letter}</span>`;
        }).join('');

        console.log('down charCode', charCode);
        console.log('down charStr', charStr);
        console.log('iterator', answer.length);
        console.log('cursorIterator', this.state.cursorIterator);

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

    componentDidUpdate() {
        const { cursorIterator, answer } = this.state;
        if (cursorIterator >= 0) {
            this.moveCursor(cursorIterator);
        }
    }

    render() {
        const { practice } = this.props;
        const { randomLetterAnswer, answerWidth } = this.state;

        return (
            <div >
                <div className="practice">
                    <div id="read">{practice.ask}</div>
                    <div className="write">
                        <span className="phrases">
                            Do you
                        </span>
                        <ContentEditable
                          innerRef={this.contentEditable}
                          onKeyUp={this.handleKeyUp}
                          onKeyDown={this.handleKeyDown}
                          html={this.state.html}
                          disabled={false}
                          tagName="article"
                          spellCheck="false"
                          focus="true"
                          className="contentEditable"
                          style={{
                              width: answerWidth
                          }}
                        />
                    </div>
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

