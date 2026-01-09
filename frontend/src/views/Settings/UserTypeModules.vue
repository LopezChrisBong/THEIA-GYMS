<template>
    <div>
        <div class="pa-5">
    <v-card class="card-style" >
    <v-row>
    <v-col cols="12">
      <v-toolbar flat class="rounded-xl mb-7">
       <v-toolbar-title><strong>User Type Modules</strong></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
      class="white--text rounded-lg"
      color="#239FAB"
      @click="addStatus()"
      >
      <v-icon left>
        mdi-plus-box-outline
      </v-icon>
       Add New
    </v-btn>
      </v-toolbar>
     <UserTypeModuleDataTable ref="UserTypeModuleDataTable"/>
    </v-col>
    </v-row>
    </v-card>
  </div>
   <UserTypeModuleDialog :data="UserTypeModuleData" :action="action"/>
    </div>
</template>

<script>
export default {
   name: 'Status',
    components: {
      UserTypeModuleDataTable : () => import('../../components/Utils/UserTypeModuleDataTable.vue'),
      UserTypeModuleDialog : () => import('../../components/Dialogs/Forms/UserTypeModuleDialog.vue'),
    },
    data: () => ({
      UserTypeModuleData: [],
      action: null,
    }),
    methods: {
       addStatus(){
           this.UserTypeModuleData = [{id: null}]
           this.action = 'Add'
       },
    }
}
</script>

<style>

</style>
