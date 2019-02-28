<template>
    <div class="hello">
        <div class="form-signin">
            <div class="practice">
                <div id="ask">
                    <span v-for="letter in ask" :class="`letterChoice ${letter != '-' ? letter : ''}`">
                        <span :if="letter != '-' || letter != ' '">{{letter}}</span>
                        <input :if="letter == '-'" type="text" id="input" class="form" @keyup="keymonitor" autofocus spellcheck="false" />
                    </span>
                </div>
                <div id="read" class="read">{{ ask }}</div>
                <div id="write"></div>
                <div class="clear"></div>
            </div>
            <div class="letter">
                <span v-for="letter in help" :class="`letterChoice ${letter}`">{{letter}}</span>
            </div>
            <input type="text" id="input" class="form" @keyup="keymonitor" autofocus spellcheck="false" />
            <button class="btn btn-sm btn-primary" >Help</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    props: {
        practice: Object
    },
    data: {
        iterator: 0,
    },
    computed: {
        help: function () {
            const answer = this.practice.answer.toLowerCase();
            const sort = answer.split('').sort(() => {
                return 0.5 - Math.random();
            });

            return sort;
        },
        ask: function () {
            return this.practice.ask.replace(/-/, '');
        }
    },
    methods: {
        keymonitor(e) {
            e.preventDefault();
            e = e || window.event;

            let charCode = e.keyCode || e.which;
            let charStr = String.fromCharCode(charCode);

            charStr = charStr.toLowerCase();
            if (e.shiftKey) {
                charStr = charStr.toUpperCase();            
            }
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
                this.iterator = this.iterator - 1;
                return;
            }

            if (charCode == 32) {
                var space = document.createTextNode(" ");
                $content.appendChild(space);
            }

            if (this.practice.length <= this.iterator) {
                console.log('4', this.practice.length <= this.iterator);
                return;
            }

            if (charCode > 64 && charCode < 91) {
                var char = document.createTextNode(charStr);
                var tmp;
                if(this.practice.charAt(this.iterator) == charStr) {
                    tmp = char;
                } else {
                    var $span = document.createElement("span");
                    $span.style.color = "red";
                    $span.appendChild(char);
                    tmp = $span;
                }
                $content.appendChild(tmp);

                this.iterator = this.iterator + 1;
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.practice{
    margin-bottom: 30px;
}

.letter {
    margin: 30px;
}

.letterChoice{
    border: 1px solid #283e51;
    border-radius: 4px;
    margin: 3px;
    width: 22px;
    display: inline-block;
}

.pressed {
    color: red;
}

.inputEngine {
    color: #2c3e50;
    font-weight: bold;
    border: 1px solid grey;
    border-radius: 5px;
    padding: 5px;
}

.read {
    font-weight: bold;
    font-size: 24px;
}

h3 {
    margin: 40px 0 0;
}
ul {
    list-style-type: none;
    padding: 0;
}
li {
    display: inline-block;
    margin: 0 10px;
}
a {
    color: #42b983;
}

.form-signin {
    width: 100%;
    /* max-width: 330px; */
    padding: 15px;
    margin: auto;
}

.form-signin .form {
    position: relative;
    box-sizing: border-box;
    height: auto;
    font-size: 16px;
}

.form:focus {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
  outline: none;
}

.form{
    background-color: #f5f5f5;
    color: #f5f5f5;
    border: none;
}

.form-signin input[type="text"] {
    margin-bottom: 20px;
}

</style>
