<template>

  <div class="containerr">

        <div :class="[lNavBarOpened ? 'l-navbar-opened':'l-navbar-closed']" id="nav-bar">
          <div>

            <div style="width: 100%;">
            <a style="text-align: center; margin-right: 10px; font-size: 25px; float: right;" @click="lNavBarOpened=!lNavBarOpened">
              <div class="span-icon-rotate" :class="{'rotate-180':lNavBarOpened}">
                <i class="fas fa-angle-double-right"></i>
              </div>
            </a>
            </div>
            <div class="nav-header">
              <h2 v-if="lNavBarOpened">Menu</h2>
            </div>

            <ul class="nav-menu" v-if="lNavBarOpened">


              <li class="li-nav-menu"><button  class="nav-button-trigger" @click="downloadWholeConfig" >{{$t('pobierz')}}</button></li>

                <!--<button class="nav-button-trigger" @click="showNav=!showNav" v-b-toggle.collapse-1 variant="primary">
                <div class="span-icon-text">
                  <i class="fas fa-list"></i>  Lista opcji
                </div>
                <div class="span-icon-rotate" :class="{'rotate-90':showNav}">
                  <i class="fas fa-angle-right"/>
                </div>
              </button>-->


                            <li v-for="(item,index) in sideBarComponents" :id="index" :key="index" :draggable="true" @dragstart="dragStartEvent($event,item)"  @dragover.prevent class="componentsSideBar" @dragend="dragStopEvent">
                              <ul class="nav-menu" v-if="index===0" disabled='true' >
                                  <li>
                                    <button class='nav-button-trigger' style="cursor: pointer;" :draggable="true" v-b-toggle.collapse-form-static>

                                      <div class="span-icon-text">
                                        <i class="fas fa-list"></i>   {{$t(item.lan)}}
                                      </div>

                                    </button>
                                  </li>
                                  <b-collapse  id="collapse-form-static" class="mt-2">
                                    <hr/>
                                    <ul class="nav-menu" v-for="option in inputComponents" @dragstart="inputComponentType=option.opt">
                                      <li class="nav-button-trigger" style="cursor: move;" :draggable="true">{{option.opt}}</li>
                                    </ul>
                                    <hr/>
                                  </b-collapse>
                              </ul>
                              <span v-else disabled='true' class='nav-button-trigger' style="cursor: move;" :draggable="true"> {{$t(item.lan)}}</span>

                            </li>
              <li class="li-nav-menu">

                <button class="nav-button-trigger" v-b-toggle.collapse-language type="button" @click="showLanguages=!showLanguages">
                  <div class="span-icon-text">
                     Lista języków
                  </div>
                  <div class="span-icon-rotate">
                    <flag :iso="getActLan" v-bind:squared=false />
                  </div>
                </button>
                <b-collapse id="collapse-language" class="mt-2">
                    <ul class="px-3 py-2 left-pan-forms">

                      <li v-for="entry in languages" :key="entry.title"  class="componentsSideBar" >
                        <button class="nav-button-trigger"  @click="changeLocale(entry.language)" v-b-toggle.collapse-language><span style="width: 100%;"> {{entry.title}} </span> <span style="float: right"><flag :iso="entry.flag" v-bind:squared=false></flag></span> </button>
                      </li>
                    </ul>
                </b-collapse>
              </li>

            </ul>


        </div>

        </div>

        <Page style="flex-grow: 9;"></Page>

  </div>
</template>

<script>
  import Page from "./Page";
  import {bus} from'../main';
  import i18n from "../plugins/i18n";

