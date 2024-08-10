export default function(ucName){
    return `
    <template>
  <div id="main-container" @click="mainClick">
    <div id="absolute">
      <ul class="nav hidden" id="random-menu" style="position: absolute">
        <li tabindex="-1" class="hidepoint">
          <ul class="menu-list" v-if="true">
            <li tabindex="-1" :class="[
              { hidepoint: true },
              {
                disabled: false,
                /*this.userActivities.find(
                      (element) => element == 'CRCARDI'
                    ) === 'CRCARDI'
                      ? false
                      : true,*/
              },
            ]">
              <a>Hot Inquiry Menu - F12</a>
            </li>
            <li tabindex="-1" :class="[
              { hidepoint: true },
              {
                disabled: false,
                /*this.userActivities.find(
                      (element) => element == 'CRCARDI'
                    ) === 'CRCARDI'
                      ? false
                      : true,*/
              },
            ]">
              <a @click="screenLock">System Lock Screen - F4</a>
            </li>
            <li tabindex="-1" :class="[
              { hidepoint: true },
              {
                disabled:
                  this.userActivities.find(
                    (element) => element == 'CRCARDI'
                  ) === 'CRCARDI'
                    ? false
                    : true,
              },
            ]">
              <a id="CRCARDI">financial calculator - F8 </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>

    <el-row>
      <el-col :lg="1" :md="1"></el-col>
      <el-col :lg="23" :md="23">
        <span class="mainHeading">ALHABIB BANKING SYSTEM</span>
      </el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :lg="1" :md="1"></el-col>
      <el-col :lg="23" :md="23">
        <span class="subHeading">Test Menu Screen</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :lg="10" :md="10"></el-col>
      <el-col :lg="6" :md="6">
        <ul class="nav" id="nav-credit-cards">
          <li tabindex="-1" class="hidepoint">
            <el-button id="credit-cards" :disabled="!this.getUsersAllAcivities.get('Credit Card')" class="moduleBtn"
              @click="useCase1Clicked">${ucName}</el-button>
          </li>
        </ul>
      </el-col>
      <el-col :lg="1" :md="1"></el-col>
      <el-col :lg="6" :md="6">
        <ul class="nav" id="nav-LCA">
          <li tabindex="-1" class="hidepoint">
            <el-button id="LCA" class="moduleBtn" :disabled="!this.getUsersAllAcivities.get('Local Currency Advice')"
              @click="useCase2Clicked">Use Case 2</el-button>
          </li>
        </ul>
      </el-col>
      <el-col :lg="1" :md="1"></el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :lg="10" :md="10"></el-col>
      <el-col :lg="6" :md="6">
        <ul class="nav" id="nav-pay-cash">
          <li tabindex="-1" class="hidepoint">
            <el-button id="pay-cash" :class="['moduleBtn']" :disabled="!this.getUsersAllAcivities.get('Pay Cash')"
              @click="useCase3Clicked">Use Case 3</el-button>
          </li>
        </ul>
      </el-col>
      <el-col :lg="1" :md="1"></el-col>
      <el-col :lg="6" :md="6">
        <ul class="nav" id="nav-inward-clearing">
          <li tabindex="-1" class="hidepoint">
            <el-button class="moduleBtn" id="inward-clearing"
              :disabled="!this.getUsersAllAcivities.get('Inward Clearing')"
              @click="useCase4Clicked">Use Case 4</el-button>
          </li>
        </ul>
      </el-col>
      <el-col :lg="1" :md="1"></el-col>
    </el-row>
    <br />
    <br /><br /><br />
    <BottomButtons :activities="userActivities" :batch="showMenuListBatch"
      @batchMenuButton-onClick="batchMenuHandler"/>
  </div>
</template>
<script>
import { reactive, ref } from "@vue/reactivity";
import { useStore } from "vuex";
import BottomButtons from "../components/bottomBtn.vue";
import ${ucName} from "../UseCase/${ucName}/${ucName}";
export default {
  components: {
    BottomButtons,
  },
  setup() {
    const store = useStore();

    return reactive({
      userRoles: store.getters["getUsersAllowedAcivities"],
      userActivities: [],
      userAcitvities2: [],
      str: "2020-01-21",
      splitedStr: "",
      showMenuListBatch: ref(false),
      ///EndActivityCodes///
    });
  },
  created() {
    window.addEventListener("keyup", this.handler);
    window.addEventListener("keydown", this.keyDownHandler);
    window.addEventListener("contextmenu", function (e) {
      e.preventDefault();
      const ele = document.getElementById("main-container");
      const menu = document.getElementById("random-menu");
      const rect = ele.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Set the position for menu
      //alert(x,y)
      menu.style.top = \`\${e.clientY}px\`;
      menu.style.left = \`\${e.clientX}px\`;

      // Show the menu
      this.$nextTick(() => {
        menu.classList.remove("hidden");
      });
      //e.preventDefault();
    });
  },
  beforeUnmount() {
    window.removeEventListener("keyup", this.handler);
    window.removeEventListener("keydown", this.keyDownHandler);
  },
  mounted() {
    //This method was added to handle the activities incorrectly allowed by user activity service - 06/Sep/2022
    console.log("USER ROLES ACTIVITIES", this.getUserRoles);
    console.log("USER ROLES ACTIVITIES", this.getUserRoles.allActivities);

    console.log("getUsersAllAcivities", this.getUsersAllAcivities)


    this.getUserRoles.allActivities.forEach((activityCodes) => {
      this.userActivities.push(activityCodes);
      // }
    });
    console.log("userActivities", this.userActivities)
  },
  computed: {
    getUserRoles() {
      return reactive(this.$store.getters["getUsersAllowedAcivities"]);
    },
    getUsersAllAcivities() {
      return reactive(this.$store.getters["getUsersAllowedAllAcivities"]);
    }
  },
  methods: {
    useCase1Clicked() {
      ${ucName}(this, process.env.VUE_APP_FSM_URL_${ucName})
    },

    useCase2Clicked() {
      console.log("useCase2Clicked");
    },

    useCase3Clicked() {
      console.log("useCase3Clicked");
    },

    useCase4Clicked() {
      console.log("useCase4Clicked");
    },

    batchMenuHandler() {
      console.log(this.showMenuListBatch);
      this.showMenuListBatch = !this.showMenuListBatch;
    },

    closeAllMenus() {
      this.showMenuListBatch = false;
    },
    screenLock() {
      this.$store.dispatch('lockScreen', true)
    },
    ///EndMethods///
  },
};
</script>
<style scoped>
.hidden {
  display: none;
}

.disabled {
  cursor: not-allowed;
  background-color: rgb(74, 138, 129) !important;
  color: rgb(58, 58, 58) !important;
}

.disabled a:hover {
  pointer-events: none;
}

.disabled a {
  pointer-events: none;
  cursor: not-allowed;
  color: rgb(58, 58, 58) !important;
}
</style>

    `;
}