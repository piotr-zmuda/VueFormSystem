<template>
  <div>

    <div class="formColumn" @dragenter="onEnter($event)" @dragleave="onLeave($event)" @mousedown="onMouseDown()" @mouseenter="columnHovered" @mouseleave="columnOutHovered">




      <div class="contentColumn bounce-enter-active align-middle" :duration="{enter:600,leave:0}"
           :class="{leftAlignClass : leftAlign, rightAlignClass : rightAlign, centerAlignClass: centerAlign}"
           ref="contentColumnDiv" style="flex-grow: 6" @drop.prevent="onDrop($event)" :draggable="true"
           @dragstart="dragStartEvent($event)" @dragend="onEnd($event)">

         <div style="margin-top:20px">
           <b-button v-if="form===0" size="sm" @click="openModal" class="mr-2">

             <i class="fas fa-cog"></i>

           </b-button>


           <input  v-if="form===1" :placeholder="fieldName"/>

           <h1
             :style="[fontConfig.includes('bold') ? {'font-weight':'bold'} : {'font-weight':'normal'}, fontConfig.includes('italic') ? {'font-style':'italic'} : {'font-style':''}, fontConfig.includes('fontSize') ? {'font-size' : fontSize+'px'} : {'font-size' : '2.5rem'}]"
             v-if="form===2" v-html="fieldName" @blur="changeValueHeader"></h1>

           <b-form-checkbox v-if="form===4"
                            name="checkbox-1"
                            value="accepted"
                            contenteditable="true"
                            unchecked-value="not_accepted"
           >
             <h4 v-if="form===4" style="position: relative; top: -4px; color: gray; cursor: move"
                 v-html="fieldName"></h4>
           </b-form-checkbox>
           <select v-if="form===5" placeholder="lala" class="form-select">
             <option value="" disabled selected hidden>{{fieldName}}</option>
             <option v-for="option in optionsTab" :value="option.valOpt" v-html="option.valName">
             </option>
           </select>
           <input v-if="form===6" type="date" name="date" value="" placeholder="Data">
           <textarea v-if="form===7" name="textarea">{{fieldName}}</textarea>
           <input v-if="form===8 && image===null" name="imageArea" type="file" @change="onFileSelected" accept="image/*" style="border:0;" placeholder=""/>
           <img  v-if="form===8 && image!==null" :src="image" :style="[imageConfig.includes('size') ? {'height':imageHeight+'rem;','width':imageWidth+'rem'} : {'height':'200px;','width':'100px'}]" alt="Avatar">


         </div>
      </div>
    </div>



    <div :draggable="false">
      <div class="r-navbar" :class="[showModal ? 'show' : 'hide']" ref="modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
           :draggable="false">
        <div class="option-modal  " role="document">
          <div class="modal-content">
            <div class="modal-header">
              <div style="width: 100%; text-align: left">
                <h5>Opcje </h5>
                <br/>
                <h6 class="modal-title" id="exampleModalLabel">kolumny {{columnIndex+1}} w rzędzie nr: {{rowIndex+1}}</h6>
              </div>
            </div>

            <div class="modal-body">
              <ul class="nav-menu" >
                <li class="li-nav-menu" style="margin-bottom: 10px">
                    <input @select="testFunction" style="width: 45%;"  :placeholder="$t('ValueENPL')" v-model="fieldName"/>
                    <input style="width: 45%;" :placeholder="$t('name')" v-model="nameOfComponent"/>
                </li>

                <li class="li-nav-menu">
                  <button class="nav-button-trigger" v-b-toggle="'collapse-menu'+rowN+''+id" variant="primary">
                    <div class="span-icon-text">
                      <i class="fas fa-list"></i>  Lista opcji
                    </div>
                    <div class="span-icon-rotate">
                    </div>
                  </button>

                  <b-collapse :id="'collapse-menu'+rowN+''+id" class="mt-2">

                   <ul>
                     <li><button class="nav-button-trigger" style=" " @click="inputLabel" v-b-toggle="'collapse-menu'+rowN+''+id"><span style="width: 100%">{{$t('field')}}</span><i class="far fa-square"></i>
                     </button></li>

                     <li><button class="nav-button-trigger" style="" @click="headerLabel" v-b-toggle="'collapse-menu'+rowN+''+id"><span style="width: 100%">{{$t('header')}}</span><i class="fas fa-heading"></i>
                     </button></li>

                     <li><button class="nav-button-trigger" style="" @click="hrLabel" v-b-toggle="'collapse-menu'+rowN+''+id">
                       <span style="width: 100%">{{$t('line')}}</span><i class="fas fa-grip-lines"></i>
                     </button></li>

                     <li><button class="nav-button-trigger" @click="checkInputLabel" v-b-toggle="'collapse-menu'+rowN+''+id">
                       <span style="width: 100%">{{$t('confirmationfield')}}</span><i class="far fa-check-square"></i>
                     </button></li>

                     <li><button class="nav-button-trigger" @click="optionLabel" v-b-toggle="'collapse-menu'+rowN+''+id">
                       <span style="width: 100%">{{$t('listField')}}</span><i class="fas fa-filter"></i>
                     </button></li>

                     <li><button class="nav-button-trigger" @click="textAreaLabel" v-b-toggle="'collapse-menu'+rowN+''+id">
                       <span style="width: 100%">{{$t('textarea')}}</span><i class="fas fa-font"></i>
                     </button></li>

                     <li><button class="nav-button-trigger" @click="dateLabel" v-b-toggle="'collapse-menu'+rowN+''+id">
                       <span style="width: 100%">{{$t('date')}}</span><i class="far fa-calendar" style="float:right;"></i>
                     </button></li>
                     <li><button class="nav-button-trigger" @click="imageLabel" v-b-toggle="'collapse-menu'+rowN+''+id">
                       <span style="width: 100%">{{$t('image')}}</span><i class="far fa-image" style="float:right;"></i>
                     </button></li>
                   </ul>

                  </b-collapse>
                </li>
                <li class="li-nav-menu">
                  <button class="nav-button-trigger" v-b-toggle="'collapse-align-option'+rowN+''+id" variant="primary">
                    <div class="span-icon-text">
                      Opcje przyrównania
                    </div>
                    <div class="span-icon-rotate">
                    </div>
                  </button>

                  <b-collapse :id="'collapse-align-option'+rowN+''+id" class="mt-2">
                    <ul>
                      <li><button class="nav-button-trigger" @click="leftAlignMethod">
                        <span style="width: 100%">lewo</span><i class="fas fa-align-left" style="float:right;"></i>
                      </button></li>

                      <li><button class="nav-button-trigger" @click="centerAlignMethod">
                        <span style="width: 100%">Srodek</span><i class="fas fa-align-center" style="float:right;"></i>
                      </button></li>

                      <li><button class="nav-button-trigger" @click="rightAlignMethod">
                        <span style="width: 100%">Prawo</span><i class="fas fa-align-right" style="float:right;"></i>
                      </button></li>
                    </ul>
                  </b-collapse>

                </li>
                <li class="li-nav-menu">
                  <button type="button" class="nav-button-trigger" data-dismiss="modal" aria-label="Close" @click="addColumn(); showModals=false">
                    Dodaj kolumne
                  </button>
                </li>
                <li class="li-nav-menu">
                  <button type="button" class="nav-button-trigger" data-dismiss="modal" aria-label="Close" @click="removeColumn(); showModals=false">
                    Usuń kolumne
                  </button>
                </li>
                <li class="li-nav-menu">
                  <button class="nav-button-trigger" @click="deleteRow(); showModals=false">Usuń wiersz</button>
                </li>
                <li class="li-nav-menu">
                  <button class="nav-button-trigger" @click="vuelidate=!vuelidate">Vuelidate</button>
                </li>
              </ul>



            </div>



            <!--image-->
           <div class="vuelidate" :class="[vuelidate ? 'show' : 'hide']">
                 <div  v-if="form===8">
                   <input v-if="form===8 && image!==null" name="imageArea" type="file" @change="onFileSelected" accept="image/*" style="border:0;" placeholder=""/>

                   <br/><br/>
                   <div>
                     <input type="checkbox"  id="size" value="size" v-model="imageConfig">
                     <label for="size">
                       {{$t('height')}}
                     </label>
                     <input type="number" v-if="imageConfig.includes('size')" :placeholder="$t('height')" v-model="imageHeight">

                     <label for="size">
                       {{$t('width')}}
                     </label>
                     <input type="number" v-if="imageConfig.includes('size')" :placeholder="$t('width')"  v-model="imageWidth"/>
                   </div>


                 </div>

             <hr v-if="form===1 || form===5 || form===4">
             <div class="modalValidateOptions" :style="[form===4 || form===5 ? {'display':'flex'} : {'display':'grid'}]">
               <div style="flex-grow: 2"  v-if="form===1 || form===5 || form===4">
                 <input type="checkbox" id="val1" name="val1" value="Required" v-model="validateTabTemp">
                 <label for="val1"> Required</label>
               </div>


               <div v-if="form===1">
                 <input type="checkbox" id="val2" name="val2" value="MaxLength" v-model="validateTabTemp">
                 <label for="val2">
                   MaxLength
                 </label>
                 <input class="numberInput" v-if="validateTabTemp.includes('MaxLength')" placeholder="0"
                        v-model="maxLengthVal">
                 <br>
               </div>


               <div v-if="form===1">
                 <input type="checkbox" id="val3" name="val3" value="MinLength" v-model="validateTabTemp">
                 <label for="val3">
                   MinLength
                 </label>
                 <input class="numberInput" v-if="validateTabTemp.includes('MinLength')" placeholder="0"
                        v-model="minLengthVal">
               </div>


               <hr v-if="form===1">
             </div>

             <div v-if="form===2" class="modalValidateOptions">
               <div>
                 <input type="checkbox" id="bold_text" value="bold" v-model="fontConfig">
                 <label for="bold_text">Pogrubienie</label>
               </div>


               <div>
                 <input type="checkbox" id="italic_text" value="italic" v-model="fontConfig">
                 <label for="italic_text">Italic text</label>
               </div>

               <div>
                 <input type="checkbox" id="font_size_check" value="fontSize" v-model="fontConfig">
                 <input type="number" id="font_size" value="fontSize" placeholder="Wielkość liter" v-model="fontSize">
                 <label for="font_size">Wielkość liter</label>

               </div>


             </div>

             <div v-if="form===5" class="justify-content-around" style="margin-bottom: 10px;">

               <ul class="nav-menu" >
                 <li class="li-nav-menu" style="margin-bottom: 10px">
                   <input type="text" id="OptionsName" v-model="optionName" style="width: 45%;" :placeholder="$t('optionName')">
                   <input type="text" id="OptionsValue" v-model="optionValue" style="width: 45%;" :placeholder="$t('valueOption')">
                 </li>
                 <li class="li-nav-menu">
                   <button class="footer-close" @click="addOption">Dodaj opcje</button>
                 </li>
                 <ul class="nav-menu">
                   <li class="li-nav-menu"> <h2>Dodane Opcje</h2></li>
                   <li class="li-nav-menu" v-for="(options,index) in optionsTab">
                     <span style="width:50%; text-align: left">{{index+1}} :</span><span style="text-align: right; width:50%;"> {{options.valName}} {{options.valOpt}} </span>
                   </li>
                 </ul>
               </ul>

             </div>



           </div>

            <div class="modal-footer">
              <button v-if="form===0" type="button" class="footer-close" data-dismiss="modal" @click="closeModal">Zamknij
              </button>

              <button v-else-if="form!==0" type="button" class="footer-close" data-dismiss="modal"
                      @click="createValidateTab">{{$t('accept')}}
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>
<script>
    import ModalMenu from './ModalMenu';
    import {bus} from "../main";
    import Modals from "./Modals";

    export default {
        data() {
            return {
                showModal:false,
                vuelidate:false,
                fontSize: 1,
                optionsTab: [],
                optionValue: 0,
                optionName: '',
                centerAlign: false,
                rightAlign: false,
                leftAlign: false,
                headerValue: 'Nagłowek',
                checkInputValue: 'CheckInput',
                droppedItem: null,
                fieldInputValue: 'cos tam',
                fieldName: 'Default',
                modal: null,
                form: 0,
                changes: 0,
                colNumbers: 0,
                optionModal: null,
                validateModal: null,
                minLengthVal: 0,
                maxLengthVal: 0,
                validateTabTemp: [],
                validationTab: [],
                fontConfig: [],
                configTab: [],
                text: 'This will get copied!',
                nameOfComponent:'Field'+this.id+""+this.rowN,
                eventTarget:'',
                previewBefore:'',
                preview:'',
                previewEntered:false,
                previewColumnSwitch:false,
                enteredColumnForm:0,
                movingColumn:'',
                image:null,
                imageHeight:0,
                imageWidth:0,
                imageConfig:[],
                previewImage:null,
                previewImageBefore:null,
                optionClosed:true,
                mouseDown:true,
                allowPreview:null,
                    previewFieldName:''
                ,beforePreviewFieldName:'',
                enteredColumn:false,
                columnIsDragged:false
            }
        },
        components: {ModalMenu, Modals},
        props: {
            id: {
                type: Number
            },
            rowN: {
                type: Number
            },
            first: {
                type: String
            },
            rowIndex: {
                type:Number
            },
            columnIndex:{
                type:Number
            }
        },
        methods: {
          closeModal(){
            this.showModal=false;
          },
          openModal(){
            bus.$emit('closeModals');
            this.showModal=true;
          },
            onMouseDown()
            {
              bus.$emit('closeModals');
             this.showModal=true;
            },
            onLeave(ev)
            {
                    if(this.columnIsDragged)
                    {
                        if(this.eventTarget===ev.target)
                        {
                            if(this.previewColumnSwitch)
                            {
                                this.countEnter=0;
                                ev.stopPropagation();
                                ev.preventDefault();
                                this.form=this.previewBefore;
                                this.fieldName=this.beforePreviewFieldName;
                                this.image=this.previewImageBefore;
                                bus.$emit('switchBack'+this.movingColumn);
                            }
                            else{
                                ev.stopPropagation();
                                ev.preventDefault();
                                this.form=this.previewBefore;
                            }
                        }
                    }
            },
            onEnter(ev)
            {

                   if(this.columnIsDragged)
                   {
                       if(!this.allowPreview)
                       {
                           if(this.previewColumnSwitch)
                           {
                               bus.$emit(this.movingColumn,[this.previewBefore,this.beforePreviewFieldName])
                               this.eventTarget=ev.target;
                               ev.stopPropagation();
                               this.form=this.preview;
                               this.fieldName=this.previewFieldName;
                               this.image=this.previewImage;
                           }else
                           {
                               this.eventTarget=ev.target;
                               ev.stopPropagation();
                               this.form=this.preview;
                           }
                       }
                   }
            },
            deleteRow(){
                if(confirm('Na pewno chcesz usunąć cały wiersz?'))
                    bus.$emit('deleteRow'+this.rowN, this.rowN);
            },
            onFileSelected(v)
            {
                let reader = new FileReader();
              reader.readAsDataURL(v.target.files[0]);
              reader.onload = (v) =>
              {
                  this.image = v.target.result;
              }
            },
            testFunction() {
                //console.log(window.getSelection().toString());
            },
            changeToHref() {
                //console.log(window.getSelection().toString())
                //console.log(this.fieldName.search(window.getSelection().toString()))
                let searchedWord = window.getSelection().toString();
                //console.log(searchedWord)
                this.fieldName = this.fieldName.replaceAll(searchedWord, "<a href='#'>" + searchedWord + "</a>");
                //console.log(this.fieldName + " " + " lalalalal");
            },
            addOption() {
                this.optionsTab.push({
                    valName: this.optionName,
                    valOpt: this.optionValue,
                    valShow: this.optionName + " " + this.optionValue
                })
            },
            leftAlignMethod() {
                this.leftAlign = true;
                this.rightAlign = false;
                this.centerAlign = false;
            },
            rightAlignMethod() {
                this.leftAlign = false;
                this.rightAlign = true;
                this.centerAlign = false;
            },
            centerAlignMethod() {
                this.leftAlign = false;
                this.rightAlign = false;
                this.centerAlign = true;
            },
            onEnd(ev){
                this.mouseDown=true;
                bus.$emit('previewColumnSwitch',false);
                bus.$emit('columnIsDragged',false);
            },
            changeFieldName(v)
            {
                switch (v) {
                    case 1://Input
                        this.fieldName="Input"
                        break;
                    case 2://header
                        this.fieldName="Header"
                        break;
                    case 4://checkbo
                        this.fieldName="Check box"
                        break;
                    case 5://select
                        this.fieldName="Select"
                        break;
                    case 6://date
                        this.fieldName="Date"
                        break;
                    case 7://textarea
                        this.fieldName="Text Area"
                        break;
                    case 8://image
                        this.fieldName="Image"
                        break;

                }
            },
            onDrop(ev) {
               if(this.columnIsDragged)
               {
                   /*console.log(ev.currentTarget);*/
                   let src = ev.dataTransfer.getData("itemID");
                   let changingInnerColumn = ev.dataTransfer.getData("ColumnChangeFormValue");
                   let idParent = ev.dataTransfer.getData('ColumnChangeID');
                   //console.log(ev.target)
                   /*console.log(idParent)
                   console.log(changingInnerColumn)
                   console.log(this.previewBefore)*/


                   if (src !== '') {
                       /*console.log("chyba działa")*/
                       switch (src) {
                           case "button":
                               this.form=0;
                               break;
                           case "input":
                               this.form = 1;
                               break;
                           case "checkbox":
                               this.form = 4;
                               break;
                           case "header":
                               this.form = 2;
                               break;
                           case "options":
                               this.form = 5;
                               break;
                           case "date":
                               this.form = 6;
                               break;
                           case "textArea":
                               this.form = 7;
                               break;
                           case "image":
                               this.form = 8;
                               break;
                       }
                   }


                   if (changingInnerColumn !== '') {
                       let tmpArray2 = [];
                       tmpArray2.push(this.previewBefore);
                       tmpArray2.push(this.beforePreviewFieldName);
                       switch (changingInnerColumn) {
                           case "0":
                               bus.$emit('droppedInnerColumn' + idParent, tmpArray2);
                               this.form = 0;
                               break;
                           case "1":
                               bus.$emit('droppedInnerColumn' + idParent, tmpArray2);
                               this.form = 1;
                               break;
                           case "2":
                               bus.$emit('droppedInnerColumn' + idParent, tmpArray2);
                               this.form = 2;
                               break;
                           case "4":
                               bus.$emit('droppedInnerColumn' + idParent, tmpArray2);
                               this.form = 4;
                               break;
                           case "5":
                               bus.$emit('droppedInnerColumn' + idParent, tmpArray2);
                               this.form = 5;
                               break;
                           case "6":
                               bus.$emit('droppedInnerColumn' + idParent, tmpArray2);
                               this.form = 6;
                               break;
                           case "7":
                               bus.$emit('droppedInnerColumn' + idParent, tmpArray2);
                               this.form = 7;
                               break;
                           case "8":
                               bus.$emit('droppedInnerColumn' + idParent, tmpArray2);
                               this.form = 8;
                               break;
                       }
                       if(this.fieldName === "")
                       {
                           this.changeFieldName(this.form);
                       }

                       /*console.log(changingInnerColumn)*/
                   }
                   /*console.log("to odebrane jest form" + this.form)
                 console.log(src==='')*/

               }
            },


            dragStartEvent(evt) {
                    bus.$emit('columnIsDragged',true);
                    bus.$emit('closeModals');
                    /*console.log("drag start")*/
                    bus.$emit('previewColumnSwitch',true);

                    bus.$emit('movingColumn','Column'+this.id+''+this.rowN);

                    if(this.image!==null)
                        bus.$emit('changeInnerImagePreview',this.image);

                    let tmpArray = []
                    tmpArray.push(this.form);
                    tmpArray.push(this.fieldName)
                    bus.$emit('changeInnerPreview',tmpArray);

                    /*console.log("======")
                    console.log(evt.target.id)
                    console.log(item)
                    console.log("======")*/
                    evt.dataTransfer.dropEffect = 'move';
                    evt.dataTransfer.effectAllowed = 'move';
                    /* console.log(this.form)*/
                    evt.dataTransfer.setData('ColumnChangeFormValue', this.form);
                    evt.dataTransfer.setData('ColumnChangeID', this.rowN + '' + this.id);
                    /*console.log(this.rowN+''+this.id)*/
                    /*console.log("to wysłane jest form" + this.form)*/

                    /*console.log(document.getElementById(item.id))*/
            },


            createValidateTab() {
                this.validationTab = [];
                /*console.log(this.minLengthVal)*/
                for (let i = 0; i < this.validateTabTemp.length; i++) {
                    switch (this.validateTabTemp[i]) {
                        case "Required":
                            this.validationTab.push({Required: 1});
                            break;
                        case "MaxLength":
                            this.validationTab.push({MaxLength: this.maxLengthVal});
                            break;
                        case "MinLength":
                            this.validationTab.push({MinLength: this.minLengthVal});
                            break;
                    }
                }
                this.showModal=false;
            },
            columnHovered(){
              bus.$emit('hoveredColumn',true)
            },
            columnOutHovered(){
              bus.$emit('hoveredColumn',false)
            },
            addColumn() {
                var a = 'dodaj' + this.rowN;
                bus.$emit(a)
            },
            removeColumn() {
                if(confirm('na pewno chcesz usunąć tą kolumne?'))
                {
                    var a = 'delete' + this.rowN + '' + this.id;
                    bus.$emit(a);
                }
            },
            textAreaLabel() {
                this.form = 7
            },
            imageLabel() {
                this.form = 8
            },
            dateLabel() {
                this.form = 6;
            },
            checkInputLabel() {
                this.form = 4;
            },
            optionLabel() {
                this.form = 5;
            },
            inputLabel() {
                this.form = 1;
            },
            headerLabel() {
                this.form = 2;
            },
            hrLabel() {
                var a = 'breakline' + this.rowN;
                bus.$emit(a)
            },
            showValidateModal() {
                var a = 'validateModalShow' + this.rowN + this.id;
                bus.$emit(a);
            },
            changeValueCheckBox(evt) {
                let src = evt.target.innerText;
                this.checkInputValue = src;
            },
            changeValueHeader(evt) {
                let src = evt.target.innerText;
                this.headerValue = src;
            },
            sendConfig() {
                this.configTab = [];
                switch (this.form) {
                    case 1://Input
                        this.configTab.push({component: "BaseInput"});
                        this.configTab.push({label:this.fieldName});
                        break;
                    case 2://header
                        this.configTab.push({title: this.fieldName});
                        this.configTab.push({font: this.fontConfig});
                        break;
                    case 4://checkbo
                        this.configTab.push({component: "CheckInput"});
                        this.configTab.push({label: this.fieldName});
                        break;
                    case 5://select
                        this.configTab.push({component: "BaseSelect"});
                        this.configTab.push({label: this.fieldName});
                        this.configTab.push({options: this.optionsTab});
                        break;
                    case 6://date
                        this.configTab.push({title: this.fieldName});
                        break;
                    case 7://textarea
                        this.configTab.push({component: "textArea"});
                        this.configTab.push({label: this.fieldName});
                        break;
                    case 8://image
                        this.configTab.push({component: "image"});
                        this.configTab.push({imageConfig:this.imageHeight+", "+this.imageWidth});
                        break;

                }
                if (this.validationTab.length !== 0) {
                    this.configTab.push({vuelidation: this.validationTab});
                }
                /*console.log("klakakka")
                console.log(this.validationTab)
                console.log("klakakka")*/

                /*console.log("klakakka")
                console.log(this.configTab)
                console.log("klakakka")*/
                let strA='"'+this.nameOfComponent+'": ';
                strA += '' + JSON.stringify(this.configTab);
                strA.replace("{", "");
                let strB = strA.split("{").join("").split("}").join("").split("[").join("{").split("]").join("}");

                var a = 'configColumn' + this.rowN + this.id;
                bus.$emit(a, strB);
            }
        },
        computed: {
            getFieldName() {
                return this.fieldName;
            }

        },
        mounted() {
            document.addEventListener('mouseup', event => {
                if (event.target === this.$refs.target || event.target.contains(this.$refs.target))
                    this.testFunction();
            });

        },
        created() {
           if(this.first)
           {
               let tmpArray = this.first.split(',');
               if(tmpArray.length>1)
               {
                   switch (tmpArray[0]) {
                       case "input":
                           this.form = 1;
                           break;
                       case "checkbox":
                           this.form = 4;
                           break;
                       case "header":
                           this.form = 2;
                           break;
                       case "options":
                           this.form = 5;
                           break;
                       case "date":
                           this.form = 6;
                           break;
                       case "textArea":
                           this.form = 7;
                           break;
                       case "image":
                           this.form = 8;
                           break;
                   }
                   this.fieldName=tmpArray[1];
               }
               else if (tmpArray[0] !== 'button') {
                   /*console.log("chyba działa")*/
                   switch (tmpArray[0]) {
                       case "input":
                           this.form = 1;
                           break;
                       case "checkbox":
                           this.form = 4;
                           break;
                       case "header":
                           this.form = 2;
                           break;
                       case "options":
                           this.form = 5;
                           break;
                       case "date":
                           this.form = 6;
                           break;
                       case "textArea":
                           this.form = 7;
                           break;
                       case "image":
                           this.form = 8;
                           break;
                   }
                   if(this.fieldName === "")
                   {
                       this.changeFieldName(this.form);
                   }
               }
           }else this.form = 0;
            var a = 'validateTab' + this.rowN + this.id;
            bus.$on(a, (v) => {
                this.validationTab = v;
                /*console.log("paralaal");
                console.log(this.validationTab)
                console.log("paralaal");*/
            });
            var aa = 'getConfigFromColumn' + this.rowN + this.id;
            bus.$on(aa, () => {
                this.sendConfig();
            });

            var aaa = 'droppedInnerColumn' + this.rowN + this.id;
            bus.$on(aaa, (v) => {
                this.form = v[0];
                this.fieldName = v[1]
            });

            var aaaa = 'changeFirstColumn' + this.rowN;
            bus.$on(aaaa, (v) => {
                //console.log("column")
                this.form = v;
            });
            bus.$on('changePreview',(v)=>{
                let tmpArray = v.split(',');
                /*console.log('lol2')*/
                if(tmpArray.length>1)
                {
                    switch (tmpArray[0]) {
                        case "button":
                            this.preview=0;
                            break;
                        case "input":
                            this.preview = 1;
                            break;
                        case "checkbox":
                            this.preview = 4;
                            break;
                        case "header":
                            this.preview = 2;
                            break;
                        case "options":
                            this.preview = 5;
                            break;
                        case "date":
                            this.preview = 6;
                            break;
                        case "textArea":
                            this.preview = 7;
                            break;
                        case "image":
                            this.preview = 8;
                            this.previewImage=null;
                            this.previewImageBefore=null;
                            break;
                    }
                    this.previewFieldName=tmpArray[1];
                }
                else if (tmpArray[0] !== '') {
                    /*console.log("chyba działa")*/
                    switch (tmpArray[0]) {
                        case "button":
                            this.preview=0;
                            break;
                        case "input":
                            this.preview = 1;
                            break;
                        case "checkbox":
                            this.preview = 4;
                            break;
                        case "header":
                            this.preview = 2;
                            break;
                        case "options":
                            this.preview = 5;
                            break;
                        case "date":
                            this.preview = 6;
                            break;
                        case "textArea":
                            this.preview = 7;
                            break;
                        case "image":
                            this.preview = 8;
                            this.previewImage=null;
                            this.previewImageBefore=null;
                            break;
                    }
                }
                this.previewBefore=this.form;
            });
            bus.$on('changeInnerPreview',(v)=>{
                /*console.log('lol2')*/

                if (v[0] || v[0]===0) {
                    /*console.log("chyba działa")*/
                    switch (v[0]) {
                        case 0:
                            this.preview = 0;
                            break;
                        case 1:
                            this.preview = 1;
                            break;
                        case 4:
                            this.preview = 4;
                            break;
                        case 2:
                            this.preview = 2;
                            break;
                        case 5:
                            this.preview = 5;
                            break;
                        case 6:
                            this.preview = 6;
                            break;
                        case 7:
                            this.preview = 7;
                            break;
                        case 8:
                            this.preview = 8;
                            break;
                    }
                }

                this.previewFieldName=v[1];
                this.beforePreviewFieldName=this.fieldName;


                this.previewBefore=this.form;

            });
            bus.$on('changeInnerImagePreview',(v)=>{
                this.previewImage=v;
                this.previewImageBefore=this.image;
            })
            bus.$on('previewColumnSwitch',(v)=>{
                this.previewColumnSwitch=v;
            });
            bus.$on('movingColumn',(v)=>{
                this.movingColumn=v
            });
            bus.$on('Column'+this.id+''+this.rowN,(v)=>{
                    this.form=v[0];
                    this.fieldName=v[1]
            });
            bus.$on('closeModals',()=>{
                this.showModal=false;
            });
            bus.$on('allowPreview',()=>{
                this.allowPreview=true;
            });
            bus.$on('stopPreview',()=>{
                this.allowPreview=false;
            });
            bus.$on('changeFieldName',(v)=>{
              this.fieldName=v;
            });
            bus.$on('switchBack'+'Column'+this.id+''+this.rowN,()=>{
                this.form=this.previewBefore;
                this.fieldName=this.beforePreviewFieldName;
            });
            bus.$on('columnIsDragged',(v)=>{
                  this.columnIsDragged=v;
            })
        }
    }
