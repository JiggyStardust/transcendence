import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  HOST: z.string().default("0.0.0.0"),
<<<<<<< HEAD
  PORT: z.coerce.number().default(443),
=======
  PORT: z.coerce.number().default(4443),
>>>>>>> gateway-port-fix
  FRONTEND_URL: z.string(),
});

export type AppConfig = z.infer<typeof EnvSchema>;

export const appConfig: AppConfig = (() => {
  const result = EnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Invalid configuration:");
    const pretty = z.prettifyError(result.error);
    console.error(pretty);
    process.exit(1);
  }

  return result.data;
})();
