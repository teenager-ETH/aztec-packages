import { describe, expect, test, beforeAll, afterAll, mock } from "bun:test";
import { execSync } from "child_process";
import { existsSync, unlinkSync, readFileSync } from "fs";
import { join } from "path";
import axios from "axios";

const CLI_PATH = join(__dirname, "index.ts");
const DOCKER_COMPOSE_PATH = join(__dirname, "docker-compose.yml");
const ENV_PATH = join(__dirname, ".env");

// Mock axios for getPublicIP
const mockedAxios = mock(axios);

beforeAll(() => {
  // Clean up any existing files before each test
  [DOCKER_COMPOSE_PATH, ENV_PATH].forEach((file) => {
    if (existsSync(file)) {
      unlinkSync(file);
    }
  });
});

afterAll(() => {
  // Clean up after all tests
  [DOCKER_COMPOSE_PATH, ENV_PATH].forEach((file) => {
    if (existsSync(file)) {
      unlinkSync(file);
    }
  });
});

describe("Test Suite", () => {
  describe("CLI commands", () => {
    beforeAll(() => {
      // Mock axios response for IP
      mockedAxios.mockResolvedValue({ data: { ip: "1.2.3.4" } });
    });

    test("shows version", () => {
      const output = execSync(`bun ${CLI_PATH} --version`).toString();
      expect(output).toContain("1.0.0");
    });

    test("shows help", () => {
      const output = execSync(`bun ${CLI_PATH} --help`).toString();
      expect(output).toContain("Aztec Testnet Node CLI");
      expect(output).toContain("Commands:");
    });

    test("start command fails without configuration", () => {
      try {
        execSync(`bun ${CLI_PATH} start`, {
          encoding: "utf8",
        });
      } catch (error: any) {
        expect(error.message).toContain(
          'Configuration not found. Please run "aztec-spartan init" first.'
        );
      }
    });
  });

  describe("Install and Run", () => {
    beforeAll(() => {
      execSync(
        `bun ${CLI_PATH} install -p 8080 -p2p 40400 -ip 7.7.7.7 -k 0x00 -n nameme`,
        {
          encoding: "utf8",
        }
      );
    });

    test("install command creates necessary files", async () => {
      // Check if files were created
      expect(existsSync(ENV_PATH)).toBe(true);
      expect(existsSync(DOCKER_COMPOSE_PATH)).toBe(true);

      // Verify .env content
      const envContent = readFileSync(ENV_PATH, "utf8");
      expect(envContent).toContain("p2pPort=40400");
      expect(envContent).toContain("port=8080");
      expect(envContent).toContain("key=0x00");
      expect(envContent).toContain("ip=7.7.7.7");
      expect(envContent).toContain("name=nameme");

      // Verify docker-compose.yml content
      const composeContent = readFileSync(DOCKER_COMPOSE_PATH, "utf8");
      expect(composeContent).toContain("name: nameme");
      expect(composeContent).toContain(`P2P_UDP_ANNOUNCE_ADDR=7.7.7.7:40400`);
      expect(composeContent).toContain("AZTEC_PORT=8080");
    });
  });
});