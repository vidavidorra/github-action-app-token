import { authenticate, InstallationAuthentication } from './authenticate.js';
declare function run(auth: typeof authenticate): Promise<InstallationAuthentication>;
export { run };
