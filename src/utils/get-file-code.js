export default function getFileCode(ms) {
	return `
import {ref} from 'vue'
import helper from "@teresol-v2/usecase-hoc/helper";

export default function defineMS${ms}(hocProxy){
	const {activateView,goTo,activeView,fsm,header} =hocProxy;
	// ref values here
	const name = ref('Majid Ali, SDE');
	function printName(){
		console.log(name.value);
	}
	const megaSet${ms}Config ={
		screenTitle:ref('screen-title'),
		componentProps:{
			NameTextBox:{
				nameValue:name,
				isVisible:true,
			}
		}
	}
	const megaSet${ms}Handlers={
		// handle components events here
		"BackButton-onClick"() {
			goTo("KILL");
		},
    }
    return{
        ms${ms}:{
			/*group the exports here*/
			printName
		},
        megaSet${ms}Handlers,
        megaSet${ms}Config,
    }
}
    `;
}
