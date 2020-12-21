<template>
    <div class="bulk-action-bar">
        <span class="checkbox">
            <input type="checkbox" v-bind:checked="allEmailsSelected"
                v-bind:class="[someEmailsSelected ? 'partial-check' : '']"
                v-on:click="bulkSelect" />
        </span>
        <span class="buttons">
            <button v-on:click="emailSelection.markRead()"
                    v-bind:disabled="[...emailSelection.emails].every(e => e.read)">
                    Mark Read
            </button>
            <button v-on:click="emailSelection.markUnRead()"
                    v-bind:disabled="[...emailSelection.emails].every(e => !e.read)">
                Mark Unread
            </button>
            <button v-on:click="emailSelection.archive()" 
                    v-bind:disabled="numberSelected === 0">
                    Archive
            </button>
        </span>
    </div>
</template>

<script>
import useEmailSelection from '../composables/use-email-selection';
import { computed } from 'vue';

export default {
    setup(props) {
        let emailSelection = useEmailSelection();
        let numberSelected = computed(() => emailSelection.emails.size);
        let numberEmails = props.emails.length; 
        let allEmailsSelected = computed(() => numberSelected.value === numberEmails);
        let someEmailsSelected = computed(() => {
            return numberSelected.value > 0 && numberSelected.value < numberEmails
        });

        let bulkSelect = function() {
            if(allEmailsSelected.value) {
                emailSelection.clear()
            } else {
                emailSelection.addMultiple(props.emails)
            }
        };

        return {
            emailSelection,
            allEmailsSelected,
            someEmailsSelected,
            bulkSelect,
            numberSelected
        }
    },
    props: {
        emails: {
            type:Array,
            required:true
        }
    }
}
</script>