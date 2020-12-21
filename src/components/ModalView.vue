<template>
    <div class="modal">
        <div class="overlay" v-on:click="emit('closeModal')">

        </div>
        <div class="modal-card">
            <slot />
        </div>
    </div>
</template>

<script>

import useKeydown from '../composables/use-keydown';

export default {
   setup(props,{emit}) {

       useKeydown([
           { key:'Escape',fn:() => { emit('closeModal') }},
           { key:'Enter',fn:() => { console.log('Diff function') }}
       ]);

       return {
         emit
       };
   }
}
</script>