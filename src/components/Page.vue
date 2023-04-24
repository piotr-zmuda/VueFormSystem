<template>
  <div>
  <div class="form-wrapper justify-content-center" >

    <div class="form-container" @drop.prevent="onDrop($event)" @dragover.prevent :draggable="false" @dragenter.prevent="onEnter($event)" @dragleave.prevent="onLeave($event)">

      <div class="form-container-divs">


        <draggable v-model="rows">
        <div v-for="(row,index) in rows" :id="'row'+row.id" :key="row.id" >

          <!--<div   class="previewRow" @dragenter="previewRowEntered" @dragleave="previewRowLeft(row.id)">
            <Row v-if="row.showUp" style="pointer-events: none;" :firstColumn="firstColumnPreview" ></Row>
          </div>
-->
                <div  class="rows" >
                  <!--<div v-if="letPreview" class="upper-row-add" @dragenter="dragEnterUp($event,row.id)" @dragleave="dragEnterUpLeave($event,row.id)"></div>-->

                  <Row :id="row.id" :firstColumn="row.firstColumn" :rowIndex="index" :class="[hoveredColumn ? 'columnHover' : 'rowHover']" />  <!--class="div-row-class"-->
                  <!--<div  v-if="letPreview" class="lower-row-add" @dragenter="dragEnterDown(row.id) " @dragleave="dragEnterDownLeave($event,row.id)"></div>-->
                </div>



            <Row v-if="row.showDown"  style="pointer-events: none; " :firstColumn="firstColumnPreview" ></Row>
          </div>
        </draggable>
        <Row v-if="entered"  style="pointer-events: none; " :firstColumn="firstColumnPreview" ></Row>



      </div>
      <div class="rowButton" :draggable="false">
        <v-btn class="addButton"  @click="addRow" > {{$t('dodaj')}} {{$t('wiersz')}} </v-btn>
      </div>
    </div>

  </div>

  </div>
