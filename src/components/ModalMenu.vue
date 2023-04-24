<template>

</template>
<script>
    export default {
        data(){
            return{
                idd: this.id
            }
        },
        props:{
            id:{
                type:Number,
                required: true
            }
        },
        created() {
            console.log(this.idd)
        }
    }
</script>
<style scoped>
.modal{
  position:relative;
  display: inline-block;
}
</style>
