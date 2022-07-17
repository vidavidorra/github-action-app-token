// src/authenticate.ts
import { createAppAuth } from "@octokit/auth-app";
import { getOctokit } from "@actions/github";
async function authenticate(options2) {
  const auth = createAppAuth({
    appId: options2.appId,
    privateKey: options2.privateKey
  });
  const appAuth = await auth({ type: "app" });
  const octokit = getOctokit(appAuth.token);
  let { installationId } = options2;
  if (installationId === void 0) {
    const installations = await octokit.rest.apps.listInstallations();
    if (installations.data.length === 0) {
      throw new Error("The GitHub App must have at least one installation");
    }
    if (options2.owner === void 0 && installations.data.length > 1) {
      throw new Error('Without "owner", the GitHub App must have exactly one installation');
    }
    if (options2.owner === void 0) {
      installationId = installations.data.at(0)?.id;
    } else {
      const installation = installations.data.find((installation2) => installation2.account?.login === options2.owner || installation2.account?.slug === options2.owner);
      if (installation === void 0) {
        throw new Error('The "owner" must have the GitHub App installed');
      }
      installationId = installation.id;
    }
  }
  const installationAuth = await auth({
    installationId,
    type: "installation",
    repositoryNames: [...options2.repositories]
  });
  return {
    token: installationAuth.token,
    createdAt: installationAuth.createdAt,
    expiresAt: installationAuth.expiresAt
  };
}

// src/options.ts
import { z } from "zod";
var rsaPrivateKeyStart = "-----BEGIN RSA PRIVATE KEY-----";
var rsaPrivateKeyEnd = "-----END RSA PRIVATE KEY-----";
function stringArgToNumber(arg) {
  const isString = typeof arg === "string";
  if (isString && /^[ \t]*[1-9]\d*[ \t]*$/.test(arg)) {
    return Number.parseInt(arg, 10);
  }
  return isString && arg.length === 0 ? void 0 : arg;
}
var options = z.object({
  appId: z.preprocess(stringArgToNumber, z.number().int().positive()),
  privateKey: z.string().min(rsaPrivateKeyStart.length + rsaPrivateKeyEnd.length + 1).superRefine((value, context) => {
    if (!value.startsWith(`${rsaPrivateKeyStart}`)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `String must start with "${rsaPrivateKeyStart}"`
      });
    }
    if (!new RegExp(`${rsaPrivateKeyEnd}(\r|
|\r
)*$`).test(value)) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `String must end with "${rsaPrivateKeyEnd}"`
      });
    }
  }),
  repositories: z.preprocess((arg) => Array.isArray(arg) ? new Set(arg) : arg, z.set(z.string().regex(/^[\w.-]+$/)).min(1)),
  owner: z.string().min(1).optional(),
  installationId: z.preprocess(stringArgToNumber, z.number().int().positive().optional()).optional()
});

// src/github-action.ts
import core from "@actions/core";
async function run(auth) {
  try {
    const inputs = {
      appId: core.getInput("appId", { required: true }),
      privateKey: core.getInput("privateKey", { required: true }),
      repositories: core.getMultilineInput("repositories", { required: true }),
      owner: core.getInput("owner"),
      installationId: core.getInput("installationId")
    };
    const parsedOptions = options.parse(inputs);
    const installationAuth = await auth(parsedOptions);
    core.setOutput("token", installationAuth.token);
    core.setOutput("createdAt", installationAuth.createdAt);
    core.setOutput("expiresAt", installationAuth.expiresAt);
    return installationAuth;
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : "Unknown error");
    throw error;
  }
}

// bin/github-action.ts
await run(authenticate);
//# sourceMappingURL=github-action.js.map