<template>
  <form class="analytical-method-form" name="analyticalmethodform" v-on:submit.prevent="submitForm">
    <div class="form-group">
      <span class="required-mark">*</span>
      <label class="control-label">Analytical Method ID</label>
      <input type="text" @change="removeSpaceMethodId" @keydown.space.prevent class="form-control" name="analyticalId" v-model="form.analyticalId" required />
    </div>
    <div class="form-group">
      <span class="required-mark">*</span>
      <label class="control-label">Target Residue Type</label>
      <select class="form-control" v-model="form.residueType" required="true">
        <option value="api">API</option>
        <option value="cleaning_agent">Cleaning Agent</option>
        <option value="bioburden">Bioburden</option>
        <option value="endotoxin">Endotoxin</option>
      </select>
    </div>
    <template v-if="form.residueType == 'api' || form.residueType == 'cleaning_agent'">
      <div>
        <div class="row">
          <div class="col-xs-12 col-md-6">
            <div class="form-group">
              <span class="required-mark">*</span>
              <label class="control-label">LOD (in ppm)</label>
              <input type="number" step="any" class="form-control" v-model="form[form.residueType].lod" required min="0" />
            </div>
          </div>
          <div class="col-xs-12 col-md-6">
            <div class="form-group">
              <span class="required-mark">*</span>
              <label class="control-label">LOQ (in ppm)</label>
              <input type="number" step="any" class="form-control" v-model="form[form.residueType].loq" required min="0" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <div v-if="!form[form.residueType].swab">
              <div class="block-btn add-btn" role="button" @click="addSamplingParameter('swab')">
                <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                <span>Configure Swab Sampling Parameters</span>
              </div>
            </div>
            <div v-if="form[form.residueType].swab">
              <div class="block-btn remove-btn" role="button" @click="removeSamplingParameter('swab')">
                <span>Remove Swab Sampling Parameters</span>
              </div>
              <div class="parameters-container">
                <div class="form-group">
                  <span class="required-mark">*</span>
                  <label class="control-label">Method Used</label>
                  <input type="text" class="form-control" v-model="form[form.residueType].swab.method" required />
                </div>
                <div class="row">
                  <div class="col-xs-12 col-md-6">
                    <div class="form-group">
                      <span class="required-mark">*</span>
                      <label class="control-label">Solvent Name</label>
                      <input type="text" class="form-control" v-model="form[form.residueType].swab.solventName" required />
                    </div>
                  </div>
                  <div class="col-xs-12 col-md-6">
                    <div class="form-group">
                      <span class="required-mark">*</span>
                      <label class="control-label">Solvent Quantity (ml)</label>
                      <input type="number" step="any" min="0" class="form-control" v-model="form[form.residueType].swab.solventQuantity" required />
                    </div>
                  </div>
                </div>
                <div class="form-group">
                  <span class="required-mark">*</span>
                  <label class="control-label">Default Recovery (%)</label>
                  <input type="number" step="any" class="form-control" v-model="form[form.residueType].swab.recovery" required min="0" max="100" />
                </div>
                <div v-if="!form[form.residueType].swab.moc || !form[form.residueType].swab.moc.length">
                  <div class="block-btn add-btn" role="button" @click="addMoc('swab')">
                    <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                    <span>Add MOC</span>
                  </div>
                </div>
                <div v-if="form[form.residueType].swab.moc && form[form.residueType].swab.moc.length" class="moc-wrapper">
                  <div class="row">
                    <div class="col-xs-7">
                      <span class="required-mark">*</span>
                      <label class="control-label">Select MOC</label>
                    </div>
                    <div class="col-xs-5">
                      <span class="required-mark">*</span>
                      <label class="control-label">Recovery (%)</label>
                    </div>
                  </div>
                  <div class="row" v-for="(material, index) in form[form.residueType].swab.moc" :key="index">
                    <div class="col-xs-7">
                      <div class="form-group">
                        <select class="form-control" v-model="material.name" required="true">
                          <option v-for="option in materialOptions" :key="option.value" :value="option.value">
                            {{option.label}}
                          </option>
                          <!-- <option value="steel">Stainless Steel</option>
                          <option value="glass">Glass</option>
                          <option value="teflon">Teflon</option>
                          <option value="plastic">Plastic</option> -->
                        </select>
                      </div>
                    </div>
                    <div class="col-xs-3">
                      <div class="form-group">
                        <input type="number" step="any" v-model="material.recovery" class="form-control" required min="0" max="100" />
                      </div>
                    </div>
                    <div class="col-xs-2">
                      <span class="glyphicon glyphicon-remove" role="button" @click="removeMoc('swab', index)"></span>
                    </div>
                  </div>
                  <div class="row" v-if="form[form.residueType].swab.showCreateMoc">
                    <div class="col-xs-7">
                      <div class="form-group">
                        <input type="text" class="form-control" v-model="form[form.residueType].swab.newMoc" required="true" />
                      </div>
                    </div>
                    <div class="col-xs-5">
                      <button type="button" class="btn btn-link btn-theme" @click="saveMoc('swab')">
                        Save
                      </button>
                      <button type="button" class="btn btn-link btn-theme" @click="cancelMoc('swab')">
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div>
                    <button type="button" class="btn btn-link btn-theme" @click="addMoc('swab')">
                      <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                      Add another
                    </button>
                    <span>or</span>
                    <button type="button" class="btn btn-link btn-theme" @click="createMoc('swab')">
                      Create a new MOC
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <div v-if="!form[form.residueType].rinse">
              <div class="block-btn add-btn" role="button" @click="addSamplingParameter('rinse')">
                <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                <span>Configure Rinse Sampling Parameters</span>
              </div>
            </div>
            <div v-if="form[form.residueType].rinse">
              <div class="block-btn remove-btn" role="button" @click="removeSamplingParameter('rinse')">
                <span>Remove Rinse Sampling Parameters</span>
              </div>
              <div class="parameters-container">
                <div class="form-group">
                  <span class="required-mark">*</span>
                  <label class="control-label">Method Used</label>
                  <input type="text" class="form-control" v-model="form[form.residueType].rinse.method" required />
                </div>
                <div class="form-group">
                  <span class="required-mark">*</span>
                  <label class="control-label">Default Recovery (%)</label>
                  <input type="number" step="any" class="form-control" v-model="form[form.residueType].rinse.recovery" required min="0" max="100" />
                </div>
                <div v-if="!form[form.residueType].rinse.moc || !form[form.residueType].rinse.moc.length">
                  <div class="block-btn add-btn" role="button" @click="addMoc('rinse')">
                    <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                    <span>Add MOC</span>
                  </div>
                </div>
                <div v-if="form[form.residueType].rinse.moc && form[form.residueType].rinse.moc.length" class="moc-wrapper">
                  <div class="row">
                    <div class="col-xs-7">
                      <span class="required-mark">*</span>
                      <label class="control-label">Select MOC</label>
                    </div>
                    <div class="col-xs-5">
                      <span class="required-mark">*</span>
                      <label class="control-label">Recovery (%)</label>
                    </div>
                  </div>
                  <div class="row" v-for="material in form[form.residueType].rinse.moc" :key="index">
                    <div class="col-xs-7">
                      <div class="form-group">
                        <select class="form-control" v-model="material.name" required="true">
                          <option v-for="option in materialOptions" :key="option.value" :value="option.value">
                            {{option.label}}
                          </option>
                          <!-- <option value="steel">Stainless Steel</option>
                          <option value="glass">Glass</option>
                          <option value="teflon">Teflon</option>
                          <option value="plastic">Plastic</option> -->
                        </select>
                      </div>
                    </div>
                    <div class="col-xs-3">
                      <div class="form-group">
                        <input type="number" step="any" v-model="material.recovery" min="0" max="100" class="form-control" required/>
                      </div>
                    </div>
                    <div class="col-xs-2">
                      <span class="glyphicon glyphicon-remove" role="button" @click="removeMoc('rinse', index)"></span>
                    </div>
                  </div>
                  <div class="row" v-if="form[form.residueType].rinse.showCreateMoc">
                    <div class="col-xs-7">
                      <div class="form-group">
                        <input type="text" class="form-control" v-model="form[form.residueType].rinse.newMoc" required="true" />
                      </div>
                    </div>
                    <div class="col-xs-5">
                      <button type="button" class="btn btn-link btn-theme" @click="saveMoc('rinse')">
                        Save
                      </button>
                      <button type="button" class="btn btn-link btn-theme" @click="cancelMoc('rinse')">
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div>
                    <button type="button" class="btn btn-link btn-theme" @click="addMoc('rinse')">
                      <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                      Add another
                    </button>
                    <span>or</span>
                    <button type="button" class="btn btn-link btn-theme" @click="createMoc('rinse')">
                      Create a new MOC
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="form.residueType === 'bioburden' || form.residueType === 'endotoxin'">
      <div>
        <div class="form-group">
          <span class="required-mark">*</span>
          <label class="control-label">Method Used</label>
          <input type="text" class="form-control" v-model="form[form.residueType].method" required />
        </div>
        <div class="form-group">
          <span class="required-mark">*</span>
          <label class="control-label">Define TNTC and TFTC limits?</label>
          <div>
            <label class="radio-inline">
              <input type="radio" name="defineLimits" value="1" v-model="form[form.residueType].defineLimits" required> Yes
            </label>
            <label class="radio-inline">
              <input type="radio" name="defineLimits" value="0" v-model="form[form.residueType].defineLimits" required> No
            </label>
          </div>
        </div>
        <div class="row" v-if="form[form.residueType].defineLimits == 1">
          <div class="col-xs-12 col-md-6">
            <div class="form-group">
              <span class="required-mark">*</span>
              <label class="control-label">TNTC Limit (in CFU)</label>
              <input type="number" step="any" class="form-control" v-model="form[form.residueType].TNTClimit" required min="0" />
            </div>
          </div>
          <div class="col-xs-12 col-md-6">
            <div class="form-group">
              <span class="required-mark">*</span>
              <label class="control-label">TFTC Limit (in CFU)</label>
              <input type="number" step="any" class="form-control" v-model="form[form.residueType].TFTClimit" required min="0" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <div v-if="!form[form.residueType].swab">
              <div class="block-btn add-btn" role="button" @click="addSamplingParameter('swab')">
                <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                <span>Configure Swab Sampling Parameters</span>
              </div>
            </div>
            <div v-if="form[form.residueType].swab">
              <div class="block-btn remove-btn" role="button" @click="removeSamplingParameter('swab')">
                <span>Remove Swab Sampling Parameters</span>
              </div>
              <div class="parameters-container">
                <div class="row">
                  <div class="col-xs-12 col-md-6">
                    <div class="form-group">
                      <label class="control-label">
                        <span class="required-mark">*</span>&nbsp;
                        Use Recovery for Swab?
                      </label>
                      <div>
                        <label class="radio-inline">
                          <input type="radio" name="useSwabRecovery" value="1" v-model="form[form.residueType].useSwabRecovery" required> Yes
                        </label>
                        <label class="radio-inline">
                          <input type="radio" name="useSwabRecovery" value="0" v-model="form[form.residueType].useSwabRecovery" required> No
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-xs-12 col-md-6" v-if="form[form.residueType].useSwabRecovery == 1">
                    <div class="form-group">
                      <span class="required-mark">*</span>
                      <label class="control-label">Default Recovery (%)</label>
                      <input type="number" step="any" class="form-control" v-model="form[form.residueType].swab.recovery" required min="0" max="100" />
                    </div>
                  </div>
                </div>
                <div v-if="!form[form.residueType].swab.moc || !form[form.residueType].swab.moc.length">
                  <div class="block-btn add-btn" role="button" @click="addMoc('swab')">
                    <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                    <span>Add MOC</span>
                  </div>
                </div>
                <div v-if="form[form.residueType].swab.moc && form[form.residueType].swab.moc.length" class="moc-wrapper">
                  <div class="row">
                    <div class="col-xs-7">
                      <span class="required-mark">*</span>
                      <label class="control-label">Select MOC</label>
                    </div>
                    <div class="col-xs-5">
                      <span class="required-mark">*</span>
                      <label class="control-label">Recovery (%)</label>
                    </div>
                  </div>
                  <div class="row" v-for="(material, index) in form[form.residueType].swab.moc" :key="index">
                    <div class="col-xs-7">
                      <div class="form-group">
                        <select class="form-control" v-model="material.name" required="true">
                          <option v-for="option in materialOptions" :key="option.value" :value="option.value">
                            {{option.label}}
                          </option>
                          <!-- <option value="steel">Stainless Steel</option>
                          <option value="glass">Glass</option>
                          <option value="teflon">Teflon</option>
                          <option value="plastic">Plastic</option> -->
                        </select>
                      </div>
                    </div>
                    <div class="col-xs-3">
                      <div class="form-group">
                        <input type="number" step="any" v-model="material.recovery" class="form-control" required min="0" max="100" />
                      </div>
                    </div>
                    <div class="col-xs-2">
                      <span class="glyphicon glyphicon-remove" role="button" @click="removeMoc('swab', index)"></span>
                    </div>
                  </div>
                  <div class="row" v-if="form[form.residueType].swab.showCreateMoc">
                    <div class="col-xs-7">
                      <div class="form-group">
                        <input type="text" class="form-control" v-model="form[form.residueType].swab.newMoc" required="true" />
                      </div>
                    </div>
                    <div class="col-xs-5">
                      <button type="button" class="btn btn-link btn-theme" @click="saveMoc('swab')">
                        Save
                      </button>
                      <button type="button" class="btn btn-link btn-theme" @click="cancelMoc('swab')">
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div>
                    <button type="button" class="btn btn-link btn-theme" @click="addMoc('swab')">
                      <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                      Add another
                    </button>
                    <span>or</span>
                    <button type="button" class="btn btn-link btn-theme" @click="createMoc('swab')">
                      Create a new MOC
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-12">
            <div v-if="!form[form.residueType].rinse">
              <div class="block-btn add-btn" role="button" @click="addSamplingParameter('rinse')">
                <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                <span>Configure Rinse Sampling Parameters</span>
              </div>
            </div>
            <div v-if="form[form.residueType].rinse">
              <div class="block-btn remove-btn" role="button" @click="removeSamplingParameter('rinse')">
                <span>Remove Rinse Sampling Parameters</span>
              </div>
              <div class="parameters-container">
                <div class="form-group">
                  <span class="required-mark">*</span>
                  <label class="control-label">Solvent Name</label>
                  <input type="text" class="form-control" v-model="form[form.residueType].rinse.solvent" required />
                </div>
                <div class="row">
                  <div class="col-xs-12 col-md-6">
                    <div class="form-group">
                      <label class="control-label">
                        <span class="required-mark">*</span>&nbsp;
                        Use Recovery for Rinse?
                      </label>
                      <div>
                        <label class="radio-inline">
                          <input type="radio" name="useRinseRecovery" value="1" v-model="form[form.residueType].useRinseRecovery" required> Yes
                        </label>
                        <label class="radio-inline">
                          <input type="radio" name="useRinseRecovery" value="0" v-model="form[form.residueType].useRinseRecovery" required> No
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="col-xs-12 col-md-6" v-if="form[form.residueType].useRinseRecovery == 1">
                    <div class="form-group">
                      <span class="required-mark">*</span>
                      <label class="control-label">Default Recovery (%)</label>
                      <input type="number" step="any" class="form-control" v-model="form[form.residueType].rinse.recovery" required min="0" max="100" />
                    </div>
                  </div>
                </div>
                <div v-if="!form[form.residueType].rinse.moc || !form[form.residueType].rinse.moc.length">
                  <div class="block-btn add-btn" role="button" @click="addMoc('rinse')">
                    <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                    <span>Add MOC</span>
                  </div>
                </div>
                <div v-if="form[form.residueType].rinse.moc && form[form.residueType].rinse.moc.length" class="moc-wrapper">
                  <div class="row">
                    <div class="col-xs-7">
                      <span class="required-mark">*</span>
                      <label class="control-label">Select MOC</label>
                    </div>
                    <div class="col-xs-5">
                      <span class="required-mark">*</span>
                      <label class="control-label">Recovery (%)</label>
                    </div>
                  </div>
                  <div class="row" v-for="(material, index) in form[form.residueType].rinse.moc" :key="index">
                    <div class="col-xs-7">
                      <div class="form-group">
                        <select class="form-control" v-model="material.name" required="true">
                          <option v-for="option in materialOptions" :key="option.value" :value="option.value">
                            {{option.label}}
                          </option>
                          <!-- <option value="steel">Stainless Steel</option>
                          <option value="glass">Glass</option>
                          <option value="teflon">Teflon</option>
                          <option value="plastic">Plastic</option> -->
                        </select>
                      </div>
                    </div>
                    <div class="col-xs-3">
                      <div class="form-group">
                        <input type="number" step="any" v-model="material.recovery" class="form-control" required min="0" max="100"/>
                      </div>
                    </div>
                    <div class="col-xs-2">
                      <span class="glyphicon glyphicon-remove" role="button" @click="removeMoc('rinse', index)"></span>
                    </div>
                  </div>
                  <div class="row" v-if="form[form.residueType].rinse.showCreateMoc">
                    <div class="col-xs-7">
                      <div class="form-group">
                        <input type="text" class="form-control" v-model="form[form.residueType].rinse.newMoc" required="true" />
                      </div>
                    </div>
                    <div class="col-xs-5">
                      <button type="button" class="btn btn-link btn-theme" @click="saveMoc('rinse')">
                        Save
                      </button>
                      <button type="button" class="btn btn-link btn-theme" @click="cancelMoc('rinse')">
                        Cancel
                      </button>
                    </div>
                  </div>
                  <div>
                    <button type="button" class="btn btn-link btn-theme" @click="addMoc('rinse')">
                      <span class="glyphicon glyphicon-remove-circle transform-add-icon"></span>
                      Add another
                    </button>
                    <span>or</span>
                    <button type="button" class="btn btn-link btn-theme" @click="createMoc('rinse')">
                      Create a new MOC
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div class="form-group">
      <span class="required-mark">*</span>
      <label class="control-label">Reason</label>
      <input type="text" class="form-control" v-model="form.reason" required />
    </div>
    <div class="action-panel">
      <button type="button" class="cancel-button btn btn-default" @click="resetForm()">Cancel</button>
      <button type="submit" class="pull-right update-button btn btn-primary">Update</button>
    </div>
  </form>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'method-form',
  data () {
    return {
      form: {},
      materialOptions:[],
    }
  },
  mounted(){
    this.resetForm();
    this.setMaterialOptions()
  },
  methods:{
    resetForm(){
      this.form = {
        analyticalId: '',
        residueType: null,
        reason:'',
        api:{},
        cleaning_agent:{},
        bioburden:{},
        endotoxin:{},
      };
    },
    addSamplingParameter(type){
      var residueType = this.form.residueType;
      Vue.set(this.form[residueType], type, {})
    },
    removeSamplingParameter(type){
      var residueType = this.form.residueType;
      this.form[residueType][type] = null;
    },
    addMoc(type){
      var residueType = this.form.residueType;
      if(!this.form[residueType][type].moc){
        Vue.set(this.form[residueType][type], 'moc', [])
      }
      this.form[residueType][type].moc.push({});
    },
    removeMoc(type,index){
      var residueType = this.form.residueType;
      if(this.form[residueType][type].moc && this.form[residueType][type].moc.length){
        this.form[residueType][type].moc.splice(index, 1);
      }
    },
    removeSpaceMethodId(){
      this.form.analyticalId = this.form.analyticalId.replace(/ /g, "")
    },
    submitForm(form){
      if(window.localStorage){
        let storedData = window.localStorage.getItem('ana-methods')
        if(!storedData){
          storedData = {}
        } else {
          storedData = JSON.parse(storedData)
        }
        let methodData = {
          analyticalId:this.form.analyticalId,
          residueType: this.form.residueType,
          reason: this.form.reason,
          api:{},
          cleaning_agent:{},
          bioburden:{},
          endotoxin:{},
        }
        methodData[this.form.residueType] = this.form[this.form.residueType]
        storedData[methodData.analyticalId] = methodData
        window.localStorage.setItem('ana-methods', JSON.stringify(storedData));
        this.$emit('methodAdded',methodData)
        this.resetForm()
        alert('Method Saved Successfully');
      }
    },
    setFormData(data){
      this.form = {}
      this.form = JSON.parse(JSON.stringify(data))
    },
    setMaterialOptions(){
      if(window.localStorage){
        let materialOptions = window.localStorage.getItem('materialOptions')
        this.materialOptions = JSON.parse(materialOptions)
      }
    },
    createMoc(type){
      var residueType = this.form.residueType;
      Vue.set(this.form[residueType][type],'showCreateMoc',true)
    },
    saveMoc(type){
      var residueType = this.form.residueType;
      if(!this.form[residueType][type].newMoc){
        alert('Please enter material name')
        return
      }
      this.materialOptions.push({
        value:this.form[residueType][type].newMoc.trim(),
        label:this.form[residueType][type].newMoc.trim(),
      })
      if(window.localStorage){
        window.localStorage.setItem('materialOptions', JSON.stringify(this.materialOptions))
      }
      this.form[residueType][type].showCreateMoc = false
    },
    cancelMoc(type){
      var residueType = this.form.residueType;
      this.form[residueType][type].showCreateMoc = false
    }
  }
}
</script>

