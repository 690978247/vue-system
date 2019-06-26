import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'
import elDragDialog from '@/directive/el-drag-dialog'
import { debounce } from '@/utils'

export const myMixin = {
  name: 'myMixin',
  directives: { elDragDialog },
  components: { Pagination },
  computed: {
    ...mapGetters(['pagesize_setting'])
  },
  data() {
    return {
      mixLabelWidth: '110px',
      mixIsHideSearch: false,
      mixTop: null,
      mixCloneTop: null,
      mixTabelMaxHeight: 100
    }
  },
  mounted() {
    this.mixSetHight()

    const that = this
    /*     window.onresize = function temp() {
      that.mixSetHight()
    } */
    this.__resizeHandler = debounce(() => {
      that.mixSetHight()
    }, 300)
    window.addEventListener('resize', this.__resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.__resizeHandler)
  },
  methods: {
    // 隐藏查询块
    hideSearch() {
      this.mixIsHideSearch = !this.mixIsHideSearch
    },
    // 设置表格高度
    mixSetHight() {
      this.$nextTick(() => {
        var result =
          this.$refs.page.$el.offsetHeight -
          this.$refs.searchblock.$el.clientHeight -
          10

        this.mixTabelMaxHeight = result - 120
      })
    }
  }
}
