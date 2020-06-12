import {InputLogDeviceFailed} from "../../items";

interface LogDeviceFailedInterface {
    save(input:InputLogDeviceFailed):Promise<string>
}

export default LogDeviceFailedInterface