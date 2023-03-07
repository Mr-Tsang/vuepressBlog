<template>
    <div class="odiv">
        <div class="odiv" @click="changeTxt">{{txt}}</div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                txt:'hello world'
            }
        },
        methods:{
            changeTxt(){
                this.txt = "你好，世界！"
            }
        }
    }
</script>
<style>
    .odiv{
        color:red;
    }
</style>