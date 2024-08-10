<script setup>
import { ref, watch } from "vue";
import download from "./utils/download-uc";
const ucName = ref("");
const MSs = ref("");
const singleFile = ref(true);

watch(ucName, () => {
    ucName.value = ucName.value.toUpperCase();
});
watch(singleFile, () => {
    const type = document.getElementById("type");
    if (singleFile.value) type.value = "Single File";
    else type.value = "Multi File";
});
function setUcType(event) {
    const types = {
        "Single File": 1,
        "Multi File": 0,
    };
    singleFile.value = !!types[event.target.value];
}
function checkMS(event) {
    const value = event.target.value;
    // Only keep numbers, dashes, and commas
    const filteredValue = value.replace(/[^0-9,_]/g, "");
    MSs.value = filteredValue;
}

async function createUC(event) {
    event.preventDefault();
    await download(MSs, ucName, singleFile)
        .then(() => {
            alert(ucName.value + " created");
            MSs.value = "";
            ucName.value = "";
            singleFile.value = true;
        })
        .catch((err) => alert(ucName.value + " failed to create "+ err));
}
</script>

<template>
    <!-- <h1>Usecase Structure</h1> -->
    <form class="card" @submit="(event) => createUC(event)">
        <div class="row">
            <label>Usecase Name:</label>
            <input
                spellcheck="false"
                required
                type="text"
                name="ucName"
                v-model="ucName"
            />
        </div>
        <div class="row">
            <label>Usecase Type:</label>
            <select id="type" @change="setUcType">
                <option>Single File</option>
                <option>Multi File</option>
            </select>
        </div>
        <div class="row">
            <label>MegaSets:</label>
            <textarea
                @input="checkMS"
                required="text"
                name="MSs"
                v-model="MSs"
                rows="6"
            />
        </div>
        <span>comma separated e.g. 242,243,244</span>
        <button type="submit">Create</button>
    </form>
</template>