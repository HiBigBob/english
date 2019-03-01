
import React, { Component } from 'react'
import ContentEditable from 'react-contenteditable'

export class KeyBoard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            iterator: 0,
            randomLetterAnswer: this.getRandomLetterAnswer(props.practice.answer),
            html: "<b>Hello <i>World</i></b>",
            answer: [{
                letter: 'h',
                isCorrect: true
            }]
        }
        this.contentEditable = React.createRef();
    }

    handleChange = evt => {
        console.log('html', evt.target.value);
        // this.setState({html: evt.target.value});
    }

    handleChangeKeyDown = e => {
        const { answer, html } = this.state;
        // let responseAnswer = answer;
        e.preventDefault();
        // e = e || window.event;
        var charCode = e.keyCode || e.which;
        var charStr = String.fromCharCode(charCode).toLowerCase();
        console.log('down charCode', charCode);
        console.log('down charStr', charStr);
        if (charCode > 64 && charCode < 91) {
            
            answer.push({letter: charStr, isCorrect: true});
            // this.setState({html: `${this.state.html}<span style="color: red">${charStr}</span>`});
        }
        if (charCode == 32) {
            answer.push({letter: ' ', isCorrect: true});
        }
        if (charCode == 8) {
        }

        console.log('responseAnswer', answer, html);
        const html2 = answer.map((letter, index) => {
            return (<span key={index} style={{color: letter.isCorrect ? 'black' : 'red'}}>letter.letter</span>)
        }).join('');
        
        this.setState({
            answer,
            html: html2
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
            });
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
            };
        };
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
        const { randomLetterAnswer } = this.state;

        console.log('render');

        return (
            <div >
                <div className="practice">
                    <div id="read">{practice.ask}</div>
                    <div id="write"></div>
                    <div className="clear"></div>
                    <ContentEditable
                      innerRef={this.contentEditable}
                      onKeyDown={this.handleChangeKeyDown}
                      html={this.state.html} // innerHTML of the editable div
                      disabled={false}       // use true to disable editing
                      onChange={this.handleChange} // handle innerHTML change
                      tagName='article' // Use a custom HTML tag (uses a div by default)
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
