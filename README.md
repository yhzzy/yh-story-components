## CCD（Component-Driven Development）
自下而上，从组件级别开始，到页面级别结束

优点：
- 组件在最大程度被重用
- 并行开发
- 可视化测试

## 处理组件的边界情况
main.js
```javascript
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  data: {
    title: '根实例 - Root'
  },
  methods: {
    handle () {
      console.log(this.title)
    }
  }
}).$mount('#app')
```
- $root：响应式数据，小型的，少量数据的项目中使用，大量数据会难以维护
root.vue
```vue
<template>
  <div>
    <!--
      小型应用中可以在 vue 根实例里存储共享数据
      组件中可以通过 $root 访问根实例
    -->
    $root.title：{{ $root.title }}
    <br>
    <button @click="$root.handle">获取 title</button>&nbsp;&nbsp;
    <button @click="$root.title = 'Hello $root'">改变 title</button>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
```
- $parent/$children：响应式数据，出现问题难以跟踪位置
**$parent**
parent.vue
```vue
<template>
  <div class="parent">
    parent
    <child></child>
  </div>
</template>

<script>
import child from './02-child'
export default {
  components: {
    child
  },
  data () {
    return {
      title: '获取父组件实例'
    }
  },
  methods: {
    handle () {
      console.log(this.title)
    }
  }
}
</script>

<style>
.parent {
  border: palegreen 1px solid;
}
</style>
```
child.vue
```vue
<template>
  <div class="child">
    child<br>
    $parent.title：{{ $parent.title }}<br>
    <button @click="$parent.handle">获取 $parent.title</button>
    <button @click="$parent.title = 'Hello $parent.title'">改变 $parent.title</button>
  
    <grandson></grandson>
  </div>
</template>

<script>
import grandson from './03-grandson'
export default {
  components: {
    grandson
  }
}
</script>

<style>
.child {
  border:paleturquoise 1px solid;
}
</style>
```
grandson.vue
```vue
<template>
  <div class="grandson">
    grandson<br>
    $parent.$parent.title：{{ $parent.$parent.title }}<br>
    <button @click="$parent.$parent.handle">获取 $parent.$parent.title</button>
    <button @click="$parent.$parent.title = 'Hello $parent.$parent.title'">改变 $parent.$parent.title</button>
  </div>
</template>

<script>
export default {
}
</script>

<style>
.grandson {
  border:navajowhite 1px solid;
}
</style>
```
**$children**
parent.vue
```vue
<template>
  <div>
    <children1></children1>
    <children2></children2>

    <button @click="getChildren">获取子组件</button>
  </div>
</template>

<script>
import children1 from './02-children1'
import children2 from './03-children2'
export default {
  components: {
    children1,
    children2
  },
  methods: {
    getChildren () {
      console.log(this.$children)
      console.log(this.$children[0].title)
      console.log(this.$children[1].title)

      this.$children[0].handle()
      this.$children[1].handle()
    }
  }
}
</script>

<style>

</style>
```
children1.vue
```vue
<template>
  <div>children1</div>
</template>

<script>
export default {
  data () {
    return {
      title: 'children1 获取子组件 - title'
    }
  },
  methods: {
    handle () {
      console.log(this.title)
    }
  }
}
</script>

<style>

</style>
```
children2.vue
```vue
<template>
  <div>children2</div>
</template>

<script>
export default {
  data () {
    return {
      title: 'children2 获取子组件 - title'
    }
  },
  methods: {
    handle () {
      console.log(this.title)
    }
  }
}
</script>

<style>

</style>
```
- $refs：普通HTML标签上访问的是DOM对象，子组件上访问的是子组件对象，需要等待组件渲染完毕后使用ref获取，不能放在created生命周期中
parent.vue
```vue
<template>
  <div>
    <myinput ref="mytxt"></myinput>

    <button @click="focus">获取焦点</button>
  </div>
</template>

<script>
import myinput from './02-myinput'
export default {
  components: {
    myinput
  },
  methods: {
    focus () {
      this.$refs.mytxt.focus()
      this.$refs.mytxt.value = 'hello'
    }
  }
  // mounted () {
  //   this.$refs.mytxt.focus()
  // }
}
</script>

<style>

</style>
```
myinput.vue
```vue
<template>
  <div>
    <input v-model="value" type="text" ref="txt">
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: 'default'
    }
  },
  methods: {
    focus () {
      this.$refs.txt.focus()
    }
  }
}
</script>

<style>

</style>
```
- 依赖注入 provide/inject：组件嵌入较多时可以使用，用于子组件获取父组件中的数据，应避免直接修改父组件中的数据
parent.vue
```vue
<template>
  <div class="parent">
    parent
    <child></child>
  </div>
</template>

<script>
import child from './02-child'
export default {
  components: {
    child
  },
  provide () {
    return {
      title: this.title,
      handle: this.handle
    }
  },
  data () {
    return {
      title: '父组件 provide'
    }
  },
  methods: {
    handle () {
      console.log(this.title)
    }
  }
}
</script>

<style>
.parent {
  border: palegreen 1px solid;
}
</style>
```
child.vue
```vue
<template>
  <div class="child">
    child<br>
    title：{{ title }}<br>
    <button @click="handle">获取 title</button>
    <button @click="title='xxx'">改变 title</button>
    <grandson></grandson>
  </div>
</template>

<script>
import grandson from './03-grandson'
export default {
  components: {
    grandson
  },
  inject: ['title', 'handle']
}
</script>

<style>
.child {
  border:paleturquoise 1px solid;
}
</style>
```
grandson.vue
```vue
<template>
  <div class="grandson">
    grandson<br>
    title：{{ title }}<br>
    <button @click="handle">获取 title</button>
    <button @click="title='yyy'">改变 title</button>
  </div>
</template>

<script>
export default {
  inject: ['title', 'handle']
}
</script>

<style>
.grandson {
  border:navajowhite 1px solid;
}
</style>
```
- $attrs：把父组件中非prop属性绑定到内部组件，$listeners：把父组件中的DOM对象的**原生事件**绑定到内部组件
parent.vue
```vue
<template>
  <div>
    <!-- <myinput
      required
      placeholder="Enter your username"
      class="theme-dark"
      data-test="test">
    </myinput> -->


    <myinput
      required
      placeholder="Enter your username"
      class="theme-dark"
      @focus="onFocus"
      @input="onInput"
      data-test="test">
    </myinput>
    <button @click="handle">按钮</button>
  </div>
</template>

<script>
import myinput from './02-myinput'
export default {
  components: {
    myinput
  },
  methods: {
    handle () {
      console.log(this.value)
    },
    onFocus (e) {
      console.log(e)
    },
    onInput (e) {
      console.log(e.target.value)
    }
  }
}
</script>

<style>

</style>
```
myinput.vue
```vue
<template>
  <!--
    1. 从父组件传给自定义子组件的属性，如果没有 prop 接收
       会自动设置到子组件内部的最外层标签上
       如果是 class 和 style 的话，会合并最外层标签的 class 和 style 
  -->
  <!-- <input type="text" class="form-control" :placeholder="placeholder"> -->

  <!--
    2. 如果子组件中不想继承父组件传入的非 prop 属性，可以使用 inheritAttrs 禁用继承
       然后通过 v-bind="$attrs" 把外部传入的非 prop 属性设置给希望的标签上

       但是这不会改变 class 和 style
  -->
  <!-- <div>
    <input type="text" v-bind="$attrs" class="form-control">
  </div> -->


  <!--
    3. 注册事件
  -->

  <!-- <div>
    <input
      type="text"
      v-bind="$attrs"
      class="form-control"
      @focus="$emit('focus', $event)"
      @input="$emit('input', $event)"
    >
  </div> -->


  <!--
    4. $listeners
  -->

  <div>
    <input
      type="text"
      v-bind="$attrs"
      class="form-control"
      v-on="$listeners"
    >
  </div>
</template>

<script>
export default {
  // props: ['placeholder', 'style', 'class']
  // props: ['placeholder']
  inheritAttrs: false
}
</script>

<style>

</style>
```
## VueCLI快速原型开发
VueCLI中提供了一个插件可以进行快速原型开发，可进行少量组件开发
```shell
npm install -g@vue/cli-service-global
```
使用vue serve快速查看组件的运行效果
- vue serve如果不指定参数默认会在当前目录找以下的入口文件：main.js、index.js、App.vue、app.vue
- 可以指定要加载的组件：vue serve ./src/login.vue

