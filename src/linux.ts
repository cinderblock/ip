import { exec } from "node:child_process";
import type { NetworkConfig, NetworkInterface, NetworkManager, RouteConfig } from "./index.js";

/**
 * Run linux's `ip` command with the given arguments.
 *
 * @warning Uses shell execution, so be careful with user input.
 * @param args
 * @returns The output of the ip command, if successful.
 */
async function ip(...args: string[]): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(`ip ${args.join(" ")}`, (error, stdout, stderr) => {
			if (error) reject(error);
			else if (stderr) reject(new Error(stderr));
			else resolve(stdout);
		});
	});
}

class LinuxNetworkInterface implements NetworkInterface {
	constructor(public name: string) {}

	async up(): Promise<void> {
		await ip("link", "set", this.name, "up");
	}

	async down(): Promise<void> {
		await ip("link", "set", this.name, "down");
	}

	async isUp(): Promise<boolean> {
		const output = await ip("link", "show", this.name);
		return output.includes("state UP");
	}

	async configure(config: NetworkConfig): Promise<void> {
		let { ipAddress, gateway, interfaceName, vlanId } = config;

		if (typeof ipAddress === "string") ipAddress = [ipAddress];
	}

	async addVLAN(vlanId: number, config?: NetworkConfig): Promise<NetworkInterface> {
		throw new Error("Not yet implemented");
	}

	async deleteVLAN(vlanName: string): Promise<void> {
		throw new Error("Not yet implemented");
	}

	async addRoute(route: RouteConfig): Promise<void> {
		throw new Error("Not yet implemented");
	}

	async removeRoute(route: RouteConfig): Promise<void> {
		throw new Error("Not yet implemented");
	}

	get addresses(): Promise<string[]> {
		throw new Error("Not yet implemented");
	}

	get mac(): Promise<string> {
		throw new Error("Not yet implemented");
	}

	get mtu(): Promise<number> {
		throw new Error("Not yet implemented");
	}

	get type(): Promise<string> {
		throw new Error("Not yet implemented");
	}
}

export const LinuxNetworkManager: NetworkManager = {
	async getInterfaces(): Promise<Map<string, NetworkInterface>> {
		throw new Error("Not yet implemented");
	},

	async createInterface(name: string): Promise<NetworkInterface | undefined> {
		const interfaces = await this.getInterfaces();
		if (interfaces.has(name)) return interfaces.get(name);

		if (!name.match(/^[a-zA-Z0-9._-]+$/)) throw new Error(`Invalid interface name: ${name}`);

		await ip("link", "add", name, "type", "dummy");
		const iface = new LinuxNetworkInterface(name);
		return iface;
	},
};