</template>
<script>
    import Row from './Row';
    import {bus} from '../main'
    import Modals from '../components/Modals';
    import draggable from "vuedraggable";
    export default {
        data(){

            return{
                rowNB:0,
                rows:[],
                tempTable:[],
                wholeConfig:'',
                entered:false,
                previewEnter:false,
                formContainerEnter:false,
                formContainerDivs:false,
                firstColumnPreview:'button',
                eventTarget:'',
                eventTargetRow:'',
                eventTargetRow2:'',
                optionClosed:false,
                allowEnter:false,
                letPreview:true,
                dragRow:false,
                draggedRow:'',
                draggedRowComponent:'',
                orginalArray:[],
                count:0,
                columnIsDragged:false,
                hoveredColumn:false


            }
        },
        methods:{
            onEnter(ev)
            {
                if(this.allowEnter)
                {
                    this.eventTarget=ev.target;
                    this.entered=true;
                    ev.stopPropagation();
                }
            },
            onLeave(ev)
            {
                if(this.eventTarget===ev.target)
                {
                    ev.stopPropagation();
                    ev.preventDefault();
                    console.log("left")
                    this.entered=false;
                }
            },
            onDrop (ev) {
                /*console.log(ev.currentTarget);*/
                let src = ev.dataTransfer.getData ("pageID");
                /*console.log(idParent)
                  console.log(changingInnerColumn)*/
                    if(src)
                    {
                        var a= 'sendConfigFromRow'+this.rowNB;
                        bus.$on(a, (v)=>{
                            this.wholeConfig += v;
                            /*console.log("=========");
                            console.log(this.wholeConfig);
                            console.log("=========");*/

                        });

                        var aa= 'deleteRow'+this.rowNB;
                        bus.$on(aa, (v)=>{
                            let index=0;
                            for(let i=0; i<this.rows.length;i++)
                            {

                                if(this.rows[i].id===v)
                                    index=i

                            }
                            this.$delete(this.rows,index)
                        });
                        console.log(this.entered)
                        if(!this.entered)
                        {

                            let tmpArray=[];
                            let indexRow=0;
                            for(let i=0;i<this.rows.length;i++)
                            {
                                tmpArray.push(this.rows[i]);
                                if(this.rows[i].showDown)
                                {
                                    indexRow=i;
                                    this.rows[i].showDown=false;
                                    tmpArray.push({firstColumn:src , id: this.rowNB, showUp:false, showDown:false})

                                }
                            }
                            this.rows = [...tmpArray]
                            this.rowNB=this.rowNB+1;
                        }else
                        {
                            this.entered=false;
                            this.rows.push({firstColumn:src , id: this.rowNB, showUp:false, showDown:false});
                            this.rowNB=this.rowNB+1;}
                    }

            },
            addRow(){
                var a= 'sendConfigFromRow'+this.rowNB;
                bus.$on(a, (v)=>{
                  this.wholeConfig += v;
                });

                var aa= 'deleteRow'+this.rowNB;
                bus.$on(aa, (v)=>{
                  let index=0;
                  for(let i=0; i<this.rows.length;i++)
                  {

                    if(this.rows[i].id===v)
                      index=i

                  }
                  this.$delete(this.rows,index)
                });

                this.rows.push({firstColumn:"button" , id: this.rowNB,  showUp:false, showDown:false} );
                bus.$on('previewRow'+this.rowNB,()=>{
                    console.log("lalala")
                });
                this.rowNB=this.rowNB+1;
            },
            download(){
                this.wholeConfig='';

                /*console.log("====Whole config=====");
                console.log(this.wholeConfig);
                console.log("=========");*/
                for(let i=0;i<this.rows.length;i++)
                {
                    var a='getConfigFromRow'+i;
                    bus.$emit(a)
                    if(i===(this.rows.length-1))
                      this.wholeConfig+=""
                    else this.wholeConfig+=","
                }

                this.sendConfigToFinal();
            },
            sendConfigToFinal(){
                // console.log(this.wholeConfig)
                //Convert JSON Array to string.
                var json = this.wholeConfig;

                //Convert JSON string to BLOB.
                json = [json];
                var blob1 = new Blob(json, { type: "text/plain;charset=utf-8" });

                let link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob1)
                link.download = 'sampleCsv.txt'
                link.click()

                bus.$emit('configFinale',this.wholeConfig);
            }

        },
        computed: {

        },
        components:{
            Row, Modals, draggable
        },
        created(){

            bus.$on('downloadWholeConfigFromPage',()=>{
                /*console.log('lol2')*/
                this.download();
            });
            bus.$on('changePreview',(v)=>{
                /*console.log('lol2')*/
                this.firstColumnPreview=v;
            });
            bus.$on('optionClosed',(v)=>{
                this.optionClosed=v;
            });
            bus.$on('letPreviewRow',(v)=>{
                this.allowEnter=v;
            })
            bus.$on('columnIsDragged',(v)=>{
                this.columnIsDragged=v;
            });
            bus.$on('dragEntered',(v)=>{
                this.columnIsDragged=v;
            });
            bus.$on('hoveredColumn',(v)=>{
                this.hoveredColumn=v;
            });
            bus.$on('previewBottomRowOpen',(v)=>{
                this.entered=false;

                for(let i=0;i<this.rows.length;i++)
                {
                    if(this.rows[i].id===v)
                        this.rows[i].showDown=true;
                }
            })
            bus.$on('previewBottomRowClose',(v)=>{
                this.entered=false;
                for(let i=0;i<this.rows.length;i++)
                {
                    this.rows[i].showDown=false;
                }
            })

        }
    }

    /*onDropRow(ev,v)
            {
                let src = ev.dataTransfer.getData ("pageID");
                this.entered=false;
                /!*console.log(idParent)
                  console.log(changingInnerColumn)*!/
                if(this.eventTarget===ev.target) {
                    if (src) {

                        for (let i = 0; i < this.rows.length; i++) {
                            if (this.rows[i].id === v) {
                                if (this.rows[i].showUp) {
                                    let index = this.rows.findIndex(x => x.id === v);
                                    this.rows.splice((index - 1), 0, {
                                        firstColumn: src,
                                        id: this.rowNB,
                                        showUp: false,
                                        showDown: false
                                    })
                                    this.count++;
                                } else if (this.rows[i].showDown) {
                                    let index = this.rows.findIndex(x => x.id === v);
                                    this.rows.splice((index + 1), 0, {
                                        firstColumn: src,
                                        id: this.rowNB,
                                        showUp: false,
                                        showDown: false
                                    })
                                    this.count++;
                                }
                            }
                            this.rows[i].showDown = false;
                        }

                    }
                    this.rowNB=this.rowNB+1;
                }
                    this.outOfRow=true;
                    this.rowEntered=false;
                    for(let i=0; i<this.rows.length;i++)
                    {
                        this.rows[i].showUp=false;
                        this.rows[i].showDown=false;
                    }
            },
            previewRowEntered()
            {
                this.outOfRow=false;
            },
            previewRowLeft(v)
            {
                this.outOfRow=true;
                if(!this.rowEntered)
                {
                    for(let i=0;i<this.rows.length;i++)
                    {
                        if(this.rows[i].id===v)
                            this.rows[i].showUp=false;
                        console.log("left row" + v+ "up")
                    }
                }
            },*/


    /* dragEnterUp(ev,v){
         this.rowEntered=true;
         if(ev.target.className!=='previewRow')
             this.outOfRow=true;
         this.eventTargetRow=ev.target;
         ev.stopPropagation();
         for(let i=0;i<this.rows.length;i++)
         {
             if(this.rows[i].id===v)
                 this.rows[i].showUp=true;
             console.log("entered row" + v+ "up")
         }
         /!*if(this.count===0)
         {

         }*!/
         /!*this.enteredUp=true;
         this.enteredDown=false;*!/
     },*/
    /*dragEnterUpLeave(ev,v){

        if(this.outOfRow)
        {
            if(this.eventTargetRow===ev.target)
            {
                for(let i=0;i<this.rows.length;i++)
                {
                    if(this.rows[i].id===v)
                      this.rows[i].showUp=false;


                }
            }
        }
        this.rowEntered=false
        /!*this.enteredUp=true;
        this.enteredDown=false;*!/
    },
*/
</script>
<style scoped>
  .columnHover{
    border-right:0;
    border-left: 0;
  }
  .rowHover{
    transition: 0.5s ease;
  }
  .rowHover:hover{
    box-shadow: 0 0 5px rgba(190,190,190,0.6);
  }
  .form-container{
  }

  .upper-row-add{
    height: 50px;
    z-index: 9;
    top: 0;
    width: 100%;
    position: relative;
    grid-area: overlap;
  }
  .lower-row-add{
    height: 50px;
    z-index: 9;
    bottom: -50px;
    width: 100%;
    position: relative;
    grid-area:overlap;
  }
  .addButton{
    border:0 #F0F0F0 solid;
    color: rgba(190,190,190,1);
    background: transparent;
    transition: ease 0.5s;
    align-content: center;
    text-align: center;
    margin-top: 4rem;
  }
  .addButton:hover{
    border: 1px rgba(190,190,190,1) solid;
  }
  .list-item {
    display: flex;
  }
  .list-enter-active, .list-leave-active {
    transition: opacity 1s;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .form-container-divs{
    padding-top: 5px;
  }
  .rows{
    display: grid;
    grid-auto-rows: minmax(100px, 100px);
    cursor: crosshair;
    /*grid-template-areas:"overlap";
    grid-template-rows: 1fr;
    grid-template-columns: 1fr;*/
  }
  .div-row-class{
    grid-area: overlap;
  }
</style>