**组件分类**
- 第三方组件
- 基础组件
- 业务组件

**结合ElementUI开发组件**
初始化package.json
```shell
$ npm init -y
```
安装ElementUI
```shell
$ vue add element
```
加载ElementUI，使用Vue.use()安装插件
main.js
```javascript
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Login from './src/Login.vue'

Vue.use(ElementUI)

new Vue({
  el: '#app',
  render: h => h(Login)
})
```
src/Login.vue
```vue
<template>
  <el-form class="form" ref="form" :model="user" :rules="rules">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="user.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input type="password" v-model="user.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="login">登 录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          },
          {
            min: 6,
            max: 12,
            message: '请输入6-12位密码'
          }
        ]
      }
    }
  },
  methods: {
    login () {
      console.log('button')
      return false
      // this.$refs.form.validate(valid => {
      //   if (valid) {
      //     alert('验证成功')
      //   } else {
      //     alert('验证失败')
      //     return false
      //   }
      // })
    }
  }
}
</script>

<style>
  .form {
    width: 30%;
    margin: 150px auto;
  }
</style>
```
```shell
$ vue serve
```

**开发一个步骤条组件**
steps.css
```css
.lg-steps {
  position: relative;
  display: flex;
  justify-content: space-between;
}

.lg-steps-line {
  position: absolute;
  height: 2px;
  top: 50%;
  left: 24px;
  right: 24px;
  transform: translateY(-50%);
  z-index: 1;
  background: rgb(223, 231, 239);
}

.lg-step {
  border: 2px solid;
  border-radius: 50%;
  height: 32px;
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  z-index: 2;
  background-color: white;
  box-sizing: border-box;
}
```
steps.vue
```vue
<template>
  <div class="lg-steps">
    <div class="lg-steps-line"></div>
    <div
      class="lg-step"
      v-for="index in count"
      :key="index"
      :style="{ color: active >= index ? activeColor : defaultColor }"
    >
      {{ index }}
    </div>
  </div>
</template>

<script>
import './steps.css'
export default {
  name: 'LgSteps',
  props: {
    count: {
      type: Number,
      default: 3
    },
    active: {
      type: Number,
      default: 0
    },
    activeColor: {
      type: String,
      default: 'red'
    },
    defaultColor: {
      type: String,
      default: 'green'
    }
  }
}
</script>

<style>

</style>
```
```shell
$ vue serve src/steps.vue
```

