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
        helpers: [],
        searchQuery: '',  // Add this
        gradeFilter: 'All', // filter for helpers by grade; 'All' means no grade filtering
        givingFilter: 'All' // filter services by giving type; 'All' means no giving filtering
      }
  },
  computed: {
   // Filter services based on search query
    filteredServices() {
      const q = this.searchQuery.trim().toLowerCase()
      return this.services.filter(service => {
        // Giving filter: if a specific giving type is chosen, require the service to include it
        if (this.givingFilter && this.givingFilter !== 'All') {
          if (!service.giving || !service.giving.map(g => g.toLowerCase()).includes(this.givingFilter.toLowerCase())) {
            return false
          }
        }

        if (!q) return true

        return (
          (service.title && service.title.toLowerCase().includes(q)) ||
          (service.blurb && service.blurb.toLowerCase().includes(q)) ||
          (service.description && service.description.toLowerCase().includes(q))
        )
      })
    },

    givingOptions() {
      const set = new Set()
      this.services.forEach(svc => {
        if (Array.isArray(svc.giving)) {
          svc.giving.forEach(g => set.add((g || '').toString().toLowerCase()))
        }
      })
      return Array.from(set).sort()
    },

	// Filter helpers based on search query
    filteredHelpers() {
      const q = this.searchQuery.trim().toLowerCase()
      return this.helpers.filter(helper => {
        // Grade filter
        if (this.gradeFilter && this.gradeFilter !== 'All') {
          if (!helper.grade || helper.grade.toLowerCase() !== this.gradeFilter.toLowerCase()) {
            return false
          }
        }

        const name = ((helper.name && helper.name.first) ? (helper.name.first + ' ' + (helper.name.last || '')) : '').toLowerCase()
        const blurb = (helper.blurb || '').toLowerCase()
        const location = (helper.location || '').toLowerCase()

        if (!q) return true

        return name.includes(q) || blurb.includes(q) || location.includes(q)
      })
    }
  },
  methods: {
    /* Format dates */
    makeTextDate(dateArray){
      let month = ""
      let theDate = ""
      if(dateArray[1] === 1){
        month = "Jan."
      } else if (dateArray[1] === 2){
        month = "Feb."
      } else if (dateArray[1] === 3){
        month = "Mar."
      } else if (dateArray[1] === 4){
        month = "Apr."
      } else if (dateArray[1] === 5){
        month = "May"
      } else if (dateArray[1] === 6){
        month = "Jun."
      } else if (dateArray[1] === 7){
        month = "Jul."
      } else if (dateArray[1] === 8){
        month = "Aug."
      } else if (dateArray[1] === 9){
        month = "Sep."
      } else if (dateArray[1] === 10){
        month = "Oct."
      } else if (dateArray[1] === 11){
        month = "Nov."
      } else {
        month = "Dec."
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

    ,capitalize(str){
      if(!str) return ''
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
}
});

vueApp.mount("#app");

