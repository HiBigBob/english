<template>
    <div class="hello">
        <div class="form-signin">
            <input type="text" id="inputEmail" class="form-control" placeholder="Response" @keyup="keymonitor" autofocus>
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
    methods: {
        keymonitor(event) {
            console.log('keyup from id: '+event.target.id)

            // what was pressed?
            let keyMessage = 'keyup: ';
            if (event.shiftKey) {
                keyMessage += 'Shift+';
            }
            keyMessage += event.key || String.fromCharCode(event.keyCode);

            console.log(keyMessage)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.inputEngine {
    color: #2c3e50;
    font-weight: bold;
    border: 1px solid grey;
    border-radius: 5px;
    padding: 5px;
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

/*
 * Globals
 */

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
    padding: 10px;
    font-size: 16px;
}

textarea:focus, input:focus{
    outline: none;
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
