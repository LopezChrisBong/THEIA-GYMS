<template>
    <div>
        <div class="pa-5">
    <v-card class="card-style" >
    <v-row>
    <v-col cols="12">
      <v-toolbar flat class="rounded-xl mb-7">
       <v-toolbar-title><strong>Modules</strong></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
      class="white--text rounded-lg"
      color="#239FAB"
      @click="addStatus()"
      >
      <v-icon left>
        mdi-plus-box-outline
      </v-icon>
       Add New Module
    </v-btn>
      </v-toolbar>
     <ModuleDataTable ref="ModuleDataTable"/>
    </v-col>
    </v-row>
    </v-card>
  </div>
   <ModuleDialog :data="moduleData" :action="action"/>
    </div>
</template>

<script>
export default {
   name: 'Status',
    components: {
      ModuleDataTable : () => import('../../components/Utils/ModuleDataTable.vue'),
      ModuleDialog : () => import('../../components/Dialogs/Forms/ModuleDialog.vue'),
    },
    data: () => ({
      moduleData: [],
      action: null,
    }),
    methods: {
       addStatus(){
           this.moduleData = [{id: null}]
           this.action = 'Add'
       },
    }
}
</script>

<style>

</style>
