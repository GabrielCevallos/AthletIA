import type { Request } from "express";

export const createTargetUri = (req: Request, baseUri: string, reg_base_path: RegExp): string => {
  const paramPath = (req as any).params?.path;
    const forwardPath = paramPath
      ? `/${Array.isArray(paramPath) ? paramPath.join('/') : paramPath}`
      : req.url.replace(reg_base_path, '') || '/';

    const target = `${baseUri}${forwardPath}`;
    return target;
}