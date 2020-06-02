enum DeviceType {
    WEB = 1,
    IOS = 2,
    ANDROID = 3,
}

type appIdSet = {
    [appid: string]: {
        name: string,
        support: DeviceType,
    }
}

export const convertDeviceType2Enum = (txt: string) => {
    switch (txt.toUpperCase())
    {
        case "WEB":
            return DeviceType.WEB
        case "IOS":
            return DeviceType.IOS
        case "ANDROID":
            return DeviceType.ANDROID
    }
}

export const convertDeviceType2Text = (dt:DeviceType) => {
    switch (dt)
    {
        case DeviceType.WEB:
            return "WEB"
        case DeviceType.IOS:
            return "IOS"
        case DeviceType.ANDROID:
            return "ANDROID"
    }
} 

const appIds:appIdSet = {
    "com.dekd.school": {
        name: "Dek-D School",
        support: DeviceType.WEB,
    },
    "com.dekd.apps.admission": {
        name: "TCAS Dek-D",
        support: DeviceType.ANDROID | DeviceType.IOS,
    }
}

export default appIds