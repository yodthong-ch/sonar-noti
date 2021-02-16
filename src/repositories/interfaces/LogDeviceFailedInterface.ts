import { NotificationCentre } from "@dek-d/notification-core";
interface LogDeviceFailedInterface {
    save(input:NotificationCentre.InputDeviceLogFailed):Promise<string>
}

export default LogDeviceFailedInterface