export default {
  name: 'Main',

  data () {
    return {
        inputComponentType:'',
        lNavBarOpened:true,
        showLanguages:false,
        showNav:false,
        configFinale:[],
        index:0,
        colorButton:"#28a74",
        arrayEvent:[],
        languages: [
          { flag: 'us', language: 'en', title: 'English' },
          { flag: 'pl', language: 'pl', title: 'Polish' }
        ],
        sideBarComponents:[
            {lan:"field"},
            {lan:'checkbox'},
            {lan:'header'},
            {lan:'list'},
            {lan:'date'},
            {lan:'textarea'},
            {lan:'image'}
        ],
      inputComponents:[
        {opt:'Imie'},
        {opt:'Nazwisko'},
        {opt:'Email'},
        {opt:'Pesel'},
        {opt:'Telefon'},
        {opt:'Haslo'},
        {opt:'Potwierdz Haslo'}


      ]
    }
  },
  components:{
      Page
  },
  computed:{
    getActLan(){
      for(let i=0; i<this.languages.length;i++)
      {
        if(this.languages[i].language===i18n.locale)
          return this.languages[i].flag;
      }
    }
  },
    methods:{
      changeLocale(locale){
        i18n.locale=locale;
        /*console.log(i18n.locale);*/
      },
      downloadWholeConfig(){
          /*console.log('lol');*/
          bus.$emit('downloadWholeConfigFromPage');
      },

       dragStopEvent(){
           bus.$emit('letPreviewRow',false);
          this.arrayEvent=[];
       } ,
      dragStartEvent (evt,item){
        /*console.log("======")
        console.log(evt.target.id)
        console.log(item)
        console.log("======")*/
        /*console.log("dragging")*/
        evt.dataTransfer.dropEffect = 'move';
        evt.dataTransfer.effectAllowed = 'move';
        this.index= this.sideBarComponents.findIndex(x => x.lan === item.lan);
        let preview;
        if(this.index===0) {
          /*evt.dataTransfer.setData('itemID', "input");*/
          this.arrayEvent.push("input");
          this.arrayEvent.push(this.inputComponentType);
          evt.dataTransfer.setData('pageID', this.arrayEvent);
        }
        else if(this.index===1) {
          /*evt.dataTransfer.setData('itemID', "checkbox");*/
            this.arrayEvent.push("checkbox");
          evt.dataTransfer.setData('pageID', this.arrayEvent);
        }
        else if(this.index===2) {
         /* evt.dataTransfer.setData('itemID', "header");*/
            this.arrayEvent.push("header");
          evt.dataTransfer.setData('pageID', this.arrayEvent);
        }
        else if(this.index===3) {
          /*evt.dataTransfer.setData('itemID', "options");*/
            this.arrayEvent.push("options");
          evt.dataTransfer.setData('pageID', this.arrayEvent);
        }
        else if(this.index===4) {
          /*evt.dataTransfer.setData('itemID', "date");*/
            this.arrayEvent.push("date");
          evt.dataTransfer.setData('pageID', this.arrayEvent);
        }
        else if(this.index===5) {
          /*evt.dataTransfer.setData('itemID', "textArea");*/
            this.arrayEvent.push("textArea");
          evt.dataTransfer.setData('pageID',this.arrayEvent );
        }
        else if(this.index===6) {
            /*evt.dataTransfer.setData('itemID', "image");*/
            this.arrayEvent.push("image");
            evt.dataTransfer.setData('pageID', this.arrayEvent);
        }
        /*console.log(preview)*/
          if(this.arrayEvent.length>1)
            bus.$emit('changePreview',this.arrayEvent[0]+','+this.arrayEvent[1])
          else bus.$emit('changePreview',this.arrayEvent[0])

          bus.$emit('letPreviewRow',true);


        /*console.log(document.getElementById(item.id))*/
      },
      dragStart: e => {
        const target = e.target;

        e.dataTransfer.setData('card_id', target.id)

        setTimeout(() => {
          target.style.display = "none";
        },0)
      }
    },
    created(){

      bus.$on('configFinale',(v)=>{
          this.configFinale=[];
          this.configFinale.push(v);

          /*console.log(this.configFinale);*/
      })
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  @import url('https://fonts.googleapis.com/css2?family=Open+Sans&family=Poppins:wght@200&display=swap');
  .close-menu-button{
    position: relative;
    top: -35px;
    right: -41%;
  }
  .languageList{
    position: fixed;
    left: 15.5%;
  }
  .languageList li{
    list-style-type: none;
    margin-top: -20px;
  }
  .languageList ul{
    list-style-type: none;
  }
  .btn-primary{
    margin-top:5px;
  }
  .componentsSideBar{
    width: 100%;
    margin-top: 15px;
  }
  .componentsSideBar input::placeholder{
    color: white;
    opacity: 1;
  }
  :root {
    --header-height: 3rem;
    --nav-width: 68px;
    --first-color: #4723D9;
    --first-color-light: #AFA5D9;
    --white-color: #F7F6FB;
    --body-font: 'Nunito', sans-serif;
    --normal-font-size: 1rem;
    --z-fixed: 100
  }


</style>
