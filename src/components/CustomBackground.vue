<template>
    <div id="textShade">

    </div>
</template>

<script>


import { mapState } from 'vuex'
import { utils } from '@/utils/utils.js'
import { backgroundService } from '@/services/BackgroundService.js'


export default {

    data: function () {
        return {
        }
    },

    mounted: function () {
    },

    computed: {
        ...mapState(['isAddTextBg', 'selectedBg', 'bgImageCustomUrl']),
    },
    watch: {
        selectedBg: function (newVal) {
            if (newVal == backgroundService.BG_CUSTOM_URL) {
                this.applyCustomBg(this.bgImageCustomUrl)
            } else {
                this.applyStaticBg(newVal)
            }
        },
        isAddTextBg: function () {
            if (this.isAddTextBg == false) {
                document.getElementById('textShade').style.background = ''
            } else {
                document.getElementById('textShade').style.background = '#00000099'
            }
        },
        bgImageCustomUrl: function (newVal) {
            if (this.selectedBg == backgroundService.BG_CUSTOM_URL) {
                this.applyCustomBg(newVal)
            }
        }
    },

    methods: {
        applyStaticBg(filename) {
            let baseUrl = `${process.env.BASE_URL}backgrounds`

            let url = baseUrl + `/${filename}`
            this.applyBg(url)
        },
        applyBg(url) {
            const body = document.querySelector('body')
            body.style.background = 'url(\'' + url + '\')'
            body.style.backgroundSize = '100% 100%'
            body.style.overflow = 'hidden'

            this.$store.dispatch('updateErrorDisplay', "") // clear error message

            if (this.selectedBg == backgroundService.BG_CUSTOM_URL) {
                this.$store.dispatch('saveBgImageCustomUrl', url)
            }
        },
        async applyCustomBg(url) {
            if (utils.isNotEmpty(url)) {
                try {
                    let processedUrl = await backgroundService.processUrl(url)
                    this.applyBg(processedUrl)
                } catch (error) {
                    this.$store.dispatch('updateErrorDisplay', "Invalid Background URL")
                }
            }
        }
    },

}
</script>

<style>
#textShade {
    position: absolute;
    border-radius: clamp(0.1rem, 2vw + 3vh, 4rem);
    top: clamp(0.1rem, 1vw + 2vh, 2rem);
    left: clamp(0.1rem, 1vw + 2vh, 2rem);
    right: clamp(0.1rem, 1vw + 2vh, 2rem);
    bottom: clamp(0.1rem, 5vw + 7vh, 5rem);
}
</style>