**模拟ElementUI封装表单组件**
form.vue
```vue
<template>
  <form>
    <slot></slot>
  </form>
</template>

<script>
export default {
  name: 'LgForm',
  provide () {
    return {
      form: this
    }
  },
  props: {
    model: {
      type: Object
    },
    rules: {
      type: Object
    }
  },
  methods: {
    validate (cb) {
      const tasks = this.$children
        .filter(child => child.prop)
        .map(child => child.validate())

      Promise.all(tasks)
        .then(() => cb(true))
        .catch(() => cb(false))
    }
  }
}
</script>

<style>

</style>
```
form-item.vue
```vue
<template>
  <div>
    <label>{{ label }}</label>
    <div>
      <slot></slot>
      <p v-if="errMessage">{{ errMessage }}</p>
    </div>
  </div>
</template>

<script>
import AsyncValidator from 'async-validator'
export default {
  name: 'LgFormItem',
  inject: ['form'],
  props: {
    label: {
      type: String
    },
    prop: {
      type: String
    }
  },
  mounted() {
    this.$on('validate', () => {
      console.log('xxxxx')
      this.validate()
    })
  },
  data () {
    return {
      errMessage: ''
    }
  },
  methods: {
    validate () {
      if (!this.prop) return
      const value = this.form.model[this.prop]
      const rules = this.form.rules[this.prop]

      const descriptor = { [this.prop]: rules }
      const validator = new AsyncValidator(descriptor)
      return validator.validate({ [this.prop]: value }, errors => {
        if (errors) {
          this.errMessage = errors[0].message
        } else {
          this.errMessage = ''
        }
      })
    }  
  }
}
</script>

<style>

</style>
```
input.vue
```vue
<template>
  <div>
    <input v-bind="$attrs" :type="type" :value="value" @input="handleInput">
  </div>
</template>

<script>
export default {
  name: 'LgInput',
  inheritAttrs: false,
  props: {
    value: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  methods: {
    handleInput (evt) {
      this.$emit('input', evt.target.value)
      const findParent = parent => {
        while (parent) {
          if (parent.$options.name === 'LgFormItem') {
            break
          } else {
            parent = parent.$parent
          }
        }
        return parent
      }
      const parent = findParent(this.$parent)
      if (parent) {
        parent.$emit('validate')
      }
    }
  }
}
</script>

<style>

</style>
```
button.vue
```vue
<template>
  <div>
    <button @click="handleClick"><slot></slot></button>
  </div>
</template>

<script>
export default {
  name: 'LgButton',
  methods: {
    handleClick (evt) {
      this.$emit('click', evt)
      evt.preventDefault();
    }
  }
}
</script>

<style>

</style>
```

