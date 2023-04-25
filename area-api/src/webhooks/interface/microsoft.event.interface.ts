export interface MicrosoftEventInterface {
    service: string;
    title: string;
    description: string;
    resource: string;
    actions: string[]; // accepted values: "created", "updated", "deleted"
}
