export default function(){
    return `
    import { computed, ref } from "vue";
import helper from "@teresol-v2/usecase-hoc/helper";

export default function (hocProxy) {
	const { activateView, goTo, fsm, focusComponent } = hocProxy;
	const passwordValue = ref(undefined);
	const userNameValue = ref(undefined);
	function isAuthDisabled() {
		return ![passwordValue, userNameValue].every((val) => !!val.value);
	}
	function savePassword(password) {
		passwordValue.value = password ?? undefined;
	}
	function saveUserName(userName) {
		userNameValue.value = userName ?? undefined;
	}

	const megaSet8Config = {
		screenTitle: ref("Authorization"),
		componentProps: {
			PasswordTextBox: {
				isVisible: true,
				isDisabled: false,
				label: "Password",
				passwordValue
			},
			UserNameTextBox: {
				isVisible: true,
				isDisabled: false,
				label: "User ID",
				userNameValue
			},
			AuthorizeButton: {
				isDisabled: computed(isAuthDisabled),
				isVisible: true,
				nativeType: "submit"
			},
			BackButton: {
				isVisible: true,
				isDisabled: false
			},
			ProgressBar: {
				isVisible: false
			},
			OkButton: {
				isVisible: false
			},

			Section1: {
				isVisible: true
			},
			Section2: {
				isVisible: true
			},
			Section3: {
				isVisible: true
			}
		}
	};
	const megaSet8Handlers = {
		vnodeMounted() {
			focusComponent("RefUserNameTextBox", "Password10");
			saveUserName(undefined);
			savePassword(undefined);
		},

		"BackButton-onClick"() {
			saveUserName(undefined);
			savePassword(undefined);
			goTo("MEGASET8_BACK", "MegaSet5");
		},
		async onSubmit() {
			try {
				const response = await fsm.post("MEGASET8_AUTHORIZE", {
					frontEndData: {
						userId: userNameValue.value,
						password: passwordValue.value
					}
				});
				helper.alert(response).then(() => {
					activateView("MegaSet12");
				});
			} catch (error) {
				helper.alert(error).then(() => {
					if (error?.response?.data?.errorMessage == "Invalid User ID") {
						saveUserName(undefined);
						savePassword(undefined);
						focusComponent("RefUserNameTextBox", "Password10");
					} else if (error?.response?.data?.errorMessage == "Invalid Password") {
						savePassword(undefined);
						focusComponent("RefPasswordTextBox", "Password10");
					} else {
						saveUserName(undefined);
						savePassword(undefined);
						focusComponent("RefUserNameTextBox", "Password10");
					}
				});
			}
		},
		"PasswordTextBox-onBlur": savePassword,
		"UserNameTextBox-onBlur": saveUserName,
		"PasswordTextBox-onKeyUp": savePassword,
		"UserNameTextBox-onKeyUp": saveUserName
	};
	return {
		megaSet8Config,
		megaSet8Handlers
	};
}
    `;
}