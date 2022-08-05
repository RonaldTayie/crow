<template>
 <v-dialog v-model="is_open" width="320" >
   <v-card>
     <v-card-title>
       Add {{role[0].toString().toUpperCase()+role.substr(1,role.length)}}
       <v-spacer></v-spacer>
       <v-btn class="bg-danger" small @click="$emit('closeNewUserDialog')" icon>
         <v-icon>
           mdi-close
         </v-icon>
       </v-btn>
     </v-card-title>
     <form  lazy-validation @submit.prevent="doCreateUser">
       <v-card-text>
         <v-text-field dense required type="text" prepend-icon="mdi-account"  label="First Name" v-model="newUser.first_name" ></v-text-field>
         <v-text-field dense required type="text" prepend-icon="mdi-account-child-outline"  label="Last Name" v-model="newUser.last_name" ></v-text-field>
         <v-text-field dense required type="email" prepend-icon="mdi-email"  label="Email Address" v-model="newUser.email" ></v-text-field>
         <v-text-field dense required prepend-icon="mdi-calendar-arrow-left" type="date"  label="Date Of Birth" v-model="newUser.dob" ></v-text-field>
         <v-text-field dense reqiured type="text" prepend-icon="mdi-hand-coin-outline"  label="Role" :value="role[0].toString().toUpperCase()+role.substr(1,role.length) " readonly disabled ></v-text-field>
         <v-text-field dense password type="password" prepend-icon="mdi-lock" v-model="newUser.password" label="Password" ></v-text-field>
         <v-text-field dense password type="password" prepend-icon="mdi-lock" v-model="newUser.password2" label="Confirm Password" ></v-text-field>
       </v-card-text>
       <v-card-actions>
         <v-btn text type="submit" class="bg-primary" small>
           Submit
         </v-btn>
         <v-spacer></v-spacer>
         <v-btn text class="bg-warning" type="reset" color="black"  small>
           Reset
         </v-btn>
       </v-card-actions>
     </form>
   </v-card>
 </v-dialog>
</template>

<script>
import {mapActions} from "vuex";

export default {
  name: "AddDriverDialog",
  data: ()=>({
    state: false,
    roleField: null,
    formValid: false,
    newUser: {
      first_name: null,
      last_name: null,
      email: null,
      dob: null,
      password: null,
      password2: null
    },
    rules: [
      value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
    ],
  }),
  props: ['is_open','role'],
  methods: {
    ...mapActions(['createUser']),
    doCreateUser(){
      let user=  this.newUser
      user['username'] = this.newUser.email
      user['user_group'] = this.role[0].toString().toUpperCase()+this.role.substr(1,this.role.length)
      console.log(user)
      let result = this.createUser(user)
      if (result){
        this.$emit('snack',{message:`${user.user_group} Created`,type:'success'})
      }else{
        this.$emit('snack',{message:`${user.user_group} Addition Failed!!`,type:'warning'})
      }
      setTimeout(()=>{
        this.$emit('closeNewUserDialog')
      },2000)
    }
  }
}
</script>

<style scoped>

</style>