<style lang="sass" scoped>
  @import "variables";
.analytical-method-form{
  margin-top:50px;
  padding-bottom: 100px;
  .required-mark{
    color:$theme-red;
  }
  .update-button{
    background-color: $theme-blue;
    color: $white;
  }
  .update-button:hover{
    background-color: darken($theme-blue,0.1);
  }
  .action-panel {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 15px;
    background: $theme-navy;
    border-top: 10px solid $theme-blue;
  }
  .glyphicon-remove-circle.transform-add-icon{
    transform: rotate(45deg);
  }
  .parameters-container {
    padding: 10px 15px;
    box-shadow: 0px 0px 4px 0px $theme-shadow;
    margin-bottom: 15px;
    border-radius: 4px;
  }
  .moc-wrapper {
    padding: 10px 10px;
    margin-bottom: 15px;
    background: $theme-grey;
    border-radius: 4px;
    .glyphicon-remove{
      margin-top: 10px;
    }
  }
  .block-btn{
    width:100%;
    text-align: center;
    border:1px solid;
    padding: 5px 0px;
    border-radius: 4px;
    margin-bottom: 15px;
    &.add-btn{
      border-color:$theme-blue;
      color:$theme-blue;
    }
    &.remove-btn{
      border-color:$theme-red;
      color:$theme-red;
    }
  }
  .btn-link.btn-theme {
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
