export default function () {
	return `
    const ms8 = {
	passwordValue: ref(undefined),
	userNameValue: ref(undefined),
	isAuthDisabled() {
		return ![ms8.passwordValue, ms8.userNameValue].every((val) => !!val.value);
	},
	savePassword(password) {
		ms8.passwordValue.value = password ?? undefined;
	},
	saveUserName(userName) {
		ms8.userNameValue.value = userName ?? undefined;
	}
};

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
			isDisabled: computed(ms8.isAuthDisabled),
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
		ms8.saveUserName(undefined);
		ms8.savePassword(undefined);
	},

	"BackButton-onClick"() {
		ms8.saveUserName(undefined);
		ms8.savePassword(undefined);
		goTo("MEGASET8_BACK", "MegaSet5");
	},
	async onSubmit() {
		try {
			const response = await fsm.post("MEGASET8_AUTHORIZE", {
				frontEndData: {
					userId: ms8.userNameValue.value,
					password: ms8.passwordValue.value
				}
			});
			helper.alert(response).then(() => {
				activateView("MegaSet12");
			});
		} catch (error) {
			helper.alert(error).then(() => {
				if (error?.response?.data?.errorMessage == "Invalid User ID") {
					ms8.saveUserName(undefined);
					ms8.savePassword(undefined);
					focusComponent("RefUserNameTextBox", "Password10");
				} else if (error?.response?.data?.errorMessage == "Invalid Password") {
					ms8.savePassword(undefined);
					focusComponent("RefPasswordTextBox", "Password10");
				} else {
					ms8.saveUserName(undefined);
					ms8.savePassword(undefined);
					focusComponent("RefUserNameTextBox", "Password10");
				}
			});
		}
	},
	"PasswordTextBox-onBlur": ms8.savePassword,
	"UserNameTextBox-onBlur": ms8.saveUserName,
	"PasswordTextBox-onKeyUp": ms8.savePassword,
	"UserNameTextBox-onKeyUp": ms8.saveUserName
}`;
}
