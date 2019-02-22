<template>
    <div class="hello">
        <div class="form-signin">
            <div class="practice">
                <div id="read" class="read">{{ text }}</div>
                <div id="write"></div>
                <div class="clear"></div>
            </div>
            <input type="text" id="input" class="form-control" placeholder="Response" @keyup="keymonitor" autofocus>
            <button class="btn btn-sm btn-primary" >Help</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    props: {
        msg: String
    },
    data: () => {
        return {
            text: 'toto'
        }
    },
    methods: {
        keymonitor(e) {
            e.preventDefault();
            e = e || window.event;

            console.log('keyup from id: '+e.target.id)

            // what was pressed?
            let keyMessage = 'keyup: ';
            if (e.shiftKey) {
                keyMessage += 'Shift+';
            }
            keyMessage += e.key || String.fromCharCode(e.keyCode);

            console.log(keyMessage)

            let charCode = e.keyCode || e.which;
            let charStr = String.fromCharCode(charCode);

            charStr = charStr.toLowerCase();
            if (e.shiftKey) {
                charStr = charStr.toUpperCase();            
            };
            
            var $content = document.getElementById("write");
            if (charCode == 8) {
                $content.removeChild($content.lastChild);
                return;
            }

            if (charCode == 32) {
                var space = document.createTextNode(" ");
                $content.appendChild(space);
            }

            if (charCode > 64 && charCode < 91) {
                var char = document.createTextNode(charStr);
                var tmp;
                if(false) {
                    tmp = char;
                } else {
                    var $span = document.createElement("span");
                    $span.style.color = "red";
                    $span.appendChild(char);
                    tmp = $span;
                }
                $content.appendChild(tmp);
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
    max-width: 330px;
    padding: 15px;
    margin: auto;
}

.form-signin .form-control {
    position: relative;
    box-sizing: border-box;
    height: auto;
    font-size: 16px;
}

.form-control:focus {
  border-color: inherit;
  -webkit-box-shadow: none;
  box-shadow: none;
}

.form-signin input[type="text"] {
    margin-bottom: 20px;
}

</style>
