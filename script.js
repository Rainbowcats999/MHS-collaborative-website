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
  data() {
    
  },
  computed: {
   
  },
  methods: {
  }
});

vueApp.mount("#app");