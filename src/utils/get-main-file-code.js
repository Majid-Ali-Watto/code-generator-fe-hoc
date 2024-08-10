import getMS8SingleFile from "./getMS8SingleFile";

export default function createMainFile(MSs, ucName, singleFile) {
	const files = [...new Set(MSs.value.split(","))];

	let code = `
			import { FsmAjax, useUseCaseViewManager, defineUseCaseLoader } from "@teresol-v2/usecase-hoc/utils";
			import helper from "@teresol-v2/usecase-hoc/helper";
			import {computed,ref} from 'vue';`;

	for (let index = 0; index < files.length; index++) {
		code += `
			import MegaSet${files[index]} from "@teresol-v2/mega-set${files[index]}";`;
	}
	if (!singleFile.value) {
		for (let index = 0; index < files.length; index++) {
			code += `
				import defineMS${files[index]} from "./ms${files[index]}Def";`;
		}
	}
	code += `

		const hocName = "${ucName.value}"

		function hocSetup(props, { attrs, slots, emit, expose }) {
			const hocConfig = { fsmUrl: props.fsmUrl, batchRequired: false, activityCode: "CPUINQI", subActivityCode: "" };
			const fsm = new FsmAjax(hocConfig);
			const header = FsmAjax.header;`;
	if (!singleFile.value) {
		code += `const hocProxy = {
					fsm,
					header,
					activateView: (ms) => activateView(ms),
					close: (kill) => close(kill),
					activeView: () => computed(() => activeView),
					goTo: async function (trans, goto = "") {
						try {
							await fsm.post(trans);
							if (goto == "") close(false);
							else hocProxy.activateView(goto);
						} catch (e) {
							helper.alert(e);
						}
					},
					focusComponent: (msCompRef, compRef) => focusComponent(msCompRef, compRef)
			};
    `;
		for (let index = 0; index < files.length; index++) {
			code += `
					const { ms${files[index]}, megaSet${files[index]}Config, megaSet${files[index]}Handlers } = defineMS${files[index]}(hocProxy);`;
		}
	} else {
		for (let index = 0; index < files.length; index++) {
			if (files[index] == 8) code += getMS8SingleFile();
			else {
				code += `
				const ms${files[index]}={
					name:ref('Majid Ali, SDE'),
					printName(){
						console.log( ms${files[index]}.name.value);
					}
				}
				const megaSet${files[index]}Config={
				screenTitle:ref('screen-title'),
					componentProps:{
						NameTextBox:{
							nameValue: ms${files[index]}.name,
							isVisible:true,
						}}
				}
				const megaSet${files[index]}Handlers={
				// handle components events here
				"BackButton-onClick"() {
						goTo("KILL");
				},
				}\n`;
			}
		}
	}
	code += `\n\tconst views= [`;
	for (let index = 0; index < files.length; index++) {
		code += `
		{ name: "MegaSet${files[index]}", title: megaSet${files[index]}Config.screenTitle, component: MegaSet${files[index]}, props: { configObj: megaSet${files[index]}Config }, handlers: megaSet${files[index]}Handlers },`;
	}
	code += `
			];
			const { activateView, close, render, activeView,focusComponent } = useUseCaseViewManager(hocConfig, views, onInitialized, onError);

			function onInitialized(response) {
				console.clear();
				console.log(response);
				activateView("MegaSet${files.at(0)}");
			}

			function onError(error, _source) {
				helper.alert(error);
			}

			return render;
		}

		export default defineUseCaseLoader(hocName, hocSetup);`;
	return code;
}
