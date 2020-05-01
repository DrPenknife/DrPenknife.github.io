var app = new Vue({
  el: '#app',
  data: {
    currentRoute: "#landing"
  },
  computed: {
    ViewComponent () {
      return routes[this.currentRoute] || NotFound
    }
  },
  
  render (h) { return h(this.ViewComponent) }
})
   
window.onhashchange = function() {
  app.currentRoute = window.location.hash
}
  