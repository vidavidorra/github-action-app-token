declare const config: {
    app: {
        withOneInstallation: {
            privateKey: string;
            owner: string;
            installationId: number;
            id: number;
        };
        withoutInstallation: {
            privateKey: string;
            owner: string;
            installationId: number;
            id: number;
        };
        withTwoInstallations: {
            privateKey: string;
            owner: string;
            installationId: number;
            id: number;
        };
    };
    fixturesPath: string;
    repository: string;
    nockBackMode: "wild" | "dryrun" | "record" | "update" | "lockdown";
};
export default config;
