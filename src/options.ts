import {z} from 'zod';

const rsaPrivateKeyStart = '-----BEGIN RSA PRIVATE KEY-----';
const rsaPrivateKeyEnd = '-----END RSA PRIVATE KEY-----';

function stringArgToNumber(arg: unknown): number | unknown {
  return typeof arg === 'string' && /^[ \t]*[1-9]\d*[ \t]*$/.test(arg)
    ? Number.parseInt(arg, 10)
    : arg;
}

const options = z.object({
  appId: z.preprocess(stringArgToNumber, z.number().int().positive()),
  privateKey: z
    .string()
    .min(rsaPrivateKeyStart.length + rsaPrivateKeyEnd.length + 1)
    .superRefine((value, context) => {
      if (!value.startsWith(`${rsaPrivateKeyStart}`)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `String must start with "${rsaPrivateKeyStart}"`,
        });
      }

      if (!new RegExp(`${rsaPrivateKeyEnd}(\r|\n|\r\n)*$`).test(value)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: `String must end with "${rsaPrivateKeyEnd}"`,
        });
      }
    }),
  /**
   * Repositories with regular expression as used by [GitHub Desktop](
   * https://github.com/desktop/desktop/blob/release-3.0.2/app/src/ui/add-repository/sanitized-repository-name.ts#L9-L11).
   * This especially makes sure the repositories don't include an owner, which
   * is relevant for these options as `owner` is specified separately.
   */
  repositories: z.preprocess(
    (arg) => (Array.isArray(arg) ? new Set(arg) : arg),
    z.set(z.string().regex(/^[\w.-]+$/)).min(1),
  ),
  owner: z.string().min(1).optional(),
  installationId: z
    .preprocess(stringArgToNumber, z.number().int().positive())
    .optional(),
});

type Options = z.infer<typeof options>;

export {options, Options};
