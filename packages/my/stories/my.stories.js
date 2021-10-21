import LgMy from '../src/my.vue'

export default {
  title: 'LgMy',
  component: LgMy
}

export const My = _ => ({
  components: { LgMy },
  template: `
    <div>
      <lg-my></lg-my>
    </div>
  `
})