import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FileItem } from "../types";
import { parseXml } from "./step";

export async function downloadProject(files: FileItem[], projectName: string) {

    if (!projectName) return;

    const zip = new JSZip();

    const addFilesToZip = (items: FileItem[], folder: JSZip) => {
        items.forEach((item) => {
            if (item.name === "package.json") {
                const packageFile = JSON.parse(item.content || "{}");

                //  update project name
                packageFile.name = projectName.replaceAll(" ", "-");

                //  convert back to string
                item.content = JSON.stringify(packageFile, null, 2);
            }
            if (item.type === "folder") {
                const newFolder = folder.folder(item.name);
                if (item.children && newFolder) {
                    addFilesToZip(item.children, newFolder);
                }
            } else {
                folder.file(item.name, item.content || "");
            }
        });
    };

    const rootFolder = zip.folder(projectName);

    if (rootFolder) {
        addFilesToZip(files, rootFolder);
    }

    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${projectName}.zip`);
}