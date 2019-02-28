
import React, { Component } from 'react'

export class KeyBoard extends Component {
    constructor(props, context) {
        super(props, context)

        this.state = {
            iterator: 0,
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

        const { iterator } = this.state;
        const { practice } = this.props;
        console.log('practice', practice);

        console.log('charStr', charStr);
        console.log('charCode', charCode);

        if (charCode > 64 && charCode < 91) {
            let query = `span.letterChoice.${charStr}:not(.pressed)`;
            if (document.querySelector(query)) {
                document.querySelector(query).classList.toggle("pressed");
            } else {
                query = `span.letterChoice.${charStr}`;
                const elems = document.querySelectorAll(query);

                elems.forEach((elem) => {
                    elem.classList.toggle("pressed");
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

        if (practice.text.length <= iterator) {
            console.log('4', practice.text.length <= iterator);
            return;
        }

        if (charCode > 64 && charCode < 91) {
            var char = document.createTextNode(charStr);
            var tmp;
            if(practice.text.charAt(iterator) == charStr) {
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
        	document.addEventListener("keydown", this.handleKeyDown.bind(this), false);
	        document.addEventListener("keyup", this.handleKeyUp.bind(this), false);
		}
    }

    componentWillUnmount() {
	    if (typeof window !== 'undefined') {
	        document.removeEventListener("keydown", this.handleKeyDown.bind(this), false);   
        	document.removeEventListener("keyup", this.handleKeyUp.bind(this), false);
		}
    }    

    render() {
        const { practice } = this.props;
        return (
            <div >
                <div className="practice">
                    <div id="read">{practice.text}</div>
                    <div id="write"></div>
                    <div className="clear"></div>
                </div>
                <div className="letter">
                    <span className="letterChoice n">n</span>
                    <span className="letterChoice m">m</span>
                </div>
            </div>
        )
  	}
}
