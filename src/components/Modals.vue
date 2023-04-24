<template>
  <div>

    <div class="modal fade" ref="ModalInfo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Jak korzystać</h5>
            <button type="button" class="btn btn-secondary-close" data-dismiss="modal" aria-label="Close">
              &times;
            </button>
          </div>
          <div class="modal-body" >
            <div>
            <i class="fas fa-heading"></i> - Utworzenie nagłówka  <br>
            </div>
            <div>
            <i class="fas fa-grip-lines" ></i> - Utworzenie Linii <br>
          </div>
            <div>
           <i class="far fa-square"></i> - Utworzenie pola formularza <br>
            </div>
            <div>
              <i class="fas fa-plus"></i> - Utworzenie nowej kolumny, przycisk znajduje się w prawym dolnym rogu <br>
            </div>
            <div>
                X  - Usunięcie pola , przycisk znajduję się w prawym górnym rogu
            </div>
            <div>
              <i class="fas fa-cog"></i> - Otworzenie menu z opcjami pola , przycisk znajduję się na środku po lewej stronie
            </div>
          </div>
          <div class="modal-footer" style="justify-content: center">
            <button type="button" class="btn btn-secondary footer-close" data-dismiss="modal">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import {bus} from "../main"
    export default {
        data(){
         return {

         }
        },
        props:{

        },
        mounted() {
            this.modalInfo= new bootstrap.Modal(this.$refs['ModalInfo']);
            this.modalInfo.show()
        },
        methods:{
            showValidateModal(){
                this.validateModal.show();
            },
            createValidTab(){
                this.validateTab=[];
                /*console.log(this.minLengthVal)*/
                for(let i=0;i<this.validateTabTemp.length;i++)
                {
                    switch(this.validateTabTemp[i])
                    {
                        case "Required":
                            this.validateTab.push({Required: 1});
                            break;
                        case "MaxLength":
                            this.validateTab.push({MaxLength: this.maxLengthVal});
                            break;
                        case "MinLength":
                            this.validateTab.push({MinLength: this.minLengthVal});
                            break;
                    }
                }
                /*console.log(this.validateTab )*/
                var a='validateTab'+this.rowN+this.id;
                bus.$emit(a, this.validateTab);
            }
        },
        created() {
            var a= 'validateModalShow'+this.rowN+this.id;
            bus.$on(a, ()=>{
                this.showValidateModal();
            });
        },

        computed:{
        }
    }
</script>
<style scoped>
  .modal-body input{

  }
  .numberInput{
    width: 30px;
  }
  input{
    text-align: center;
  }
</style>
