export default function () {
	return `
    <template>
    <div class="common-layout" v-if="isAuthenticated">
        <lockScreenDialog />
        <el-container style="height: 100vh" v-if="!$route.meta.hideNavbar">
            <el-container>
                <el-header>
                    <el-menu
                        background-color="rgb(0, 155, 131)"
                        text-color="black"
                    >
                        <el-row
                            class="headerRow"
                            style="padding-left: 18%; align-items: center"
                        >
                            <el-col :lg="16" :md="15">
                                <br />
                                <span class="Header globalFont">{{
                                    theTitle
                                }}</span>
                            </el-col>
                            <el-col :lg="7" :md="8">
                                <br />
                                <span class="Header globalFont">{{
                                    version
                                }}</span>
                            </el-col>
                            <el-col :lg="1" :md="1">
                                <br />
                                <el-button
                                    @click="closeModule"
                                    :tabindex="-1"
                                    :disabled="false"
                                    class="closeBtn globalFont"
                                    size="small"
                                >
                                    <el-icon class="closeIcon">
                                        <CloseBold />
                                    </el-icon>
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-menu>
                </el-header>
                <el-main>
                    <router-view style="padding-left: 18%" />
                </el-main>
                <el-footer>
                    <el-menu
                        background-color="rgb(0, 155, 131)"
                        text-color="black"
                    >
                        <el-row style="align-items: center">
                            <el-col :lg="6" :md="6">
                                <div style="border: 1px inset">
                                    <span class="Footer"
                                        >{{ getDay }} -
                                        {{ getfooterDate }}</span
                                    >
                                </div>
                            </el-col>
                            <el-col :lg="18" :md="18">
                                <div style="border: 1px inset">
                                    <span class="Footer"
                                        >{{ getFooter.loginBranch }} -
                                        {{ getFooter.loginUserId }}</span
                                    >
                                </div>
                            </el-col>
                        </el-row>
                    </el-menu>
                </el-footer>
            </el-container>
        </el-container>
        <div v-if="$route.meta.hideNavbar">
            <router-view></router-view>
        </div>
    </div>
    <div v-else>
        <h5>Loading...</h5>
    </div>
</template>
<script>
import { CloseBold } from "@element-plus/icons-vue";
import { reactive, toValue } from "vue";
import axios from "axios";
import { useStore } from "vuex";
import { getToken, useKeycloak } from "@teresol/vue-keycloak";
import { confirmOptions } from "../src/mixins/alertOption.js";
import { ElMessageBox } from "element-plus";
import lockScreenDialog from "./components/lockScreenDialog.vue";
const { isAuthenticated } = useKeycloak();
function preventKeyStroke(e) {
    e = e || window.event;
    if (
        (e.keyCode >= 8 && e.keyCode <= 68) ||
        (e.keyCode >= 69 && e.keyCode <= 103) ||
        (e.keyCode >= 104 && e.keyCode <= 222)
    ) {
        // If tab key is pressed
        e.preventDefault(); // Stop event from its action
    }
}
export default {
    components: {
        CloseBold,
        lockScreenDialog,
    },
    created() {
        window.addEventListener("keyup", this.keyUpHandler);
        window.addEventListener("keydown", this.keyDownHandler);
        window.addEventListener("keydown", this.handleKeyPress);
    },
    mounted() {
        console.log("mounted");
        if (typeof window !== "undefined") {
            document.addEventListener("keydown", this.handleKeyPress);
        }
    },
    beforeUnmount() {
        console.log("unMounted");
        window.removeEventListener("keyup", this.keyUpHandler);
        window.removeEventListener("keydown", this.keyDownHandler);
        if (typeof window !== "undefined") {
            window.removeEventListener("keydown", this.handleKeyPress);
        }
    },
    computed: {
        theTitle() {
            return toValue(this.$route.meta.title);
        },
        getterRoute() {
            return reactive(this.$store.getters.getRoute);
        },
        getFooter() {
            return reactive(this.$store.getters.getHeaders);
        },
        getDay() {
            var date = this.$store.getters.getHeaders.loginBranchDate;
            let days = new Date(date).toLocaleString("en-us", {
                weekday: "long",
            });
            console.log("Day:", days);
            return days;
        },
        getfooterDate() {
            var date = this.$store.getters.getHeaders.loginBranchDate;
            let day = date.substring(8, 10);
            let month = date.substring(5, 7);
            let year = date.substring(0, 4);
            date = day + "/" + month + "/" + year;
            return date;
        },
    },
    setup() {
        /////////////////////////////////////////////////
        const store = useStore();
        const handleKeyPress = (evt) => {
            if (evt.key == "F4") {
                if (!store.getters.getDisableLockScreen) {
                    if (store.getters.getHeaders.loginUserId != "") {
                        store.dispatch("lockScreen", true);
                    }
                }
            }
        };
        // const UUID = ref()
        // const generateRandomUUID = () => {
        //   UUID.value = crypto.randomUUID();
        // }
        /////////////////////////////////////////////////
        ///////////////////Token//////////////////////
        axios.interceptors.request.use(async (config) => {
            // generateRandomUUID()
            let token = await getToken();
            console.log("----------------TOKEN-----------------------");
            console.log("isToken:", !!token);
            console.log("--------------------------------------------");

            config.headers = {
                Authorization: \`Bearer $\{token}\`,
                // "X-LOGGING-ID": \`$\{UUID.value}\`
            };
            store.dispatch("disableLockScreen", true);
            document.body.classList.add("loading-indicator");
            if (config.hasOwnProperty("data")) {
                if (config.data != "undefined") {
                    if (config.data.transition == "KILL") {
                        document.body.classList.remove("loading-indicator");
                    }
                }
            }
            if (
                config.url != process.env.VUE_APP_SERVICES_ALLOW_USER_ACTIVITIES
            ) {
                let buttonsList = document.querySelectorAll("._custom_button");
                if (buttonsList) {
                    for (let index = 0; index < buttonsList.length; index++) {
                        console.log(buttonsList[index]);
                        buttonsList[index].classList.add(
                            "disableUseCaseButton"
                        );
                    }
                }
                document.addEventListener("keydown", preventKeyStroke);
                document.removeEventListener("keydown", handleKeyPress);
            }
            return config;
        });

        ////////////////////////////////////////
        axios.interceptors.response.use(
            async (response) => {
                document.body.classList.remove("loading-indicator");
                store.dispatch("disableLockScreen", false);
                if (
                    response.config.url !=
                    process.env.VUE_APP_SERVICES_ALLOW_USER_ACTIVITIES
                ) {
                    let buttonsList =
                        document.querySelectorAll("._custom_button");
                    if (buttonsList) {
                        for (
                            let index = 0;
                            index < buttonsList.length;
                            index++
                        ) {
                            console.log(buttonsList[index]);
                            buttonsList[index].classList.remove(
                                "disableUseCaseButton"
                            );
                        }
                    }
                    document.removeEventListener("keydown", preventKeyStroke);
                    document.addEventListener("keydown", handleKeyPress);
                }
                return response;
            },
            function (error) {
                document.body.classList.remove("loading-indicator");
                store.dispatch("disableLockScreen", false);
                let buttonsList = document.querySelectorAll("._custom_button");
                if (buttonsList) {
                    for (let index = 0; index < buttonsList.length; index++) {
                        console.log(buttonsList[index]);
                        buttonsList[index].classList.remove(
                            "disableUseCaseButton"
                        );
                    }
                }
                document.removeEventListener("keydown", preventKeyStroke);
                document.addEventListener("keydown", handleKeyPress);
                if (error.message.includes("401")) {
                    error.message =
                        "You Are Not Authorize To Perform This Activity";
                }
                return Promise.reject(error);
            }
        );
        /////////////////////////////////////////
        //
        const version = process.env.VUE_APP_APPVERSION;
        return {
            version,
            isAuthenticated,
            handleKeyPress,
        };
    },
    methods: {
        simulate(element, eventName) {
            var eventMatchers = {
                HTMLEvents:
                    /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
                MouseEvents:
                    /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/,
            };
            var defaultOptions = {
                pointerX: 0,
                pointerY: 0,
                button: 0,
                ctrlKey: false,
                altKey: false,
                shiftKey: false,
                metaKey: false,
                bubbles: true,
                cancelable: true,
            };
            var options = this.extend(defaultOptions, arguments[2] || {});
            var oEvent,
                eventType = null;

            for (var name in eventMatchers) {
                if (eventMatchers[name].test(eventName)) {
                    eventType = name;
                    break;
                }
            }

            if (!eventType)
                throw new SyntaxError(
                    "Only HTMLEvents and MouseEvents interfaces are supported"
                );

            if (document.createEvent) {
                oEvent = document.createEvent(eventType);
                if (eventType == "HTMLEvents") {
                    oEvent.initEvent(
                        eventName,
                        options.bubbles,
                        options.cancelable
                    );
                } else {
                    oEvent.initMouseEvent(
                        eventName,
                        options.bubbles,
                        options.cancelable,
                        document.defaultView,
                        options.button,
                        options.pointerX,
                        options.pointerY,
                        options.pointerX,
                        options.pointerY,
                        options.ctrlKey,
                        options.altKey,
                        options.shiftKey,
                        options.metaKey,
                        options.button,
                        element
                    );
                }
                element.dispatchEvent(oEvent);
            } else {
                options.clientX = options.pointerX;
                options.clientY = options.pointerY;
                var evt = document.createEventObject();
                oEvent = this.extend(evt, options);
                element.fireEvent("on" + eventName, oEvent);
            }
            return element;
        },
        extend(destination, source) {
            for (var property in source)
                destination[property] = source[property];
            return destination;
        },
        closeModule() {
            ElMessageBox.confirm(
                "Are You Sure, You Want To Exit!",
                "Message",
                confirmOptions
            ).then(() => {
                if (toValue(this.$route.meta.killFsmOnClose) !== true) {
                    this.$store.dispatch("killTransition");
                }

                this.$store.dispatch("BCH_OPN_UC1_OpenBatch/resetState");
                this.$store.dispatch("BCH_INQ_UC3_InquireBatch/resetState");
                this.$store.dispatch("BCH_CLS_UC2_CloseBatch/resetState");

                this.$router.push("/" + this.getterRoute);
            });
        },
        keyUpHandler(e) {
            // debugger
            if (e.keyCode == 9) {
                if (document.activeElement.id.includes("Table")) {
                    var el =
                        document.activeElement.children[0].children[2]
                            .children[0].children[0].children[0].children[0]
                            .children[1].children[0];
                    var loop =
                        document.activeElement.children[0].children[2]
                            .children[0].children[0].children[0].children[0]
                            .children[1];
                    loop.children[0].tabIndex = 0;
                    this.simulate(el, "click");
                    el.focus();
                }
            }
            if (e.keyCode == 38) {
                var el = document.activeElement;
                //console.log(el.tagName)
                if (el.tagName == "TR") {
                    el.tabIndex = "-1";
                    if (el.previousSibling) {
                        el.previousSibling.tabIndex = "0";
                        //console.log("up key:",el)
                        this.simulate(el.previousSibling, "click");
                        el.previousSibling.focus();
                    }
                }
            }
            if (e.keyCode == 40) {
                var el = document.activeElement;
                //console.log(el.tagName)
                if (el.tagName == "TR") {
                    el.tabIndex = "-1";
                    if (el.nextSibling) {
                        el.nextSibling.tabIndex = "0";
                        //console.log("down key",el)
                        this.simulate(el.nextSibling, "click");
                        el.nextSibling.focus();
                    }
                }
            }
        },
        keyDownHandler(e) {
            const keyEvent = new KeyboardEvent("keydown", { key: "Enter" });

            if (e.keyCode == 16) {
                //console.log("active element:",document.activeElement)
                var el = document.activeElement;
                if (el.id.includes("DropDown")) {
                    el.dispatchEvent(keyEvent);
                    e.preventDefault();
                }
            }
        },
    },
};
</script>
    `;
}