</script>
<style scoped>

  .bounce-enter-active * {
    animation: bounce-in .5s;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .vuelidate *{
    transition: all ease 0.5s;
  }
  .show *{
    opacity: 1
  }
  .hide *{
    opacity: 0;
    display:none;
  }
  .modal-backdrop.show{
    position: inherit;
  }
  .modal{
    position: fixed;
    right: 0;
    top: 0;
    width: 0;
    height: 0;
  }
  .modal-dialog{
    position: fixed;
    right: 0;
    top: 0;
    width: 24%;
  }
  .rightAlignClass {
    text-align: right;
    transition: 1s;
  }

  .leftAlignClass {
    text-align: left;
    transition: 1s;
  }

  .centerAlignClass {
    text-align: center;
    transition: 1s;
  }

  input {
    padding: 0.75rem 1.2rem;
    border-radius: 5px;
    border: 1px solid rgba(190,190,190,1);
    outline-color: #007bff;
    width: 100%;
  }
  label {
    width: 250px;
  }
  .formColumn:hover .aligneButton {
    opacity: 1;

  }

  textarea {
    width: 100%;
  }

  input:focus {
    outline: dimgray !important;
    border: 1px solid black;
  }

  h1 {
    color: gray;
  }


  .form-select {
    width: 100%;
  }
  .mr-2 {
    width: 68px;
    height: 45px;
    transition: ease-out .3s;
    background-color: transparent;
    color:rgba(190,190,190,1);
  }

  .mr-2:hover {
    color: white;
    background-color: rgba(190,190,190,1);
  }

  .btn-secondary-close {
    background-color: transparent;
    border: 0;
    font-weight: 900;
    font-size: 25px;
    padding: 0;
  }

  .modal-footer {
    text-align: center;
    justify-content: center;
  }

  .footer-close {
    background-color: transparent;
    color: rgba(190,190,190,1);
    transition: ease-out 0.5s;
    border: 1px solid rgba(190,190,190,1);
    padding: 5px 5px;
    border-radius: 15px;
  }

  .footer-close:hover {
    border-color: black;
    color: black;
  }


  .formColumn {
    display: flex;
    min-height: 100px;
  }
  .columnButtons button {
    background-color: transparent;
    border: 0;
    padding: 0;
    vertical-align: middle;
    position: relative;
  }

  .columnButtons button svg {
    width: 100%;
    font-size: 20px;
    color: #007bff;
    vertical-align: middle;
    transition: .5s;

  }

  .columnButtons button svg:hover {
    color: #0dcaf0;

  }

  .contentColumn {
    flex-grow: 60;
    cursor: move;
  }

  .numberInput {
    width: 60px;
  }

  .modalValidateOptions {
    gap: 0.5rem;
    grid-template-columns: repeat(3, 30%);
    display: grid;
    width: 100%;
  }
  .modalValidateOptions label{
    width: 100%;
  }
</style>
