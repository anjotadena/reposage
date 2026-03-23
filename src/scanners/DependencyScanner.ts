/**
 * Parses dependency manifest files: package.json, requirements.txt,
 * go.mod, Cargo.toml, composer.json, *.csproj, pom.xml, build.gradle.
 */

import fs from "node:fs";
import type { ScanResult } from "../models/ScanResult.js";

export interface ParsedDependencies {
  type: "npm" | "pip" | "go" | "cargo" | "composer" | "dotnet" | "maven" | "gradle";
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
  path: string;
}

export class DependencyScanner {
  constructor(private scanResult: ScanResult) {}

  parseAll(): ParsedDependencies[] {
    const results: ParsedDependencies[] = [];

    const pkgPath = this.scanResult.keyFiles["package.json"];
    if (pkgPath) {
      const pkg = this.parsePackageJson(pkgPath);
      if (pkg) results.push(pkg);
    }

    const reqPath = this.scanResult.files.find((f) =>
      f.relativePath.endsWith("requirements.txt")
    )?.absolutePath;
    if (reqPath) {
      const pip = this.parseRequirementsTxt(reqPath);
      if (pip) results.push(pip);
    }

    const goModPath = this.scanResult.keyFiles["go.mod"];
    if (goModPath) {
      const go = this.parseGoMod(goModPath);
      if (go) results.push(go);
    }

    const cargoPath = this.scanResult.keyFiles["Cargo.toml"];
    if (cargoPath) {
      const cargo = this.parseCargoToml(cargoPath);
      if (cargo) results.push(cargo);
    }

    const composerPath = this.scanResult.keyFiles["composer.json"];
    if (composerPath) {
      const composer = this.parseComposerJson(composerPath);
      if (composer) results.push(composer);
    }

    const csprojFiles = this.scanResult.files.filter((f) => f.relativePath.endsWith(".csproj"));
    for (const f of csprojFiles) {
      const dotnet = this.parseCsproj(f.absolutePath);
      if (dotnet) results.push(dotnet);
    }

    const pomPath = this.scanResult.files.find((f) =>
      f.relativePath.endsWith("pom.xml")
    )?.absolutePath;
    if (pomPath) {
      const maven = this.parsePomXml(pomPath);
      if (maven) results.push(maven);
    }

    const gradlePath = this.scanResult.files.find(
      (f) => f.relativePath.endsWith("build.gradle") || f.relativePath.endsWith("build.gradle.kts")
    )?.absolutePath;
    if (gradlePath) {
      const gradle = this.parseGradle(gradlePath);
      if (gradle) results.push(gradle);
    }

    return results;
  }

  private parsePackageJson(filePath: string): ParsedDependencies | null {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const pkg = JSON.parse(raw) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      return {
        type: "npm",
        dependencies: pkg.dependencies ?? {},
        devDependencies: pkg.devDependencies,
        path: filePath,
      };
    } catch {
      return null;
    }
  }

  private parseRequirementsTxt(filePath: string): ParsedDependencies | null {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const deps: Record<string, string> = {};
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const match = trimmed.match(/^([a-zA-Z0-9_-]+)(?:==|>=|<=|~=)?([\d.]*)?/);
        if (match) {
          deps[match[1].toLowerCase()] = match[2] ?? "*";
        }
      }
      return { type: "pip", dependencies: deps, path: filePath };
    } catch {
      return null;
    }
  }

  private parseGoMod(filePath: string): ParsedDependencies | null {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const deps: Record<string, string> = {};
      const requireBlock = raw.match(/require\s*\(([\s\S]*?)\)/);
      if (requireBlock) {
        for (const line of requireBlock[1].split("\n")) {
          const match = line.trim().match(/(\S+)\s+(\S+)/);
          if (match) deps[match[1]] = match[2];
        }
      }
      return { type: "go", dependencies: deps, path: filePath };
    } catch {
      return null;
    }
  }

  private parseCargoToml(filePath: string): ParsedDependencies | null {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const deps: Record<string, string> = {};
      const depMatch = raw.match(/\[dependencies\]\s*([\s\S]*?)(?=\[|$)/);
      if (depMatch) {
        for (const line of depMatch[1].split("\n")) {
          const m = line.trim().match(/^(\w+)\s*=\s*"([^"]*)"/);
          if (m) deps[m[1]] = m[2];
        }
      }
      return { type: "cargo", dependencies: deps, path: filePath };
    } catch {
      return null;
    }
  }

  private parseComposerJson(filePath: string): ParsedDependencies | null {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const composer = JSON.parse(raw) as {
        require?: Record<string, string>;
        "require-dev"?: Record<string, string>;
      };
      const dependencies = { ...(composer.require ?? {}) };
      if (dependencies.php) delete dependencies.php;
      return {
        type: "composer",
        dependencies,
        devDependencies: composer["require-dev"] ?? {},
        path: filePath,
      };
    } catch {
      return null;
    }
  }

  private parseCsproj(filePath: string): ParsedDependencies | null {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const deps: Record<string, string> = {};
      const refs = raw.matchAll(/<PackageReference\s+Include="([^"]+)"\s+Version="([^"]+)"/g);
      for (const m of refs) {
        deps[m[1]] = m[2];
      }
      return { type: "dotnet", dependencies: deps, path: filePath };
    } catch {
      return null;
    }
  }

  private parsePomXml(filePath: string): ParsedDependencies | null {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const deps: Record<string, string> = {};
      const depsMatch = raw.match(/<dependencies>([\s\S]*?)<\/dependencies>/);
      if (depsMatch) {
        const refs = depsMatch[1].matchAll(
          /<dependency>[\s\S]*?<groupId>([^<]+)<\/groupId>[\s\S]*?<artifactId>([^<]+)<\/artifactId>[\s\S]*?<version>([^<]*)<\/version>/g
        );
        for (const m of refs) {
          deps[`${m[1]}:${m[2]}`] = m[3];
        }
      }
      return { type: "maven", dependencies: deps, path: filePath };
    } catch {
      return null;
    }
  }

  private parseGradle(filePath: string): ParsedDependencies | null {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const deps: Record<string, string> = {};
      const implMatch = raw.matchAll(/implementation\s+['"]([^'"]+)['"]/g);
      for (const m of implMatch) {
        deps[m[1]] = "*";
      }
      return { type: "gradle", dependencies: deps, path: filePath };
    } catch {
      return null;
    }
  }
}
