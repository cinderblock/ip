/**
 * Represents a network configuration.
 */
export interface NetworkConfig {
	/**
	 * VLAN ID for creating a VLAN interface on top of the base interface
	 * If set, a VLAN interface is created
	 * @default undefined
	 * @example 10
	 */
	vlanId?: number;

	/**
	 * Custom interface name.
	 * Auto-generated if not provided for VLANs.
	 * @default $interface.$vlanid (e.g., 'eth0.10')
	 * @example 'eth0.10'
	 */
	interfaceName?: string;

	/**
	 * The static IP address to assign to the interface.
	 * Used for static configuration. If omitted and dhcp is not set, interface may be manual.
	 * @default undefined
	 * @example '192.168.1.10'
	 */
	ipAddress?: string | string[];

	/**
	 * Network prefix length (CIDR, e.g., 24 for 255.255.255.0).
	 * Used with ip_address to form the subnet.
	 * @default undefined
	 * @example 24
	 */
	prefix?: number;

	/**
	 * Default gateway IP address for the interface.
	 * Used to set the default route for the interface.
	 * @default undefined
	 * @example '192.168.1.1'
	 */
	gateway?: string;
}

export interface RouteConfig {
	to: string;
	via: string;
	metric?: number;
}

export interface NetworkInterface {
	name: string;

	up(): Promise<void>;
	down(): Promise<void>;

	isUp(): Promise<boolean>;

	configure(config: NetworkConfig): Promise<void>;

	addVLAN(vlanId: number, config?: NetworkConfig): Promise<NetworkInterface>;

	deleteVLAN(vlanName: string): Promise<void>;

	addRoute(route: RouteConfig): Promise<void>;
	removeRoute(route: RouteConfig): Promise<void>;

	get addresses(): Promise<string[]>;
	get mac(): Promise<string>;
	get mtu(): Promise<number>;
	get type(): Promise<string>;
}

export interface SearchFilter {
	name?: string;
	mac?: string;
	address?: string;
	type?: string;
}

export async function filterInterfaces(
	interfaces: Map<string, NetworkInterface>,
	filter?: SearchFilter | undefined,
): Promise<Map<string, NetworkInterface>> {
	if (!filter) return interfaces;

	const filteredInterfaces = new Map<string, NetworkInterface>();

	for (const [name, iface] of interfaces) {
		if (filter.name && name !== filter.name) continue;
		if (filter.mac && (await iface.mac) !== filter.mac) continue;
		if (filter.address && !(await iface.addresses).includes(filter.address)) continue;
		if (filter.type && (await iface.type) !== filter.type) continue;
		filteredInterfaces.set(name, iface);
	}

	return filteredInterfaces;
}

export interface NetworkManager<T extends NetworkInterface = NetworkInterface> {
	getInterfaces(filter?: SearchFilter): Promise<Map<string, T>>;

	newInterface(name: string): Promise<T | undefined>;
}

let nm: Promise<NetworkManager> | undefined | null;

export async function getNetworkManager() {
	if (nm === undefined) {
		nm = loadNetworkManager();

		nm.catch(e => {
			console.error("Error loading network manager:");
			console.error(e);
			nm = null; // Reset nm to null on error
		});
	}

	return nm;
}

async function loadNetworkManager(): Promise<NetworkManager> {
	let ret: NetworkManager | undefined = undefined;

	switch (process.platform) {
		case "linux":
			ret = (await import("./linux.js")).LinuxNetworkManager;
			break;
		case "win32":
			// TODO: Implement and import Win32NetworkManager
			break;
		case "darwin":
			// TODO: Implement and import DarwinNetworkManager
			break;
		default:
	}

	if (!ret) throw new Error("Unsupported platform");

	// Share the filter across platforms
	const getInterfaces = ret.getInterfaces.bind(ret);
	ret.getInterfaces = async (filter?: SearchFilter) => filterInterfaces(await getInterfaces(), filter);

	return ret;
}
