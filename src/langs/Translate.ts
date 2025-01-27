// Generated by https://quicktype.io

export interface Translate {
    LauncherServer: LauncherServer
    LangManager: LangManager
    CommandsManager: CommandsManager
    MirrorManager: MirrorManager
    UpdatesManager: UpdatesManager
    ProgressHelper: ProgressHelper
    ProfilesManager: ProfilesManager
}

interface CommandsManager {
    cmdNotFound: string
    invokeCmd: string
}

interface LangManager {
    strNotFound: string
}

interface LauncherServer {
    initEnd: string
}

interface MirrorManager {
    dirExist: string
    client: Assets
    assets: Assets
}

interface Assets {
    notFound: string
    download: string
    downloadErr: string
    unpacking: string
    unpackingErr: string
    success: string
}

interface ProfilesManager {
    sync: string
    syncEnd: string
    syncSkip: string
    loadingErr: string
}

interface ProgressHelper {
    loading: string
    download: string
}

interface UpdatesManager {
    sync: string
    syncTime: string
    syncEnd: string
    syncSkip: string
}
