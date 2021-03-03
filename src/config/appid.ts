export enum DeviceType {
    IOS = "ios",
    ANDROID = "android",
    FIREBASE = "firebase",
    FIREBASE_WEB = "firebase:web",
    FIREBASE_IOS = "firebase:ios",
    FIREBASE_ANDROID = "firebase:android",
}

type AppIdSet = {
    [appid: string]: {
        name: string,
        short: string,
        support: DeviceType[],
    }
}

export const convertDeviceType2Enum = (txt: string):DeviceType => {
    switch (txt.toLowerCase())
    {
    case "ios":
        return DeviceType.IOS
    case "android":
        return DeviceType.ANDROID
    case "firebase:ios":
        return DeviceType.FIREBASE_IOS
    case "firebase:android":
        return DeviceType.FIREBASE_ANDROID
    case "firebase:web":
        return DeviceType.FIREBASE_WEB
    default:
        throw new TypeError(`${txt} not match`)
    }
}

export const convertDeviceType2Text = (dt:DeviceType):string => {
    switch (dt)
    {
    case DeviceType.IOS:
        return "ios"
    case DeviceType.ANDROID:
        return "android"
    case DeviceType.FIREBASE_IOS:
        return "firebase:ios"
    case DeviceType.FIREBASE_ANDROID:
        return "firebase:android"
    case DeviceType.FIREBASE_WEB:
        return "firebase:web"
    default:
        return ''
    }
} 

const appIds:AppIdSet = {
    "com.dekd.school": {
        name: "Dek-D School",
        short: 'school',
        support: [DeviceType.FIREBASE_WEB],
    },
    "com.dekd.apps.admission": {
        name: "TCAS Dek-D",
        short: 'tcasapp',
        support: [DeviceType.FIREBASE_ANDROID, DeviceType.FIREBASE_IOS],
    }
}

export default appIds