import getFileCode from "./get-file-code";
import createMainFile from "./get-main-file-code";
import getMS8Code from "./getMS8Code";
import env from "./env";
import getApp from "./getApp";
import teller from "./teller";
import vueConfig from "./vueConfig";
export default async function download(MSs, ucName, singleFile) {
	const extraFiles = ["Teller.vue", "App.vue", "vue.config.js", ".env.development"];
	// Create a new instance of JSZip
	const zip = new JSZip();
	// Define the contents of the files
	zip.file(`${extraFiles[0]}`, teller(ucName.value));
	zip.file(`${extraFiles[1]}`, getApp());
	zip.file(`${extraFiles[2]}`, vueConfig(ucName.value));
	zip.file(`${extraFiles[3]}`, env(ucName.value));
	const dirName = `${ucName.value}`;
	const directory = zip.folder(dirName);
	if (!singleFile.value) {
		MSs.value.split(",").forEach((file) => {
			directory.file(`ms${file}Def.js`, file == 8 ? getMS8Code() : getFileCode(file));
		});
	}
	directory.file(`${ucName.value}.js`, createMainFile(MSs, ucName, singleFile));

	try {
		// Generate the zip file
		const content = await zip.generateAsync({ type: "blob" });

		// Create a link element
		const link = document.createElement("a");
		link.href = URL.createObjectURL(content);
		link.download = ucName.value + ".zip";
		// Programmatically click the link to trigger the download
		link.click();

		// Clean up
		URL.revokeObjectURL(link.href);
	} catch (err) {
		throw new Error("Error creating zip file:", err);
	}
}
