
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
            answer: [],
            widthByLetter,
            answerWidth: `${props.practice.answer.length * widthByLetter}px`
        }

        console.log('answerWidth', this.state.answerWidth);
        this.contentEditable = React.createRef();
    }

    increase = () => {
        this.setState({
            iterator: this.state.iterator + 1 
        });
    }

    decrease = () => {
        if (this.state.iterator > 0) {
            this.setState({
                iterator: this.state.iterator - 1 
            });
        }
    }

    handleKeyDown = e => {
        e.preventDefault();
    }

    handleKeyUp = e => {
        e.preventDefault();
        const charCode = e.keyCode || e.which;
        const charStr = String.fromCharCode(charCode).toLowerCase();

        const { answer, randomLetterAnswer, iterator } = this.state;
        const { practice } = this.props;
        const elem = document.getElementsByTagName('article')[0];
        const pos = elem.innerText.length;
        const isCorrect = practice.answer.charAt(pos) === charStr;

        console.log('down charCode', charCode);
        console.log('down charStr', charStr);
        console.log('down length', pos);
        console.log('charAt', practice.answer.charAt(pos));
        console.log('isCorrect', isCorrect);
        console.log('practice.answer.length', practice.answer.length);
        console.log('iterator', iterator);


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

            this.increase();
        }

        if (charCode == 32) {
            answer.push({letter: '&nbsp;', isCorrect});
            this.increase();
        }

        if (charCode == 8) {
            answer.pop();
            this.decrease();
        }

        if (practice.answer.length <= iterator) {
            return;
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

    render() {
        const { practice } = this.props;
        const { randomLetterAnswer, answerWidth } = this.state;

        return (
            <div >
                <div className="practice">
                    <div id="read">{practice.ask}</div>
                    <div className="write">
                        <ContentEditable
                          innerRef={this.contentEditable}
                          onKeyUp={this.handleKeyUp}
                          onKeyDown={this.handleKeyDown}
                          html={this.state.html}
                          disabled={false}
                          tagName="article"
                          spellCheck="false"
                          focus="true"
                          style={{
                              outline: 'none',
                              borderBottom: '2px solid green',
                              position: 'absolute',
                              whiteSpace: 'nowrap',
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

