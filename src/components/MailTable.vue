<template>

  <button v-on:click="selectScreen('inbox')"
          v-bind:disabled="selectedScreen == 'inbox'">Inbox</button>
  <button  v-on:click="selectScreen('archive')"
           v-bind:disabled="selectedScreen == 'archive'">
  Archived
  </button>

  <bulk-action-bar v-bind:emails="filteredEmails" > </bulk-action-bar>
  <table class="mail-table">
    <tbody>
      <tr v-for="email in filteredEmails" 
          v-bind:key="email.id" 
          v-bind:class="['clickable',email.read ? 'read' : '']">
        <td> 
          <input type="checkbox" v-on:click="emailSelection.toggle(email)"
            v-bind:checked="emailSelection.emails.has(email)" /> 
        </td>
        <td v-on:click="openEmail(email)">{{email.from}}</td>
        <td v-on:click="openEmail(email)">
          <p><strong>{{email.subject}}</strong> - {{email.body}}</p>
        </td>
        <td class="date" v-on:click="openEmail(email)">
          {{format(new Date(email.sentAt),'MMM do yyyy')}}
        </td>
        <td><button v-on:click="archiveEmail(email)">Archive</button></td>
      </tr>
    </tbody>
  </table>

  <modal-view v-if="openedEmail" v-on:closeModal="closeEmail">
    <mail-view v-bind:email="openedEmail" v-on:changeEmail="changeEmail" />
  </modal-view>

</template>

<script>

import {format} from 'date-fns';
import {ref} from 'vue';
import axios from 'axios';
import MailView from './MailView.vue';
import ModalView from './ModalView.vue';
import { reactive } from 'vue';
import useEmailSelection from '../composables/use-email-selection';
import BulkActionBar from './BulkActionBar.vue';
 
export default {
   async setup() {
    let response = await axios.get('http://localhost:3000/emails/');
    let emails = response.data;

    return {
      emailSelection : useEmailSelection(),
      format,
      "emails": ref(emails),
      openedEmail: ref(null),
      selectedScreen: ref('inbox')
    }
  },
  components: {
      MailView,
      ModalView,
      BulkActionBar
  },
  computed: {
    sortedEmails() {
      return this.emails.sort((e1,e2) => {
        return e1.sentAt < e2.sentAt ? 1 : -1
      });
    },
    filteredEmails() {
      if(this.selectedScreen == 'inbox') {
        return this.sortedEmails.filter(e => !e.archived)
      } else {
        return this.sortedEmails.filter(e => e.archived);
      }      
    }
  },
  methods: {
      selectScreen(newScreen) {
        this.selectedScreen = newScreen;
        this.emailSelection.clear();
      },
      openEmail(email) {
        this.openedEmail = email;

        if(email) {
          email.read = true;
          this.updateEmail(email);
        }
           
      },
      archiveEmail(email) {
        email.archived = true;
        this.updateEmail(email);
      },
      updateEmail(email) {
          axios.put(`http://localhost:3000/emails/${email.id}`,email);
      },
      closeEmail() {      
        this.openedEmail = null;
      },
      changeEmail({toggleRead,toggleArchive,changeIndex,save,closeModal }) {
        let email = this.openedEmail;
        if(toggleRead) { email.read = !email.read }
        if(toggleArchive) { email.archived = !email.archived }
        if(save) { this.updateEmail(email) }
        if(closeModal) { this.openedEmail = null }

        if(changeIndex) {
          let emails = this.filteredEmails;
          let currentIndex = emails.indexOf(this.openedEmail);
          let newEmail = emails[currentIndex + changeIndex];
          this.openEmail(newEmail);
        }

      }
  }
}
</script>