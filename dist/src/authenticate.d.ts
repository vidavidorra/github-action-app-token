import { Options } from './options.js';
interface InstallationAuthentication {
    token: string;
    createdAt: string;
    expiresAt: string;
}
declare function authenticate(options: Options): Promise<InstallationAuthentication>;
export default authenticate;
export { authenticate, InstallationAuthentication };
