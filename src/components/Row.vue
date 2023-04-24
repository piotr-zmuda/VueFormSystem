<template>
  <div style="height: 100px;" >

        <div class="divRow" style="display: flex;" @dragenter="onEnter($event)" @dragleave="onLeave($event)" @dragstart="onDragStart($event)" :draggable="true">
          <div style=" display: flex; width: 100%" class="justify-content-center" >
            <div  v-for="(column,index) in columns" :key="column.id" class="FlexGrowColumn" :class="[ {'col-4' : (columns.length===3)} , {'col-6' : (columns.length===2)} , {'col-12' : (columns.length===1)}]" >

              <Column  class="column-class" :id="column.id" :rowN="idRow" :first="column.firstColumnValueArray" :rowIndex="rowIndex" :columnIndex="index" >

              </Column>

            </div>
          </div>




        </div>
        <!--<button class="DeleteRow" @click="deleteRow">
          Usuń wiersz
        </button>-->
    <!--<hr v-if="breakLine" style="border-top: 1px solid gray;">-->
  </div>

</template>
<script>
  import Column from './Column'
  import {bus} from "../main";

  export default {
        data(){
            return{
                columns:[],
                breakLine:false,
                config:'  "__Row_nr'+this.id+'": {',
                idColumns:1,
                firstColumnValue:this.firstColumn,
                eventTarget:'',
                movingRow:'',
                enteredColumns:[],
                movingColumns:[],
                columnIsDragged:false,
                letPreview:false,
                draggedIdRow:0
            }
        },
        props:{
            id:{
                type:Number
            },
            firstColumn:{
              type:String
            },
            rowIndex:{
                type:Number
            }
        },
      components:{ Column },
        methods:{
            onEnter(ev){
                console.log(this.columnIsDragged + '' +this.letPreview)
                if(!this.columnIsDragged)
                {
                   if(this.letPreview)
                   {
                       this.eventTarget=ev.target;
                       ev.stopPropagation();
                       bus.$emit('previewBottomRowOpen',this.id)
                       /*console.log("entered")*/
                   }
                }
            },
            onLeave(ev){
                if(!this.columnIsDragged)
                {
                    if(this.eventTarget===ev.target)
                    {
                        if(this.letPreview)
                        {
                            bus.$emit('previewBottomRowClose',this.id)
                            console.log('left row')
                            ev.stopPropagation();
                        }
                    }
                }
            },
            onDragStart(ev){
                bus.$emit('draggedIdRow',[this.id,[...this.columns]]);

            },
            pobierz(){
                for(let i=0;i<this.columns.length;i++)
                {
                   bus.$emit('getConfigFromColumn'+this.id+this.columns[i].id)
                    if(i===(this.columns.length-1))
                    this.config+="";
                    else this.config+=","
                }
                this.config+="}"
                bus.$emit('sendConfigFromRow'+this.id, this.config);
                this.config='  "__Row_nr'+this.id+'": {';
                /*console.log("=====config====");
                console.log(this.config);
                console.log("=========")*/
            },

            delEvent(v){
                var deleteCol= 'delete'+this.id+''+v;
                bus.$on(deleteCol, ()=>{
                    /*console.log(v);*/
                    /*console.log(this.columns.length+"lalala")
                    console.log(this.columns.indexOf(0)+ this.id_col);*/
                    let delVal;
                    if(this.columns.length===1)
                        alert('Jest jedna kolumna , usuń cały wiersz')
                     else
                    {
                        for(let i=0;i<this.columns.length;i++)
                        {
                            if(this.columns[i].id===v)
                                delVal=i;
                        }
                    }
                    this.$delete(this.columns,delVal)
                    /*this.columns.splice(this.columns.indexOf(1,1));*/
                });
            }
        },
      computed:{
            idRow(){
                return this.id;
            }
      },

        created() {
                if(this.firstColumnValue!=="button")
                {
                  this.columns.push({firstColumnValueArray: this.firstColumnValue, id:this.idColumns})

                }
                else this.columns.push({firstColumnValueArray:"button", id:this.idColumns});
                this.delEvent(1);
                var a= 'dodaj'+this.id;
                bus.$on(a, ()=>{


                    if(this.columns.length<3) {
                        this.idColumns++;
                        this.columns.push({id:this.idColumns})
                        this.delEvent(this.idColumns);


                            let a= 'configColumn'+this.id+this.idColumns;
                            bus.$on(a, (v)=>{
                              this.config+=v +" ";
                              /*console.log("==== this is config row=====");
                              console.log(this.config);
                              console.log("=========");*/

                            });
                    }
                    else alert('kolumn jest za duzo')
                });


                var aa= 'breakline'+this.id;
                bus.$on(aa, ()=>{
                    this.breakLine=true
                });

                    var aaa= 'configColumn'+this.id+this.idColumns;
                    bus.$on(aaa, (v)=>{
                        this.config+=v;
                        /*console.log("==== this is config row=====");
                        console.log(this.config);
                        console.log("=========");
*/
                    });
            var aaaa= 'getConfigFromRow'+this.id;
            bus.$on(aaaa, ()=>{
              /*console.log("====row config=====")*/
                this.pobierz();
              /*console.log("====row config=====")*/
            });
            bus.$on('columnIsDragged',(v)=>{
                this.columnIsDragged=v;
            });
            bus.$on('letPreviewRow',(v)=>{
                console.log(v)
                this.letPreview=v
            });
            bus.$on('draggedIdRow',(v)=>{
                this.draggedIdRow=v[0];
                this.movingColumns=v[1];
            });


        }

    }
</script>
<style scoped>
  .column-class-overlap{
    flex-grow: 1; justify-content: center; width: 100%; grid-area:overlap;
  }
  .column-class{
    flex-grow: 1; justify-content: center; width: 100%;
  }

  .DeleteRow{
    position: relative;
    left: -58%;
    top: -59%;
    border:0 #F0F0F0 solid;
    color: rgba(190,190,190,1);
    background: transparent;
    transition: ease 0.5s;
    border-radius: 10px;
  }
  .DeleteRow:hover{
    border: 1px rgba(190,190,190,1) solid;
  }
  .FlexGrowColumn{

  }

</style>
