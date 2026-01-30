const vueApp = Vue.createApp({

  created () {
    fetch('jsons/volunteer.json').then(response => response.json()).then(json => {
        this.services = json
    })

    fetch('jsons/students.json').then(response => response.json()).then(json => {
        this.helpers = json
    })
  },
  data() {
    return {
        services: [],
        helpers: []
      }
  },
  computed: {
   
  },
  methods: {
    /* Format dates */
    makeTextDate(dateArray){
      let month = ""
      let theDate = ""
      if(dateArray[1] === 1){
        month = "January"
      } else if (dateArray[1] === 2){
        month = "February"
      } else if (dateArray[1] === 3){
        month = "March"
      } else if (dateArray[1] === 4){
        month = "April"
      } else if (dateArray[1] === 5){
        month = "May"
      } else if (dateArray[1] === 6){
        month = "June"
      } else if (dateArray[1] === 7){
        month = "July"
      } else if (dateArray[1] === 8){
        month = "August"
      } else if (dateArray[1] === 9){
        month = "September"
      } else if (dateArray[1] === 10){
        month = "October"
      } else if (dateArray[1] === 11){
        month = "November"
      } else {
        month = "December"
      }

      theDate = month + " " + dateArray[2] + ", " + dateArray[0]
      return theDate
    },

    /* Rendering multiple hosts */
    renderHosts(hostsArray){
      let hostsText = ""

      if(hostsArray.length === 1){
        hostsText = hostsArray[0]
      } else {
        for(let i = 0; i < hostsArray.length; i++){
          if(i === hostsArray.length - 1){
            hostsText += "and " + hostsArray[i]
          } else {
            hostsText += hostsArray[i] + ", "
          }
        }
      }

      return hostsText
    }
  }
});

vueApp.mount("#app");

const myModal = document.getElementById('myModal')
const myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', () => {
  myInput.focus()
})