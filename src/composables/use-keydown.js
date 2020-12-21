import {onBeforeUnmount} from 'vue';

let useKeydown = (keyCombos) => {
    let onkeydown = (event) => {
        console.log(event.key);

        let kc = keyCombos.find(kc => kc.key == event.key);
        if(kc) {
            kc.fn();
        }
    };
    window.addEventListener('keydown',onkeydown);

    onBeforeUnmount(() => {
        window.removeEventListener('keydown',onkeydown);
    });
};

export default useKeydown;