import type { NetworkConfig, NetworkInterface, NetworkManager, RouteConfig } from "./index.js";

class LinuxNetworkInterface implements NetworkInterface {
	constructor(public name: string) {}

	async up(): Promise<void> {
		throw new Error("Not yet implemented");
	}

	async down(): Promise<void> {
		throw new Error("Not yet implemented");
	}

	async isUp(): Promise<boolean> {
		throw new Error("Not yet implemented");
	}

	async configure(config: NetworkConfig): Promise<void> {
		throw new Error("Not yet implemented");
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
		throw new Error("Not yet implemented");
	},
};
