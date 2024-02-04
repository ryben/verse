
<script>

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data: function () {
    return {
    }
  },
  mounted: function () {
    window.addEventListener('storage', () => { this.loadFromLocalStorage() })

    this.loadUrlParams()
  },
  methods: {

    loadUrlParams: function () {
      let currentUrl = new URL(window.location.href)

      var isAutosizeText = currentUrl.searchParams.get("autosize")
      if (isAutosizeText != null && isAutosizeText.toLowerCase() != 'false') {
        this.isAutosizeText = true
      }
    },


  }
}
</script>
