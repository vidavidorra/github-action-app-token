import { z } from 'zod';
declare const options: z.ZodObject<{
    appId: z.ZodEffects<z.ZodNumber, number, number>;
    privateKey: z.ZodEffects<z.ZodString, string, string>;
    /**
     * Repositories with regular expression as used by [GitHub Desktop](
     * https://github.com/desktop/desktop/blob/release-3.0.2/app/src/ui/add-repository/sanitized-repository-name.ts#L9-L11).
     * This especially makes sure the repositories don't include an owner, which
     * is relevant for these options as `owner` is specified separately.
     */
    repositories: z.ZodEffects<z.ZodSet<z.ZodString>, Set<string>, Set<string>>;
    owner: z.ZodOptional<z.ZodString>;
    installationId: z.ZodOptional<z.ZodEffects<z.ZodNumber, number, number>>;
}, "strip", z.ZodTypeAny, {
    owner?: string | undefined;
    installationId?: number | undefined;
    appId: number;
    privateKey: string;
    repositories: Set<string>;
}, {
    owner?: string | undefined;
    installationId?: number | undefined;
    appId: number;
    privateKey: string;
    repositories: Set<string>;
}>;
declare type Options = z.infer<typeof options>;
export { options, Options };
