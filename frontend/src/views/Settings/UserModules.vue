<template>
    <div>
        <div class="pa-5">
    <v-card class="card-style" >
    <v-row>
    <v-col cols="12">
      <v-toolbar flat class="rounded-xl mb-7">
       <v-toolbar-title><strong>User Modules</strong></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
      class="white--text rounded-lg"
      color="#239FAB"
      @click="addStatus()"
      >
      <v-icon left>
        mdi-plus-box-outline
      </v-icon>
       Add New User Module
    </v-btn>
      </v-toolbar>
     <UserModuleDataTable ref="UserModuleDataTable"/>
    </v-col>
    </v-row>
    </v-card>
  </div>
   <UserModuleDialog :data="UserModuleData" :action="action"/>
    </div>
</template>

<script>
export default {
   name: 'Status',
    components: {
      UserModuleDataTable : () => import('../../components/Utils/UserModuleDataTable.vue'),
      UserModuleDialog : () => import('../../components/Dialogs/Forms/UserModuleDialog.vue'),
    },
    data: () => ({
      UserModuleData: [],
      action: null,
    }),
    methods: {
       addStatus(){
           this.UserModuleData = [{id: null}]
           this.action = 'Add'
       },
    }
}
</script>

<style>

</style>
