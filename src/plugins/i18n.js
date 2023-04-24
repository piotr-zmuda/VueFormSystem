import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
  'en': {accept:"Accept",ValueENPL:"Value",name:"Name",height:"height",optionName:"Option name",optionValue:"Option Value",width:"width",image:"image",wiersz:"row",dodaj:"add",pobierz:"download",leftNavButton: 'Options',field:'Form field', checkbox:'checkbox', header:'header',listField:'Field list',date:'date',textarea:'text area', confirmationfield: "Confirmation field", line:"line" },
  'pl': {accept:"Akceptuj",ValueENPL:"Wartość",name:"Nazwa",height:"wysokość",optionName:"Nazwa Opcji",optionValue:"Wartosc Opcji",width:"szerokość",image:"obraz",wiersz:"wiersz",dodaj:"dodaj",pobierz:"pobierz",leftNavButton: 'Opcje',field:'Pole formularza', checkbox:'checkbox', header:'Nagłowek',listField:'Pole listy',date:'data',textarea:'pole tekstowe', confirmationfield:'Pole zatwierdzające', line:"linia"}
};
const i18n = new VueI18n({
  locale: 'pl', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages, // set locale messages
});
export default i18n;
