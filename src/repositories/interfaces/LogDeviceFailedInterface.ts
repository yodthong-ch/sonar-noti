import InputLogDeviceFailed from "../../items/InputLogDeviceFailed";

interface LogDeviceFailedInterface {
    save(input:InputLogDeviceFailed):Promise<string>
}

export default LogDeviceFailedInterface