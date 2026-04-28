/**
 * Base class for all Fluid-related errors.
 */
export class FluidError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FluidError";
    Object.setPrototypeOf(this, FluidError.prototype);
  }
}

/**
 * Base class for all Fluid request-related errors (network or server).
 */
export class FluidRequestError extends FluidError {
  public readonly statusCode?: number;
  public readonly serverUrl?: string;

  constructor(message: string, statusCode?: number, serverUrl?: string) {
    super(message);
    this.name = "FluidRequestError";
    this.statusCode = statusCode;
    this.serverUrl = serverUrl;
    Object.setPrototypeOf(this, FluidRequestError.prototype);
  }

  public toString(): string {
    return `${this.name}(message=${JSON.stringify(this.message)}, status_code=${this.statusCode}, server_url=${JSON.stringify(this.serverUrl)})`;
  }
}

/**
 * Error thrown when a network request fails (e.g., DNS, timeout, no connectivity).
 */
export class FluidNetworkError extends FluidRequestError {
  constructor(message: string, serverUrl?: string) {
    super(message, undefined, serverUrl);
    this.name = "FluidNetworkError";
    Object.setPrototypeOf(this, FluidNetworkError.prototype);
  }
}

/**
 * Error thrown when the Fluid server returns an error response (4xx or 5xx).
 */
export class FluidServerError extends FluidRequestError {
  public readonly responseBody?: any;

  constructor(message: string, status: number, serverUrl: string, responseBody?: any) {
    super(message, status, serverUrl);
    this.name = "FluidServerError";
    this.responseBody = responseBody;
    Object.setPrototypeOf(this, FluidServerError.prototype);
  }
}

/**
 * Error thrown when all configured servers are unavailable or exhausted.
 */
export class FluidNoAvailableServerError extends FluidRequestError {
  constructor(message: string, serverUrl?: string) {
    super(message, undefined, serverUrl);
    this.name = "FluidNoAvailableServerError";
    Object.setPrototypeOf(this, FluidNoAvailableServerError.prototype);
  }
}

/**
 * Error thrown when the Fluid client is misconfigured.
 */
export class FluidConfigurationError extends FluidError {
  constructor(message: string) {
    super(message);
    this.name = "FluidConfigurationError";
    Object.setPrototypeOf(this, FluidConfigurationError.prototype);
  }
}

/**
 * Error thrown when a required wallet/keypair is missing or operation is rejected by user.
 */
export class FluidWalletError extends FluidError {
  constructor(message: string) {
    super(message);
    this.name = "FluidWalletError";
    Object.setPrototypeOf(this, FluidWalletError.prototype);
  }
}
