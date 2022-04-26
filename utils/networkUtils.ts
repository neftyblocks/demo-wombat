/**
 * filter the network url to get the protocol, hostname and port
 **/

export const rpcEndpoints = (endpoints: string[]) =>
    endpoints.map((endpoint) => {
        const [protocol, hostWithPort] = endpoint.split('://');
        const [host, port] = hostWithPort.split(':');

        return {
            protocol,
            host,
            port: +port,
        };
    });
