// TODO Ещё больше try/catch для отлова возможных ошибок
// TODO Перевод

import * as path from "path"
import { URL } from "url"

import { HttpHelper } from "../helpers/HttpHelper"
import { JsonHelper } from "../helpers/JsonHelper"
import { LogHelper } from "../helpers/LogHelper"
import { StorageHelper } from "../helpers/StorageHelper"
import { App } from "../LauncherServer"
import { ProfileConfig } from "../profiles/types/ProfileConfig"
import { MojangManager } from "./MojangManager"

export class FabricManager extends MojangManager {
    fabricLink = "https://maven.fabricmc.net/"

    /**
     * Скачивание клиента с зеркала Mojang + Fabric
     * @param clientVer - Версия клиента
     * @param dirName - Название конечной папки
     */
    async downloadClient(clientVer: string, dirName: string): Promise<void> {
        const fabricVersion: any = await this.getFabricVersionInfo(clientVer)
        if (fabricVersion === undefined) return

        const profileUUID = await super.downloadClient(clientVer, dirName, true)
        if (profileUUID === undefined) return

        const librariesDir = path.resolve(StorageHelper.updatesDir, dirName, "libraries")

        LogHelper.info("Download Fabric libraries, please wait...")
        const librariesList: Set<string> = new Set()
        fabricVersion.libraries.forEach((lib: any) => {
            librariesList.add(this.getLibPath(lib.name))
        })

        await HttpHelper.downloadFiles(librariesList, this.fabricLink, librariesDir)

        //Profiles
        App.ProfilesManager.editProfile(profileUUID, {
            mainClass: fabricVersion.mainClass,
        } as ProfileConfig)
        LogHelper.info("Done")
    }

    async getFabricVersionInfo(version: string): Promise<any> {
        let loadersData
        try {
            loadersData = await HttpHelper.readFile(new URL(`https://meta.fabricmc.net/v2/versions/loader/${version}`))
        } catch (error) {
            LogHelper.debug(error)
            LogHelper.error("FabricMC site unavailable")
            return
        }

        let loaders: any[]
        try {
            loaders = JsonHelper.fromJSON(loadersData)
        } catch (error) {
            LogHelper.debug(error)
            LogHelper.error("Error parsing JSON data")
            return
        }

        const data = loaders.find((data: any) => data.loader.stable === true)
        if (data === undefined) {
            LogHelper.error("Fabric version %s not found", version)
            return
        }

        let versionData
        try {
            versionData = await HttpHelper.readFile(
                new URL(`https://meta.fabricmc.net/v2/versions/loader/${version}/${data.loader.version}/profile/json`)
            )
        } catch (error) {
            LogHelper.debug(error)
            LogHelper.error("Client data not found")
            return
        }

        try {
            return JsonHelper.fromJSON(versionData)
        } catch (error) {
            LogHelper.debug(error)
            return
        }
    }

    // Вынести в хелпер?
    getLibPath(name: string): string {
        const patterns = name.split(":")
        return `${patterns[0].replace(/\./g, "/")}/${patterns[1]}/${patterns[2]}/${patterns[1]}-${patterns[2]}.jar`
    }
}
