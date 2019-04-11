<template>
  <div id="app" class="container-fluid">
    <div class="row">
      <div class="col-md-2 left-panel">
        <h3>Saved Methods</h3>
        <ul class="list-unstyled method-list">
          <li v-for="(methodData, key) in analyticalMethods" :key="key" @click="setFormData(methodData)" role="button">
            {{key}}
          </li>
        </ul>
      </div>
      <div class="col-md-10 right-panel">
        <div class="row">
          <div class="col-md-4 col-md-offset-4">
            <method-form ref="method-form" v-on:methodAdded="updateMethods"></method-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MethodForm from './method-form'
import Vue from 'vue';

export default {
  name: 'app',
  mounted(){
    this.getSavedMethods()
  },
  components: {
    MethodForm
  },
  data(){
    return {
      analyticalMethods:{}
    }
  },
  methods:{
    getSavedMethods() {
      if(window.localStorage){
        let storedData = window.localStorage.getItem('ana-methods')
        if(storedData){
          this.analyticalMethods = JSON.parse(storedData)
        }
      }
    },
    setFormData(data) {
      this.$refs['method-form'].setFormData(data)
    },
    updateMethods(data){
      if(data){
        Vue.set(this.analyticalMethods, data.analyticalId, data)
      }
    }
  }
}
</script>
<style lang="sass" scoped>
  @import "variables";
  .left-panel{
    height:100vh;
    background-color: $theme-light-blue;
    .method-list{
      li {
        padding: 5px 15px;
        border-radius: 4px;
        transition: all linear 0.3s;
        &:hover{
          color:$white;
          background-color: $theme-blue;
        }
      }
    }
  }
  .right-panel{
    height:100vh;
    overflow: auto;
  }
</style>
