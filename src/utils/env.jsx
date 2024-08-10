export default function(ucName){
    return `
VUE_APP_FSM_URL_BCH_OPN_UC1_OpenBatch=https://services.teresol-bahl.com/fsm/BCH_OPN_UC1_OpenBatch
VUE_APP_FSM_URL_BCH_INQ_UC3_InquireBatch=https://services.teresol-bahl.com/fsm/BCH_INQ_UC3_InquireBatch

VUE_APP_SERVICES_ALLOW_USER_ACTIVITIES=https://services.teresol-bahl.com/auth/realms/ahbs-realm/protocol/openid-connect/userinfo
VUE_APP_UNLOCK_SCREEN=https://services.teresol-bahl.com/bahlBackendServer/validateUserCredentials

VUE_APP_FSM_BASE_URL=https://services.teresol-bahl.com/fsm/
VUE_APP_REMOTE_FE_BASE_URL=https://services.teresol-bahl.com/fe/

VUE_APP_FSM_URL_${ucName}=http://192.168.236.176:3500/fsm/${ucName}

VUE_APP_APPVERSION="ALHABIB VERSION 1.31.6 (TeReSol)"
VUE_APP_REDIRECTURI=http://192.168.236.162:3100/
VUE_APP_KEYCLOAKURL=https://services.teresol-bahl.com/auth
    `;
}