## 组件库的开发

### 两种项目的组织方式
- Multirepo(Multiple)：每一个包对应一个项目
- Monorepo(Monolithic Repository)：一个项目仓库中管理多个模块/包

以Monorepo为例
**目录结构**
packages 放置所有组件
├── component1 包名
│   ├── __test__ 测试代码
│   ├── dist 打包目录
│   ├── index.js 打包入口
│   ├── LICENSE 版权信息
│   ├── package.json 包描述信息
│   ├── README.md
│   └── src vue组件源码
├── component2
├── component3
├── component4
└── component5

### 使用StoryBook可视化开发组件库
- 可视化的组件展示平台
- 在隔离的开发环境中，以交互式的方式展示组件
- 独立开发组件
- 支持的框架：React、React Native、Vue、Angular、Ember、HTML、Svelte、Mithril、Riot

**安装**
新建一个项目目录
```shell
$ npx -p @storybook/cli sb init --type vue
## 后边要用到yarn的工作区，推荐yarn安装
$ yarn add vue
$ yarn add vue-loader vue-template-compiler --dev
```
然后将Monorepo结构的packages新建到根目录下，并为每一个组件新建一个stories文件夹

**修改storybook配置文件，设置stories的代码源为packages下的*.stories.js**
.storybook/main.js
```javascript
module.exports = {
  "stories": [
    "../packages/**/*.stories.js",
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ]
}
```

**开发组件的story**
input/stories/input.stories.js
```javascript
import LgInput from '../'

export default {
  title: 'LgInput',
  component: LgInput
}

export const Text = () => ({
  components: { LgInput },
  template: '<lg-input v-model="value"></lg-input>',
  data () {
    return {
      value: 'admin'
    }
  }
})

export const Password = () => ({
  components: { LgInput },
  template: '<lg-input type="password" v-model="value"></lg-input>',
  data () {
    return {
      value: 'admin'
    }
  }
})
```
*如果需要单独给某一个包安装依赖，直接cd到该目录并通过yarn安装即可*
form/stories/form.stories.js
```javascript
import LgForm from '../'
import LgFormItem from '../../formitem'
import LgInput from '../../input'
import LgButton from '../../button'

export default {
  title: 'LgForm',
  component: LgForm
}

export const Login = () => ({
  components: { LgForm, LgFormItem, LgInput, LgButton },
  template: `
    <lg-form class="form" ref="form" :model="user" :rules="rules">
      <lg-form-item label="用户名" prop="username">
        <!-- <lg-input v-model="user.username"></lg-input> -->
        <lg-input :value="user.username" @input="user.username=$event" placeholder="请输入用户名"></lg-input>
      </lg-form-item>
      <lg-form-item label="密码" prop="password">
        <lg-input type="password" v-model="user.password"></lg-input>
      </lg-form-item>
      <lg-form-item>
        <lg-button type="primary" @click="login">登 录</lg-button>
      </lg-form-item>
    </lg-form>
  `,
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码'
          },
          {
            min: 6,
            max: 12,
            message: '请输入6-12位密码'
          }
        ]
      }
    }
  },
  methods: {
    login () {
      console.log('button')
      this.$refs.form.validate(valid => {
        if (valid) {
          alert('验证成功')
        } else {
          alert('验证失败')
          return false
        }
      })
    }
  }
})
```

**启动在线预览组件库**
```shell
$ yarn storybook
```

### 使用yarn workspaces提升管理packages中公共依赖包

**开启yarn的工作区**
项目根目录的package.json
```json
"private": true, // 发布到npm或github时禁止提交当前的根目录
"workspaces": [
  "packages/*"
]
```

**yarn workspaces的使用**
- 给工作区根目录安装开发依赖
```shell
## -W为开发工作区，表示安装到工作区的根目录下
$ yarn add jest -D -W
```
- 给指定工作区安装依赖
```shell
## lg-button为package.json中的name属性
$ yarn workspace lg-button add lodash@4
```
- 给所有的工作区安装依赖
```shell
$ yarn install
```

### 使用Lerna统一发布组件库
- Lerna是一个优化使用git和npm管理多包仓库的工作流工具
- 用于管理具有多个包的Javascript项目
- 它可以一键把代码提交到git和npm仓库

**Lerna的使用**
- 全局安装
```shell
$ yarn global add lerna
```
- 初始化
```shell
$ lerna init
```
- 发布
```shell
$ lerna publish
```